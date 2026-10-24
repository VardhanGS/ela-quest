// ELA Quest cloud sync: classes and students in Firestore, reached through its REST API with anonymous sign-in.
// No Firebase SDK is loaded. Progress is stored as one JSON string per student, and the app stays local-first:
// it saves on the device immediately and syncs in the background.
const Cloud = (() => {
  const CFG = typeof ELAQ_FIREBASE !== 'undefined' ? ELAQ_FIREBASE : null;
  const available = !!(CFG && typeof window !== 'undefined' && !window.ELAQ_NO_SW && typeof fetch !== 'undefined' && window.crypto && crypto.subtle);
  const DOCS = CFG ? `https://firestore.googleapis.com/v1/projects/${CFG.projectId}/databases/(default)/documents` : '';
  const ls = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
  };

  // ---- auth (anonymous; one identity per device) ----
  async function token() {
    let a = ls.get('elaq_auth', null);
    if (a && a.exp > Date.now() + 60000) return a.idToken;
    let r;
    if (a && a.refreshToken) {
      r = await fetch(`https://securetoken.googleapis.com/v1/token?key=${CFG.apiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(a.refreshToken)}`,
      });
      if (r.ok) { const j = await r.json(); a = { idToken: j.id_token, refreshToken: j.refresh_token, exp: Date.now() + j.expires_in * 1000 }; ls.set('elaq_auth', a); return a.idToken; }
    }
    r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${CFG.apiKey}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ returnSecureToken: true }),
    });
    if (!r.ok) throw new Error('Could not connect to the class server.');
    const j = await r.json();
    a = { idToken: j.idToken, refreshToken: j.refreshToken, exp: Date.now() + j.expiresIn * 1000 };
    ls.set('elaq_auth', a);
    return a.idToken;
  }

  async function req(method, path, body, query = '') {
    const t = await token();
    const r = await fetch(`${DOCS}/${path}${query ? '?' + query : ''}`, {
      method, headers: { Authorization: `Bearer ${t}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (r.status === 404) return null;
    if (!r.ok) { const e = new Error(`Server said ${r.status}`); e.status = r.status; throw e; }
    return r.status === 200 ? r.json() : {};
  }

  // Firestore typed values <-> plain values
  const enc = (o) => ({ fields: Object.fromEntries(Object.entries(o).map(([k, v]) => [k, typeof v === 'number' ? { integerValue: String(Math.round(v)) } : { stringValue: String(v) }])) });
  const dec = (doc) => {
    if (!doc || !doc.fields) return null;
    const o = { id: doc.name.split('/').pop() };
    for (const [k, v] of Object.entries(doc.fields)) o[k] = 'integerValue' in v ? Number(v.integerValue) : v.stringValue;
    return o;
  };

  // ---- ids and PINs ----
  const ALPHA = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'; // no 0/O/1/I/L
  const randomId = (n) => { const b = crypto.getRandomValues(new Uint8Array(n)); return [...b].map((x) => ALPHA[x % ALPHA.length]).join(''); };
  const cleanCode = (s) => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const prettyCode = (id) => id.replace(/(.{4})(?=.)/g, '$1-');
  async function hash(s) {
    const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
    return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  const adminHash = (classId, pin) => hash(`${classId}:admin:${pin}`);
  const pinHash = (classId, sid, pin) => hash(`${classId}:${sid}:${pin}`);

  // ---- classes & students ----
  async function createClass(name, pin) {
    const id = randomId(12);
    await req('PATCH', `classes/${id}`, enc({ name, adminHash: await adminHash(id, pin), createdAt: Date.now() }), 'currentDocument.exists=false');
    return { id, name };
  }
  const getClass = async (id) => dec(await req('GET', `classes/${id}`));
  async function listStudents(classId, full = false) {
    const out = [];
    let page = '';
    do {
      const mask = full ? '' : '&mask.fieldPaths=name&mask.fieldPaths=avatar&mask.fieldPaths=pinHash&mask.fieldPaths=updatedAt';
      const r = await req('GET', `classes/${classId}/students`, null, `pageSize=300${mask}${page ? '&pageToken=' + page : ''}`);
      (r && r.documents || []).forEach((d) => out.push(dec(d)));
      page = r && r.nextPageToken;
    } while (page);
    return out.sort((a, b) => a.name.localeCompare(b.name));
  }
  const getStudent = async (classId, sid) => dec(await req('GET', `classes/${classId}/students/${sid}`));
  async function createStudent(classId, { name, avatar, pin, data }) {
    const sid = randomId(10);
    await req('PATCH', `classes/${classId}/students/${sid}`, enc({ name, avatar, pinHash: await pinHash(classId, sid, pin), data: JSON.stringify(data), updatedAt: Date.now() }), 'currentDocument.exists=false');
    return sid;
  }
  const saveStudent = (classId, sid, data) =>
    req('PATCH', `classes/${classId}/students/${sid}`, enc({ data: JSON.stringify(data), updatedAt: Date.now() }), 'updateMask.fieldPaths=data&updateMask.fieldPaths=updatedAt&currentDocument.exists=true');
  const deleteStudent = (classId, sid) => req('DELETE', `classes/${classId}/students/${sid}`);

  // ---- merging progress made on two devices ----
  const max = (a, b) => Math.max(a || 0, b || 0);
  function merge(a, b) {
    if (!a) return b; if (!b) return a;
    // A reset on either device wins over anything recorded before it.
    if ((a.resetAt || 0) !== (b.resetAt || 0)) return (a.resetAt || 0) > (b.resetAt || 0) ? a : b;
    const m = { ...b, ...a };
    ['xp', 'quests', 'perfects', 'fixed'].forEach((k) => { m[k] = max(a[k], b[k]); });
    m.best = { ...b.best }; Object.entries(a.best || {}).forEach(([k, v]) => { m.best[k] = max(m.best[k], v); });
    m.plays = { ...b.plays }; Object.entries(a.plays || {}).forEach(([k, v]) => { m.plays[k] = max(m.plays[k], v); });
    m.daily = { ...b.daily };
    Object.entries(a.daily || {}).forEach(([d, v]) => { const o = m.daily[d] || {}; m.daily[d] = { rounds: max(o.rounds, v.rounds), q: max(o.q, v.q), correct: max(o.correct, v.correct), xp: max(o.xp, v.xp) }; });
    const sa = a.streak || {}, sb = b.streak || {};
    m.streak = (sa.last || '') > (sb.last || '') ? sa : (sb.last || '') > (sa.last || '') ? sb : { last: sa.last, count: max(sa.count, sb.count) };
    m.badges = { ...a.badges, ...b.badges };
    Object.keys(m.badges).forEach((k) => { if (a.badges?.[k] && b.badges?.[k]) m.badges[k] = a.badges[k] < b.badges[k] ? a.badges[k] : b.badges[k]; });
    m.watched = { ...b.watched, ...a.watched };
    m.gone = [...new Set([...(a.gone || []), ...(b.gone || [])])].slice(-400);
    const gone = new Set(m.gone);
    const wid = (w) => w.id || `${w.date}|${w.title}`;
    const seenW = new Set();
    m.writings = [...(a.writings || []), ...(b.writings || [])].filter((w) => { const k = wid(w); if (gone.has(k) || seenW.has(k)) return false; seenW.add(k); return true; })
      .sort((x, y) => (y.at || 0) - (x.at || 0));
    const seenM = new Set();
    m.missed = [...(a.missed || []), ...(b.missed || [])].filter((x) => { if (gone.has(x.id) || seenM.has(x.id)) return false; seenM.add(x.id); return true; }).slice(0, 40);
    m.draft = (a.draftAt || 0) >= (b.draftAt || 0) ? a.draft : b.draft;
    m.draftAt = max(a.draftAt, b.draftAt);
    return m;
  }

  return { available, createClass, getClass, listStudents, getStudent, createStudent, saveStudent, deleteStudent, adminHash, pinHash, merge, cleanCode, prettyCode };
})();

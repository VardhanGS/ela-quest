// ELA Quest — app shell, quiz engine, progress, and Writing Studio.
(() => {
  const app = document.getElementById('app');

  // ---------- storage ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
    del(k) { try { localStorage.removeItem(k); } catch { /* ignore */ } },
  };
  const dayKey = (d = new Date()) => d.toLocaleDateString('en-CA');
  const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return dayKey(d); };
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const nl = (s) => esc(s).replace(/\n/g, '<br>');

  const AVATARS = ['🦊', '🐼', '🦁', '🐸', '🐙', '🦄', '🐯', '🐨', '🐧', '🦉', '🐢', '🐝'];
  let settings = Object.assign({ autoRead: false, rate: 0.85, sound: true, volume: 0.7, music: false, sayPraise: true, examples: true, narrateExamples: true, unlockAll: false, dailyGoal: 3 }, store.get('elaq_settings', {}));
  const applySound = () => SFX.configure({ sound: settings.sound, vol: settings.volume, music: settings.music });
  applySound();
  let profiles = store.get('elaq_profiles', []);
  let activeId = store.get('elaq_active', null);
  let P = null;

  const blankData = () => ({ xp: 0, best: {}, plays: {}, daily: {}, streak: { last: null, count: 0 }, badges: {}, writings: [], draft: null, missed: [], fixed: 0, quests: 0, perfects: 0, watched: {}, words: {} });
  function loadProfile(id) {
    activeId = id;
    store.set('elaq_active', id);
    P = Object.assign(blankData(), store.get('elaq_p_' + id, {}));
    lastDraft = JSON.stringify(P.draft);
  }
  let lastDraft = null;
  function save() {
    if (!activeId || !P) return;
    const dj = JSON.stringify(P.draft);
    if (dj !== lastDraft) { if (lastDraft !== null) P.draftAt = Date.now(); lastDraft = dj; }
    store.set('elaq_p_' + activeId, P);
    if (me() && me().cloud) queuePush();
  }
  const saveSettings = () => store.set('elaq_settings', settings);
  const saveProfiles = () => store.set('elaq_profiles', profiles);
  const me = () => profiles.find((p) => p.id === activeId);

  // ---------- content helpers ----------
  const subj = (id) => SUBJECTS.find((s) => s.id === id);
  const skillOf = (sid, kid) => subj(sid).skills.find((k) => k.id === kid);
  const key = (sid, kid, l) => `${sid}.${kid}.${l}`;
  const best = (sid, kid, l) => P.best[key(sid, kid, l)];
  const starsFor = (pct) => (pct == null ? 0 : pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 50 ? 1 : 0);
  const unlocked = (sid, kid, l) => l === 0 || settings.unlockAll || (best(sid, kid, l - 1) || 0) >= 70;
  const passed = (sid, kid, l) => (best(sid, kid, l) || 0) >= 70;

  function mastery(s) {
    let got = 0, max = 0;
    s.skills.forEach((k) => k.levels.forEach((_, l) => { got += starsFor(best(s.id, k.id, l)); max += 3; }));
    return Math.round((got / max) * 100);
  }
  function readiness() {
    let n = 0, done = 0;
    SUBJECTS.forEach((s) => s.skills.forEach((k) => { n++; if (passed(s.id, k.id, 2)) done++; }));
    return { n, done, pct: Math.round((done / n) * 100) };
  }
  function nextUp() {
    const out = [];
    SUBJECTS.forEach((s) => {
      for (const k of s.skills) {
        const l = [0, 1, 2].find((x) => unlocked(s.id, k.id, x) && !passed(s.id, k.id, x));
        if (l != null) { out.push({ s, k, l }); break; }
      }
    });
    return out;
  }

  const RANKS = ['Word Sprout', 'Letter Explorer', 'Sound Detective', 'Sentence Builder', 'Story Seeker', 'Paragraph Pro', 'Book Adventurer', 'Word Wizard', 'Grade 3 Trailblazer', 'Reading Legend'];
  const XP_PER = 250;
  const playerLevel = () => Math.floor(P.xp / XP_PER) + 1;
  const rank = () => RANKS[Math.min(playerLevel() - 1, RANKS.length - 1)];

  const BADGES = [
    { id: 'first', icon: '🌱', name: 'First Quest', desc: 'Finish your first quest.', test: () => P.quests >= 1 },
    { id: 'q10', icon: '🎒', name: 'Busy Learner', desc: 'Finish 10 quests.', test: () => P.quests >= 10 },
    { id: 'q30', icon: '🏔️', name: 'Mountain Climber', desc: 'Finish 30 quests.', test: () => P.quests >= 30 },
    { id: 'perfect', icon: '💯', name: 'Perfect!', desc: 'Get every question right in a quest.', test: () => P.perfects >= 1 },
    { id: 'streak3', icon: '🔥', name: 'On Fire', desc: 'Learn 3 days in a row.', test: () => P.streak.count >= 3 },
    { id: 'streak7', icon: '🌟', name: 'Super Week', desc: 'Learn 7 days in a row.', test: () => P.streak.count >= 7 },
    { id: 'fixer', icon: '🩹', name: 'Mistake Fixer', desc: 'Fix 10 mistakes in Practice Mistakes.', test: () => P.fixed >= 10 },
    { id: 'writer', icon: '✍️', name: 'Author', desc: 'Publish your first piece of writing.', test: () => P.writings.length >= 1 },
    { id: 'writer5', icon: '📚', name: 'Bookshelf', desc: 'Publish 5 pieces of writing.', test: () => P.writings.length >= 5 },
    { id: 'movie', icon: '🎬', name: 'Movie Star', desc: 'Watch 5 video lessons.', test: () => Object.keys(P.watched || {}).length >= 5 },
    { id: 'xp1000', icon: '⚡', name: '1,000 XP', desc: 'Earn 1,000 XP.', test: () => P.xp >= 1000 },
    { id: 'bee50', icon: '🐝', name: 'Busy Bee', desc: 'Master 50 spelling words.', test: () => Object.values(P.words || {}).filter((w) => w.mastered).length >= 50 },
    { id: 'onebee', icon: '🏆', name: 'One Bee Ready', desc: 'Master every word on the One Bee list.', test: () => subj('spelling').skills.filter((k) => k.id.startsWith('onebee')).every((k) => masteredIn(k.words) === k.words.length) },
    ...['phonics', 'spelling', 'grammar', 'reading', 'vocab', 'writing'].map((sid) => ({ id: 'champ_' + sid, icon: { phonics: '🔤', spelling: '🐝', grammar: '✏️', reading: '📚', vocab: '💬', writing: '🖍️' }[sid], name: `${subj(sid).name} Champ`, desc: `Pass every Grade 3 Challenge in ${subj(sid).name}.`, test: () => subj(sid).skills.every((k) => passed(sid, k.id, 2)) })),
    { id: 'grade3', icon: '🎓', name: 'Ready for Grade 3', desc: 'Pass every Grade 3 Challenge.', test: () => readiness().done === readiness().n },
  ];
  function checkBadges() {
    const earned = [];
    BADGES.forEach((b) => { if (!P.badges[b.id] && b.test()) { P.badges[b.id] = dayKey(); earned.push(b); } });
    return earned;
  }

  function touchDay(fn) {
    const d = dayKey();
    P.daily[d] = P.daily[d] || { rounds: 0, q: 0, correct: 0, xp: 0 };
    fn(P.daily[d]);
    if (P.streak.last !== d) {
      P.streak.count = P.streak.last === yesterday() ? P.streak.count + 1 : 1;
      P.streak.last = d;
    }
  }
  const streakNow = () => (P.streak.last === dayKey() || P.streak.last === yesterday() ? P.streak.count : 0);

  // ---------- speech & sound ----------
  // All speech goes through Voice (voice.js): natural pre-recorded clips, device TTS as a fallback.
  Voice.setRate(settings.rate);
  const speak = (text, rate) => { Voice.say(text, rate ? { rate } : {}); };
  const speakAsync = (text) => (settings.narrateExamples ? Voice.say(text) : new Promise((r) => setTimeout(r, 400)));
  function confetti() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = document.createElement('div');
    box.className = 'confetti';
    const colors = ['var(--phonics)', 'var(--grammar)', 'var(--reading)', 'var(--writing)', 'var(--gold)'];
    for (let i = 0; i < 60; i++) {
      const s = document.createElement('i');
      s.style.left = Math.random() * 100 + '%';
      s.style.background = colors[i % colors.length];
      s.style.animationDelay = Math.random() * 0.4 + 's';
      s.style.animationDuration = 1.6 + Math.random() * 1.2 + 's';
      s.style.transform = `rotate(${Math.random() * 360}deg)`;
      box.appendChild(s);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 3200);
  }

  // ---------- routing ----------
  let view = { name: 'home' };
  let modal = null;
  function go(name, params = {}) {
    Voice.stop();
    view = { name, ...params };
    modal = null; pin = null;
    render();
    window.scrollTo(0, 0);
  }

  const NAV = [['home', '🏠', 'Home'], ['studio', '🖍️', 'Write'], ['videos', '🎬', 'Videos'], ['progress', '📈', 'Progress'], ['settings', '⚙️', 'Settings']];

  function render() {
    const noUser = !profiles.length || !P;
    const open = ['classCreate', 'classPick', 'dashboard', 'studentView'].includes(view.name);
    if (view.name === 'welcome' || (noUser && !open)) { app.innerHTML = screenWelcome() + modalHTML(); AFTER.welcome(); return; }
    if (noUser) { app.innerHTML = `<main class="main">${SCREENS[view.name]()}</main>` + modalHTML(); AFTER[view.name] && AFTER[view.name](); return; }
    const focus = ['quiz', 'results', 'example'].includes(view.name);
    const body = SCREENS[view.name] ? SCREENS[view.name]() : SCREENS.home();
    const active = view.name === 'video' ? 'videos' : view.name === 'subject' ? 'home' : ['studioNew', 'studioEdit', 'writingView'].includes(view.name) ? 'studio' : view.name;
    app.innerHTML = `
      ${focus ? '' : topbar()}
      <main class="main ${focus ? 'focus' : ''}">${body}</main>
      ${focus ? '' : `<nav class="tabbar" aria-label="Main">${NAV.map(([id, ic, label]) => `<button class="tab ${active === id ? 'on' : ''}" data-act="nav" data-to="${id}"><span class="tab-ic" aria-hidden="true">${ic}</span><span>${label}</span></button>`).join('')}</nav>`}
      ${modalHTML()}`;
    AFTER[view.name] && AFTER[view.name]();
    SFX.syncMusic(['quiz', 'example', 'video'].includes(view.name));
  }

  const modalHTML = () => (modal ? `<div class="scrim" data-act="closeModal"></div><div class="modal" role="dialog" aria-modal="true">${modal}</div>` : '');

  function topbar() {
    const p = me();
    const into = P.xp % XP_PER;
    return `<header class="topbar">
      <button class="brand" data-act="nav" data-to="home" aria-label="ELA Quest home"><span class="brand-word">ELA Quest</span><span class="brand-sub">Grade 2 → 3</span></button>
      <div class="top-right">
        ${p.cloud ? `<span class="pill sync" id="syncPill" title="${esc(SYNC_LABEL[sync.state])}">${SYNC_ICON[sync.state]}</span>` : ''}
        <span class="pill streak" title="Days in a row">🔥 <b>${streakNow()}</b></span>
        <span class="pill xp" title="Level ${playerLevel()}: ${into}/${XP_PER} XP"><b>Lv ${playerLevel()}</b><span class="xpbar"><i style="width:${(into / XP_PER) * 100}%"></i></span></span>
        <button class="chip-me" data-act="nav" data-to="players"><span class="av">${p.avatar}</span><span class="nm">${esc(p.name)}</span></button>
      </div>
    </header>`;
  }

  // ---------- screens ----------
  function screenWelcome() {
    const pick = view.avatar || AVATARS[0];
    return `<main class="main welcome">
      <div class="paper-title"><h1>ELA Quest</h1><p>Phonics · Grammar · Reading · Writing</p></div>
      ${classCard()}
      <section class="card stack">
        <h2>${Cloud.available ? '📱 Play on this device only' : 'Who is learning today?'}</h2>
        <label class="lbl" for="newName">Your name</label>
        <input id="newName" class="input" maxlength="16" placeholder="Type your name" value="${esc(view.typed || '')}" autocomplete="off">
        <span class="lbl">Pick a buddy</span>
        <div class="avatars">${AVATARS.map((a) => `<button class="av-btn ${a === pick ? 'on' : ''}" data-act="pickAvatar" data-a="${a}" aria-label="Avatar ${a}">${a}</button>`).join('')}</div>
        <button class="btn primary big" data-act="createPlayer">Start my quest</button>
        ${profiles.length ? '<button class="btn ghost" data-act="nav" data-to="players">Back to players</button>' : ''}
      </section>
      <p class="fine">${Cloud.available ? 'Class players sync to every device. Device-only players are saved just here.' : 'Progress is saved on this device. Grown-ups can add more players later.'}</p>
    </main>`;
  }

  const SCREENS = {
    home() {
      const p = me();
      const td = P.daily[dayKey()] || { rounds: 0, q: 0, correct: 0 };
      const goal = settings.dailyGoal;
      const r = readiness();
      const up = nextUp();
      return `
        <section class="hello">
          <div class="hello-av">${p.avatar}</div>
          <div class="hello-text">
            <h1>Hi, ${esc(p.name)}!</h1>
            <p><b>${rank()}</b> · Level ${playerLevel()} · ${P.xp} XP</p>
          </div>
        </section>

        <section class="today card">
          <div class="today-goal">
            <div class="ring" style="--p:${Math.min(td.rounds / goal, 1) * 100}"><span>${Math.min(td.rounds, goal)}/${goal}</span></div>
            <div>
              <h2>Today's goal</h2>
              <p class="muted">${td.rounds >= goal ? 'Goal reached! Keep going for bonus XP.' : `Finish ${goal - td.rounds} more quest${goal - td.rounds === 1 ? '' : 's'} today.`}</p>
            </div>
          </div>
          <div class="today-btns">
            <button class="btn primary" data-act="mix">⚡ Daily Mix</button>
            <button class="btn" data-act="review" ${P.missed.length ? '' : 'disabled'}>🩹 Practice Mistakes${P.missed.length ? ` (${P.missed.length})` : ''}</button>
          </div>
        </section>

        <h2 class="sec">Choose a subject</h2>
        <section class="subjects">
          ${SUBJECTS.map((s) => {
            const m = mastery(s);
            return `<button class="subject s-${s.color}" data-act="openSubject" data-s="${s.id}">
              <span class="subject-ic" aria-hidden="true">${s.icon}</span>
              <span class="subject-name">${s.name}</span>
              <span class="subject-blurb">${s.blurb}</span>
              <span class="meter"><i style="width:${m}%"></i></span>
              <span class="subject-meta">${s.skills.length} skills · ${m}% mastered</span>
            </button>`;
          }).join('')}
          <button class="subject s-studio" data-act="nav" data-to="studio">
            <span class="subject-ic" aria-hidden="true">📝</span>
            <span class="subject-name">Writing Studio</span>
            <span class="subject-blurb">Plan, write, check, and publish your own stories, opinions, how-tos, and letters.</span>
            <span class="subject-meta">${P.writings.length} published${P.draft ? ' · draft in progress' : ''}</span>
          </button>
        </section>

        ${VIDS().length ? `<section class="card">
          <div class="row-between"><h2>🎬 Watch & learn</h2><button class="btn small ghost" data-act="nav" data-to="videos">All ${VIDEOS.length} videos →</button></div>
          <div class="vstrip">${[...VIDEOS].sort((a, b) => !!(P.watched || {})[a.id] - !!(P.watched || {})[b.id]).slice(0, 4).map(vcard).join('')}</div>
        </section>` : ''}

        <section class="grid2">
          <div class="card">
            <h2>Up next</h2>
            ${up.length ? `<ul class="uplist">${up.map(({ s, k, l }) => `<li><button class="up s-${s.color}" data-act="start" data-s="${s.id}" data-k="${k.id}" data-l="${l}"><span class="up-ic">${k.icon}</span><span class="up-txt"><b>${k.name}</b><small>${LEVEL_NAMES[l].long} · ${esc(k.levels[l].title)}</small></span><span class="go">Go</span></button></li>`).join('')}</ul>` : '<p class="muted">You have passed every level. Amazing!</p>'}
          </div>
          <div class="card">
            <h2>Grade 3 readiness</h2>
            <div class="ready"><span class="ready-num">${r.pct}%</span><span class="muted">${r.done} of ${r.n} Grade 3 Challenges passed</span></div>
            <div class="meter big"><i style="width:${r.pct}%"></i></div>
            <p class="fine">Pass a level with 70% or more to unlock the next one. Level 3 in every skill is Grade 3 work.</p>
          </div>
        </section>`;
    },

    subject() {
      const s = subj(view.s);
      return `
        <section class="sub-head s-${s.color}">
          <button class="back" data-act="nav" data-to="home" aria-label="Back">←</button>
          <span class="sub-ic">${s.icon}</span>
          <div><h1>${s.name}</h1><p>${s.blurb} · ${mastery(s)}% mastered</p></div>
        </section>
        <div class="legend"><span><i class="lv lv0"></i>Level 1 · Grade 2 Starter</span><span><i class="lv lv1"></i>Level 2 · Grade 2 Star</span><span><i class="lv lv2"></i>Level 3 · Grade 3 Challenge</span></div>
        <section class="skills">
          ${s.skills.map((k) => `
            <article class="skill card">
              <h2><span class="skill-ic">${k.icon}</span>${k.name}${k.words ? ` <small class="muted words-count">${masteredIn(k.words)} of ${k.words.length} words mastered</small>` : ''}</h2>
              <div class="levels">
                ${k.levels.map((L, l) => {
                  const open = unlocked(s.id, k.id, l);
                  const b = best(s.id, k.id, l);
                  const st = starsFor(b);
                  return `<button class="level lv${l} ${open ? '' : 'locked'} ${b != null && b >= 70 ? 'passed' : ''}" data-act="start" data-s="${s.id}" data-k="${k.id}" data-l="${l}" ${open ? '' : 'aria-disabled="true"'}>
                    <span class="level-top"><span class="level-tag">${LEVEL_NAMES[l].long}</span><span class="stars" aria-label="${st} stars">${[0, 1, 2].map((i) => `<i class="${i < st ? 'on' : ''}">★</i>`).join('')}</span></span>
                    <span class="level-title">${open ? '' : '🔒 '}${esc(L.title)}</span>
                    <span class="level-desc">${esc(L.desc)}</span>
                    <span class="level-foot"><span class="std">${L.std}</span><span>${b != null ? `Best ${b}%` : open ? 'Start' : 'Pass the level before'}</span></span>
                  </button>`;
                }).join('')}
              </div>
            </article>`).join('')}
        </section>`;
    },

    quiz() { return screenQuiz(); },
    results() { return screenResults(); },
    progress() { return screenProgress(); },
    settings() { return screenSettings(); },
    players() { return screenPlayers(); },
    studio() { return screenStudio(); },
    example() { return screenExample(); },
    videos() { return screenVideos(); },
    video() { return screenVideo(); },
    studioNew() { return screenStudioNew(); },
    studioEdit() { return screenStudioEdit(); },
    writingView() { return screenWritingView(); },
  };
  const AFTER = {
    welcome() { const i = document.getElementById('newName'); if (i) { i.focus(); i.addEventListener('keydown', (e) => { if (e.key === 'Enter') ACT.createPlayer(); }); } },
  };

  // ---------- quiz engine ----------
  let Q = null;

  function prep(q) {
    q = JSON.parse(JSON.stringify(q));
    if (q.t === 'order') {
      let pool = q.parts.map((text, i) => ({ text, i }));
      let tries = 0;
      do { pool = U.shuffle(pool); tries++; } while (tries < 10 && pool.every((p, i) => p.i === i));
      q.pool = pool;
    }
    return q;
  }
  const freshSt = () => ({ tries: 0, done: false, correct: null, picked: [], sel: [], place: {}, chosen: null, wrongOpts: [], wrongItems: [], msg: null, typed: '' });

  function buildMix() {
    const bestPer = {};
    SUBJECTS.forEach((s) => s.skills.forEach((k) => {
      if (k.passage) return;
      k.levels.forEach((_, l) => { if (unlocked(s.id, k.id, l)) bestPer[s.id + k.id] = [s, k, l]; });
    }));
    const picks = U.sample(Object.values(bestPer), 8);
    return picks.map(([s, k, l]) => ({ ...U.pick(k.levels[l].gen()), from: `${s.name} · ${k.name}` }));
  }

  function startRound(opts) {
    let qs;
    if (opts.mode === 'mix') qs = buildMix();
    else if (opts.mode === 'review') qs = U.sample(P.missed, 8).map((m) => ({ ...m.q, from: m.from }));
    else qs = skillOf(opts.s, opts.k).levels[opts.l].gen(P.words || {});
    if (!qs.length) { go('home'); return; }
    Q = { ...opts, qs: qs.map(prep), i: 0, points: 0, xp: 0, log: [], st: freshSt(), started: Date.now() };
    if (opts.mode === 'skill' && settings.examples && !opts.noExample) {
      const seen = new Set(qs.map((q) => JSON.stringify([q.q, q.a, q.say])));
      const pool = skillOf(opts.s, opts.k).levels[opts.l].gen();
      Q.demoRaw = pool.find((q) => !seen.has(JSON.stringify([q.q, q.a, q.say]))) || pool[0];
      Q.demo = prep(Q.demoRaw); Q.demoSt = freshSt(); Q.demoDone = false; Q.demoStarted = false;
      go('example');
      return;
    }
    go('quiz');
  }

  const cur = () => Q.qs[Q.i];
  const PRAISE = Voice.PRAISE;

  function answerText(q) {
    switch (q.t) {
      case 'mc': return q.a;
      case 'build': return q.a;
      case 'type': return q.a[0];
      case 'spell': return q.a;
      case 'order': return q.list ? q.parts.map((p, i) => `${i + 1}. ${p}`).join('\n') : q.parts.join(' ');
      case 'tap': return q.a.map((i) => q.words[i].replace(/[.,!?;:]+$/, '')).join(', ');
      case 'sort': return q.items.map((it) => `${it.w} → ${q.bins[it.b]}`).join('\n');
      default: return '';
    }
  }

  function isCorrect(q, st) {
    switch (q.t) {
      case 'mc': return st.chosen === q.a;
      case 'build': return st.picked.map((i) => q.tiles[i]).join('') === q.a;
      case 'type': { const v = st.typed.trim().toLowerCase().replace(/[.!?]$/, ''); return q.a.some((a) => a.toLowerCase() === v); }
      case 'spell': return st.typed.trim().toLowerCase() === q.a.toLowerCase();
      case 'order': { const seq = st.picked.map((i) => q.pool[i].text); return seq.join('|') === q.parts.join('|') || (q.alts || []).some((alt) => alt.join('|') === seq.join('|')); }
      case 'tap': return [...st.sel].sort((a, b) => a - b).join(',') === [...q.a].sort((a, b) => a - b).join(',');
      case 'sort': return q.items.every((it, i) => st.place[i] === it.b);
      default: return false;
    }
  }

  function check() {
    const q = cur(), st = Q.st;
    if (st.done) return;
    const ok = isCorrect(q, st);
    if (ok) {
      const first = st.tries === 0;
      Q.points += first ? 1 : 0.5;
      Q.xp += first ? 10 : 5;
      st.done = true; st.correct = true;
      st.msg = { kind: 'good', title: U.pick(PRAISE) + (first ? '' : ' (2nd try)'), body: q.why || '' };
      SFX.play(first ? 'firstTry' : 'correct');
      if (settings.sayPraise) setTimeout(() => speak(st.msg.title.replace(/ \(2nd try\)/, '')), 250);
      Q.log.push({ q, ok: true, first });
      if (q.word) wordStat(q.word, true, first);
      if (Q.mode === 'review') { P.missed = P.missed.filter((m) => m.id !== q._mid); P.gone = [...(P.gone || []), q._mid].slice(-400); P.fixed++; }
    } else {
      st.tries++;
      SFX.play(st.tries === 1 ? 'tryAgain' : 'wrong');
      if (st.tries === 1) {
        st.msg = { kind: 'try', title: 'Not quite. Try again!', body: q.hint || 'Look carefully and give it another try.' };
        if (q.t === 'mc') st.wrongOpts.push(st.chosen);
        if (q.t === 'sort') { st.wrongItems = q.items.map((it, i) => (st.place[i] !== it.b ? i : -1)).filter((i) => i >= 0); st.wrongItems.forEach((i) => delete st.place[i]); }
        if (q.t === 'build' || q.t === 'order') st.picked = [];
        if (q.t === 'tap') st.sel = [];
        st.chosen = null;
      } else {
        st.done = true; st.correct = false;
        if (q.t === 'sort') q.items.forEach((it, i) => { st.place[i] = it.b; });
        st.msg = { kind: 'bad', title: 'Here is the answer:', answer: answerText(q), body: q.why || '' };
        Q.log.push({ q, ok: false });
        if (q.word) wordStat(q.word, false, false);
        if (Q.mode !== 'review') {
          const clean = { ...q }; delete clean.pool; delete clean._mid;
          const id = Math.random().toString(36).slice(2, 9);
          P.missed = [{ id, q: { ...clean, _mid: id }, from: q.from || (Q.s ? `${subj(Q.s).name} · ${skillOf(Q.s, Q.k).name}` : '') }, ...P.missed].slice(0, 40);
        }
      }
    }
    save();
    render();
  }

  // Spelling words: mastered after two first-try correct spellings in a row.
  function wordStat(w, ok, first) {
    P.words = P.words || {};
    const s = P.words[w] || { right: 0, wrong: 0, streak: 0, mastered: false };
    if (ok) { s.right++; s.streak = first ? s.streak + 1 : 0; if (s.streak >= 2) s.mastered = true; }
    else { s.wrong++; s.streak = 0; s.mastered = false; }
    s.last = dayKey();
    P.words[w] = s;
  }
  const masteredIn = (words) => words.filter((w) => P.words && P.words[w] && P.words[w].mastered).length;

  function nextQ() {
    if (Q.i < Q.qs.length - 1) { Q.i++; Q.st = freshSt(); render(); window.scrollTo(0, 0); return; }
    finish();
  }

  function finish() {
    const n = Q.qs.length;
    const pct = Math.round((Q.points / n) * 100);
    const res = { pct, correct: Q.log.filter((x) => x.ok).length, n, xp: Q.xp, missed: Q.log.filter((x) => !x.ok).map((x) => x.q), unlockedNext: false, newBest: false, badges: [] };
    const stars = starsFor(pct);
    let bonus = 20 + stars * 10;
    if (Q.mode === 'skill') {
      const k = key(Q.s, Q.k, Q.l);
      const prev = P.best[k];
      if (prev == null || pct > prev) { P.best[k] = pct; res.newBest = prev != null; }
      P.plays[k] = (P.plays[k] || 0) + 1;
      if (Q.l < 2 && (prev || 0) < 70 && pct >= 70 && !settings.unlockAll) res.unlockedNext = true;
    }
    res.xp += bonus;
    P.xp += res.xp;
    P.quests++;
    if (pct === 100) P.perfects++;
    touchDay((d) => { d.rounds++; d.q += n; d.correct += res.correct; d.xp += res.xp; });
    res.badges = checkBadges();
    save();
    Q.result = res;
    go('results');
    if (stars >= 2) setTimeout(confetti, 150);
    let at = 280;
    for (let i = 0; i < stars; i++) { setTimeout(() => SFX.play('star', i), at); at += 200; }
    at += 150;
    if (res.unlockedNext) { setTimeout(() => SFX.play('unlock'), at); at += 650; }
    if (res.badges.length) { setTimeout(() => SFX.play('badge'), at); at += 650; }
    if (pct === 100) setTimeout(() => SFX.play('fanfare'), at);
  }

  function screenQuiz() {
    const q = cur(), st = Q.st;
    const title = Q.mode === 'mix' ? 'Daily Mix' : Q.mode === 'review' ? 'Practice Mistakes' : `${skillOf(Q.s, Q.k).name} · ${LEVEL_NAMES[Q.l].long}`;
    const color = Q.mode === 'skill' ? subj(Q.s).color : 'mix';
    const pct = ((Q.i + (st.done ? 1 : 0)) / Q.qs.length) * 100;
    const passage = q.passage ? `
      <aside class="passage card">
        <div class="passage-head"><span class="kind">${esc(q.passage.kind)}</span><button class="btn small" data-act="readPassage">🔊 Read to me</button></div>
        <h2>${esc(q.passage.title)}</h2>
        ${q.passage.text.split('\n\n').map((p) => `<p>${esc(p)}</p>`).join('')}
      </aside>` : '';
    return `
      <div class="quiz s-${color}">
        <header class="quiz-head">
          <button class="icon-btn" data-act="askQuit" aria-label="Leave quest">✕</button>
          <div class="quiz-title"><b>${esc(title)}</b><span>Question ${Q.i + 1} of ${Q.qs.length}</span></div>
          ${Q.mode === 'skill' ? '<button class="icon-btn" data-act="showLesson" aria-label="Show the lesson">💡</button>' : ''}<span class="pill">⭐ ${Q.xp} XP</span>
        </header>
        <div class="progress"><i style="width:${pct}%"></i></div>
        <div class="quiz-body ${q.passage ? 'with-passage' : ''}">
          ${passage}
          <section class="qcard card ${st.msg && st.msg.kind === 'try' ? 'shake' : ''}">
            ${q.from ? `<span class="from">${esc(q.from)}</span>` : ''}
            <div class="prompt-row">
              <p class="prompt">${nl(q.q)}</p>
              <button class="icon-btn speak" data-act="readQ" aria-label="Read the question aloud">🔊</button>
            </div>
            ${q.say && q.t !== 'spell' ? `<div class="say-row"><button class="btn say" data-act="sayWord">🔊 Hear the word</button><button class="btn small ghost" data-act="sayWordSlow">🐢 Slow</button></div>` : ''}
            ${renderBody(q, st)}
            ${feedback(st)}
            <div class="actions">${actionBtn(q, st)}</div>
          </section>
        </div>
      </div>`;
  }

  function feedback(st) {
    if (!st.msg) return '';
    const m = st.msg;
    return `<div class="fb fb-${m.kind}" role="status">
      <b>${esc(m.title)}</b>
      ${m.answer ? `<div class="fb-answer">${nl(m.answer)}</div>` : ''}
      ${m.body ? `<p>${nl(m.body)}</p>` : ''}
    </div>`;
  }

  function actionBtn(q, st) {
    if (st.done) return `<button class="btn primary big" data-act="next">${Q.i < Q.qs.length - 1 ? 'Next →' : 'See my score'}</button>`;
    if (q.t === 'mc') return '';
    let ready = true;
    if (q.t === 'sort') ready = q.items.every((_, i) => st.place[i] != null);
    if (q.t === 'build') ready = st.picked.length > 0;
    if (q.t === 'order') ready = st.picked.length === q.pool.length;
    if (q.t === 'tap') ready = st.sel.length > 0;
    if (q.t === 'type' || q.t === 'spell') ready = st.typed.trim().length > 0;
    return `<button class="btn primary big" data-act="check" ${ready ? '' : 'disabled'}>Check</button>`;
  }

  function renderBody(q, st) {
    switch (q.t) {
      case 'mc': {
        const long = q.opts.some((o) => o.length > 18);
        const tiny = q.opts.every((o) => o.length <= 3);
        return `<div class="opts ${long ? 'long' : ''} ${tiny ? 'tiny' : ''}">${q.opts.map((o) => {
          let cls = '';
          if (st.done && o === q.a) cls = 'right';
          else if (st.done && o === st.chosen && !st.correct) cls = 'wrong';
          else if (st.wrongOpts.includes(o)) cls = 'wrong dim';
          const dis = st.done || st.wrongOpts.includes(o);
          return `<div class="opt-wrap"><button class="opt ${cls}" data-act="choose" data-v="${esc(o)}" ${dis ? 'disabled' : ''}>${esc(o)}</button>${q.sayOpts ? `<button class="icon-btn mini" data-act="sayText" data-v="${esc(o)}" aria-label="Hear ${esc(o)}">🔈</button>` : ''}</div>`;
        }).join('')}</div>`;
      }
      case 'sort': {
        const tray = q.items.map((it, i) => (st.place[i] == null ? i : -1)).filter((i) => i >= 0);
        const chip = (i) => {
          const it = q.items[i];
          let cls = st.chosen === i ? 'sel' : '';
          if (st.done) cls = st.place[i] === it.b ? 'right' : 'wrong';
          return `<button class="chip ${cls}" data-act="sortPick" data-i="${i}" ${st.done ? 'disabled' : ''}>${esc(it.w)}</button>`;
        };
        return `
          <p class="howto">${st.chosen != null ? 'Now tap the box where it belongs.' : 'Tap a word, then tap its box.'}</p>
          <div class="tray">${tray.length ? tray.map(chip).join('') : '<span class="muted">All sorted! Press Check.</span>'}</div>
          <div class="bins" style="--n:${q.bins.length}">${q.bins.map((b, bi) => `
            <div class="bin ${st.chosen != null ? 'target' : ''}" data-act="sortDrop" data-b="${bi}" role="button" tabindex="0">
              <span class="bin-title">${esc(b)}</span>
              <div class="bin-items">${q.items.map((_, i) => (st.place[i] === bi ? chip(i) : '')).join('')}</div>
            </div>`).join('')}</div>`;
      }
      case 'build': {
        return `
          <div class="slots" aria-label="Your word">${st.picked.length ? st.picked.map((ti, pi) => `<button class="tile in" data-act="unpick" data-p="${pi}" ${st.done ? 'disabled' : ''}>${esc(q.tiles[ti])}</button>`).join('') : '<span class="muted">Tap the tiles below</span>'}</div>
          <div class="tiles">${q.tiles.map((t, ti) => `<button class="tile" data-act="pick" data-i="${ti}" ${st.picked.includes(ti) || st.done ? 'disabled' : ''}>${esc(t)}</button>`).join('')}</div>
          ${!st.done && st.picked.length ? '<button class="btn small ghost" data-act="clearPick">↺ Clear</button>' : ''}`;
      }
      case 'order': {
        const list = q.list;
        return `
          <div class="${list ? 'olist' : 'slots sentence'}">${st.picked.length ? st.picked.map((pi, n) => `<button class="${list ? 'ostep in' : 'tile word in'}" data-act="unpick" data-p="${n}" ${st.done ? 'disabled' : ''}>${list ? `<span class="num">${n + 1}</span>` : ''}${esc(q.pool[pi].text)}</button>`).join('') : `<span class="muted">${list ? 'Tap what happens first.' : 'Tap the words in order.'}</span>`}</div>
          <div class="${list ? 'olist pool' : 'tiles'}">${q.pool.map((p, pi) => (st.picked.includes(pi) ? '' : `<button class="${list ? 'ostep' : 'tile word'}" data-act="pick" data-i="${pi}" ${st.done ? 'disabled' : ''}>${esc(p.text)}</button>`)).join('')}</div>
          ${!st.done && st.picked.length ? '<button class="btn small ghost" data-act="clearPick">↺ Start over</button>' : ''}`;
      }
      case 'tap': {
        return `<p class="howto">Tap ${q.a.length > 1 ? 'all the words' : 'the word'}. Tap again to undo.</p>
          <div class="tapline">${q.words.map((w, i) => {
            let cls = st.sel.includes(i) ? 'sel' : '';
            if (st.done) cls = q.a.includes(i) ? 'right' : st.sel.includes(i) ? 'wrong' : '';
            return `<button class="tapw ${cls}" data-act="tapWord" data-i="${i}" ${st.done ? 'disabled' : ''}>${esc(w)}</button>`;
          }).join('')}</div>`;
      }
      case 'spell': {
        const shown = st.done ? q.a : '';
        return `<div class="bee-tools">
            <button class="btn bee" data-act="sayWord">🔊 Say it</button>
            <button class="btn bee" data-act="sayWordSlow">🐢 Slow</button>
            <button class="btn bee" data-act="beeSentence">📖 Sentence</button>
            <button class="btn bee" data-act="beeDef">💡 Meaning</button>
          </div>
          ${st.showSent || st.done ? `<p class="bee-line"><b>Sentence:</b> ${esc(st.done ? q.sentence : q.masked)}</p>` : ''}
          ${st.showDef || st.done ? `<p class="bee-line"><b>Meaning:</b> ${esc(q.def)}</p>` : ''}
          ${q.hints && !st.done ? `<div class="letter-boxes" aria-label="${q.a.length} letters">${[...q.a].map((c, i) => `<span>${i === 0 ? esc(c) : ''}</span>`).join('')}</div>` : ''}
          ${shown ? `<div class="letter-boxes done">${[...shown].map((c) => `<span>${esc(c)}</span>`).join('')}</div>` : ''}
          <input id="typeAns" class="input big-input spell-input" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" value="${esc(st.typed)}" ${st.done ? 'disabled' : ''} placeholder="Type the word">`;
      }
      case 'type':
        return `<input id="typeAns" class="input big-input" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(st.typed)}" ${st.done ? 'disabled' : ''} placeholder="Type here">`;
      default: return '';
    }
  }

  AFTER.quiz = () => {
    const q = cur();
    Voice.prefetch(Voice.build.question(q));
    if (Q.qs[Q.i + 1]) Voice.prefetch(Voice.build.question(Q.qs[Q.i + 1]));
    const inp = document.getElementById('typeAns');
    if (inp && !Q.st.done) {
      inp.focus();
      inp.setSelectionRange(inp.value.length, inp.value.length);
      inp.addEventListener('input', () => {
        Q.st.typed = inp.value;
        SFX.play('typeKey');
        const b = app.querySelector('[data-act="check"]');
        if (b) b.disabled = !inp.value.trim();
      });
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter' && inp.value.trim()) check(); });
    }
    if (q.t === 'spell' && !Q.st.readOnce) { Q.st.readOnce = true; setTimeout(() => Voice.say(q.say), 300); }
    else if (settings.autoRead && !Q.st.msg && !Q.st.readOnce) { Q.st.readOnce = true; setTimeout(() => readQuestion(q), 250); }
  };

  const readQuestion = (q) => Voice.say(Voice.build.question(q));


  function screenResults() {
    const r = Q.result;
    const stars = starsFor(r.pct);
    const isSkill = Q.mode === 'skill';
    const k = isSkill ? skillOf(Q.s, Q.k) : null;
    const msg = stars === 3 ? 'Outstanding!' : stars === 2 ? 'Great work!' : stars === 1 ? 'Good try!' : 'Keep practicing!';
    const canNext = isSkill && Q.l < 2 && unlocked(Q.s, Q.k, Q.l + 1);
    return `
      <section class="results card s-${isSkill ? subj(Q.s).color : 'mix'}">
        <div class="big-stars">${[0, 1, 2].map((i) => `<i class="${i < stars ? 'on' : ''}" style="animation-delay:${i * 0.18}s">★</i>`).join('')}</div>
        <h1>${msg}</h1>
        <p class="score">${r.correct} of ${r.n} correct · <b>${r.pct}%</b></p>
        <p class="muted">${isSkill ? `${k.name} · ${LEVEL_NAMES[Q.l].long}` : Q.mode === 'mix' ? 'Daily Mix' : 'Practice Mistakes'}</p>
        <div class="reward-row">
          <span class="reward">+${r.xp} XP</span>
          ${r.newBest ? '<span class="reward">New best!</span>' : ''}
          ${r.unlockedNext ? `<span class="reward unlock">🔓 ${LEVEL_NAMES[Q.l + 1].long} unlocked</span>` : ''}
        </div>
        ${r.badges.length ? `<div class="new-badges">${r.badges.map((b) => `<div class="badge on"><span>${b.icon}</span><b>${b.name}</b><small>${b.desc}</small></div>`).join('')}</div>` : ''}
        ${isSkill && r.pct < 70 ? '<p class="tip">Score 70% or more to pass this level and unlock the next one.</p>' : ''}
        <div class="res-btns">
          ${canNext ? `<button class="btn primary big" data-act="start" data-s="${Q.s}" data-k="${Q.k}" data-l="${Q.l + 1}">Next level →</button>` : ''}
          <button class="btn ${canNext ? '' : 'primary big'}" data-act="again">↻ Play again</button>
          <button class="btn ghost" data-act="${isSkill ? 'openSubject' : 'nav'}" data-s="${Q.s || ''}" data-to="home">${isSkill ? 'Back to ' + subj(Q.s).name : 'Home'}</button>
        </div>
      </section>
      ${r.missed.length ? `<section class="card review"><h2>Let's look at the tricky ones</h2><p class="muted">These are saved in Practice Mistakes so you can try them again.</p><ol>${r.missed.map((q) => `<li><p>${nl(q.q)}</p><p class="ans"><b>Answer:</b> ${nl(answerText(q))}</p></li>`).join('')}</ol></section>` : ''}`;
  }

  // ---------- "Watch first" examples ----------
  let demoToken = 0;
  const VIDS = () => (typeof VIDEOS !== 'undefined' ? VIDEOS : []);
  const lessonOf = (k, l) => (typeof LESSONS !== 'undefined' ? LESSONS[`${k}.${l}`] : null);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const fmtSecs = (n) => `${Math.floor(n / 60)}:${String(Math.round(n) % 60).padStart(2, '0')}`;

  function screenExample() {
    const k = skillOf(Q.s, Q.k), L = k.levels[Q.l];
    const les = lessonOf(Q.k, Q.l) || { rule: L.desc, ex: '' };
    const dq = Q.demo, st = Q.demoSt;
    const vid = les.video && VIDS().find((v) => v.id === les.video);
    return `
      <div class="quiz example s-${subj(Q.s).color}">
        <header class="quiz-head">
          <button class="icon-btn" data-act="exitExample" aria-label="Back to skills">←</button>
          <div class="quiz-title"><b>${esc(k.name)} · ${LEVEL_NAMES[Q.l].long}</b><span>Watch first, then it's your turn</span></div>
          <button class="btn small ghost" data-act="startQuest">Skip ›</button>
        </header>
        <div class="example-grid">
          <section class="card lesson">
            <div class="lesson-head"><span class="kind">💡 Learn it</span><button class="icon-btn speak" data-act="readLesson" aria-label="Read the lesson aloud">🔊</button></div>
            <p class="rule">${esc(les.rule)}</p>
            ${les.ex ? `<p class="ex">${esc(les.ex)}</p>` : ''}
            ${vid ? `<button class="btn small video-link" data-act="openVideo" data-id="${vid.id}" data-back="example">🎬 Watch the video lesson · ${fmtSecs(vid.secs)}</button>` : ''}
          </section>
          <section class="card demo-card" id="demoCard">
            <div class="lesson-head"><span class="kind">👀 Watch me</span><span class="demo-status" id="demoStatus">${Q.demoDone ? 'Done! Now you try.' : 'Watch how to answer…'}</span></div>
            ${dq.passage ? `<div class="demo-passage"><b>${esc(dq.passage.title)}</b><p>${esc(dq.passage.text.split('\n\n')[0])}${dq.passage.text.includes('\n\n') ? ' …' : ''}</p><small>In the quest you will read the whole text.</small></div>` : ''}
            <p class="prompt">${nl(dq.q)}</p>
            <div id="demoBody" class="demo-body" inert>${demoInner()}</div>
            <span class="hand" id="hand" aria-hidden="true">👆</span>
          </section>
        </div>
        <div class="example-actions">
          <button class="btn" data-act="replayDemo">↻ Watch again</button>
          <button class="btn primary big ${Q.demoDone ? 'pulse' : ''}" id="yourTurn" data-act="startQuest">Your turn →</button>
        </div>
      </div>`;
  }
  const demoInner = () => renderBody(Q.demo, Q.demoSt) + feedback(Q.demoSt);
  const paintDemo = () => { const b = document.getElementById('demoBody'); if (b) b.innerHTML = demoInner(); };

  function demoSteps(q) {
    const steps = [];
    if (q.t === 'mc') steps.push({ sel: `.opt[data-v="${CSS.escape(q.a)}"]`, apply: (st) => { st.chosen = q.a; } });
    if (q.t === 'sort') q.items.forEach((it, i) => {
      steps.push({ sel: `.chip[data-i="${i}"]`, apply: (st) => { st.chosen = i; }, after: 250 });
      steps.push({ sel: `.bin[data-b="${it.b}"]`, apply: (st) => { st.place[i] = it.b; st.chosen = null; }, sound: 'place', after: 300 });
    });
    if (q.t === 'build') {
      // Find tiles that spell the answer (backtracking, since chunks like "str" and "s" can overlap).
      const path = [];
      const solve = (rest, used) => {
        if (!rest) return true;
        for (let i = 0; i < q.tiles.length; i++) {
          if (used.has(i) || !q.tiles[i] || !rest.startsWith(q.tiles[i])) continue;
          used.add(i); path.push(i);
          if (solve(rest.slice(q.tiles[i].length), used)) return true;
          used.delete(i); path.pop();
        }
        return false;
      };
      solve(q.a, new Set());
      path.forEach((idx) => steps.push({ sel: `.tiles .tile[data-i="${idx}"]`, apply: (st) => { st.picked.push(idx); }, say: q.tiles[idx] }));
    }
    if (q.t === 'order') q.parts.forEach((_, n) => {
      const pi = q.pool.findIndex((p) => p.i === n);
      steps.push({ sel: `[data-act="pick"][data-i="${pi}"]`, apply: (st) => { st.picked.push(pi); } });
    });
    if (q.t === 'tap') q.a.forEach((i) => steps.push({ sel: `.tapw[data-i="${i}"]`, apply: (st) => { st.sel.push(i); } }));
    if (q.t === 'type') [...q.a[0]].forEach((_, n) => steps.push({ sel: '#typeAns', apply: (st) => { st.typed = q.a[0].slice(0, n + 1); }, sound: 'typeKey', after: 140, still: n > 0 }));
    if (q.t === 'spell') [...q.a].forEach((_, n) => steps.push({ sel: '#typeAns', apply: (st) => { st.typed = q.a.slice(0, n + 1); }, sound: 'typeKey', after: 220, still: n > 0 }));
    return steps;
  }

  async function moveHand(sel, still) {
    const card = document.getElementById('demoCard'), hand = document.getElementById('hand');
    const el = card && card.querySelector('#demoBody ' + sel);
    if (!el || !hand) return;
    const c = card.getBoundingClientRect(), r = el.getBoundingClientRect();
    hand.classList.add('show');
    hand.style.transform = `translate(${r.left - c.left + r.width / 2 - 14}px, ${r.top - c.top + r.height / 2 - 6}px)`;
    if (!still) await wait(640);
  }
  function tapHand() {
    const h = document.getElementById('hand');
    if (!h) return;
    h.classList.add('tap');
    setTimeout(() => h.classList.remove('tap'), 180);
  }

  async function runDemo() {
    const my = ++demoToken;
    const alive = () => my === demoToken && view.name === 'example';
    Q.demo = prep(Q.demoRaw); Q.demoSt = freshSt(); Q.demoDone = false;
    paintDemo();
    const status = document.getElementById('demoStatus'); if (status) status.textContent = 'Watch how to answer…';
    const yt = document.getElementById('yourTurn'); if (yt) yt.classList.remove('pulse');
    const hand = document.getElementById('hand'); if (hand) { hand.classList.remove('show'); hand.style.transform = ''; }
    const les = lessonOf(Q.k, Q.l);
    if (les) await speakAsync(Voice.build.lesson(les));
    if (!alive()) return;
    await speakAsync(Voice.LINES.watch);
    if (!alive()) return;
    const q = Q.demo, st = Q.demoSt;
    for (const step of demoSteps(q)) {
      if (!alive()) return;
      await moveHand(step.sel, step.still);
      if (!alive()) return;
      tapHand();
      SFX.play(step.sound || 'pop');
      if (step.say) Voice.say({ text: step.say, kind: 'tile' });
      step.apply(st);
      paintDemo();
      await wait(step.after || 520);
    }
    if (!alive()) return;
    st.done = true; st.correct = true;
    st.msg = { kind: 'good', title: 'That is the answer!', body: q.why || q.hint || '' };
    paintDemo();
    SFX.play('correct');
    Q.demoDone = true;
    if (hand) hand.classList.remove('show');
    if (status) status.textContent = 'Done! Now you try.';
    if (yt) yt.classList.add('pulse');
    await speakAsync(Voice.build.demoEnd(q));
  }
  AFTER.example = () => { Voice.prefetch(Voice.build.lesson(lessonOf(Q.k, Q.l))); if (!Q.demoStarted) { Q.demoStarted = true; runDemo(); } };

  // ---------- video lessons ----------
  const vcard = (v) => `<button class="vcard s-${v.subject}" data-act="openVideo" data-id="${v.id}">
      <span class="vthumb"><img src="${v.poster}" alt="" loading="lazy"><span class="vplay" aria-hidden="true">▶</span><span class="vdur">${fmtSecs(v.secs)}</span>${(P.watched || {})[v.id] ? '<span class="vdone">✓ Watched</span>' : ''}</span>
      <span class="vlabel">${esc(v.label)}</span><b>${esc(v.title)}</b><small>${esc(v.desc)}</small></button>`;

  function screenVideos() {
    const vids = VIDS();
    const watched = vids.filter((v) => (P.watched || {})[v.id]).length;
    const groups = [['mix', 'Getting started'], ['phonics', 'Phonics'], ['spelling', 'Spelling Bee'], ['grammar', 'Grammar'], ['reading', 'Reading'], ['vocab', 'Vocabulary'], ['writing', 'Writing']];
    return `
      <h1 class="page-h">Video lessons</h1>
      <p class="lead">Short lessons with pictures, sounds, and read-along words. Watch one, then practice the skill. You have watched ${watched} of ${vids.length}.</p>
      ${groups.map(([sid, label]) => { const list = vids.filter((v) => v.subject === sid); return list.length ? `<h2 class="sec">${label}</h2><section class="vgrid">${list.map(vcard).join('')}</section>` : ''; }).join('')}`;
  }

  function screenVideo() {
    const v = VIDS().find((x) => x.id === view.id);
    if (!v) return screenVideos();
    const more = [...VIDEOS.filter((x) => x.id !== v.id && x.subject === v.subject), ...VIDEOS.filter((x) => x.subject !== v.subject)].slice(0, 4);
    const pr = v.practice;
    return `
      <section class="vpage s-${v.subject}">
        <div class="player-top"><button class="back" data-act="videoBack" aria-label="Back">←</button><span class="kind">${esc(v.label)} · ${fmtSecs(v.secs)}</span></div>
        <div class="vwrap"><video id="vplayer" src="${v.src}" poster="${v.poster}" controls playsinline preload="metadata"></video></div>
        <div class="vinfo">
          <h1>${esc(v.title)}</h1>
          <p class="muted">${esc(v.desc)}</p>
          <div class="row">
            ${pr ? `<button class="btn primary" data-act="start" data-s="${pr[0]}" data-k="${pr[1]}" data-l="${pr[2]}">Practice: ${esc(skillOf(pr[0], pr[1]).name)} →</button>` : '<button class="btn primary" data-act="nav" data-to="home">Start learning →</button>'}
            ${(P.watched || {})[v.id] ? '<span class="tag-done">✓ Watched</span>' : '<span class="muted">Watch to the end for +15 XP</span>'}
          </div>
          <p id="vtoast" class="vtoast" hidden></p>
        </div>
      </section>
      <h2 class="sec">More videos</h2>
      <section class="vgrid">${more.map(vcard).join('')}</section>`;
  }
  AFTER.video = () => {
    const el = document.getElementById('vplayer');
    if (!el) return;
    el.addEventListener('play', () => Voice.stop());
    el.addEventListener('ended', () => {
      P.watched = P.watched || {};
      const first = !P.watched[view.id];
      if (first) { P.watched[view.id] = dayKey(); P.xp += 15; touchDay((d) => { d.xp += 15; }); }
      const badges = checkBadges();
      save();
      const t = document.getElementById('vtoast');
      if (t) { t.hidden = false; t.textContent = first ? `✓ Watched! +15 XP${badges.length ? ' · New badge: ' + badges.map((b) => b.name).join(', ') : ''}` : '✓ Nice review!'; }
      SFX.play(badges.length ? 'badge' : first ? 'unlock' : 'pop');
      if (first) confetti();
    });
  };

  // ---------- progress ----------
  function screenProgress(who = me().name, readOnly = false) {
    const r = readiness();
    const days = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); const k = dayKey(d); return { k, label: d.toLocaleDateString('en-US', { weekday: 'short' }), ...(P.daily[k] || { q: 0, correct: 0, rounds: 0 }) }; });
    const maxQ = Math.max(8, ...days.map((d) => d.q));
    const weekQ = days.reduce((a, d) => a + d.q, 0), weekC = days.reduce((a, d) => a + d.correct, 0);
    const played = [];
    SUBJECTS.forEach((s) => s.skills.forEach((k) => k.levels.forEach((L, l) => { const b = best(s.id, k.id, l); if (b != null) played.push({ s, k, l, b }); })));
    const weak = played.filter((x) => x.b < 70).sort((a, b) => a.b - b.b).slice(0, 5);
    const strong = played.filter((x) => x.b >= 90).sort((a, b) => b.l - a.l || b.b - a.b).slice(0, 5);
    return `
      ${readOnly ? '' : `<h1 class="page-h">${esc(who)}'s progress</h1>`}
      <section class="stats">
        <div class="stat"><b>${P.xp}</b><span>Total XP</span></div>
        <div class="stat"><b>${P.quests}</b><span>Quests done</span></div>
        <div class="stat"><b>${streakNow()}</b><span>Day streak</span></div>
        <div class="stat"><b>${r.pct}%</b><span>Grade 3 ready</span></div>
      </section>

      <section class="card">
        <div class="row-between"><h2>This week</h2><span class="muted">${weekQ} questions · ${weekQ ? Math.round((weekC / weekQ) * 100) : 0}% correct</span></div>
        <div class="week">${days.map((d) => `<div class="day ${d.k === dayKey() ? 'today' : ''}"><div class="bar-box"><span class="bar-n">${d.q || ''}</span><i class="bar" style="height:${(d.q / maxQ) * 100}%"></i><i class="bar ok" style="height:${(d.correct / maxQ) * 100}%"></i></div><span class="day-l">${d.label}</span></div>`).join('')}</div>
        <div class="key"><span><i class="sw a"></i>Answered</span><span><i class="sw b"></i>Correct</span></div>
      </section>

      <section class="grid2">
        <div class="card"><h2>Strengths</h2>${strong.length ? `<ul class="plain">${strong.map((x) => `<li><span class="dot s-${x.s.color}"></span>${x.k.name} · ${LEVEL_NAMES[x.l].long} <b>${x.b}%</b></li>`).join('')}</ul>` : '<p class="muted">Score 90% or more on a level to see it here.</p>'}</div>
        <div class="card"><h2>Needs practice</h2>${weak.length ? `<ul class="plain">${weak.map((x) => `<li>${readOnly ? `<span class="dot s-${x.s.color}"></span>${x.k.name} · ${LEVEL_NAMES[x.l].long} <b>${x.b}%</b>` : `<button class="link" data-act="start" data-s="${x.s.id}" data-k="${x.k.id}" data-l="${x.l}"><span class="dot s-${x.s.color}"></span>${x.k.name} · ${LEVEL_NAMES[x.l].long} <b>${x.b}%</b></button>`}</li>`).join('')}</ul>` : '<p class="muted">Nothing below 70% right now.</p>'}</div>
      </section>

      <section class="card">
        <h2>Skill map</h2>
        <p class="muted">Each box is one level. Stars show the best score. Codes are the Common Core standards each level practices.</p>
        <div class="map">${SUBJECTS.map((s) => `
          <div class="map-sub s-${s.color}">
            <h3>${s.icon} ${s.name} <small>${mastery(s)}%</small></h3>
            ${s.skills.map((k) => `<div class="map-row"><span class="map-name">${k.name}</span>${k.levels.map((L, l) => { const b = best(s.id, k.id, l); const st = starsFor(b); return `<button class="cell c${st} ${unlocked(s.id, k.id, l) ? '' : 'locked'}" ${readOnly ? 'disabled' : 'data-act="start"'} data-s="${s.id}" data-k="${k.id}" data-l="${l}" title="${LEVEL_NAMES[l].long}: ${esc(L.title)} (${L.std})">${b == null ? (unlocked(s.id, k.id, l) ? '–' : '🔒') : '★'.repeat(st) || b + '%'}</button>`; }).join('')}</div>`).join('')}
          </div>`).join('')}</div>
      </section>

      <section class="card">
        <h2>Badges <small class="muted">${Object.keys(P.badges).length} of ${BADGES.length}</small></h2>
        <div class="badges">${BADGES.map((b) => `<div class="badge ${P.badges[b.id] ? 'on' : ''}"><span>${b.icon}</span><b>${b.name}</b><small>${b.desc}</small></div>`).join('')}</div>
      </section>`;
  }

  // ---------- settings & players ----------
  function screenSettings() {
    return `
      <h1 class="page-h">Settings</h1>
      <section class="card stack">
        <h2>Listening</h2>
        <p class="fine">Questions, lessons, and stories use a natural recorded voice${Voice.clipCount() ? ` (${Voice.clipCount().toLocaleString()} lines)` : ''}. Your own writing is read by this device's built-in voice.</p>
        <label class="toggle"><input type="checkbox" id="setAuto" data-set="autoRead" ${settings.autoRead ? 'checked' : ''}><span>Read every question aloud automatically</span></label>
        <label class="lbl" for="setRate">Reading speed: <b id="rateVal">${settings.rate.toFixed(2)}×</b></label>
        <input type="range" id="setRate" min="0.6" max="1.2" step="0.05" value="${settings.rate}">
        <button class="btn small" data-act="sayText" data-v="${Voice.LINES.testVoice}">🔊 Test the voice</button>
        <label class="toggle"><input type="checkbox" id="setPraise" data-set="sayPraise" ${settings.sayPraise ? 'checked' : ''}><span>Say "Great job!" out loud after a right answer</span></label>
      </section>
      <section class="card stack">
        <h2>Sounds</h2>
        <label class="toggle"><input type="checkbox" id="setSound" data-set="sound" ${settings.sound ? 'checked' : ''}><span>Sound effects (taps, chimes, stars, fanfares)</span></label>
        <label class="lbl" for="setVol">Volume: <b id="volVal">${Math.round(settings.volume * 100)}%</b></label>
        <input type="range" id="setVol" min="0.1" max="1" step="0.05" value="${settings.volume}" ${settings.sound ? '' : 'disabled'}>
        <label class="toggle"><input type="checkbox" id="setMusic" data-set="music" ${settings.music ? 'checked' : ''} ${settings.sound ? '' : 'disabled'}><span>Background music (plays on menus, pauses during quests and videos)</span></label>
        <div class="row"><button class="btn small" data-act="testSound" data-v="firstTry">✓ Right</button><button class="btn small" data-act="testSound" data-v="tryAgain">↺ Try again</button><button class="btn small" data-act="testSound" data-v="fanfare">🎺 Fanfare</button><button class="btn small" data-act="testSound" data-v="badge">🏅 Badge</button></div>
      </section>
      <section class="card stack">
        <h2>Examples</h2>
        <label class="toggle"><input type="checkbox" id="setEx" data-set="examples" ${settings.examples ? 'checked' : ''}><span>Show a "Watch first" example before every quest</span></label>
        <label class="toggle"><input type="checkbox" id="setExVoice" data-set="narrateExamples" ${settings.narrateExamples ? 'checked' : ''}><span>Read the lesson and example aloud</span></label>
      </section>
      <section class="card stack">
        <h2>Daily goal</h2>
        <div class="seg">${[1, 2, 3, 5].map((n) => `<button class="${settings.dailyGoal === n ? 'on' : ''}" data-act="goal" data-n="${n}">${n} quest${n > 1 ? 's' : ''}</button>`).join('')}</div>
      </section>
      <section class="card stack">
        <h2>For grown-ups</h2>
        <label class="toggle"><input type="checkbox" id="setUnlock" data-set="unlockAll" ${settings.unlockAll ? 'checked' : ''}><span>Unlock all levels (skip ahead to Grade 3 work)</span></label>
        <p class="fine">Normally a level unlocks after scoring 70% or more on the level before it.</p>
        <button class="btn" data-act="nav" data-to="players">Manage players</button>
        ${oldBeePlayers().length ? `<button class="btn" data-act="askBeeImport">🐝 Import from Spelling Bee Trainer</button>` : ''}
        ${classes.map((c) => `<button class="btn" data-act="openDashboard" data-c="${c.id}">🏫 ${esc(c.name)} dashboard</button>`).join('')}
        ${Cloud.available ? '<button class="btn ghost" data-act="nav" data-to="classCreate">Create a class</button>' : ''}
        <button class="btn danger" data-act="askReset">Reset ${esc(me().name)}'s progress</button>
      </section>
      <p class="fine center">ELA Quest covers Grade 2 Common Core reading foundations, language, reading, and writing standards, with a Grade 3 Challenge level for every skill.</p>`;
  }

  function screenPlayers() {
    const row = (p) => {
      const d = store.get('elaq_p_' + p.id, {});
      return `<li class="${p.id === activeId ? 'on' : ''}">
        <button class="player" data-act="switchPlayer" data-id="${p.id}"><span class="av">${p.avatar}</span><span><b>${esc(p.name)}</b><small>${d.xp || 0} XP · ${d.quests || 0} quests${p.cloud ? ' · 🔒 PIN' : ''}</small></span>${p.id === activeId ? '<span class="tag">Playing</span>' : ''}</button>
        ${p.cloud ? '' : `<button class="icon-btn" data-act="askDeletePlayer" data-id="${p.id}" aria-label="Delete ${esc(p.name)}">🗑️</button>`}
      </li>`;
    };
    const locals = profiles.filter((p) => !p.cloud);
    return `
      <h1 class="page-h">Players</h1>
      ${classes.map((c) => {
        const here = profiles.filter((p) => p.cloud && p.cloud.classId === c.id);
        return `<section class="card stack">
          <div class="row-between"><h2>🏫 ${esc(c.name)}</h2><span class="muted">Syncs to every device</span></div>
          ${here.length ? `<ul class="players">${here.map(row).join('')}</ul>` : '<p class="muted">No one from this class has signed in on this device yet.</p>'}
          <div class="row"><button class="btn primary" data-act="openClass" data-c="${c.id}">Sign in a student</button><button class="btn" data-act="openDashboard" data-c="${c.id}">Grown-ups: dashboard</button><button class="btn ghost" data-act="leaveClass" data-c="${c.id}">Forget on this device</button></div>
        </section>`;
      }).join('')}
      <section class="card stack">
        <h2>📱 This device only</h2>
        ${locals.length ? `<ul class="players">${locals.map(row).join('')}</ul>` : '<p class="muted">No device-only players.</p>'}
        <div class="row"><button class="btn" data-act="newPlayer">+ Add a device-only player</button></div>
        ${locals.length && classes.length ? '<p class="fine">To move a device-only player into a class, sign in to the class, tap "I\'m new here", and choose them under "Bring progress".</p>' : ''}
      </section>
      ${Cloud.available ? `<section class="card stack"><h2>Classes</h2><p class="muted">Join a class so a student's progress follows them to any device, or create one as a parent or teacher.</p>
        <div class="row"><button class="btn" data-act="nav" data-to="welcome">Join a class</button><button class="btn" data-act="nav" data-to="classCreate">Create a class</button></div></section>` : ''}`;
  }

  // ---------- writing studio ----------
  const typeOf = (id) => STUDIO.types.find((t) => t.id === id);

  function screenStudio() {
    return `
      <h1 class="page-h">Writing Studio</h1>
      <p class="lead">Plan it, write it, check it, publish it. Every piece you publish goes on your bookshelf.</p>
      ${P.draft ? `<section class="card draft-card"><div><span class="kind">Draft in progress</span><h2>${typeOf(P.draft.type).icon} ${esc(P.draft.prompt)}</h2><p class="muted">${typeOf(P.draft.type).name} · ${LEVEL_NAMES[P.draft.lvl].long} · ${wordCount(P.draft.text)} words</p></div><div class="row"><button class="btn primary" data-act="resumeDraft">Keep writing</button><button class="btn ghost" data-act="askDiscard">Discard</button></div></section>` : ''}
      <h2 class="sec">Start something new</h2>
      <section class="types">${STUDIO.types.map((t) => `<button class="type-card" data-act="newWriting" data-t="${t.id}"><span class="type-ic">${t.icon}</span><b>${t.name}</b><span>${t.blurb}</span><small class="std">${t.std}</small></button>`).join('')}</section>
      <h2 class="sec">My bookshelf</h2>
      ${P.writings.length ? `<section class="shelf">${P.writings.map((w, i) => `<button class="book" data-act="openWriting" data-i="${i}"><span class="book-type">${typeOf(w.type).icon} ${typeOf(w.type).name}</span><b>${esc(w.title)}</b><span class="stars">${'★'.repeat(w.stars)}${'☆'.repeat(3 - w.stars)}</span><small>${w.date} · ${wordCount(w.text)} words</small></button>`).join('')}</section>` : '<p class="muted card">Nothing here yet. Your published writing will show up on this shelf.</p>'}`;
  }

  function screenStudioNew() {
    const t = typeOf(view.t);
    const lvl = view.lvl ?? 0;
    const prompt = view.prompt ?? t.prompts[0];
    return `
      <section class="sub-head s-writing"><button class="back" data-act="nav" data-to="studio" aria-label="Back">←</button><span class="sub-ic">${t.icon}</span><div><h1>${t.name}</h1><p>${t.blurb}</p></div></section>
      <section class="card stack">
        <h2>1. Pick your level</h2>
        <div class="goal-pick">${STUDIO.goals.map((g, i) => `<button class="goal-opt lv${i} ${i === lvl ? 'on' : ''}" data-act="setNewLvl" data-l="${i}"><b>${LEVEL_NAMES[i].long}</b><span>${g.label}</span></button>`).join('')}</div>
        <h2>2. Pick a topic</h2>
        <div class="prompts">${t.prompts.map((p) => `<button class="prompt-opt ${p === prompt ? 'on' : ''}" data-act="setPrompt" data-v="${esc(p)}">${esc(p)}</button>`).join('')}</div>
        <label class="lbl" for="ownTopic">Or write your own topic</label>
        <input id="ownTopic" class="input" maxlength="80" placeholder="My own idea…" value="${t.prompts.includes(prompt) ? '' : esc(prompt)}">
        <button class="btn primary big" data-act="beginWriting">Start planning →</button>
      </section>`;
  }
  AFTER.studioNew = () => {
    const inp = document.getElementById('ownTopic');
    inp && inp.addEventListener('input', () => { if (inp.value.trim()) { view.prompt = inp.value.trim(); app.querySelectorAll('.prompt-opt').forEach((b) => b.classList.remove('on')); } });
  };

  const sentencesOf = (text) => text.replace(/\s+/g, ' ').trim().split(/(?<=[.!?]["”]?)\s+/).filter((s) => /[a-z]/i.test(s));
  const wordCount = (text) => (text.trim().match(/[A-Za-z']+/g) || []).length;
  const MISSPELL = { dont: "don't", cant: "can't", im: "I'm", wont: "won't", didnt: "didn't", isnt: "isn't", becuase: 'because', becaus: 'because', becuz: 'because', thier: 'their', freind: 'friend', frend: 'friend', alot: 'a lot', wint: 'went', sed: 'said', wuz: 'was', becoz: 'because', beutiful: 'beautiful', favrite: 'favorite', favorit: 'favorite', thay: 'they', whent: 'went', wher: 'where', becase: 'because', realy: 'really', togather: 'together', aftr: 'after', frist: 'first', scool: 'school', skool: 'school', peple: 'people', evry: 'every', lets: "let's" };

  function autoChecks(d) {
    const t = typeOf(d.type), g = STUDIO.goals[d.lvl], text = d.text.trim();
    const sents = sentencesOf(text);
    const words = wordCount(text);
    const lc = text.toLowerCase();
    const checks = [];
    checks.push({ ok: sents.length >= g.sentences, label: `At least ${g.sentences} sentences`, detail: `You have ${sents.length}.` });
    checks.push({ ok: words >= g.words, label: `At least ${g.words} words`, detail: `You have ${words}.` });
    const lowerStart = sents.filter((s) => /^["“]?[a-z]/.test(s));
    checks.push({ ok: sents.length > 0 && lowerStart.length === 0, label: 'Every sentence starts with a capital letter', detail: lowerStart.length ? `Check: "${lowerStart[0].slice(0, 30)}…"` : '' });
    checks.push({ ok: /[.!?]["”]?$/.test(text), label: 'Ends with an end mark (. ? !)', detail: '' });
    const loneI = (text.match(/\bi\b/g) || []).length;
    checks.push({ ok: loneI === 0, label: 'The word "I" is always a capital', detail: loneI ? `Found "i" ${loneI} time${loneI > 1 ? 's' : ''}.` : '' });
    const found = Object.keys(MISSPELL).filter((w) => new RegExp(`\\b${w}\\b`, 'i').test(text));
    checks.push({ ok: found.length === 0, label: 'No common spelling slips', detail: found.length ? found.map((w) => `${w} → ${MISSPELL[w]}`).join(', ') : '' });
    if (d.lvl >= 1) {
      const used = t.words.filter((w) => lc.includes(w.toLowerCase()));
      checks.push({ ok: used.length >= (d.lvl === 2 ? 3 : 2), label: `Uses ${d.lvl === 2 ? 3 : 2}+ linking words (${t.words.slice(0, 4).join(', ')}…)`, detail: used.length ? `You used: ${used.join(', ')}` : '' });
    }
    if (d.lvl === 2 && d.type === 'story') checks.push({ ok: /["“].+?["”]/.test(text), label: 'Includes dialogue in quotation marks', detail: '' });
    if (d.lvl === 2 && ['opinion', 'info', 'howto'].includes(d.type)) checks.push({ ok: /(in conclusion|that is why|that's why|now you|to sum up|so remember)/i.test(text), label: 'Has a concluding sentence', detail: '' });
    if (d.type === 'letter') {
      checks.push({ ok: /^dear\b.+,/i.test(text), label: 'Starts with a greeting like "Dear Grandma,"', detail: '' });
      checks.push({ ok: /(love|your friend|sincerely|from|yours)[^\n]*,/i.test(text), label: 'Has a closing like "Love," with a comma', detail: '' });
    }
    return checks;
  }

  const SELF = ['I read my writing out loud (or used 🔊 Listen).', 'Every sentence is about my topic.', 'I used describing words.', 'My writing has a beginning, middle, and end.'];

  function screenStudioEdit() {
    const d = P.draft, t = typeOf(d.type), g = STUDIO.goals[d.lvl];
    const steps = ['Plan', 'Write', 'Check', 'Publish'];
    const plan = t.plan.filter((f) => !(d.lvl < 2 && /Grade 3/.test(f.label)));
    let body = '';
    if (d.step === 0) {
      body = `<section class="card stack">
        <h2>Plan your ${t.name.toLowerCase()}</h2>
        <p class="muted">Jot down quick ideas. You don't need full sentences yet.</p>
        ${plan.map((f) => `<label class="lbl" for="plan_${f.key}">${esc(f.label.replace(' (Grade 3 Challenge)', ''))}</label><input id="plan_${f.key}" class="input" data-plan="${f.key}" placeholder="${esc(f.ph)}" value="${esc(d.plan[f.key] || '')}">`).join('')}
        <div class="row"><button class="btn primary big" data-act="step" data-n="1">Start writing →</button></div>
      </section>`;
    } else if (d.step === 1) {
      const filled = plan.filter((f) => d.plan[f.key]);
      body = `<div class="write-grid">
        <section class="card stack">
          <div class="row-between"><h2>Write</h2><span class="goal-chip">${esc(g.label)}</span></div>
          <div class="starters"><span class="lbl">Tap to add:</span>${t.starters.map((s) => `<button class="chip" data-act="insert" data-v="${esc(s)}">${esc(s)}</button>`).join('')}</div>
          <textarea id="draftText" class="paper" placeholder="Start writing here…" spellcheck="true">${esc(d.text)}</textarea>
          <div class="counters"><span id="cntW">0 words</span><span id="cntS">0 sentences</span><span class="meter"><i id="cntBar"></i></span></div>
          <div class="row"><button class="btn" data-act="step" data-n="0">← Plan</button><button class="btn" data-act="listenDraft">🔊 Listen</button><button class="btn primary" data-act="step" data-n="2">Check my writing →</button></div>
        </section>
        <aside class="card plan-side"><h2>My plan</h2>${filled.length ? `<dl>${filled.map((f) => `<dt>${esc(f.label.replace(' (Grade 3 Challenge)', ''))}</dt><dd>${esc(d.plan[f.key])}</dd>`).join('')}</dl>` : '<p class="muted">No plan notes yet.</p>'}<h3>Word bank</h3><div class="wb">${t.words.map((w) => `<span>${esc(w)}</span>`).join('')}</div></aside>
      </div>`;
    } else if (d.step === 2) {
      const checks = autoChecks(d);
      const passedN = checks.filter((c) => c.ok).length;
      body = `<section class="card stack">
        <div class="row-between"><h2>Check your writing</h2><span class="goal-chip">${passedN} of ${checks.length} checks</span></div>
        <ul class="checks">${checks.map((c) => `<li class="${c.ok ? 'ok' : 'no'}"><span class="mark">${c.ok ? '✓' : '!'}</span><span><b>${esc(c.label)}</b>${c.detail ? `<small>${esc(c.detail)}</small>` : ''}</span></li>`).join('')}</ul>
        <h3>Check it yourself</h3>
        ${SELF.map((s, i) => `<label class="toggle"><input type="checkbox" id="self${i}" data-self="${i}" ${d.self && d.self[i] ? 'checked' : ''}><span>${esc(s)}</span></label>`).join('')}
        <div class="preview paper-view">${esc(d.text) || '<span class="muted">Nothing written yet.</span>'}</div>
        <div class="row"><button class="btn" data-act="step" data-n="1">← Fix it up</button><button class="btn" data-act="listenDraft">🔊 Listen</button><button class="btn primary" data-act="step" data-n="3" ${wordCount(d.text) < 3 ? 'disabled' : ''}>Ready to publish →</button></div>
      </section>`;
    } else {
      body = `<section class="card stack">
        <h2>Publish</h2>
        <label class="lbl" for="pubTitle">Give your writing a title</label>
        <input id="pubTitle" class="input" maxlength="60" value="${esc(d.title || d.prompt)}">
        <div class="preview paper-view">${esc(d.text)}</div>
        <div class="row"><button class="btn" data-act="step" data-n="2">← Back</button><button class="btn primary big" data-act="publish">📚 Publish to my bookshelf</button></div>
      </section>`;
    }
    return `
      <section class="sub-head s-writing"><button class="back" data-act="nav" data-to="studio" aria-label="Back to studio">←</button><span class="sub-ic">${t.icon}</span><div><h1>${esc(d.prompt)}</h1><p>${t.name} · ${LEVEL_NAMES[d.lvl].long}</p></div></section>
      <ol class="steps">${steps.map((s, i) => `<li class="${i === d.step ? 'on' : i < d.step ? 'done' : ''}"><button data-act="step" data-n="${i}" ${i > d.step + 1 ? 'disabled' : ''}><span>${i + 1}</span>${s}</button></li>`).join('')}</ol>
      ${body}`;
  }

  AFTER.studioEdit = () => {
    const d = P.draft;
    app.querySelectorAll('[data-plan]').forEach((inp) => inp.addEventListener('input', () => { d.plan[inp.dataset.plan] = inp.value; save(); }));
    app.querySelectorAll('[data-self]').forEach((cb) => cb.addEventListener('change', () => { d.self = d.self || {}; d.self[cb.dataset.self] = cb.checked; save(); }));
    const title = document.getElementById('pubTitle');
    title && title.addEventListener('input', () => { d.title = title.value; save(); });
    const ta = document.getElementById('draftText');
    if (ta) {
      const g = STUDIO.goals[d.lvl];
      const upd = () => {
        d.text = ta.value;
        const w = wordCount(ta.value), s = sentencesOf(ta.value).length;
        document.getElementById('cntW').textContent = `${w} / ${g.words} words`;
        document.getElementById('cntS').textContent = `${s} / ${g.sentences} sentences`;
        document.getElementById('cntBar').style.width = Math.min(100, (Math.min(w / g.words, 1) * 50 + Math.min(s / g.sentences, 1) * 50)) + '%';
        save();
      };
      ta.addEventListener('input', upd);
      upd();
    }
  };

  function screenWritingView() {
    const w = P.writings[view.i];
    if (!w) return SCREENS.studio();
    const t = typeOf(w.type);
    return `
      <section class="sub-head s-writing"><button class="back" data-act="nav" data-to="studio" aria-label="Back">←</button><span class="sub-ic">${t.icon}</span><div><h1>${esc(w.title)}</h1><p>${t.name} · ${LEVEL_NAMES[w.lvl].long} · ${w.date}</p></div></section>
      <section class="card stack">
        <div class="row-between"><span class="stars big">${'★'.repeat(w.stars)}${'☆'.repeat(3 - w.stars)}</span><span class="muted">${wordCount(w.text)} words · ${sentencesOf(w.text).length} sentences</span></div>
        <div class="paper-view published"><h2>${esc(w.title)}</h2><p class="byline">by ${esc(me().name)}</p>${esc(w.text)}</div>
        <div class="row"><button class="btn primary" data-act="listenPiece" data-i="${view.i}">🔊 Read it to me</button><button class="btn ghost" data-act="copyPiece" data-i="${view.i}">Copy text</button><button class="btn danger ghost" data-act="askDeleteWriting" data-i="${view.i}">Delete</button></div>
      </section>`;
  }

  // ---------- classes & cloud sync ----------
  // Cloud students are profiles with `cloud: {classId, sid, className}`. Progress is saved on the device first,
  // then pushed to the class (debounced); it is pulled and merged on sign-in, on app start, and when the app
  // comes back to the foreground, so progress made on another device shows up.
  const SYNC_ICON = { idle: '☁️', saving: '⏳', saved: '☁️✓', offline: '⚠️' };
  const SYNC_LABEL = { idle: 'Synced with your class', saving: 'Saving to your class…', saved: 'Saved to your class', offline: 'Offline: progress is saved on this device and will sync later' };
  const sync = { state: 'idle', timer: null, dirty: false, busy: false };
  let classes = store.get('elaq_classes', []); // classes this device has joined: [{id, name}]
  const adminOK = new Set(); // classes unlocked with the grown-up PIN this session
  const saveClasses = () => store.set('elaq_classes', classes);
  const rememberClass = (c) => { if (!classes.some((x) => x.id === c.id)) { classes.push({ id: c.id, name: c.name }); saveClasses(); } };

  function setSync(state) {
    sync.state = state;
    const el = document.getElementById('syncPill');
    if (el) { el.textContent = SYNC_ICON[state]; el.title = SYNC_LABEL[state]; }
  }
  function queuePush(delay = 2500) {
    sync.dirty = true;
    clearTimeout(sync.timer);
    sync.timer = setTimeout(push, delay);
    setSync('saving');
  }
  async function push() {
    const p = me();
    if (!p || !p.cloud || !sync.dirty || sync.busy) return;
    sync.busy = true; sync.dirty = false;
    try { await Cloud.saveStudent(p.cloud.classId, p.cloud.sid, P); setSync('saved'); }
    catch (e) { if (e.status === 404) studentRemoved(p); else { sync.dirty = true; setSync('offline'); } }
    finally { sync.busy = false; }
  }
  async function pull() {
    const p = me();
    if (!p || !p.cloud) return;
    try {
      const s = await Cloud.getStudent(p.cloud.classId, p.cloud.sid);
      if (me() !== p) return;
      if (!s) { studentRemoved(p); return; }
      let remote = {};
      try { remote = JSON.parse(s.data || '{}'); } catch { /* keep local */ }
      if (s.name && s.name !== p.name) { p.name = s.name; saveProfiles(); }
      const merged = Object.assign(blankData(), Cloud.merge(P, Object.assign(blankData(), remote)));
      const changed = JSON.stringify(merged) !== JSON.stringify(P);
      P = merged;
      store.set('elaq_p_' + activeId, P);
      if (JSON.stringify(merged) !== JSON.stringify(Object.assign(blankData(), remote))) queuePush(400); else setSync('saved');
      if (changed && !['quiz', 'example', 'studioEdit', 'video'].includes(view.name)) render();
    } catch { setSync('offline'); }
  }
  function studentRemoved(p) {
    profiles = profiles.filter((x) => x.id !== p.id);
    store.del('elaq_p_' + p.id);
    saveProfiles();
    if (profiles.length) loadProfile(profiles[0].id); else { P = null; activeId = null; store.del('elaq_active'); }
    go(profiles.length ? 'players' : 'welcome');
    modal = `<h2>${esc(p.name)} was removed</h2><p>A grown-up removed ${esc(p.name)} from ${esc(p.cloud.className || 'the class')}, so this device signed them out.</p><div class="row end"><button class="btn primary" data-act="closeModal">OK</button></div>`;
    render();
  }
  window.addEventListener('online', () => { if (sync.dirty) push(); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') pull(); else if (sync.dirty) push(); });
  setInterval(() => { if (sync.dirty) push(); }, 30000);

  // Evaluate the progress helpers against another student's data (for the dashboard).
  function withData(data, fn) {
    const saved = P;
    P = Object.assign(blankData(), data);
    try { return fn(); } finally { P = saved; }
  }
  function summarize(data) {
    return withData(data, () => {
      const days = Object.keys(P.daily).sort();
      const played = [];
      SUBJECTS.forEach((s) => s.skills.forEach((k) => k.levels.forEach((L, l) => { const b = best(s.id, k.id, l); if (b != null) played.push({ s, k, l, b }); })));
      const weak = played.filter((x) => x.b < 70).sort((a, b) => a.b - b.b)[0];
      const week = days.filter((d) => d >= dayKey(new Date(Date.now() - 6 * 864e5))).reduce((a, d) => a + (P.daily[d].q || 0), 0);
      return { xp: P.xp, level: playerLevel(), quests: P.quests, streak: streakNow(), ready: readiness().pct, last: days[days.length - 1] || null,
        week, mastery: Object.fromEntries(SUBJECTS.map((s) => [s.id, mastery(s)])), weak, writings: P.writings.length, badges: Object.keys(P.badges).length };
    });
  }
  const lastSeen = (d) => { if (!d) return 'Not yet'; if (d === dayKey()) return 'Today'; if (d === yesterday()) return 'Yesterday'; return new Date(d + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); };
  const joinLink = (id) => `${location.origin}${location.pathname}#join-${id}`;

  // ---- PIN pad (modal) ----
  let pin = null; // {title, sub, len, max, entered, err, check(p) -> Promise<bool>, ok()}
  function pinModal() {
    const dots = pin.max > pin.len ? pin.entered.length || 1 : pin.len;
    return `<div class="pinpad">
      <h2>${esc(pin.title)}</h2>${pin.sub ? `<p class="muted">${esc(pin.sub)}</p>` : ''}
      <div class="pin-dots ${pin.err ? 'shake' : ''}">${[...Array(Math.max(dots, pin.len))].map((_, i) => `<i class="${i < pin.entered.length ? 'on' : ''}"></i>`).join('')}</div>
      <p class="pin-err" role="alert">${esc(pin.err || '')}</p>
      <div class="pin-keys">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button data-act="pinKey" data-v="${n}">${n}</button>`).join('')}
        <button data-act="closeModal" class="pin-cancel">Cancel</button><button data-act="pinKey" data-v="0">0</button><button data-act="pinBack" aria-label="Delete">⌫</button></div>
      ${pin.max > pin.len ? `<button class="btn primary" data-act="pinGo" ${pin.entered.length >= pin.len ? '' : 'disabled'}>OK</button>` : ''}
    </div>`;
  }
  function askPin(opts) { pin = { len: 4, max: 4, entered: '', err: '', ...opts }; modal = pinModal(); render(); }
  async function pinSubmit() {
    const ok = await pin.check(pin.entered).catch(() => null);
    if (ok === null) { pin.err = 'Could not reach the class. Check the internet and try again.'; pin.entered = ''; }
    else if (!ok) { pin.err = 'That PIN is not right. Try again.'; pin.entered = ''; SFX.play('tryAgain'); }
    else { const done = pin.ok; pin = null; modal = null; SFX.play('unlock'); done(); return; }
    modal = pinModal(); render();
  }

  // ---- screens ----
  function classCard() {
    if (!Cloud.available) return '';
    const code = view.code ?? (location.hash.startsWith('#join-') ? location.hash.slice(6) : '');
    return `<section class="card stack class-card">
      <h2>🏫 Join my class</h2>
      <p class="muted">Your progress follows you to any device. Ask a grown-up for the class code.</p>
      <label class="lbl" for="joinCode">Class code</label>
      <input id="joinCode" class="input code-input" maxlength="16" placeholder="XXXX-XXXX-XXXX" value="${esc(code)}" autocomplete="off" autocapitalize="characters" spellcheck="false">
      <p class="pin-err" id="joinErr" role="alert">${esc(view.joinErr || '')}</p>
      <button class="btn primary big" data-act="joinClass">Join class</button>
      ${classes.length ? `<div class="joined">${classes.map((c) => `<button class="chip" data-act="openClass" data-c="${c.id}">🏫 ${esc(c.name)}</button>`).join('')}</div>` : ''}
      <button class="btn ghost" data-act="nav" data-to="classCreate">Grown-ups: create a class</button>
    </section>`;
  }

  function screenClassCreate() {
    if (view.created) {
      const c = view.created;
      return `<div class="narrow"><section class="card stack">
        <h2>🎉 ${esc(c.name)} is ready</h2>
        <p>Write down this class code. Students type it once on each device to join.</p>
        <div class="big-code" id="bigCode">${Cloud.prettyCode(c.id)}</div>
        <div class="row"><button class="btn" data-act="copyText" data-v="${Cloud.prettyCode(c.id)}">Copy code</button><button class="btn" data-act="copyText" data-v="${esc(joinLink(c.id))}">Copy join link</button></div>
        <p class="fine">Anyone with this code can see and change progress in the class, so share it only with your family or students. Keep your grown-up PIN private; it opens the dashboard.</p>
        <button class="btn primary big" data-act="openClass" data-c="${c.id}">Add students →</button>
      </section></div>`;
    }
    return `<div class="narrow"><section class="card stack">
      <h2>Create a class</h2>
      <p class="muted">For a parent or teacher. You get a class code to share and a dashboard that shows every student's progress.</p>
      <label class="lbl" for="className">Class name</label>
      <input id="className" class="input" maxlength="40" placeholder="Garimella Family, Room 12…" value="${esc(view.cname || '')}">
      <label class="lbl" for="adminPin">Grown-up PIN (4–6 digits)</label>
      <input id="adminPin" class="input" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="new-password">
      <label class="lbl" for="adminPin2">Type the PIN again</label>
      <input id="adminPin2" class="input" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="new-password">
      <p class="pin-err" role="alert">${esc(view.err || '')}</p>
      <button class="btn primary big" data-act="createClass" ${view.busy ? 'disabled' : ''}>${view.busy ? 'Creating…' : 'Create class'}</button>
      <button class="btn ghost" data-act="nav" data-to="${profiles.length ? 'players' : 'welcome'}">Back</button>
    </section></div>`;
  }

  function screenClassPick() {
    const c = classes.find((x) => x.id === view.c) || { id: view.c, name: 'Class' };
    const list = view.students;
    const locals = profiles.filter((p) => !p.cloud);
    if (view.mode === 'new') {
      const pick = view.avatar || AVATARS[0];
      return `<div class="narrow"><section class="card stack">
        <h2>Join ${esc(c.name)}</h2>
        <label class="lbl" for="stuName">Your first name</label>
        <input id="stuName" class="input" maxlength="16" value="${esc(view.typed || '')}" autocomplete="off">
        <span class="lbl">Pick a buddy</span>
        <div class="avatars">${AVATARS.map((a) => `<button class="av-btn ${a === pick ? 'on' : ''}" data-act="pickAvatar" data-a="${a}">${a}</button>`).join('')}</div>
        <label class="lbl" for="stuPin">Make a 4-digit PIN (a secret number to sign in)</label>
        <input id="stuPin" class="input" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="new-password">
        <label class="lbl" for="stuPin2">Type your PIN again</label>
        <input id="stuPin2" class="input" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="new-password">
        ${locals.length ? `<label class="lbl" for="bringFrom">Bring progress from a player on this device?</label>
        <select id="bringFrom" class="input"><option value="">No, start fresh</option>${locals.map((p) => `<option value="${p.id}">${esc(p.avatar + ' ' + p.name)} (${(store.get('elaq_p_' + p.id, {}).xp || 0)} XP)</option>`).join('')}</select>` : ''}
        <p class="pin-err" role="alert">${esc(view.err || '')}</p>
        <button class="btn primary big" data-act="createStudent" ${view.busy ? 'disabled' : ''}>${view.busy ? 'Joining…' : 'Join the class'}</button>
        <button class="btn ghost" data-act="pickMode" data-m="">Back</button>
      </section></div>`;
    }
    return `<div class="narrow">
      <div class="paper-title"><h1>${esc(c.name)}</h1><p>Tap your name to sign in</p></div>
      <section class="card stack">
        ${!list ? '<p class="muted center">Loading the class…</p>' : view.err ? `<p class="pin-err">${esc(view.err)}</p><button class="btn" data-act="openClass" data-c="${c.id}">Try again</button>` : `
        <div class="stu-grid">${list.map((st) => `<button class="stu" data-act="pickStudent" data-sid="${st.id}"><span class="av">${esc(st.avatar || '🦊')}</span><b>${esc(st.name)}</b></button>`).join('')}
          <button class="stu new" data-act="pickMode" data-m="new"><span class="av">＋</span><b>I'm new here</b></button></div>`}
        <div class="row">
          <button class="btn ghost" data-act="nav" data-to="${profiles.length ? 'players' : 'welcome'}">Back</button>
          <button class="btn ghost" data-act="openDashboard" data-c="${c.id}">Grown-ups: dashboard</button>
        </div>
      </section>
    </div>`;
  }
  AFTER.classPick = () => {
    if (view.students || view.loading || view.mode === 'new') return;
    view.loading = true;
    Cloud.listStudents(view.c).then((l) => { view.students = l; view.loading = false; if (view.name === 'classPick') render(); })
      .catch(() => { view.students = []; view.err = 'Could not load the class. Check the internet and try again.'; view.loading = false; if (view.name === 'classPick') render(); });
  };
  AFTER.welcome = ((orig) => () => {
    orig();
    if (location.hash.startsWith('#join-') && !view.autoJoined) { view.autoJoined = true; ACT.joinClass(); }
  })(AFTER.welcome);

  function screenDashboard() {
    const c = classes.find((x) => x.id === view.c) || { id: view.c, name: 'Class' };
    const list = view.students;
    const rows = (list || []).map((st) => { let d = {}; try { d = JSON.parse(st.data || '{}'); } catch { /* empty */ } return { st, sum: summarize(d) }; });
    const active = rows.filter((r) => r.sum.last === dayKey()).length;
    const avgReady = rows.length ? Math.round(rows.reduce((a, r) => a + r.sum.ready, 0) / rows.length) : 0;
    return `
      <section class="sub-head s-mix"><button class="back" data-act="nav" data-to="players" aria-label="Back">←</button><span class="sub-ic">🏫</span><div><h1>${esc(c.name)}</h1><p>Class dashboard · code ${Cloud.prettyCode(c.id)}</p></div></section>
      <div class="row"><button class="btn small" data-act="copyText" data-v="${esc(joinLink(c.id))}">Copy join link</button><button class="btn small" data-act="copyText" data-v="${Cloud.prettyCode(c.id)}">Copy code</button><button class="btn small ghost" data-act="refreshDash">↻ Refresh</button></div>
      ${!list ? '<p class="muted card">Loading students…</p>' : view.err ? `<p class="pin-err card">${esc(view.err)}</p>` : !rows.length ? '<p class="card muted">No students yet. On a child\'s device, open the join link (or type the code) and tap "I\'m new here".</p>' : `
      <section class="stats">
        <div class="stat"><b>${rows.length}</b><span>Students</span></div>
        <div class="stat"><b>${active}</b><span>Learned today</span></div>
        <div class="stat"><b>${rows.reduce((a, r) => a + r.sum.week, 0)}</b><span>Questions this week</span></div>
        <div class="stat"><b>${avgReady}%</b><span>Avg Grade 3 ready</span></div>
      </section>
      <section class="card dash-wrap"><div class="dash-scroll"><table class="dash">
        <thead><tr><th>Student</th><th>Last active</th><th>XP</th><th>Quests</th><th>Streak</th><th>This week</th>${SUBJECTS.map((s) => `<th class="s-${s.color}">${s.name}</th>`).join('')}<th>Grade 3 ready</th><th>Needs practice</th><th></th></tr></thead>
        <tbody>${rows.map(({ st, sum }) => `<tr>
          <td><button class="link" data-act="openStudent" data-sid="${st.id}"><span class="av">${esc(st.avatar || '🦊')}</span> <b>${esc(st.name)}</b></button></td>
          <td>${lastSeen(sum.last)}</td><td class="num">${sum.xp}</td><td class="num">${sum.quests}</td><td class="num">${sum.streak ? '🔥 ' + sum.streak : '–'}</td><td class="num">${sum.week} q</td>
          ${SUBJECTS.map((s) => `<td class="s-${s.color}"><span class="meter mini"><i style="width:${sum.mastery[s.id]}%"></i></span><small>${sum.mastery[s.id]}%</small></td>`).join('')}
          <td class="num"><b>${sum.ready}%</b></td>
          <td>${sum.weak ? `${esc(sum.weak.k.name)} <small class="muted">${LEVEL_NAMES[sum.weak.l].short} · ${sum.weak.b}%</small>` : '<span class="muted">–</span>'}</td>
          <td><button class="icon-btn mini" data-act="askRemoveStudent" data-sid="${st.id}" aria-label="Remove ${esc(st.name)}">🗑️</button></td>
        </tr>`).join('')}</tbody></table></div></section>`}
      <p class="fine">Mastery is the share of stars earned across all levels in that subject. Grade 3 ready is the share of skills whose Grade 3 Challenge is passed (70% or more).</p>`;
  }
  AFTER.dashboard = () => {
    if (view.students || view.loading) return;
    view.loading = true;
    Cloud.listStudents(view.c, true).then((l) => { view.students = l; view.loading = false; if (view.name === 'dashboard') render(); })
      .catch(() => { view.students = []; view.err = 'Could not load the class. Check the internet and try again.'; view.loading = false; if (view.name === 'dashboard') render(); });
  };

  function screenStudentView() {
    const st = (view.students || []).find((x) => x.id === view.sid);
    if (!st) return screenDashboard();
    let d = {}; try { d = JSON.parse(st.data || '{}'); } catch { /* empty */ }
    const body = withData(d, () => screenProgress(st.name, true));
    const ws = (d.writings || []);
    return `
      <section class="sub-head s-mix"><button class="back" data-act="backToDash" aria-label="Back to dashboard">←</button><span class="sub-ic">${esc(st.avatar || '🦊')}</span><div><h1>${esc(st.name)}</h1><p>Last synced ${st.updatedAt ? new Date(st.updatedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'never'}</p></div></section>
      ${body}
      <section class="card stack"><h2>Writing (${ws.length})</h2>${ws.length ? ws.map((w) => `<details class="wpiece"><summary><b>${esc(w.title)}</b> <span class="muted">${esc(w.date)} · ${'★'.repeat(w.stars || 0)}</span></summary><div class="paper-view">${esc(w.text)}</div></details>`).join('') : '<p class="muted">No published writing yet.</p>'}</section>`;
  }

  Object.assign(SCREENS, { classCreate: screenClassCreate, classPick: screenClassPick, dashboard: screenDashboard, studentView: screenStudentView });

  async function signInStudent(c, st, data) {
    const id = `c_${c.id}_${st.id}`;
    let prof = profiles.find((p) => p.id === id);
    if (!prof) { prof = { id, name: st.name, avatar: st.avatar || AVATARS[0], cloud: { classId: c.id, sid: st.id, className: c.name } }; profiles.push(prof); saveProfiles(); }
    if (data) store.set('elaq_p_' + id, data);
    loadProfile(id);
    go('home');
    await pull();
  }

  // ---------- modals ----------
  function confirmModal(title, text, yesAct, yesLabel, data = '') {
    modal = `<h2>${esc(title)}</h2><p>${esc(text)}</p><div class="row end"><button class="btn ghost" data-act="closeModal">Cancel</button><button class="btn danger" data-act="${yesAct}" ${data}>${esc(yesLabel)}</button></div>`;
    render();
  }

  // ---------- actions ----------
  const ACT = {
    nav: (ds) => { SFX.play('tap'); if (ds.to === 'home' && ds.s) return go('subject', { s: ds.s }); go(ds.to); },
    testSound: (ds) => SFX.play(ds.v),
    startQuest: () => { demoToken++; Voice.stop(); SFX.play('whoosh'); go('quiz'); },
    exitExample: () => { demoToken++; const s = Q.s; Q = null; go('subject', { s }); },
    replayDemo: () => runDemo(),
    readLesson: () => { const les = lessonOf(Q.k, Q.l); if (les) Voice.say(Voice.build.lesson(les)); },
    showLesson: () => {
      const les = lessonOf(Q.k, Q.l) || { rule: skillOf(Q.s, Q.k).levels[Q.l].desc };
      modal = `<span class="kind">💡 Remember</span><p class="rule">${esc(les.rule)}</p>${les.ex ? `<p class="ex">${esc(les.ex)}</p>` : ''}<div class="row end"><button class="btn" data-act="readLesson">🔊 Read it</button><button class="btn primary" data-act="closeModal">Got it</button></div>`;
      SFX.play('open'); render();
    },
    openVideo: (ds) => { demoToken++; SFX.play('open'); go('video', { id: ds.id, back: ds.back || '' }); },
    videoBack: () => { if (view.back === 'example' && Q && Q.demo) go('example'); else go('videos'); },
    closeModal: () => { modal = null; render(); },
    openSubject: (ds) => (ds.s ? go('subject', { s: ds.s }) : go('home')),
    start: (ds) => { const l = +ds.l; if (!unlocked(ds.s, ds.k, l)) { modal = `<h2>🔒 Locked level</h2><p>Score 70% or more on <b>${LEVEL_NAMES[l - 1].long}</b> to unlock this level.</p><div class="row end"><button class="btn primary" data-act="start" data-s="${ds.s}" data-k="${ds.k}" data-l="${l - 1}">Play ${LEVEL_NAMES[l - 1].long}</button></div>`; render(); return; } startRound({ mode: 'skill', s: ds.s, k: ds.k, l }); },
    mix: () => startRound({ mode: 'mix' }),
    review: () => { if (P.missed.length) startRound({ mode: 'review' }); },
    again: () => startRound({ mode: Q.mode, s: Q.s, k: Q.k, l: Q.l, noExample: true }),
    askQuit: () => confirmModal('Leave this quest?', 'Your answers in this quest will not be saved.', 'quit', 'Leave'),
    quit: () => { const back = Q.mode === 'skill' ? ['subject', { s: Q.s }] : ['home', {}]; Q = null; go(...back); },

    choose: (ds) => { if (Q.st.done) return; SFX.play('tap'); Q.st.chosen = ds.v; check(); },
    check: () => check(),
    next: () => { SFX.play('whoosh'); nextQ(); },
    readQ: () => readQuestion(cur()),
    sayWord: () => Voice.say(cur().say),
    sayWordSlow: () => Voice.say(cur().say, { kind: 'slow' }),
    sayText: (ds) => speak(ds.v),
    beeSentence: () => { Q.st.showSent = true; Voice.say(cur().sentence); render(); },
    beeDef: () => { Q.st.showDef = true; Voice.say(cur().def); render(); },
    readPassage: () => Voice.say(Voice.build.passage(cur().passage)),
    sortPick: (ds, el, e) => {
      e.stopPropagation();
      const i = +ds.i;
      if (Q.st.place[i] != null) { delete Q.st.place[i]; Q.st.chosen = null; SFX.play('unplace'); }
      else { Q.st.chosen = Q.st.chosen === i ? null : i; SFX.play('pop'); }
      if (cur().sayOpts) speak(cur().items[i].w);
      Q.st.msg = Q.st.msg && Q.st.msg.kind === 'try' ? Q.st.msg : null;
      render();
    },
    sortDrop: (ds) => { if (Q.st.chosen == null) return; SFX.play('place'); Q.st.place[Q.st.chosen] = +ds.b; Q.st.chosen = null; render(); },
    pick: (ds) => { SFX.play('pop'); Q.st.picked.push(+ds.i); const q = cur(); if (q.t === 'build') Voice.say({ text: q.tiles[+ds.i], kind: 'tile' }); render(); },
    unpick: (ds) => { SFX.play('unplace'); Q.st.picked.splice(+ds.p, 1); render(); },
    clearPick: () => { Q.st.picked = []; render(); },
    tapWord: (ds) => { const i = +ds.i; const s = Q.st.sel; SFX.play(s.includes(i) ? 'unplace' : 'pop'); Q.st.sel = s.includes(i) ? s.filter((x) => x !== i) : [...s, i]; render(); },

    pickAvatar: (ds) => { view.avatar = ds.a; view.typed = (document.getElementById('newName') || {}).value || ''; render(); },
    createPlayer: () => {
      const name = ((document.getElementById('newName') || {}).value || '').trim();
      if (!name) { const i = document.getElementById('newName'); i.classList.add('err'); i.placeholder = 'Please type a name first'; i.focus(); return; }
      const id = 'p' + Date.now().toString(36);
      profiles.push({ id, name, avatar: view.avatar || AVATARS[0] });
      saveProfiles();
      loadProfile(id);
      save();
      go('home');
    },
    newPlayer: () => go('welcome'),
    switchPlayer: (ds) => { loadProfile(ds.id); go('home'); },
    askDeletePlayer: (ds) => { const p = profiles.find((x) => x.id === ds.id); confirmModal(`Delete ${p.name}?`, 'All of this player\'s progress and writing will be erased from this device.', 'deletePlayer', 'Delete player', `data-id="${ds.id}"`); },
    deletePlayer: (ds) => {
      profiles = profiles.filter((p) => p.id !== ds.id);
      store.del('elaq_p_' + ds.id);
      saveProfiles();
      if (ds.id === activeId) { if (profiles.length) loadProfile(profiles[0].id); else { P = null; activeId = null; store.del('elaq_active'); } }
      go(profiles.length ? 'players' : 'home');
    },
    askReset: () => confirmModal(`Reset ${me().name}'s progress?`, 'Scores, XP, badges, and writing for this player will be erased. This cannot be undone.', 'resetMe', 'Reset progress'),
    resetMe: () => { P = blankData(); P.resetAt = Date.now(); save(); go('home'); },
    goal: (ds) => { settings.dailyGoal = +ds.n; saveSettings(); render(); },

    newWriting: (ds) => go('studioNew', { t: ds.t, lvl: Math.min(2, Math.max(0, ...[0, 1, 2].filter((l) => l === 0 || P.writings.filter((w) => w.lvl === l - 1 && w.stars >= 2).length > 0))) }),
    setNewLvl: (ds) => { view.lvl = +ds.l; render(); },
    setPrompt: (ds) => { view.prompt = ds.v; render(); },
    beginWriting: () => {
      const own = (document.getElementById('ownTopic') || {}).value;
      const prompt = (own && own.trim()) || view.prompt || typeOf(view.t).prompts[0];
      const start = () => { P.draft = { type: view.t, lvl: view.lvl ?? 0, prompt, plan: {}, text: '', step: 0, self: {} }; save(); go('studioEdit'); };
      if (P.draft) { modal = `<h2>Replace your draft?</h2><p>You already have a draft in progress. Starting a new piece will erase it.</p><div class="row end"><button class="btn ghost" data-act="resumeDraft">Keep my draft</button><button class="btn danger" data-act="forceBegin">Start new</button></div>`; ACT.forceBegin = start; render(); return; }
      start();
    },
    resumeDraft: () => go('studioEdit'),
    askDiscard: () => confirmModal('Discard this draft?', 'Your plan and writing for this draft will be erased.', 'discard', 'Discard draft'),
    discard: () => { P.draft = null; save(); go('studio'); },
    step: (ds) => { P.draft.step = +ds.n; save(); render(); window.scrollTo(0, 0); },
    insert: (ds) => {
      SFX.play('pop');
      const ta = document.getElementById('draftText');
      if (!ta) return;
      const s = ta.selectionStart ?? ta.value.length, e = ta.selectionEnd ?? s;
      const before = ta.value.slice(0, s);
      const pad = before && !/\s$/.test(before) ? ' ' : '';
      const ins = pad + ds.v + ' ';
      ta.value = before + ins + ta.value.slice(e);
      ta.focus();
      ta.selectionStart = ta.selectionEnd = s + ins.length;
      ta.dispatchEvent(new Event('input'));
    },
    listenDraft: () => Voice.say(P.draft.text || Voice.LINES.nothingYet),
    publish: () => {
      const d = P.draft;
      const checks = autoChecks(d);
      const ratio = checks.filter((c) => c.ok).length / checks.length;
      const selfN = Object.values(d.self || {}).filter(Boolean).length;
      const stars = ratio === 1 && selfN >= 3 ? 3 : ratio >= 0.7 ? 2 : 1;
      const title = ((document.getElementById('pubTitle') || {}).value || d.title || d.prompt).trim();
      P.writings.unshift({ id: Math.random().toString(36).slice(2, 10), at: Date.now(), type: d.type, lvl: d.lvl, prompt: d.prompt, title, text: d.text.trim(), stars, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) });
      const xp = 30 + stars * 15;
      P.xp += xp;
      P.draft = null;
      touchDay((day) => { day.rounds++; day.xp += xp; });
      const badges = checkBadges();
      save();
      go('writingView', { i: 0 });
      modal = `<h2>Published! ${'★'.repeat(stars)}</h2><p>You earned <b>+${xp} XP</b>. Your writing is on your bookshelf.</p>${badges.map((b) => `<div class="badge on inline"><span>${b.icon}</span><b>${b.name}</b></div>`).join('')}${stars < 3 ? '<p class="fine">To earn 3 stars, pass every check and tick at least 3 self-checks.</p>' : ''}<div class="row end"><button class="btn primary" data-act="closeModal">Yay!</button></div>`;
      render();
      SFX.play('fanfare');
      if (stars >= 2) confetti();
    },
    openWriting: (ds) => go('writingView', { i: +ds.i }),
    listenPiece: (ds) => { const w = P.writings[+ds.i]; Voice.say([w.title, ...w.text.split(/\n+/)]); },
    copyPiece: (ds, el) => {
      const w = P.writings[+ds.i];
      const txt = `${w.title}\nby ${me().name}\n\n${w.text}`;
      try { navigator.clipboard.writeText(txt).then(() => { el.textContent = 'Copied'; }, () => { el.textContent = 'Select the text to copy'; }); } catch { el.textContent = 'Select the text to copy'; }
    },
    askDeleteWriting: (ds) => confirmModal('Delete this writing?', 'It will be removed from your bookshelf.', 'deleteWriting', 'Delete', `data-i="${ds.i}"`),
    deleteWriting: (ds) => { const [w] = P.writings.splice(+ds.i, 1); if (w) P.gone = [...(P.gone || []), w.id || `${w.date}|${w.title}`].slice(-400); save(); go('studio'); },
  };

  // ---------- import from the old Spelling Bee Trainer (same site, so same browser storage) ----------
  function oldBeePlayers() {
    const list = store.get('bee_profiles', []);
    const out = list.map((p) => ({ id: p.id, name: p.name, avatar: p.avatar, stats: store.get(`bee_${p.id}_wordStats`, {}) }));
    const legacy = store.get('bee_wordStats', null);
    if (legacy) out.push({ id: 'legacy', name: 'Spelling Bee player', avatar: '🐝', stats: legacy });
    return out.filter((p) => Object.keys(p.stats || {}).length);
  }

  // ---------- class & sync actions ----------
  const val = (id) => ((document.getElementById(id) || {}).value || '').trim();
  Object.assign(ACT, {
    askBeeImport: () => {
      const list = oldBeePlayers();
      modal = `<h2>🐝 Import spelling progress</h2><p>Pick the Spelling Bee Trainer player whose words should be added to <b>${esc(me().name)}</b>. Words already practiced here are kept; the import only adds.</p>
        <div class="stack">${list.map((p) => { const n = Object.keys(p.stats).length, m = Object.values(p.stats).filter((x) => x.mastered || x.streak >= 2).length; return `<button class="player" data-act="beeImport" data-id="${esc(p.id)}"><span class="av">${esc(p.avatar || '🐝')}</span><span><b>${esc(p.name)}</b><small>${n} words practiced · ${m} mastered</small></span></button>`; }).join('')}</div>
        <div class="row end"><button class="btn ghost" data-act="closeModal">Cancel</button></div>`;
      render();
    },
    beeImport: (ds) => {
      const src = oldBeePlayers().find((p) => p.id === ds.id);
      if (!src) return;
      P.words = P.words || {};
      let added = 0;
      Object.entries(src.stats).forEach(([w, o]) => {
        const mine = P.words[w];
        const conv = { right: o.right || 0, wrong: o.wrong || 0, streak: o.streak || 0, mastered: !!(o.mastered || (o.streak || 0) >= 2), last: o.lastSeen ? String(o.lastSeen).slice(0, 10) : null };
        if (!mine || conv.right + conv.wrong > mine.right + mine.wrong) { P.words[w] = conv; added++; }
      });
      checkBadges(); save();
      modal = `<h2>Imported ✓</h2><p>Added ${added} words from ${esc(src.name)}'s Spelling Bee progress. Words they missed will come up first in Spelling Bee quests.</p><div class="row end"><button class="btn primary" data-act="closeModal">Great</button></div>`;
      SFX.play('unlock'); render();
    },
    joinClass: async () => {
      const code = Cloud.cleanCode(val('joinCode') || view.code || (location.hash.startsWith('#join-') ? location.hash.slice(6) : ''));
      view.code = code;
      if (code.length !== 12) { view.joinErr = 'Class codes have 12 letters and numbers, like ABCD-EFGH-JKMN.'; render(); return; }
      view.joinErr = 'Looking for the class…'; render();
      try {
        const c = await Cloud.getClass(code);
        if (!c) { view.joinErr = 'No class has that code. Check it and try again.'; render(); return; }
        rememberClass(c);
        if (location.hash.startsWith('#join-')) history.replaceState(null, '', location.pathname);
        go('classPick', { c: c.id });
      } catch { view.joinErr = 'Could not reach the class. Check the internet and try again.'; render(); }
    },
    openClass: (ds) => go('classPick', { c: ds.c }),
    pickMode: (ds) => { view.mode = ds.m; view.err = ''; render(); },
    createClass: async () => {
      const name = val('className'), p1 = val('adminPin'), p2 = val('adminPin2');
      view.cname = name;
      if (!name) { view.err = 'Give the class a name.'; render(); return; }
      if (!/^\d{4,6}$/.test(p1)) { view.err = 'The grown-up PIN must be 4 to 6 digits.'; render(); return; }
      if (p1 !== p2) { view.err = 'The two PINs do not match.'; render(); return; }
      view.busy = true; view.err = ''; render();
      try {
        const c = await Cloud.createClass(name, p1);
        rememberClass(c); adminOK.add(c.id);
        view.busy = false; view.created = c; SFX.play('fanfare'); render();
      } catch { view.busy = false; view.err = 'Could not create the class. Check the internet and try again.'; render(); }
    },
    pickStudent: (ds) => {
      const st = view.students.find((x) => x.id === ds.sid), c = classes.find((x) => x.id === view.c);
      const id = `c_${c.id}_${st.id}`;
      askPin({ title: `Hi, ${st.name}!`, sub: 'Type your 4-digit PIN.', check: async (p) => (await Cloud.pinHash(c.id, st.id, p)) === st.pinHash, ok: () => signInStudent(c, st, profiles.some((x) => x.id === id) ? null : blankData()) });
    },
    createStudent: async () => {
      const c = classes.find((x) => x.id === view.c);
      const name = val('stuName'), p1 = val('stuPin'), p2 = val('stuPin2'), from = val('bringFrom');
      view.typed = name;
      if (!name) { view.err = 'Type your first name.'; render(); return; }
      if ((view.students || []).some((s) => s.name.toLowerCase() === name.toLowerCase())) { view.err = `There is already a ${name} in this class. Add your last initial, like "${name} G."`; render(); return; }
      if (!/^\d{4}$/.test(p1)) { view.err = 'Your PIN must be exactly 4 digits.'; render(); return; }
      if (p1 !== p2) { view.err = 'The two PINs do not match.'; render(); return; }
      const data = from ? Object.assign(blankData(), store.get('elaq_p_' + from, {})) : blankData();
      const avatar = view.avatar || (from && (profiles.find((p) => p.id === from) || {}).avatar) || AVATARS[0];
      view.busy = true; view.err = ''; render();
      try {
        const sid = await Cloud.createStudent(c.id, { name, avatar, pin: p1, data });
        SFX.play('fanfare');
        await signInStudent(c, { id: sid, name, avatar }, data);
      } catch { view.busy = false; view.err = 'Could not join the class. Check the internet and try again.'; render(); }
    },
    pinKey: (ds) => { if (!pin) return; if (pin.entered.length < pin.max) pin.entered += ds.v; pin.err = ''; SFX.play('tap'); if (pin.max === pin.len && pin.entered.length === pin.len) { pinSubmit(); return; } modal = pinModal(); render(); },
    pinBack: () => { if (!pin) return; pin.entered = pin.entered.slice(0, -1); modal = pinModal(); render(); },
    pinGo: () => { if (pin && pin.entered.length >= pin.len) pinSubmit(); },
    openDashboard: async (ds) => {
      const cid = ds.c;
      const open = () => go('dashboard', { c: cid });
      if (adminOK.has(cid)) return open();
      let c;
      try { c = await Cloud.getClass(cid); } catch { modal = '<h2>Offline</h2><p>The dashboard needs the internet. Check the connection and try again.</p><div class="row end"><button class="btn primary" data-act="closeModal">OK</button></div>'; render(); return; }
      if (!c) return;
      askPin({ title: 'Grown-up PIN', sub: `Opens the dashboard for ${c.name}.`, len: 4, max: 6, check: async (p) => (await Cloud.adminHash(cid, p)) === c.adminHash, ok: () => { adminOK.add(cid); open(); } });
    },
    refreshDash: () => { view.students = null; view.err = ''; render(); },
    openStudent: (ds) => go('studentView', { c: view.c, sid: ds.sid, students: view.students }),
    backToDash: () => go('dashboard', { c: view.c, students: view.students }),
    askRemoveStudent: (ds) => { const st = view.students.find((x) => x.id === ds.sid); confirmModal(`Remove ${st.name} from the class?`, `${st.name}'s progress and writing will be deleted from the class on every device. This cannot be undone.`, 'removeStudent', 'Remove student', `data-sid="${ds.sid}"`); },
    removeStudent: async (ds) => {
      try { await Cloud.deleteStudent(view.c, ds.sid); } catch { modal = '<h2>Could not remove</h2><p>Check the internet and try again.</p><div class="row end"><button class="btn primary" data-act="closeModal">OK</button></div>'; render(); return; }
      view.students = view.students.filter((x) => x.id !== ds.sid);
      const local = profiles.find((p) => p.cloud && p.cloud.sid === ds.sid);
      modal = null;
      if (local) studentRemoved(local); else render();
    },
    copyText: (ds, el) => {
      const done = (t) => { const o = el.textContent; el.textContent = t; setTimeout(() => { el.textContent = o; }, 1600); };
      try { navigator.clipboard.writeText(ds.v).then(() => done('Copied ✓'), () => done(ds.v)); } catch { done(ds.v); }
    },
    leaveClass: (ds) => confirmModal('Forget this class on this device?', 'Students from this class will be signed out here. Their progress stays safe in the class.', 'forgetClass', 'Forget class', `data-c="${ds.c}"`),
    forgetClass: (ds) => {
      profiles.filter((p) => p.cloud && p.cloud.classId === ds.c).forEach((p) => store.del('elaq_p_' + p.id));
      profiles = profiles.filter((p) => !(p.cloud && p.cloud.classId === ds.c)); saveProfiles();
      classes = classes.filter((c) => c.id !== ds.c); saveClasses();
      if (!profiles.some((p) => p.id === activeId)) { if (profiles.length) loadProfile(profiles[0].id); else { P = null; activeId = null; store.del('elaq_active'); } }
      go(profiles.length ? 'players' : 'welcome');
    },
  });
  // Switching to a class student on a shared device always asks for their PIN.
  const plainSwitch = ACT.switchPlayer;
  ACT.switchPlayer = (ds) => {
    const p = profiles.find((x) => x.id === ds.id);
    if (!p || !p.cloud || p.id === activeId) return plainSwitch(ds);
    askPin({
      title: `Hi, ${p.name}!`, sub: 'Type your 4-digit PIN.',
      check: async (pinIn) => { const st = await Cloud.getStudent(p.cloud.classId, p.cloud.sid); if (!st) return false; return (await Cloud.pinHash(p.cloud.classId, p.cloud.sid, pinIn)) === st.pinHash; },
      ok: () => { loadProfile(p.id); go('home'); pull(); },
    });
  };

  let audioPrimed = false;
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    SFX.unlockAudio();
    Voice.unlock();
    if (!audioPrimed) { audioPrimed = true; SFX.syncMusic(['quiz', 'example', 'video'].includes(view.name)); }
    if (!el || el.disabled || el.getAttribute('aria-disabled') === 'true' && el.dataset.act !== 'start') return;
    const fn = ACT[el.dataset.act];
    if (fn) fn(el.dataset, el, e);
  });
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.bin[data-act]')) { e.preventDefault(); e.target.click(); }
    if (e.key === 'Escape' && modal) { modal = null; render(); }
  });
  document.addEventListener('change', (e) => {
    const k = e.target.dataset && e.target.dataset.set;
    if (k) { settings[k] = e.target.checked; saveSettings(); applySound(); render(); if (k === 'sound' && settings.sound) SFX.play('pop'); }
  });
  document.addEventListener('input', (e) => {
    if (e.target.id === 'setVol') { settings.volume = +e.target.value; saveSettings(); applySound(); const v = document.getElementById('volVal'); if (v) v.textContent = Math.round(settings.volume * 100) + '%'; SFX.play('tap'); }
    if (e.target.id === 'setRate') { settings.rate = +e.target.value; Voice.setRate(settings.rate); saveSettings(); const v = document.getElementById('rateVal'); if (v) v.textContent = settings.rate.toFixed(2) + '×'; }
  });

  // ---------- boot ----------
  if (location.hash === '#debug') window.__elaq = { Q: () => Q, P: () => P, S: SUBJECTS, demoSteps, isCorrect, freshSt, prep, renderBody };
  if (activeId && profiles.some((p) => p.id === activeId)) loadProfile(activeId);
  else if (profiles.length) loadProfile(profiles[0].id);
  render();
  if (me() && me().cloud) pull();

  if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !window.ELAQ_NO_SW) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();

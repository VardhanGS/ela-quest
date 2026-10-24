// ELA Quest voice: plays pre-recorded natural-voice clips (Kokoro "af_heart", made by tools/make_voice.py)
// and falls back to the device's best text-to-speech voice for anything not recorded (like a child's own writing).
const Voice = (() => {
  const PRAISE = ['Great job!', 'You got it!', 'Super!', 'Awesome!', 'Way to go!', 'Nice thinking!', 'Correct!', 'Brilliant!'];
  const LINES = {
    watch: 'Now watch me.', yourTurn: 'Now it is your turn!', forExample: 'For example:', howTo: 'That is how you do it.',
    testVoice: 'Hi! This is how I will read your questions.', nothingYet: 'You have not written anything yet.', answer: 'That is the answer!',
  };

  const clean = (t) => String(t ?? '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '')
    .replace(/_{2,}/g, ' blank ')
    .replace(/[“”]/g, '"').replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
  // Turns symbols in lesson examples into words.
  const speakable = (t) => String(t).replace(/→/g, ', becomes, ').replace(/[·|›]/g, ', ').replace(/\s\+\s/g, ' plus ').replace(/\s=\s/g, ' equals ').replace(/✗/g, 'Not a sentence: ');

  // cyrb53: a small, fast 53-bit string hash. The same function names the clip files.
  function cyrb53(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
  }
  const keyOf = (text, kind = '') => cyrb53((kind ? kind + '|' : '') + clean(text));

  // ---- the speakable pieces of each screen (also used by tools/enumerate_speech.js) ----
  const build = {
    question(q) {
      // Drop a trailing letter pattern like "__ip": the word itself is played right after.
      const parts = [q.q.replace(/\?\s{2}\S*_{2,}\S*$/, '?').replace(/\n+/g, '. ')];
      if (q.t === 'mc' && !q.say && !/spelling/i.test(q.q)) parts.push(...q.opts);
      if (q.say) parts.push({ text: q.say });
      return parts;
    },
    lesson(les) { return les ? [les.rule, ...(les.ex ? [LINES.forExample, speakable(les.ex)] : [])] : []; },
    passage(p) { return [p.title, ...p.text.split('\n\n')]; },
    demoEnd(q) { return [q.why || q.hint || LINES.howTo, LINES.yourTurn]; },
  };

  // ---- playback ----
  // Clips are packed into one audio bundle per skill (voice/<bundle>.mp4). A bundle is fetched and decoded
  // once; each line is cut out as a small WAV so it can play at any speed without changing pitch.
  const clips = typeof VOICE_CLIPS !== 'undefined' ? VOICE_CLIPS : {};
  const bundles = typeof VOICE_BUNDLES !== 'undefined' ? VOICE_BUNDLES : [];
  const buffers = {}, urls = new Map();
  let rate = 0.85, token = 0, audio = null, ttsVoice = null, dctx = null;

  function loadBundle(bi) {
    if (!buffers[bi]) {
      buffers[bi] = fetch(`voice/${bundles[bi]}.mp4`)
        .then((r) => { if (!r.ok) throw new Error('missing'); return r.arrayBuffer(); })
        .then((ab) => {
          const AC = window.AudioContext || window.webkitAudioContext;
          dctx = dctx || new AC();
          return new Promise((res, rej) => dctx.decodeAudioData(ab, res, rej));
        })
        .catch((e) => { delete buffers[bi]; throw e; });
    }
    return buffers[bi];
  }

  function wavURL(buf, startMs, durMs) {
    const sr = buf.sampleRate, ch = buf.getChannelData(0);
    const s = Math.max(0, Math.floor((startMs - 40) / 1000 * sr)), e = Math.min(ch.length, Math.ceil((startMs + durMs + 60) / 1000 * sr));
    const n = e - s, dv = new DataView(new ArrayBuffer(44 + n * 2));
    const str = (o, t) => { for (let i = 0; i < t.length; i++) dv.setUint8(o + i, t.charCodeAt(i)); };
    str(0, 'RIFF'); dv.setUint32(4, 36 + n * 2, true); str(8, 'WAVE'); str(12, 'fmt ');
    dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true); dv.setUint32(24, sr, true);
    dv.setUint32(28, sr * 2, true); dv.setUint16(32, 2, true); dv.setUint16(34, 16, true); str(36, 'data'); dv.setUint32(40, n * 2, true);
    for (let i = 0; i < n; i++) dv.setInt16(44 + i * 2, Math.max(-1, Math.min(1, ch[s + i])) * 32767, true);
    return URL.createObjectURL(new Blob([dv], { type: 'audio/wav' }));
  }

  async function clipURL(key) {
    if (urls.has(key)) return urls.get(key);
    const [bi, start, dur] = clips[key];
    const url = wavURL(await loadBundle(bi), start, dur);
    urls.set(key, url);
    if (urls.size > 150) { const [k, u] = urls.entries().next().value; URL.revokeObjectURL(u); urls.delete(k); }
    return url;
  }

  function pickTTS() {
    if (!('speechSynthesis' in window)) return;
    const vs = speechSynthesis.getVoices().filter((v) => v.lang && v.lang.startsWith('en'));
    const score = (v) => (/natural|neural|premium|enhanced/i.test(v.name) ? 50 : 0) + (/ava|zoe|jenny|aria|ana|samantha|allison|google us english/i.test(v.name) ? 20 : 0) + (v.lang === 'en-US' ? 5 : 0) + (v.localService ? 0 : 3);
    ttsVoice = vs.sort((a, b) => score(b) - score(a))[0] || null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) { pickTTS(); speechSynthesis.onvoiceschanged = pickTTS; }

  async function playClip(key, playbackRate, my) {
    let url;
    try { url = await clipURL(key); } catch { return false; }
    if (my !== token) return true;
    return new Promise((res) => {
      audio = audio || new Audio();
      const a = audio;
      let done = false;
      const fin = (ok = true) => { if (!done) { done = true; clearInterval(guard); a.onended = a.onerror = null; res(ok); } };
      a.onended = () => fin(true); a.onerror = () => fin(false);
      a.src = url;
      a.playbackRate = playbackRate;
      a.preservesPitch = true; a.webkitPreservesPitch = true;
      a.play().catch(() => fin(false));
      const guard = setInterval(() => { if (my !== token) { a.pause(); fin(true); } }, 100);
    });
  }

  function playTTS(text, r, my) {
    return new Promise((res) => {
      if (!('speechSynthesis' in window) || my !== token) return res();
      const u = new SpeechSynthesisUtterance(text);
      if (ttsVoice) u.voice = ttsVoice;
      u.rate = r; u.pitch = 1.12;
      let done = false;
      const fin = () => { if (!done) { done = true; res(); } };
      u.onend = fin; u.onerror = fin;
      setTimeout(fin, 1500 + text.length * 90 / r);
      speechSynthesis.speak(u);
    });
  }

  // say(text | [parts]) → Promise that resolves when everything has been spoken (or was cancelled).
  // A part may be a string or {text, kind}; kind 'slow' = slowed-down word, 'tile' = letter tile.
  async function say(input, opts = {}) {
    stop();
    const my = ++token;
    const parts = (Array.isArray(input) ? input : [input]).map((p) => (typeof p === 'string' ? { text: p, kind: opts.kind } : { kind: opts.kind, ...p })).filter((p) => clean(p.text));
    const speed = opts.rate || rate;
    for (const p of parts) {
      if (my !== token) return;
      const key = keyOf(p.text, p.kind);
      const played = clips[key] && await playClip(key, p.kind === 'slow' ? 1 : Math.min(1.4, Math.max(0.7, speed / 0.85)), my);
      if (!played && my === token) await playTTS(clean(p.text), p.kind === 'slow' ? 0.5 : p.kind === 'tile' ? 0.8 : speed, my);
    }
  }

  function stop() {
    token++;
    if (audio) { try { audio.pause(); } catch { /* ignore */ } }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) speechSynthesis.cancel();
  }

  // Warm up the bundles a screen will need, so the first word plays without a pause.
  function prefetch(parts) {
    (Array.isArray(parts) ? parts : [parts]).forEach((p) => {
      const c = clips[keyOf(typeof p === 'string' ? p : p.text, typeof p === 'string' ? '' : p.kind)];
      if (c) loadBundle(c[0]).catch(() => {});
    });
  }
  // iOS only lets audio play later if it first played during a tap.
  let unlocked = false;
  function unlock() {
    if (unlocked) return;
    unlocked = true;
    audio = audio || new Audio();
    audio.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=';
    audio.play().catch(() => {});
    if (bundles.length) loadBundle(0).catch(() => {});
  }

  return { say, stop, build, clean, keyOf, speakable, prefetch, unlock, PRAISE, LINES, setRate: (r) => { rate = r; }, hasClip: (t, k) => !!clips[keyOf(t, k)], clipCount: () => Object.keys(clips).length };
})();

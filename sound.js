// ELA Quest sound kit: every effect is synthesized with Web Audio, so there are no audio files to load.
const SFX = (() => {
  let ctx = null, master = null, musicGain = null, musicTimer = null, musicOn = false;
  let enabled = true, volume = 0.7;

  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = volume;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // One enveloped oscillator note.
  function note(freq, at, dur, { type = 'sine', vol = 0.25, attack = 0.008, bend = 0, dest } = {}) {
    const c = ac(); if (!c) return;
    const t = c.currentTime + at;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (bend) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq * bend), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(dest || master);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  function noise(at, dur, { vol = 0.12, from = 400, to = 3000 } = {}) {
    const c = ac(); if (!c) return;
    const t = c.currentTime + at;
    const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource(); src.buffer = buf;
    const f = c.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.2;
    f.frequency.setValueAtTime(from, t); f.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.4); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(master);
    src.start(t); src.stop(t + dur);
  }

  const C5 = 523.25, E5 = 659.25, G5 = 783.99, C6 = 1046.5, E6 = 1318.5, G6 = 1568;
  const sounds = {
    tap: () => note(880, 0, 0.05, { type: 'triangle', vol: 0.08 }),
    pop: () => note(520, 0, 0.12, { type: 'sine', vol: 0.2, bend: 1.9 }),
    place: () => { note(300, 0, 0.12, { type: 'triangle', vol: 0.22, bend: 0.7 }); note(600, 0.02, 0.08, { vol: 0.06 }); },
    unplace: () => note(500, 0, 0.1, { type: 'triangle', vol: 0.14, bend: 0.6 }),
    correct: () => { [C5, E5, G5, C6].forEach((f, i) => note(f, i * 0.07, 0.35, { type: 'triangle', vol: 0.2 })); note(E6, 0.3, 0.5, { vol: 0.07 }); },
    firstTry: () => { [C5, E5, G5, C6, E6].forEach((f, i) => note(f, i * 0.06, 0.32, { type: 'triangle', vol: 0.19 })); note(G6, 0.32, 0.6, { vol: 0.06 }); },
    tryAgain: () => { note(392, 0, 0.18, { type: 'sine', vol: 0.18 }); note(349.2, 0.16, 0.26, { type: 'sine', vol: 0.16 }); },
    wrong: () => { note(311, 0, 0.22, { type: 'triangle', vol: 0.16, bend: 0.9 }); note(233, 0.2, 0.4, { type: 'triangle', vol: 0.16, bend: 0.85 }); },
    whoosh: () => noise(0, 0.3, { vol: 0.08, from: 500, to: 2600 }),
    star: (i = 0) => { note([C6, E6, G6][i] || C6, 0, 0.5, { type: 'triangle', vol: 0.2 }); note(([C6, E6, G6][i] || C6) * 2, 0.02, 0.35, { vol: 0.05 }); },
    fanfare: () => {
      [[C5, 0], [C5, 0.12], [C5, 0.24], [G5, 0.36], [E5, 0.6], [G5, 0.72], [C6, 0.84]].forEach(([f, t]) => note(f, t, t < 0.8 ? 0.16 : 0.7, { type: 'square', vol: 0.07 }));
      [[C5 / 2, 0.84], [G5 / 2, 0.84]].forEach(([f, t]) => note(f, t, 0.8, { type: 'triangle', vol: 0.12 }));
    },
    unlock: () => { [G5, C6, E6, G6].forEach((f, i) => note(f, i * 0.09, 0.45, { type: 'triangle', vol: 0.17 })); noise(0.3, 0.4, { vol: 0.05, from: 3000, to: 8000 }); },
    badge: () => { for (let i = 0; i < 7; i++) note(1200 + i * 230 + Math.random() * 80, i * 0.05, 0.25, { vol: 0.07 }); note(C6, 0.35, 0.6, { type: 'triangle', vol: 0.15 }); },
    countdown: () => note(988, 0, 0.08, { type: 'square', vol: 0.06 }),
    typeKey: () => note(1400 + Math.random() * 300, 0, 0.025, { type: 'square', vol: 0.025 }),
    open: () => { note(G5, 0, 0.12, { type: 'triangle', vol: 0.1 }); note(C6, 0.07, 0.18, { type: 'triangle', vol: 0.1 }); },
  };

  // Gentle background music: a looping pentatonic melody over soft chords.
  const MEL = [0, 2, 4, 7, 4, 2, 9, 7, 4, 7, 9, 12, 9, 7, 4, 2];
  const CHORDS = [[0, 4, 7], [-3, 0, 4], [-7, -3, 0], [-5, -1, 2]];
  const hz = (semi) => 392 * Math.pow(2, semi / 12);
  function startMusic() {
    const c = ac(); if (!c || musicTimer) return;
    musicGain = c.createGain(); musicGain.gain.value = 0.0001; musicGain.connect(master);
    musicGain.gain.exponentialRampToValueAtTime(0.5, c.currentTime + 1.5);
    const step = 0.36;
    let i = 0;
    let next = c.currentTime + 0.1;
    const tick = () => {
      while (next < c.currentTime + 1.2) {
        const at = next - c.currentTime;
        if (i % 8 === 0) CHORDS[(i / 8) % CHORDS.length | 0].forEach((s) => note(hz(s - 12), at, step * 8, { type: 'sine', vol: 0.03, attack: 0.4, dest: musicGain }));
        if (i % 2 === 0 || Math.random() < 0.35) note(hz(MEL[i % MEL.length]), at, 0.6, { type: 'triangle', vol: 0.035, dest: musicGain });
        i++; next += step;
      }
    };
    tick();
    musicTimer = setInterval(tick, 400);
  }
  function stopMusic() {
    if (!musicTimer) return;
    clearInterval(musicTimer); musicTimer = null;
    const g = musicGain;
    if (g && ctx) { g.gain.cancelScheduledValues(ctx.currentTime); g.gain.setValueAtTime(g.gain.value, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6); setTimeout(() => g.disconnect(), 800); }
  }

  return {
    play(name, arg) { if (!enabled) return; try { sounds[name] && sounds[name](arg); } catch { /* audio unavailable */ } },
    configure({ sound, vol, music }) {
      enabled = !!sound;
      volume = vol;
      if (master) master.gain.value = volume;
      musicOn = !!music && enabled;
    },
    // Music only starts after a user gesture (browsers block audio before one).
    syncMusic(paused) { if (musicOn && !paused) startMusic(); else stopMusic(); },
    unlockAudio() { ac(); },
  };
})();

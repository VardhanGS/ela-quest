// Collects every line the app can speak (question prompts, options, words, tiles, lessons, passages, praise)
// by running each level's generator many times. Writes tools/speech-lines.json for tools/make_voice.py.
// Usage: node tools/enumerate_speech.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const ctx = { console, window: {}, TextEncoder };
ctx.window = ctx;
vm.createContext(ctx);
const load = (f) => vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
['voice.js', 'data/core.js', 'data/phonics.js', 'data/grammar.js', 'data/reading.js', 'data/writing.js', 'data/lessons.js'].forEach(load);
vm.runInContext('this.Voice = Voice; this.SUBJECTS = SUBJECTS; this.LESSONS = LESSONS;', ctx);
const { Voice, SUBJECTS, LESSONS } = ctx;

const lines = new Map();
let bundle = 'common';
const add = (p, kind) => {
  const part = typeof p === 'string' ? { text: p, kind } : { kind, ...p };
  const text = Voice.clean(part.text);
  if (!text) return;
  const key = Voice.keyOf(text, part.kind);
  if (!lines.has(key)) lines.set(key, { key, text, kind: part.kind || '', bundle });
};

const RUNS = +(process.argv[2] || 250);
Voice.PRAISE.forEach((p) => add(p));
Object.values(Voice.LINES).forEach((p) => add(p));
for (const s of SUBJECTS) for (const k of s.skills) k.levels.forEach((L, l) => {
  bundle = `${k.id}-${l}`;
  const les = LESSONS[`${k.id}.${l}`];
  if (les) Voice.build.lesson(les).forEach((p) => add(p));
  let stale = 0;
  for (let r = 0; r < RUNS && stale < 250; r++) {
    const before = lines.size;
    for (const q of L.gen()) {
      Voice.build.question(q).forEach((p) => add(p));
      if (q.say) { add(q.say); add(q.say, 'slow'); }
      if (q.sayOpts && q.opts) q.opts.forEach((o) => add(o));
      if (q.sayOpts && q.items) q.items.forEach((it) => add(it.w));
      if (q.t === 'build') q.tiles.forEach((t) => add(t, 'tile'));
      if (q.passage) Voice.build.passage(q.passage).forEach((p) => add(p));
      Voice.build.demoEnd(q).forEach((p) => add(p));
      add(q.why || '');
    }
    stale = lines.size === before ? stale + 1 : 0;
  }
});

const out = [...lines.values()];
fs.writeFileSync(path.join(__dirname, 'speech-lines.json'), JSON.stringify(out));
const chars = out.reduce((a, l) => a + l.text.length, 0);
console.log(`${out.length} lines, ${chars} characters (~${Math.round(chars / 15 / 60)} min of audio)`);

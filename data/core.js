// Shared helpers for building questions. Loaded before every content file.
// Question shapes the app understands:
//   mc    {t:'mc', q, opts[], a, say?, hint?, why?, passage?}
//   sort  {t:'sort', q, bins[], items:[{w,b}]}
//   build {t:'build', q, tiles[], a, say?}
//   order {t:'order', q, parts[] (correct order), list?:bool, alts?:[[...]]}
//   tap   {t:'tap', q, words[], a:[indices]}
//   type  {t:'type', q, a:[accepted answers], say?}
const U = {
  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },
  sample(arr, n) { return U.shuffle(arr).slice(0, n); },
  pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; },
  uniq(arr) { return [...new Set(arr)]; },

  // Multiple choice: one right answer plus up to `n` distractors.
  mc(q, a, pool, extra = {}, n = 3) {
    const ds = U.sample(U.uniq(pool).filter((d) => d !== a), n);
    return { t: 'mc', q, a, opts: U.shuffle([a, ...ds]), ...extra };
  },

  // Multiple choice where the options keep the given order (e.g. 1,2,3,4 or . ? !).
  mcFixed(q, a, opts, extra = {}) { return { t: 'mc', q, a, opts, ...extra }; },

  // "The [dog] ran to the [park]." -> tap question; bracketed words are correct.
  tap(q, sentence, extra = {}) {
    const raw = sentence.split(' ');
    const a = [];
    const words = raw.map((w, i) => {
      if (w.includes('[')) a.push(i);
      return w.replace(/[\[\]]/g, '');
    });
    return { t: 'tap', q, words, a, ...extra };
  },

  sort(q, bins, items, extra = {}) {
    return { t: 'sort', q, bins, items: U.shuffle(items), ...extra };
  },

  // Letter/chunk tiles for word building, with a few distractor tiles.
  build(q, parts, extraTiles, extra = {}) {
    const a = parts.join('');
    return { t: 'build', q, a, tiles: U.shuffle([...parts, ...extraTiles]), ...extra };
  },

  letterTiles(word, n = 2) {
    const letters = 'abcdefghijklmnoprstuwy'.split('').filter((c) => !word.includes(c));
    return U.sample(letters, n);
  },

  order(q, parts, extra = {}) { return { t: 'order', q, parts, ...extra }; },

  // Build a round of `n` questions from a list of generator functions, skipping repeats.
  mix(n, fns) {
    const out = [];
    const seen = new Set();
    let tries = 0;
    while (out.length < n && tries < n * 25) {
      tries++;
      const q = U.pick(fns)();
      if (!q) continue;
      const key = JSON.stringify([q.q, q.a, q.say, q.words, q.items && q.items.map((i) => i.w), q.parts]);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(q);
    }
    return out;
  },

  // Each bank entry is turned into a question by `make`; returns a round of n.
  fromBank(n, bank, make) { return U.sample(bank, n).map(make); },
};

const SUBJECTS = [];
function addSubject(s) { SUBJECTS.push(s); }

const LEVEL_NAMES = [
  { short: 'Starter', grade: 'Grade 2', long: 'Grade 2 Starter' },
  { short: 'Star', grade: 'Grade 2', long: 'Grade 2 Star' },
  { short: 'Challenge', grade: 'Grade 3', long: 'Grade 3 Challenge' },
];

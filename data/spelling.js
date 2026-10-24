// SPELLING BEE — word lists from the Spelling Bee Trainer (L.2.2d, L.2.2e, L.3.2e, L.3.2f).
// Each list is a skill with three levels: Look & Build → Spell with Hints → Bee Test (audio only).
// gen(words) receives the player's word stats so rounds favor words that are new or still tricky.
(function () {
  const LISTS = [
    ['starter', 'Starter Words', '🐣', 'Level 1 — Starter (3-4 letters)'],
    ['buildingup', 'Building Up', '🌱', 'Level 2 — Building Up'],
    ['beechallenge', 'Bee Challenge', '🐝', 'Level 3 — Bee Challenge'],
    ['trickyspellers', 'Tricky Spellers', '🧠', 'Level 4 — Tricky Spellers'],
    ['onebee1', 'One Bee: Easier Start', '🏅', '🐝 One Bee — Easier Start'],
    ['onebee2', 'One Bee: Harder Half', '🏆', '🐝 One Bee — Harder Half'],
  ];

  // Hide the word (and simple forms of it) when a sentence is shown on screen.
  const mask = (sentence, word) => sentence.replace(new RegExp(`\\b${word}(s|es|ed|ing)?\\b`, 'gi'), '_____');

  // Pick n words: unseen and tricky words first, mastered words last.
  function pickWords(list, n, stats = {}) {
    const rank = (o) => { const s = stats[o.w]; if (!s) return 1; if (s.mastered) return 3; if (s.wrong > 0) return 0; return 2; };
    return U.shuffle(list).sort((a, b) => rank(a) - rank(b)).slice(0, n);
  }

  const spellQ = (o, hints) => ({
    t: 'spell', word: o.w, a: o.w, say: o.w, sentence: o.s, def: o.d, masked: mask(o.s, o.w), hints,
    q: hints ? 'Listen, then spell the word. The first letter is a clue.' : 'Spelling Bee! Listen, then spell the word.',
    why: `"${o.w}": ${o.d}`,
  });

  const skills = LISTS.map(([id, name, icon, key]) => {
    const list = SPELL_LISTS[key];
    return {
      id, name, icon, words: list.map((o) => o.w),
      levels: [
        {
          title: 'Look & build', std: 'L.2.2d', desc: 'See the word, hear it, then build it from letter tiles.',
          gen: (stats) => pickWords(list, 8, stats).map((o) => U.build(`Look, listen, and build: ${o.w}`, o.w.split(''), U.letterTiles(o.w, 2), { say: o.w, word: o.w, why: `"${o.w}": ${o.d}` })),
        },
        {
          title: 'Spell with hints', std: 'L.2.2d · L.2.2e', desc: 'Hear the word and type it. Letter boxes and the first letter help.',
          gen: (stats) => pickWords(list, 10, stats).map((o) => spellQ(o, true)),
        },
        {
          title: 'Bee test', std: 'L.3.2e · L.3.2f', desc: 'Like a real spelling bee: listen and spell with no hints.',
          gen: (stats) => pickWords(list, 10, stats).map((o) => spellQ(o, false)),
        },
      ],
    };
  });

  addSubject({
    id: 'spelling', name: 'Spelling Bee', blurb: 'Listen, spell, and master your bee words', color: 'spelling', icon: '🐝',
    skills,
  });
})();

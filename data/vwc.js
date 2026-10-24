// VOCABULARY WORKSHOP LEVEL C — 15 units of 20 words (L.VL.8.3, L.VI.8.4, L.KL.8.2).
// Each unit has three levels: Definitions → Completing the Sentence → Synonyms & Antonyms.
(function () {
  const byUnit = (u) => VWC_WORDS.filter((o) => o.u === u);
  const samePos = (o, pool) => { const same = pool.filter((x) => x !== o && x.p === o.p); return same.length >= 3 ? same : pool.filter((x) => x !== o); };

  const defQ = (pool) => () => { const o = U.pick(pool); return U.mc(`What does "${o.w}" (${o.p}) mean?`, o.d, samePos(o, pool).map((x) => x.d), { why: `${o.w}: ${o.d}. Memory hint: ${o.assoc}.`, hint: `Memory hint: ${o.assoc}.` }); };
  const wordQ = (pool) => () => { const o = U.pick(pool); return U.mc(`Which word means "${o.d}"?`, o.w, samePos(o, pool).map((x) => x.w), { why: `${o.w}: ${o.d}.` }); };
  const sentQ = (pool) => () => { const o = U.pick(pool); return U.mc(`Choose the word that best completes the sentence:\n${o.s}`, o.w, samePos(o, pool).map((x) => x.w), { why: `"${o.w}" means ${o.d}.`, hint: 'Look for clues in the sentence, then try each word.' }); };
  // Synonym/antonym distractors are synonyms of OTHER words whose meanings don't overlap with this word.
  const low = (a) => a.map((x) => x.toLowerCase());
  const overlaps = (o, x) => { const mine = new Set(low([o.w, ...o.syn, ...o.ant])); return [x.w, ...x.syn, ...x.ant].some((y) => mine.has(y.toLowerCase())); };
  const foreignSyns = (o) => VWC_WORDS.filter((x) => x !== o && !overlaps(o, x)).flatMap((x) => x.syn);
  const synQ = (pool) => () => {
    const o = U.pick(pool.filter((x) => x.syn.length));
    return U.mc(`Which word is a SYNONYM for "${o.w}"?`, U.pick(o.syn), [...foreignSyns(o), ...o.ant], { why: `${o.w} (${o.d}) is similar to ${o.syn.join(', ')}.` });
  };
  const antQ = (pool) => () => {
    const o = U.pick(pool.filter((x) => x.ant.length));
    return U.mc(`Which word is an ANTONYM for "${o.w}"?`, U.pick(o.ant), [...o.syn, ...foreignSyns(o)], { why: `${o.w} means ${o.d}; its opposites include ${o.ant.join(', ')}.`, hint: 'An antonym means the opposite. Watch out for synonyms!' });
  };

  const unitSkill = (u) => {
    const pool = byUnit(u);
    return {
      id: `vwc${u}`, name: `Unit ${u}`, icon: '📗',
      levels: [
        { title: 'Definitions', std: 'L.VL.8.3', desc: `${pool.slice(0, 4).map((o) => o.w).join(', ')}…`, gen: () => U.mix(10, [defQ(pool), wordQ(pool)]) },
        { title: 'Completing the sentence', std: 'L.VL.8.3 · L.KL.8.2', desc: 'Choose the word that fits each sentence.', gen: () => U.mix(10, [sentQ(pool)]) },
        { title: 'Synonyms & antonyms', std: 'L.VI.8.4', desc: 'Find words with similar and opposite meanings.', gen: () => U.mix(10, [synQ(pool), antQ(pool), sentQ(pool)]) },
      ],
    };
  };

  const review = {
    id: 'vwcreview', name: 'Cumulative Review', icon: '🏆',
    levels: [
      { title: 'Units 1–5', std: 'L.VL.8.3', desc: 'Mixed practice on the first 100 words.', gen: () => { const p = VWC_WORDS.filter((o) => o.u <= 5); return U.mix(12, [defQ(p), sentQ(p), synQ(p)]); } },
      { title: 'Units 6–10', std: 'L.VL.8.3', desc: 'Mixed practice on words 101–200.', gen: () => { const p = VWC_WORDS.filter((o) => o.u > 5 && o.u <= 10); return U.mix(12, [defQ(p), sentQ(p), synQ(p)]); } },
      { title: 'All 300 words', std: 'L.VL.8.3 · L.VI.8.4', desc: 'Final test practice on every unit.', gen: () => U.mix(15, [defQ(VWC_WORDS), sentQ(VWC_WORDS), synQ(VWC_WORDS), antQ(VWC_WORDS)]) },
    ],
  };

  addSubject({
    id: 'vwc', track: 'g8', name: 'Vocab Workshop C', blurb: 'All 15 units of Sadlier Vocabulary Workshop, Level C', color: 'spelling', icon: '📗',
    skills: [...[...Array(15)].map((_, i) => unitSkill(i + 1)), review],
  });
})();

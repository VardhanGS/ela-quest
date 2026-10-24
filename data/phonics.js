// PHONICS & WORD STUDY — Grade 2 RF.2.3, Grade 3 RF.3.3
(function () {
  const SHORT = {
    a: ['cat', 'map', 'bag', 'hat', 'jam', 'van', 'clap', 'sand', 'flag', 'ham'],
    e: ['bed', 'pen', 'net', 'web', 'sled', 'nest', 'desk', 'ten', 'jet', 'vest'],
    i: ['pig', 'sit', 'fish', 'lip', 'hill', 'milk', 'swim', 'gift', 'six', 'wig'],
    o: ['dog', 'mop', 'pot', 'box', 'frog', 'sock', 'stop', 'log', 'fox', 'hot'],
    u: ['bug', 'sun', 'cup', 'rug', 'duck', 'drum', 'jump', 'plum', 'bus', 'nut'],
  };
  const ANCHOR = { a: 'apple', e: 'egg', i: 'igloo', o: 'octopus', u: 'umbrella' };
  const LONG_CVCE = {
    a: ['cake', 'lake', 'name', 'gate', 'tape', 'plane', 'grape', 'snake'],
    i: ['bike', 'kite', 'time', 'five', 'pine', 'slide', 'smile', 'prize'],
    o: ['rope', 'home', 'bone', 'note', 'stone', 'globe', 'hose', 'nose'],
    u: ['cube', 'mule', 'tube', 'cute', 'flute', 'tune', 'rule', 'huge'],
  };
  const MAGIC_E = [['cap', 'cape'], ['tap', 'tape'], ['can', 'cane'], ['man', 'mane'], ['hat', 'hate'], ['kit', 'kite'], ['pin', 'pine'], ['rid', 'ride'], ['hop', 'hope'], ['not', 'note'], ['rob', 'robe'], ['cub', 'cube'], ['tub', 'tube'], ['cut', 'cute'], ['bit', 'bite'], ['plan', 'plane']];
  const TEAMS = {
    'long a': { ai: ['rain', 'train', 'paint', 'snail', 'mail', 'tail'], ay: ['day', 'play', 'tray', 'gray', 'stay', 'clay'] },
    'long e': { ee: ['tree', 'feet', 'green', 'sheep', 'bee', 'seed'], ea: ['leaf', 'beach', 'read', 'team', 'seal', 'peach'] },
    'long o': { oa: ['boat', 'coat', 'road', 'soap', 'goat', 'toast'], ow: ['snow', 'grow', 'bowl', 'slow', 'blow', 'throw'] },
    'long i': { igh: ['light', 'night', 'high', 'right', 'bright', 'sight'], ie: ['pie', 'tie', 'lie'] },
  };
  const TEAM_MISSPELL = [['train', ['trane', 'trayn']], ['play', ['plai', 'plae']], ['boat', ['bote', 'bowt']], ['night', ['nite', 'niht']], ['green', ['grean', 'grene']], ['snow', ['snoa', 'sno']], ['beach', ['beech', 'beche']], ['paint', ['paynt', 'pante']], ['soap', ['sope', 'sowp']], ['light', ['lite', 'liet']], ['sheep', ['sheap', 'shepe']], ['tray', ['trai', 'trae']]];

  const sounds = (team) => Object.values(TEAMS[team]).flat();

  const vowels = {
    id: 'vowels', name: 'Vowel Sounds', icon: '🍎',
    levels: [
      {
        title: 'Short vowels', std: 'RF.2.3a', desc: 'Hear and spell short a, e, i, o, u.',
        gen: () => U.mix(8, [
          () => {
            const v = U.pick(Object.keys(SHORT));
            const a = U.pick(SHORT[v]);
            const pool = Object.keys(SHORT).filter((k) => k !== v).flatMap((k) => SHORT[k]);
            return U.mc(`Which word has the short ${v} sound, like in "${ANCHOR[v]}"?`, a, pool,
              { hint: `Say each word slowly. Listen for the middle sound.`, why: `"${a}" has the short ${v} sound, like ${ANCHOR[v]}.`, sayOpts: true });
          },
          () => {
            const v = U.pick(Object.keys(SHORT));
            const w = U.pick(SHORT[v]);
            return U.mcFixed('Listen to the word. Which vowel sound do you hear in the middle?', v, ['a', 'e', 'i', 'o', 'u'],
              { say: w, hint: 'Stretch the word out: say each sound slowly.', why: `"${w}" has the short ${v} sound.` });
          },
          () => {
            const v = U.pick(Object.keys(SHORT));
            const w = U.pick(SHORT[v]);
            return U.build('Listen and build the word.', w.split(''), U.letterTiles(w, 2), { say: w });
          },
          () => {
            const [v1, v2] = U.sample(Object.keys(SHORT), 2);
            const items = [...U.sample(SHORT[v1], 3).map((w) => ({ w, b: 0 })), ...U.sample(SHORT[v2], 3).map((w) => ({ w, b: 1 }))];
            return U.sort('Sort the words by their vowel sound.', [`Short ${v1}`, `Short ${v2}`], items, { sayOpts: true });
          },
        ]),
      },
      {
        title: 'Long vowels with magic e', std: 'RF.2.3a', desc: 'Silent e makes the vowel say its name.',
        gen: () => U.mix(8, [
          () => {
            const [s, l] = U.pick(MAGIC_E);
            return U.mc(`Add a magic e to "${s}". What new word do you get?`, l, [s, s + 's', ...MAGIC_E.map((p) => p[1]).filter((x) => x[0] === l[0])],
              { hint: 'The silent e at the end makes the vowel say its name.', why: `${s} + e = ${l}. The vowel now says its name.` });
          },
          () => {
            const v = U.pick(Object.keys(LONG_CVCE));
            const a = U.pick(LONG_CVCE[v]);
            const pool = [...(SHORT[v] || []), ...Object.keys(LONG_CVCE).filter((k) => k !== v).flatMap((k) => LONG_CVCE[k])];
            return U.mc(`Which word has a long ${v} sound? (The ${v} says its name.)`, a, pool,
              { hint: 'Look for a silent e at the end that makes the vowel say its name.', why: `In "${a}", the ${v} says its name because of the silent e.`, sayOpts: true });
          },
          () => {
            const pairs = U.sample(MAGIC_E, 3);
            const items = U.shuffle([...pairs.map((p) => ({ w: p[0], b: 0 })), ...pairs.map((p) => ({ w: p[1], b: 1 }))]);
            return U.sort('Sort the words: short vowel or long vowel?', ['Short vowel', 'Long vowel'], items, { sayOpts: true });
          },
          () => {
            const v = U.pick(Object.keys(LONG_CVCE));
            const w = U.pick(LONG_CVCE[v]);
            return U.build('Listen and build the word. Don\'t forget the magic e!', w.split(''), U.letterTiles(w, 2), { say: w });
          },
        ]),
      },
      {
        title: 'Vowel teams', std: 'RF.2.3b · RF.3.3', desc: 'ai, ay, ee, ea, oa, ow, igh, ie.',
        gen: () => U.mix(8, [
          () => {
            const team = U.pick(Object.keys(TEAMS));
            const key = U.pick(sounds(team));
            const a = U.pick(sounds(team).filter((w) => w !== key));
            const pool = Object.keys(TEAMS).filter((t) => t !== team).flatMap(sounds);
            return U.mc(`Which word has the same vowel sound as "${key}"?`, a, pool,
              { hint: `"${key}" has the ${team} sound.`, why: `"${key}" and "${a}" both have the ${team} sound.`, sayOpts: true });
          },
          () => {
            const [w, wrong] = U.pick(TEAM_MISSPELL);
            return U.mc('Listen. Which spelling is correct?', w, wrong, { say: w, hint: 'Think about which vowel team this word uses.', why: `"${w}" is spelled ${w.toUpperCase().split('').join('-')}.` });
          },
          () => {
            const team = U.pick(['long a', 'long e', 'long o']);
            const [t1, t2] = Object.keys(TEAMS[team]);
            const items = [...U.sample(TEAMS[team][t1], 3).map((w) => ({ w, b: 0 })), ...U.sample(TEAMS[team][t2], 3).map((w) => ({ w, b: 1 }))];
            const tip = { 'long a': 'Tip: "ai" comes in the middle, "ay" comes at the end.', 'long e': 'Both make the long e sound. Look closely at the letters.', 'long o': 'Tip: "oa" is usually in the middle, "ow" is often at the end.' }[team];
            return U.sort(`Sort by vowel team. ${tip}`, [t1, t2], items);
          },
          () => {
            const team = U.pick(Object.keys(TEAMS));
            const t = U.pick(Object.keys(TEAMS[team]));
            const w = U.pick(TEAMS[team][t]);
            const i = w.indexOf(t);
            const parts = [w.slice(0, i), t, w.slice(i + t.length)].filter(Boolean).flatMap((p) => (p === t ? [p] : p.split('')));
            const others = U.sample(['ai', 'ay', 'ee', 'ea', 'oa', 'ow', 'igh', 'ie'].filter((x) => x !== t), 2);
            return U.build('Listen and build the word with a vowel team.', parts, others, { say: w });
          },
        ]),
      },
    ],
  };

  const DIGRAPHS = [['ship', 'sh', 0], ['shop', 'sh', 0], ['shell', 'sh', 0], ['fish', 'sh', 1], ['dish', 'sh', 1], ['chip', 'ch', 0], ['chin', 'ch', 0], ['chop', 'ch', 0], ['lunch', 'ch', 1], ['bench', 'ch', 1], ['thumb', 'th', 0], ['three', 'th', 0], ['bath', 'th', 1], ['moth', 'th', 1], ['math', 'th', 1], ['whale', 'wh', 0], ['wheel', 'wh', 0], ['whip', 'wh', 0], ['white', 'wh', 0], ['duck', 'ck', 1], ['sock', 'ck', 1], ['truck', 'ck', 1], ['kick', 'ck', 1], ['back', 'ck', 1]];
  const BLENDS = [['black', 'bl'], ['clap', 'cl'], ['flag', 'fl'], ['glad', 'gl'], ['plant', 'pl'], ['sled', 'sl'], ['brick', 'br'], ['crab', 'cr'], ['drum', 'dr'], ['frog', 'fr'], ['grape', 'gr'], ['prize', 'pr'], ['tree', 'tr'], ['star', 'st'], ['spin', 'sp'], ['snail', 'sn'], ['swing', 'sw'], ['skate', 'sk']];
  const END_BLENDS = [['hand', 'nd'], ['nest', 'st'], ['jump', 'mp'], ['pink', 'nk'], ['gift', 'ft'], ['milk', 'lk'], ['belt', 'lt'], ['desk', 'sk'], ['camp', 'mp'], ['wind', 'nd']];
  const BIG_BLENDS = [['string', 'str'], ['street', 'str'], ['spring', 'spr'], ['spray', 'spr'], ['scrub', 'scr'], ['screen', 'scr'], ['splash', 'spl'], ['split', 'spl'], ['throw', 'thr'], ['three', 'thr'], ['shrimp', 'shr'], ['shrink', 'shr']];
  const TRICKY = [['phone', ['fone', 'phon']], ['graph', ['graf', 'grapf']], ['catch', ['cach', 'catsh']], ['match', ['mach', 'matsh']], ['bridge', ['brige', 'bridj']], ['fudge', ['fuge', 'fudj']], ['strong', ['strog', 'stronge']], ['dolphin', ['dolfin', 'dolpin']], ['kitchen', ['kichen', 'kitshen']], ['badge', ['bage', 'badj']]];

  const blank = (w, part, end) => (end ? w.slice(0, w.length - part.length) + '__' : '__' + w.slice(part.length));

  const blends = {
    id: 'blends', name: 'Blends & Digraphs', icon: '🐠',
    levels: [
      {
        title: 'Digraphs sh, ch, th, wh, ck', std: 'RF.2.3', desc: 'Two letters, one sound.',
        gen: () => U.mix(8, [
          () => {
            const [w, d, end] = U.pick(DIGRAPHS);
            const shown = end ? w.slice(0, w.lastIndexOf(d)) + '__' + w.slice(w.lastIndexOf(d) + 2) : '__' + w.slice(2);
            return U.mc(`Listen. Which letters fill the blank?  ${shown}`, d, ['sh', 'ch', 'th', 'wh', 'ck'], { say: w, hint: 'Two letters work together to make one sound.', why: `"${w}" uses the digraph ${d}.` });
          },
          () => {
            const [w, d] = U.pick(DIGRAPHS);
            const i = w.indexOf(d);
            const parts = [...w.slice(0, i).split(''), d, ...w.slice(i + 2).split('')].filter(Boolean);
            return U.build('Listen and build the word.', parts, U.sample(['sh', 'ch', 'th', 'wh', 'ck'].filter((x) => x !== d), 2), { say: w });
          },
          () => {
            const [d1, d2] = U.sample(['sh', 'ch', 'th', 'wh'], 2);
            const pick = (d) => U.sample(DIGRAPHS.filter((x) => x[1] === d), 3).map((x) => ({ w: x[0], b: d === d1 ? 0 : 1 }));
            return U.sort('Sort the words by their digraph.', [d1, d2], [...pick(d1), ...pick(d2)]);
          },
        ]),
      },
      {
        title: 'Beginning & ending blends', std: 'RF.2.3', desc: 'bl, cr, st, sw … nd, mp, nk.',
        gen: () => U.mix(8, [
          () => {
            const [w, b] = U.pick(BLENDS);
            return U.mc(`Listen. Which blend fills the blank?  ${blank(w, b)}`, b, BLENDS.map((x) => x[1]), { say: w, hint: 'You can hear both letters in a blend.', why: `"${w}" starts with the blend ${b}.` });
          },
          () => {
            const [w, b] = U.pick(END_BLENDS);
            return U.mc(`Listen. Which blend ends the word?  ${blank(w, b, true)}`, b, END_BLENDS.map((x) => x[1]), { say: w, hint: 'Listen to the very end of the word.', why: `"${w}" ends with ${b}.` });
          },
          () => {
            const [w, b] = U.pick(BLENDS);
            return U.build('Listen and build the word.', [b, ...w.slice(b.length).split('')], U.sample(BLENDS.map((x) => x[1]).filter((x) => x !== b), 2), { say: w });
          },
        ]),
      },
      {
        title: 'Three-letter blends & ph, tch, dge', std: 'RF.3.3', desc: 'str, spl, thr, shr and tricky spellings.',
        gen: () => U.mix(8, [
          () => {
            const [w, b] = U.pick(BIG_BLENDS);
            return U.mc(`Listen. Which letters fill the blank?  ${blank(w, b)}`, b, BIG_BLENDS.map((x) => x[1]), { say: w, hint: 'Three letters blend together at the start.', why: `"${w}" starts with ${b}.` });
          },
          () => {
            const [w, wrong] = U.pick(TRICKY);
            const tip = w.includes('ph') ? 'ph can make the /f/ sound.' : w.includes('tch') ? 'After a short vowel, /ch/ is often spelled tch.' : w.includes('dge') ? 'After a short vowel, /j/ is often spelled dge.' : 'Listen for every sound.';
            return U.mc('Listen. Which spelling is correct?', w, wrong, { say: w, hint: tip, why: `"${w}" is correct. ${tip}` });
          },
          () => {
            const [w, b] = U.pick(BIG_BLENDS);
            return U.build('Listen and build the word.', [b, ...w.slice(b.length).split('')], U.sample(['str', 'spr', 'scr', 'spl', 'thr', 'shr'].filter((x) => x !== b), 2), { say: w });
          },
        ]),
      },
    ],
  };

  const RC1 = [['car', 'ar'], ['star', 'ar'], ['farm', 'ar'], ['park', 'ar'], ['barn', 'ar'], ['shark', 'ar'], ['jar', 'ar'], ['corn', 'or'], ['fork', 'or'], ['horse', 'or'], ['storm', 'or'], ['short', 'or'], ['sport', 'or'], ['horn', 'or']];
  const RC2 = [['her', 'er'], ['fern', 'er'], ['germ', 'er'], ['after', 'er'], ['bird', 'ir'], ['girl', 'ir'], ['shirt', 'ir'], ['first', 'ir'], ['dirt', 'ir'], ['burn', 'ur'], ['turn', 'ur'], ['nurse', 'ur'], ['purple', 'ur'], ['surf', 'ur']];
  const RC3 = { air: ['chair', 'hair', 'pair', 'care', 'share', 'square', 'bear', 'wear'], eer: ['hear', 'near', 'deer', 'cheer', 'steer', 'year'], or: ['more', 'store', 'shore', 'roar', 'board', 'soar'] };

  const rcBlank = (w, p) => { const i = w.indexOf(p); return w.slice(0, i) + '__' + w.slice(i + p.length); };

  const bossyR = {
    id: 'bossyr', name: 'Bossy R', icon: '🦈',
    levels: [
      {
        title: 'ar and or', std: 'RF.2.3', desc: 'The r changes the vowel sound: car, corn.',
        gen: () => U.mix(8, [
          () => { const [w, p] = U.pick(RC1); return U.mcFixed(`Listen. Which letters fill the blank?  ${rcBlank(w, p)}`, p, ['ar', 'or', 'er'], { say: w, hint: 'ar says /ar/ like car. or says /or/ like corn.', why: `"${w}" is spelled with ${p}.` }); },
          () => U.sort('Sort the words: ar or or?', ['ar', 'or'], [...U.sample(RC1.filter((x) => x[1] === 'ar'), 3).map((x) => ({ w: x[0], b: 0 })), ...U.sample(RC1.filter((x) => x[1] === 'or'), 3).map((x) => ({ w: x[0], b: 1 }))], { sayOpts: true }),
          () => { const [w, p] = U.pick(RC1); const i = w.indexOf(p); return U.build('Listen and build the word.', [...w.slice(0, i).split(''), p, ...w.slice(i + 2).split('')].filter(Boolean), [p === 'ar' ? 'or' : 'ar', 'er'], { say: w }); },
        ]),
      },
      {
        title: 'er, ir, ur', std: 'RF.2.3', desc: 'Three spellings, one sound: her, bird, turn.',
        gen: () => U.mix(8, [
          () => { const [w, p] = U.pick(RC2); return U.mcFixed(`Listen. Which letters fill the blank?  ${rcBlank(w, p)}`, p, ['er', 'ir', 'ur'], { say: w, hint: 'er, ir and ur sound the same. You have to remember how the word looks.', why: `"${w}" is spelled with ${p}.` }); },
          () => { const [w, p] = U.pick(RC2); const wrong = ['er', 'ir', 'ur'].filter((x) => x !== p).map((x) => w.replace(p, x)); return U.mc('Listen. Which spelling is correct?', w, wrong, { say: w, hint: 'Picture the word in a book. Which looks right?', why: `"${w}" is spelled with ${p}.` }); },
          () => U.sort('Sort the words by how the /er/ sound is spelled.', ['er', 'ir', 'ur'], ['er', 'ir', 'ur'].flatMap((p, b) => U.sample(RC2.filter((x) => x[1] === p), 2).map((x) => ({ w: x[0], b })))),
        ]),
      },
      {
        title: 'air, ear, ore families', std: 'RF.3.3', desc: 'chair & care, near & deer, more & roar.',
        gen: () => U.mix(8, [
          () => {
            const fam = U.pick(Object.keys(RC3));
            const [key, a] = U.sample(RC3[fam], 2);
            return U.mc(`Which word rhymes with "${key}"?`, a, Object.keys(RC3).filter((f) => f !== fam).flatMap((f) => RC3[f]),
              { hint: 'Rhyming words have the same ending sound, even if they are spelled differently.', why: `"${key}" and "${a}" rhyme.`, sayOpts: true });
          },
          () => U.sort('Sort by the ending sound you hear.', ['like chair', 'like deer', 'like more'], Object.keys(RC3).flatMap((f, b) => U.sample(RC3[f], 2).map((w) => ({ w, b }))), { sayOpts: true }),
          () => {
            const opts = [['chair', ['chare', 'cheir']], ['bear', ['bair', 'baer']], ['deer', ['deir', 'deere']], ['store', ['stoar', 'stor']], ['board', ['bord', 'boared']], ['square', ['squair', 'squere']], ['cheer', ['chear', 'chir']], ['roar', ['rore', 'rour']]];
            const [w, wrong] = U.pick(opts);
            return U.mc(`Listen: "${w}". Which spelling is correct?`, w, wrong.map((x) => x.trim()), { say: w, hint: 'Think of another word in the same word family.', why: `"${w}" is the correct spelling.` });
          },
        ]),
      },
    ],
  };

  const OI = [['coin', 'oi'], ['boil', 'oi'], ['soil', 'oi'], ['point', 'oi'], ['join', 'oi'], ['noise', 'oi'], ['boy', 'oy'], ['toy', 'oy'], ['joy', 'oy'], ['enjoy', 'oy'], ['soy', 'oy'], ['annoy', 'oy']];
  const OU = [['cloud', 'ou'], ['house', 'ou'], ['mouth', 'ou'], ['shout', 'ou'], ['round', 'ou'], ['cow', 'ow'], ['owl', 'ow'], ['town', 'ow'], ['crown', 'ow'], ['now', 'ow'], ['haul', 'au'], ['sauce', 'au'], ['launch', 'au'], ['paw', 'aw'], ['draw', 'aw'], ['yawn', 'aw'], ['straw', 'aw'], ['saw', 'aw']];
  const OO = { moon: ['moon', 'spoon', 'food', 'pool', 'zoo', 'boot'], book: ['book', 'foot', 'cook', 'wood', 'hook', 'good'], ew: ['new', 'grew', 'chew', 'flew', 'blue', 'glue', 'true', 'clue'] };

  const diphthongs = {
    id: 'diphthongs', name: 'Vowel Sound Mix-ups', icon: '🦉',
    levels: [
      {
        title: 'oi and oy', std: 'RF.2.3', desc: 'coin and boy make the same sound.',
        gen: () => U.mix(8, [
          () => { const [w, p] = U.pick(OI); return U.mcFixed(`Listen. Which letters fill the blank?  ${rcBlank(w, p)}`, p, ['oi', 'oy'], { say: w, hint: 'oi is usually in the middle of a word. oy is usually at the end.', why: `"${w}" uses ${p}${p === 'oy' ? ' because the sound is at the end' : ' because the sound is in the middle'}.` }); },
          () => U.sort('Sort the words: oi or oy?', ['oi', 'oy'], [...U.sample(OI.filter((x) => x[1] === 'oi'), 3).map((x) => ({ w: x[0], b: 0 })), ...U.sample(OI.filter((x) => x[1] === 'oy'), 3).map((x) => ({ w: x[0], b: 1 }))]),
          () => { const [w, p] = U.pick(OI); const i = w.indexOf(p); return U.build('Listen and build the word.', [...w.slice(0, i).split(''), p, ...w.slice(i + 2).split('')].filter(Boolean), [p === 'oi' ? 'oy' : 'oi', 'ou'], { say: w }); },
        ]),
      },
      {
        title: 'ou, ow, au, aw', std: 'RF.2.3', desc: 'cloud & cow, sauce & paw.',
        gen: () => U.mix(8, [
          () => { const [w, p] = U.pick(OU); const set = ['ou', 'ow'].includes(p) ? ['ou', 'ow', 'au', 'aw'] : ['au', 'aw', 'ou', 'ow']; return U.mcFixed(`Listen. Which letters fill the blank?  ${rcBlank(w, p)}`, p, set, { say: w, hint: 'ou/ow say /ow/ like "ouch". au/aw say /aw/ like "saw".', why: `"${w}" uses ${p}.` }); },
          () => { const pair = U.pick([['ou', 'ow'], ['au', 'aw']]); return U.sort(`Sort the words: ${pair[0]} or ${pair[1]}?`, pair, pair.flatMap((p, b) => U.sample(OU.filter((x) => x[1] === p), 3).map((x) => ({ w: x[0], b })))); },
          () => {
            const groups = { '/ow/ like cow': OU.filter((x) => ['ou', 'ow'].includes(x[1])).map((x) => x[0]), '/aw/ like saw': OU.filter((x) => ['au', 'aw'].includes(x[1])).map((x) => x[0]) };
            const g = U.pick(Object.keys(groups));
            const other = Object.keys(groups).find((k) => k !== g);
            return U.mc(`Which word has the ${g} sound?`, U.pick(groups[g]), groups[other], { sayOpts: true, hint: 'Say each word out loud.', why: `That word has the ${g} sound.` });
          },
        ]),
      },
      {
        title: 'oo, ew, ue', std: 'RF.3.3', desc: 'moon vs. book, new and blue.',
        gen: () => U.mix(8, [
          () => U.sort('The letters oo make two sounds. Sort the words.', ['oo as in moon', 'oo as in book'], [...U.sample(OO.moon, 3).map((w) => ({ w, b: 0 })), ...U.sample(OO.book, 3).map((w) => ({ w, b: 1 }))], { sayOpts: true }),
          () => { const key = U.pick(OO.ew); return U.mc(`Which word has the same vowel sound as "${key}"?`, U.pick(OO.moon), OO.book, { sayOpts: true, hint: `"${key}" has the long /oo/ sound, like moon.`, why: `"${key}" sounds like moon.` }); },
          () => { const [w, wrong] = U.pick([['blue', ['bloo', 'bleu']], ['grew', ['grue', 'groo']], ['glue', ['glew', 'gloo']], ['chew', ['chue', 'chooe']], ['spoon', ['spune', 'spewn']], ['clue', ['clew', 'cloo']]]); return U.mc('Listen. Which spelling is correct?', w, wrong.map((x) => x.trim()), { say: w, hint: 'ew and ue both say /oo/.', why: `"${w}" is the correct spelling.` }); },
        ]),
      },
    ],
  };

  const parts = {
    id: 'wordparts', name: 'Prefixes & Suffixes', icon: '🧩',
    levels: [
      {
        title: 'Endings -s, -es, -ed, -ing', std: 'RF.2.3d', desc: 'Add endings to base words.',
        gen: () => U.mix(8, [
          () => { const [b, a, w] = U.pick([['box', 'boxes', ['boxs', 'boxies']], ['bus', 'buses', ['buss', 'busies']], ['dish', 'dishes', ['dishs', 'dishies']], ['fox', 'foxes', ['foxs', 'foxies']], ['lunch', 'lunches', ['lunchs', 'lunchies']], ['dog', 'dogs', ['doges', 'dogies']], ['hat', 'hats', ['hates', 'hatz']], ['wish', 'wishes', ['wishs', 'wishies']]]); return U.mc(`Which is the right way to say more than one ${b}?`, a, w, { hint: 'Add -es to words that end in s, x, sh, or ch.', why: `${b} → ${a}` }); },
          () => { const [b, a] = U.pick([['jump', 'jumped'], ['play', 'played'], ['help', 'helped'], ['kick', 'kicked'], ['walk', 'walked'], ['look', 'looked'], ['paint', 'painted']]); return U.mc(`Yesterday I ___ (${b}).`, a, [b, b + 'ing', b + 's'], { hint: '"Yesterday" means it already happened. Add -ed.', why: `It happened yesterday, so we add -ed: ${a}.` }); },
          () => { const [w, b] = U.pick([['jumping', 'jump'], ['played', 'play'], ['boxes', 'box'], ['reading', 'read'], ['helped', 'help'], ['dishes', 'dish'], ['singing', 'sing'], ['looked', 'look']]); return U.mc(`What is the base word in "${w}"?`, b, [w.slice(0, -1), w.slice(0, 2), w], { hint: 'Cover up the ending. What word is left?', why: `${w} = ${b} + ${w.slice(b.length)}` }); },
        ]),
      },
      {
        title: 'un-, re-, -ful, -less, -er', std: 'RF.2.3d · L.2.4b', desc: 'Word parts change meaning.',
        gen: () => U.mix(8, [
          () => {
            const bank = [['unhappy', 'not happy'], ['unlock', 'the opposite of lock'], ['unsafe', 'not safe'], ['untie', 'the opposite of tie'], ['reread', 'read again'], ['refill', 'fill again'], ['retell', 'tell again'], ['repaint', 'paint again'], ['helpful', 'full of help'], ['colorful', 'full of color'], ['joyful', 'full of joy'], ['fearless', 'without fear'], ['useless', 'without use'], ['painless', 'without pain'], ['teacher', 'a person who teaches'], ['helper', 'a person who helps']];
            const [w, m] = U.pick(bank);
            return U.mc(`What does "${w}" mean?`, m, bank.map((x) => x[1]), { hint: 'un- = not, re- = again, -ful = full of, -less = without, -er = a person who.', why: `"${w}" means ${m}.` });
          },
          () => {
            const bank = [['not kind', 'unkind'], ['do again', 'redo'], ['full of care', 'careful'], ['without a home', 'homeless'], ['a person who paints', 'painter'], ['play again', 'replay'], ['not fair', 'unfair'], ['full of hope', 'hopeful']];
            const [m, w] = U.pick(bank);
            return U.mc(`Which word means "${m}"?`, w, bank.map((x) => x[1]), { why: `"${w}" means ${m}.` });
          },
          () => {
            const [w, p] = U.pick([['unhappy', ['un', 'happy']], ['rewrite', ['re', 'write']], ['helpful', ['help', 'ful']], ['fearless', ['fear', 'less']], ['retell', ['re', 'tell']], ['thankful', ['thank', 'ful']], ['unpack', ['un', 'pack']]]);
            return U.build(`Build the word "${w}" with word parts.`, p, U.sample(['un', 're', 'ful', 'less', 'er', 'ing'].filter((x) => !p.includes(x)), 2));
          },
        ]),
      },
      {
        title: 'pre-, dis-, mis-, -ly, -able, -ness', std: 'RF.3.3a · L.3.4b', desc: 'Grade 3 prefixes and suffixes.',
        gen: () => U.mix(8, [
          () => {
            const bank = [['preheat', 'heat before'], ['preview', 'see before'], ['preschool', 'school before kindergarten'], ['disagree', 'not agree'], ['dislike', 'not like'], ['disappear', 'go out of sight'], ['misspell', 'spell wrongly'], ['misplace', 'put in the wrong place'], ['quickly', 'in a quick way'], ['softly', 'in a soft way'], ['washable', 'can be washed'], ['breakable', 'can be broken'], ['kindness', 'being kind'], ['sadness', 'being sad']];
            const [w, m] = U.pick(bank);
            return U.mc(`What does "${w}" mean?`, m, bank.map((x) => x[1]), { hint: 'pre- = before, dis- = not, mis- = wrongly, -ly = in a way, -able = can be, -ness = being.', why: `"${w}" means ${m}.` });
          },
          () => {
            const bank = [['Mom will ___ the oven before baking.', 'preheat', ['misheat', 'heatness', 'disheat']], ['I ___ broccoli. I do not like it.', 'dislike', ['prelike', 'likeable', 'mislike']], ['Oops! I ___ my name on the test.', 'misspelled', ['prespelled', 'spellness', 'disspelled']], ['The turtle walked ___ across the road.', 'slowly', ['slowness', 'slowable', 'preslow']], ['Her ___ made everyone smile.', 'kindness', ['kindly', 'kindable', 'miskind']], ['This shirt is ___, so it can go in the washer.', 'washable', ['washness', 'prewash', 'miswash']]];
            const [s, a, w] = U.pick(bank);
            return U.mc(`Choose the word that fits: ${s}`, a, w, { why: `"${a}" makes sense in this sentence.` });
          },
          () => {
            const bank = [['dis', 'not'], ['pre', 'before'], ['mis', 'wrongly'], ['re', 'again'], ['un', 'not'], ['ly', 'in a way'], ['able', 'can be'], ['ness', 'state of being'], ['ful', 'full of'], ['less', 'without']];
            const [p, m] = U.pick(bank);
            return U.mc(`What does the word part "${p.length > 3 || ['ly', 'ful'].includes(p) ? '-' + p : p + '-'}" mean?`, m, bank.map((x) => x[1]), { why: `${p} means "${m}".` });
          },
        ]),
      },
    ],
  };

  const COMPOUNDS = [['sun', 'flower'], ['rain', 'bow'], ['cup', 'cake'], ['foot', 'ball'], ['star', 'fish'], ['snow', 'man'], ['back', 'pack'], ['tooth', 'brush'], ['butter', 'fly'], ['pop', 'corn'], ['bed', 'room'], ['sail', 'boat'], ['mail', 'box'], ['gold', 'fish'], ['rain', 'drop'], ['home', 'work']];
  const SYL = [['cat', 1], ['dog', 1], ['frog', 1], ['jump', 1], ['school', 1], ['apple', 2], ['rabbit', 2], ['picnic', 2], ['pencil', 2], ['monkey', 2], ['tiger', 2], ['happy', 2], ['banana', 3], ['elephant', 3], ['dinosaur', 3], ['butterfly', 3], ['computer', 3], ['octopus', 3], ['kangaroo', 3], ['watermelon', 4], ['caterpillar', 4], ['alligator', 4], ['helicopter', 4]];
  const SPLITS = [['rabbit', 3], ['napkin', 3], ['basket', 3], ['tiger', 2], ['robot', 2], ['music', 2], ['pumpkin', 4], ['sunset', 3], ['paper', 2], ['lemon', 3], ['wagon', 3], ['candle', 3], ['table', 2], ['puzzle', 3], ['turtle', 3], ['muffin', 3], ['spider', 3], ['pilot', 2]];

  const syllables = {
    id: 'syllables', name: 'Syllables & Big Words', icon: '👏',
    levels: [
      {
        title: 'Compound words', std: 'RF.2.3', desc: 'Two small words make one big word.',
        gen: () => U.mix(8, [
          () => { const p = U.pick(COMPOUNDS); return U.build(`Make the compound word "${p.join('')}".`, p, U.sample(COMPOUNDS.flat().filter((x) => !p.includes(x)), 2)); },
          () => { const p = U.pick(COMPOUNDS); return U.mc(`Which two words make "${p.join('')}"?`, p.join(' + '), [`${p[0].slice(0, -1)} + ${p[0].slice(-1)}${p[1]}`, `${p[0]} + ${U.pick(COMPOUNDS)[1]}`, `${U.pick(COMPOUNDS)[0]} + ${p[1]}`], { why: `${p[0]} + ${p[1]} = ${p.join('')}` }); },
          () => { const p = U.pick(COMPOUNDS); return U.mc('Which one is a compound word?', p.join(''), ['happy', 'pencil', 'monkey', 'tiger', 'yellow', 'garden', 'kitten'], { why: `"${p.join('')}" is made of ${p[0]} and ${p[1]}.` }); },
        ]),
      },
      {
        title: 'Count the syllables', std: 'RF.2.3c', desc: 'Clap the beats in each word.',
        gen: () => U.mix(8, [
          () => { const [w, n] = U.pick(SYL); return U.mcFixed(`How many syllables are in "${w}"? Clap it out!`, String(n), ['1', '2', '3', '4'], { say: w, hint: 'Put your hand under your chin. Each time your chin drops is one syllable.', why: `"${w}" has ${n} syllable${n > 1 ? 's' : ''}.` }); },
          () => { const n = U.pick([1, 2, 3]); const a = U.pick(SYL.filter((x) => x[1] === n))[0]; return U.mc(`Which word has ${n} syllable${n > 1 ? 's' : ''}?`, a, SYL.filter((x) => x[1] !== n).map((x) => x[0]), { sayOpts: true, why: `"${a}" has ${n}.` }); },
          () => U.sort('Sort by number of syllables.', ['1 syllable', '2 syllables', '3 syllables'], [1, 2, 3].flatMap((n) => U.sample(SYL.filter((x) => x[1] === n), 2).map((x) => ({ w: x[0], b: n - 1 }))), { sayOpts: true }),
        ]),
      },
      {
        title: 'Break big words apart', std: 'RF.3.3c', desc: 'Split words into syllables to read them.',
        gen: () => U.mix(8, [
          () => {
            const [w, k] = U.pick(SPLITS);
            const show = (i) => w.slice(0, i) + '-' + w.slice(i);
            const wrong = U.uniq([k - 1, k + 1, k + 2].filter((i) => i > 0 && i < w.length && i !== k)).map(show);
            return U.mc(`Which shows the syllables in "${w}" the right way?`, show(k), wrong, { say: w, hint: 'Each syllable has one vowel sound.', why: `${show(k)}: each part has one vowel sound.` });
          },
          () => { const [w, n] = U.pick(SYL.filter((x) => x[1] >= 3)); return U.mcFixed(`How many syllables are in "${w}"?`, String(n), ['2', '3', '4', '5'], { say: w, why: `"${w}" has ${n} syllables.` }); },
          () => { const [w, k] = U.pick(SPLITS); return U.build(`Build "${w}" one syllable at a time.`, [w.slice(0, k), w.slice(k)], U.sample(SPLITS.map(([x, j]) => x.slice(j)).filter((x) => x !== w.slice(k)), 2), { say: w }); },
        ]),
      },
    ],
  };

  const SILENT1 = [['knee', 'k'], ['knot', 'k'], ['knock', 'k'], ['know', 'k'], ['knife', 'k'], ['knit', 'k'], ['write', 'w'], ['wrap', 'w'], ['wrist', 'w'], ['wrong', 'w'], ['wrote', 'w'], ['wreck', 'w']];
  const SILENT2 = [['lamb', 'b'], ['thumb', 'b'], ['climb', 'b'], ['comb', 'b'], ['crumb', 'b'], ['light', 'gh'], ['night', 'gh'], ['high', 'gh'], ['eight', 'gh'], ['walk', 'l'], ['talk', 'l'], ['chalk', 'l'], ['half', 'l']];
  const HOMO = [['I can ___ my name.', 'write', 'right'], ['Turn ___ at the corner.', 'right', 'write'], ['We swam in the ___.', 'sea', 'see'], ['I can ___ the bird.', 'see', 'sea'], ['I ___ two apples.', 'ate', 'eight'], ['The spider has ___ legs.', 'eight', 'ate'], ['The bees buzzed by the ___.', 'flower', 'flour'], ['Mom needs ___ to bake bread.', 'flour', 'flower'], ['They lost ___ dog.', 'their', 'there'], ['Put the box over ___.', 'there', 'their'], ['I have ___ cats.', 'two', 'too'], ['I want to come, ___!', 'too', 'two'], ['A ___ lives in the forest.', 'bear', 'bare'], ['The tree was ___ in winter.', 'bare', 'bear'], ['The ___ rode a horse.', 'knight', 'night'], ['The stars come out at ___.', 'night', 'knight']];

  const silent = {
    id: 'silent', name: 'Silent Letters & Sound-Alikes', icon: '🤫',
    levels: [
      {
        title: 'Silent k and w', std: 'RF.2.3', desc: 'kn says /n/, wr says /r/.',
        gen: () => U.mix(8, [
          () => { const [w, l] = U.pick(SILENT1); return U.mc(`Which letter is silent in "${w}"?`, l, w.split('').filter((c) => c !== l), { say: w, hint: 'Say the word. Which letter do you NOT hear?', why: `In "${w}", the ${l} is silent.` }); },
          () => { const [w, l] = U.pick(SILENT1.filter((x) => ['knee', 'knock', 'knife', 'wrist', 'wrong', 'wreck'].includes(x[0]))); return U.mc('Listen. Which spelling is correct?', w, [w.slice(1), w.slice(1) + 'e'], { say: w, hint: 'This word has a silent letter at the beginning.', why: `"${w}" starts with a silent ${l}.` }); },
          () => { const [w] = U.pick(SILENT1); return U.build('Listen and build the word. It has a silent letter!', w.split(''), U.letterTiles(w, 2), { say: w }); },
        ]),
      },
      {
        title: 'Silent b, gh, and l', std: 'RF.2.3', desc: 'lamb, night, walk.',
        gen: () => U.mix(8, [
          () => { const [w, l] = U.pick(SILENT2); return U.mc(`Which letter${l.length > 1 ? 's are' : ' is'} silent in "${w}"?`, l, ['b', 'gh', 'l', 'k', 'w'], { say: w, hint: 'Say the word slowly. Which letters make no sound?', why: `In "${w}", ${l} is silent.` }); },
          () => { const [w, l] = U.pick(SILENT2.filter((x) => !['light', 'high'].includes(x[0]))); return U.mc('Listen. Which spelling is correct?', w, [w.replace(l, ''), w.replace(l, '') + 'e'], { say: w, why: `"${w}" has a silent ${l}.` }); },
          () => U.sort('Sort by the silent letter.', ['silent b', 'silent gh', 'silent l'], ['b', 'gh', 'l'].flatMap((l, b) => U.sample(SILENT2.filter((x) => x[1] === l), 2).map((x) => ({ w: x[0], b })))),
        ]),
      },
      {
        title: 'Homophones', std: 'L.3.2 · RF.3.3', desc: 'Words that sound the same but mean different things.',
        gen: () => U.fromBank(8, HOMO, ([s, a, w]) => U.mc(`Choose the right word: ${s}`, a, [w], { hint: `"${a}" and "${w}" sound the same. Think about the meaning.`, why: `"${a}" is the right word for this meaning.` }, 1)),
      },
    ],
  };

  addSubject({
    id: 'phonics', name: 'Phonics', blurb: 'Sounds, spelling patterns, and word parts', color: 'phonics', icon: '🔤',
    skills: [vowels, blends, bossyR, diphthongs, parts, syllables, silent],
  });
})();

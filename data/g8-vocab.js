// GRADE 8 VOCABULARY & WORD STUDY — NJSLS-ELA 2023: L.VL.8.3 (context, word choice, Greek/Latin roots), L.VI.8.4 (figurative language, relationships, connotation).
(function () {
  const ROOTS = [
    ['bene', 'good, well', ['benefit', 'benevolent', 'beneficial']], ['mal', 'bad', ['malfunction', 'malice', 'malnourished']], ['chron', 'time', ['chronological', 'chronic', 'synchronize']],
    ['graph', 'write, draw', ['autograph', 'paragraph', 'biography']], ['port', 'carry', ['transport', 'portable', 'export']], ['dict', 'say, speak', ['predict', 'dictate', 'contradict']],
    ['spect', 'look, see', ['inspect', 'spectator', 'perspective']], ['tele', 'far', ['telescope', 'telephone', 'television']], ['bio', 'life', ['biology', 'biography', 'antibiotic']],
    ['auto', 'self', ['automatic', 'autobiography', 'autonomy']], ['logy', 'study of', ['geology', 'zoology', 'psychology']], ['ject', 'throw', ['eject', 'projectile', 'reject']],
    ['rupt', 'break', ['erupt', 'interrupt', 'bankrupt']], ['scrib', 'write', ['scribble', 'describe', 'inscription']], ['struct', 'build', ['construct', 'structure', 'destruction']],
    ['vis', 'see', ['visible', 'vision', 'invisible']], ['aud', 'hear', ['audience', 'audible', 'audition']], ['cred', 'believe', ['credible', 'incredible', 'credit']],
    ['therm', 'heat', ['thermometer', 'thermal', 'thermostat']], ['phon', 'sound', ['symphony', 'phonics', 'microphone']], ['geo', 'earth', ['geography', 'geology', 'geothermal']],
    ['hydr', 'water', ['hydrate', 'hydrant', 'dehydrated']], ['micro', 'small', ['microscope', 'microbe', 'microchip']], ['multi', 'many', ['multiply', 'multicolored', 'multitude']],
  ];
  const AFFIX = [['anti-', 'against', 'antibacterial'], ['circum-', 'around', 'circumference'], ['inter-', 'between', 'international'], ['trans-', 'across', 'transatlantic'], ['sub-', 'under', 'submarine'], ['super-', 'above, beyond', 'superhuman'], ['-ology', 'study of', 'ecology'], ['-ous', 'full of', 'courageous'], ['-ible / -able', 'can be done', 'flexible'], ['-ist', 'a person who', 'scientist'], ['-ify', 'to make', 'simplify'], ['mis-', 'wrongly', 'misinterpret']];

  // distractor meanings must not share a word with the answer ("write" vs "write, draw")
  const differ = (m) => (x) => !x.split(/[ ,]+/).some((w) => m.split(/[ ,]+/).includes(w));
  const rootMeaning = () => { const [r, m, ws] = U.pick(ROOTS); return U.mc(`The words ${ws.join(', ')} all share the root "${r}". What does "${r}" most likely mean?`, m, ROOTS.map((x) => x[1]).filter(differ(m)), { hint: 'Think about what the words have in common.', why: `"${r}" means "${m}."` }); };
  const rootWord = () => { const [r, m, ws] = U.pick(ROOTS); const w = U.pick(ws); return U.mc(`Which root in "${w}" gives the clue to its meaning?`, r, ROOTS.filter((x) => !w.includes(x[0])).map((x) => x[0]), { why: `"${w}" contains "${r}," which means "${m}."` }); };
  const affixQ = () => { const [a, m, w] = U.pick(AFFIX); return U.mc(`In "${w}," what does "${a}" mean?`, m, AFFIX.map((x) => x[1]).filter(differ(m)), { why: `${a} means "${m}."` }); };
  const useRoot = () => { const [q, a, o] = U.pick([['Using roots, what does "chronometer" most likely measure?', 'time', ['heat', 'sound', 'distance']], ['Using roots, a "malediction" is most likely…', 'a curse (bad words)', ['a blessing', 'a long speech', 'a written letter']], ['Using roots, "inaudible" most likely means…', 'unable to be heard', ['unable to be seen', 'unable to be believed', 'very loud']], ['Using roots, a "hydrophobic" material most likely…', 'repels water', ['attracts heat', 'conducts sound', 'grows quickly']], ['Using roots, "incredulous" most likely means…', 'unwilling to believe', ['easy to break', 'full of joy', 'well-spoken']], ['Using roots, "geothermal" energy comes from…', "the earth's heat", ['ocean water', 'sunlight', 'wind']]]); return U.mc(q, a, o, { hint: 'Break the word into parts you know.', why: `The roots point to "${a}."` }); };

  const CTX = [
    ['The once-bustling factory was now [derelict]; its windows were shattered and weeds grew through the floor.', 'abandoned and falling apart', ['busy and crowded', 'newly built', 'brightly painted'], 'Example/description clue'],
    ['Unlike her [gregarious] sister, who loved parties, Nadia preferred quiet evenings alone.', 'sociable and outgoing', ['shy and quiet', 'angry', 'forgetful'], 'Contrast clue'],
    ['The scientist was [meticulous], checking every measurement three times before recording it.', 'extremely careful and precise', ['careless', 'fast', 'confused'], 'Example clue'],
    ['After the long drought, the river was reduced to a [meager] trickle.', 'very small in amount', ['powerful', 'muddy', 'freezing'], 'Inference clue'],
    ['The [ominous] clouds, dark and heavy, warned us that a storm was coming.', 'threatening; suggesting something bad', ['cheerful', 'thin and white', 'beautiful'], 'Description clue'],
    ['His explanation was so [lucid], or clear, that everyone understood the problem right away.', 'clear and easy to understand', ['confusing', 'long', 'boring'], 'Definition clue'],
    ['Instead of being [frugal] with her allowance, Tia spent it all on the first day.', 'careful with money', ['wasteful', 'generous', 'lucky'], 'Contrast clue'],
    ['The hikers were [resilient]; even after the storm destroyed their camp, they rebuilt it and kept going.', 'able to recover quickly from difficulty', ['weak', 'lost', 'lazy'], 'Example clue'],
    ['The committee reached a [unanimous] decision: every single member voted yes.', 'agreed to by everyone', ['split down the middle', 'secret', 'delayed'], 'Definition clue'],
    ['The speaker\'s [candid] remarks surprised the audience, who expected a polished, careful speech instead of blunt honesty.', 'honest and direct', ['rehearsed', 'quiet', 'rude'], 'Contrast clue'],
    ['Although the task seemed [daunting] at first, the team broke it into small steps and finished early.', 'intimidating; seeming hard to do', ['simple', 'exciting', 'quick'], 'Contrast clue'],
    ['The old map was so [obscure] that even the librarian could not figure out what town it showed.', 'unclear; hard to understand', ['famous', 'colorful', 'modern'], 'Inference clue'],
  ];
  const ctxQ = (bank) => () => { const [s, a, w] = U.pick(bank); const word = s.match(/\[(.+?)\]/)[1]; return U.mc(`${s.replace(/\[(.+?)\]/, '“$1”')}\n\nWhat does "${word}" mean?`, a, w, { hint: 'Look for definition, contrast, or example clues nearby.', why: `The context shows that "${word}" means ${a}.` }); };
  const clueType = () => { const [s, , , t] = U.pick(CTX); return U.mcFixed(`What kind of context clue helps you here?\n${s.replace(/[[\]]/g, '')}`, t.split('/')[0].replace(' clue', '').trim() + ' clue', ['Definition clue', 'Contrast clue', 'Example clue', 'Description clue', 'Inference clue'], { why: `The sentence gives a ${t.toLowerCase()}.` }); };

  const CONN = [
    ['thrifty', 'cheap', 'positive', 'Both mean careful with money, but "cheap" sounds negative.'], ['determined', 'stubborn', 'positive', '"Stubborn" suggests being unreasonable.'], ['confident', 'arrogant', 'positive', '"Arrogant" suggests thinking you are better than others.'],
    ['curious', 'nosy', 'positive', '"Nosy" suggests prying into others\' business.'], ['slender', 'scrawny', 'positive', '"Scrawny" suggests unhealthily thin.'], ['relaxed', 'lazy', 'positive', '"Lazy" suggests not wanting to work.'],
    ['youthful', 'childish', 'positive', '"Childish" suggests immature behavior.'], ['assertive', 'pushy', 'positive', '"Pushy" suggests forcing your ideas on others.'], ['unique', 'weird', 'positive', '"Weird" suggests strange in a bad way.'],
    ['aroma', 'stench', 'positive', '"Stench" is an unpleasant smell.'], ['cautious', 'cowardly', 'positive', '"Cowardly" suggests a lack of courage.'], ['chuckle', 'smirk', 'positive', '"Smirk" suggests a smug, mocking smile.'],
  ];
  const connQ = () => { const [p, n, , why] = U.pick(CONN); const pos = Math.random() < 0.5; return U.mc(`Which word has a more ${pos ? 'POSITIVE' : 'NEGATIVE'} connotation?`, pos ? p : n, [pos ? n : p], { hint: 'Denotation is the dictionary meaning. Connotation is the feeling a word carries.', why }, 1); };
  const connSort = () => { const pick = U.sample(CONN, 3); return U.sort('Sort the words by connotation.', ['Positive feeling', 'Negative feeling'], U.shuffle([...pick.map((x) => ({ w: x[0], b: 0 })), ...pick.map((x) => ({ w: x[1], b: 1 }))])); };
  const connPurpose = () => { const [q, a, o] = U.pick([['A writer wants readers to admire a character who saves money. Which description fits?', 'She was thrifty and planned every purchase.', ['She was cheap and never shared.', 'She was stingy with every penny.']], ['A writer wants readers to dislike a character who will not change his mind. Which description fits?', 'He was stubborn and refused to listen.', ['He was determined and focused.', 'He was persistent and dedicated.']], ['A food critic loved the bakery. Which sentence fits her review?', 'The aroma of fresh bread filled the shop.', ['The odor of bread filled the shop.', 'The stench of bread filled the shop.']], ['A reporter wants to sound neutral about a large crowd. Which word fits best?', 'crowd', ['mob', 'swarm']]]); return U.mc(q, a, o, { hint: 'Think about the feeling each word gives the reader.', why: `"${a}" creates the intended feeling.` }); };

  const FIG = [
    ['The classroom was a zoo after the fire drill.', 'Metaphor'], ['Her smile was as bright as the morning sun.', 'Simile'], ['The old car groaned as it climbed the hill.', 'Personification'], ['I have told you a million times to clean your room.', 'Hyperbole'],
    ['It is raining cats and dogs.', 'Idiom'], ['He was a real Romeo, always writing love notes.', 'Allusion'], ['"Lovely weather," she muttered as the hail pounded the roof.', 'Verbal irony'], ['The fire station burned down.', 'Situational irony'],
    ['The wind whispered secrets through the trees.', 'Personification'], ['Time is a thief that steals our summers.', 'Metaphor'], ['This backpack weighs a ton!', 'Hyperbole'], ['She has a heart of gold.', 'Idiom'],
    ['He ran like a cheetah chasing its dinner.', 'Simile'], ['Opening that box was like opening Pandora\'s box.', 'Allusion'], ['I used to be a baker, but I couldn\'t make enough dough.', 'Pun'],
  ];
  const DEVICES = ['Simile', 'Metaphor', 'Personification', 'Hyperbole', 'Idiom', 'Allusion', 'Verbal irony', 'Situational irony', 'Pun'];
  const ALSO = { 'It is raining cats and dogs.': ['Hyperbole', 'Metaphor'], 'She has a heart of gold.': ['Metaphor'], 'He was a real Romeo, always writing love notes.': ['Metaphor'], 'Time is a thief that steals our summers.': ['Personification'], 'Opening that box was like opening Pandora\'s box.': ['Simile'], 'The classroom was a zoo after the fire drill.': ['Hyperbole'], 'I have told you a million times to clean your room.': ['Idiom'], 'This backpack weighs a ton!': ['Idiom'] };
  const figQ = (pool) => () => { const [s, a] = U.pick(pool); return U.mc(`What type of figurative language is this? "${s}"`, a, DEVICES.filter((d) => !(ALSO[s] || []).includes(d)), { hint: 'Simile uses like/as. Metaphor says one thing IS another. Personification gives human traits to things. Hyperbole exaggerates.', why: `This is ${/^[AEIOU]/.test(a) ? 'an' : 'a'} ${a.toLowerCase()}.` }); };
  const figMeaning = () => { const [s, a, o] = U.pick([['"The classroom was a zoo after the fire drill."', 'The classroom was wild and noisy.', ['There were animals in the classroom.', 'The classroom was clean and calm.']], ['"Opening that box was like opening Pandora\'s box."', 'It caused many unexpected problems.', ['It contained a gift.', 'It was hard to open.']], ['"She has a heart of gold."', 'She is very kind and generous.', ['She is very rich.', 'She is stubborn.']], ['"\'Lovely weather,\' she muttered as hail pounded the roof."', 'She means the weather is terrible.', ['She enjoys hailstorms.', 'She is talking about a different day.']], ['"Time is a thief that steals our summers."', 'Summer seems to pass too quickly.', ['Someone stole the summer.', 'Summer lasts a long time.']]]); return U.mc(`What does this figurative language mean? ${s}`, a, o, { why: a }); };

  const ANALOGY = [
    ['hot : cold :: tall : ___', 'short', ['big', 'warm', 'high'], 'antonyms'], ['author : book :: composer : ___', 'symphony', ['piano', 'reader', 'orchestra'], 'creator to creation'], ['petal : flower :: page : ___', 'book', ['paper', 'read', 'library'], 'part to whole'],
    ['scissors : cut :: pen : ___', 'write', ['ink', 'paper', 'sharp'], 'tool to use'], ['fish : school :: wolf : ___', 'pack', ['den', 'howl', 'forest'], 'member to group'], ['timid : bold :: frugal : ___', 'wasteful', ['careful', 'shy', 'rich'], 'antonyms'],
    ['enormous : big :: furious : ___', 'angry', ['calm', 'loud', 'tired'], 'degree (stronger form)'], ['pilot : airplane :: captain : ___', 'ship', ['crew', 'ocean', 'uniform'], 'worker to thing operated'], ['seed : tree :: egg : ___', 'chicken', ['nest', 'shell', 'yolk'], 'early stage to mature form'],
    ['benevolent : kind :: malicious : ___', 'cruel', ['generous', 'clever', 'quiet'], 'synonyms'], ['thermometer : temperature :: scale : ___', 'weight', ['height', 'music', 'fish'], 'tool to what it measures'], ['chapter : novel :: verse : ___', 'poem', ['song', 'rhyme', 'author'], 'part to whole'],
  ];
  const anaQ = (pool) => () => { const [q, a, w, rel] = U.pick(pool); return U.mc(`Complete the analogy: ${q}`, a, w, { hint: 'Figure out how the first pair is related, then find a word that makes the second pair related the same way.', why: `The relationship is ${rel}.` }); };
  const anaRel = () => { const [q, , , rel] = U.pick(ANALOGY); return U.mc(`What is the relationship in the first pair? ${q.split('::')[0].trim()}`, rel, ANALOGY.map((x) => x[3]), { why: `It shows ${rel}.` }); };

  addSubject({
    id: 'g8vocab', track: 'g8', name: 'Vocabulary', blurb: 'Roots, context clues, connotation, and figurative language', color: 'vocab', icon: '💬',
    skills: [
      { id: 'g8roots', name: 'Greek & Latin Roots', icon: '🏛️', levels: [
        { title: 'Common roots', std: 'L.VL.8.3', desc: 'bene, mal, chron, graph, port, spect…', gen: () => U.mix(8, [rootMeaning, rootWord]) },
        { title: 'Prefixes and suffixes', std: 'L.VL.8.3', desc: 'anti-, circum-, inter-, trans-, -ology, -ous…', gen: () => U.mix(8, [affixQ, rootMeaning]) },
        { title: 'Figure out new words', std: 'L.VL.8.3', desc: 'Use roots to define words you have never seen.', gen: () => U.mix(8, [useRoot, rootWord, affixQ]) },
      ] },
      { id: 'g8context', name: 'Context Clues', icon: '🕵️', levels: [
        { title: 'Use the clues', std: 'L.VL.8.3', desc: 'Definition, contrast, and example clues.', gen: () => U.mix(8, [ctxQ(CTX.slice(0, 6)), ctxQ(CTX)]) },
        { title: 'Name the clue', std: 'L.VL.8.3', desc: 'Identify the type of clue that helps.', gen: () => U.mix(8, [ctxQ(CTX), clueType]) },
        { title: 'Challenge words', std: 'L.VL.8.3', desc: 'Inference clues for harder words.', gen: () => U.mix(8, [ctxQ(CTX.slice(6)), clueType]) },
      ] },
      { id: 'g8connote', name: 'Connotation', icon: '🎨', levels: [
        { title: 'Positive or negative?', std: 'L.VI.8.4', desc: 'thrifty vs. cheap, confident vs. arrogant.', gen: () => U.mix(8, [connQ, connSort]) },
        { title: 'Word choice and feeling', std: 'L.VI.8.4 · L.VL.8.3', desc: 'Pick the word that creates the intended effect.', gen: () => U.mix(8, [connPurpose, connQ]) },
        { title: 'Tone through word choice', std: 'L.VL.8.3', desc: 'How word choice shapes tone and meaning.', gen: () => U.mix(8, [connPurpose, connSort]) },
      ] },
      { id: 'g8figurative', name: 'Figurative Language', icon: '🌙', levels: [
        { title: 'Name the device', std: 'L.VI.8.4', desc: 'Simile, metaphor, personification, hyperbole.', gen: () => U.mix(8, [figQ(FIG.filter((f) => ['Simile', 'Metaphor', 'Personification', 'Hyperbole'].includes(f[1])))]) },
        { title: 'Idioms, allusions, irony, puns', std: 'L.VI.8.4', desc: 'The trickier figures of speech.', gen: () => U.mix(8, [figQ(FIG)]) },
        { title: 'What does it mean?', std: 'L.VI.8.4', desc: 'Interpret figurative language in context.', gen: () => U.mix(8, [figMeaning, figQ(FIG)]) },
      ] },
      { id: 'g8analogies', name: 'Analogies', icon: '🔗', levels: [
        { title: 'Simple analogies', std: 'L.VI.8.4', desc: 'Antonyms, part to whole, tool to use.', gen: () => U.mix(8, [anaQ(ANALOGY.slice(0, 6))]) },
        { title: 'Name the relationship', std: 'L.VI.8.4', desc: 'Figure out how word pairs are related.', gen: () => U.mix(8, [anaQ(ANALOGY), anaRel]) },
        { title: 'Challenge analogies', std: 'L.VI.8.4', desc: 'Degree, synonyms, and abstract pairs.', gen: () => U.mix(8, [anaQ(ANALOGY.slice(5)), anaRel]) },
      ] },
    ],
  });
})();

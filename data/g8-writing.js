// GRADE 8 WRITING — NJSLS-ELA 2023: W.AW.8.1 (argument), W.IW.8.2 (informative), W.NW.8.3 (narrative), W.WP.8.4, W.SE.8.6.
(function () {
  const claims = {
    id: 'g8claims', name: 'Claims & Counterclaims', icon: '🗣️',
    levels: [
      {
        title: 'Strong claims', std: 'W.AW.8.1', desc: 'A claim is a debatable position you can support with evidence.',
        gen: () => U.mix(6, [
          () => { const [a, o] = U.pick([['Schools should replace printed textbooks with digital ones to save money and keep information current.', ['Textbooks are books used in schools.', 'I like reading on my tablet.', 'Some schools use digital textbooks.']], ['Our town should ban gas-powered leaf blowers because they create noise and air pollution.', ['Leaf blowers are loud.', 'Many people use leaf blowers in the fall.', 'Leaf blowers were invented in the 1950s.']], ['Middle schools should require every student to learn basic coding.', ['Coding is a computer skill.', 'Some students like computers.', 'There are many coding languages.']]]); return U.mc('Which is the strongest CLAIM for an argumentative essay?', a, o, { hint: 'A claim takes a clear, arguable position. It is not a fact or a personal preference.', why: `"${a}" is debatable and can be supported with evidence.` }); },
          () => U.sort('Sort: arguable claim or simple fact?', ['Arguable claim', 'Fact'], U.shuffle([...U.sample(['Cell phones should be banned during the school day.', 'Every student should volunteer in the community.', 'Our school year should be longer.', 'Homework should be limited to one hour a night.'], 3).map((w) => ({ w, b: 0 })), ...U.sample(['New Jersey is on the East Coast.', 'The school day begins at 8:00.', 'Water boils at 212°F at sea level.', 'Our school has 600 students.'], 3).map((w) => ({ w, b: 1 }))])),
        ]),
      },
      {
        title: 'Counterclaims', std: 'W.AW.8.1', desc: 'Acknowledge the other side, then respond.',
        gen: () => U.mix(6, [
          () => { const [c, a, o] = U.pick([['Claim: Schools should start later.', 'Some people argue that later start times would disrupt after-school sports.', ['Teenagers need more sleep.', 'Later start times are a great idea.', 'Many schools start at 7:30.']], ['Claim: Students should be allowed to choose their own reading books.', 'Some teachers worry that students would choose only easy books.', ['Reading is important.', 'Choosing books is fun.', 'Libraries have many books.']], ['Claim: Our town should build more bike lanes.', 'Some drivers argue that bike lanes would make roads more crowded.', ['Biking is good exercise.', 'Bike lanes are often painted green.', 'More people should ride bikes.']]]); return U.mc(`${c} Which sentence is a COUNTERCLAIM?`, a, o, { hint: 'A counterclaim is the opposing side\'s argument.', why: `"${a}" presents the opposing view.` }); },
          () => { const [c, a, o] = U.pick([['Counterclaim: Some say later start times would hurt sports schedules.', 'However, districts that changed their schedules simply moved practices later, and teams still competed successfully.', ['Sports are fun.', 'That is a silly argument.', 'Sleep is important.']], ['Counterclaim: Some argue that school uniforms limit self-expression.', 'While that concern is understandable, students can still express themselves through clubs, art, and activities.', ['Uniforms are blue.', 'People who say that are wrong.', 'Some schools have uniforms.']]]); return U.mc(`${c} Which is the best REBUTTAL?`, a, o, { hint: 'A strong rebuttal respectfully responds with reasons or evidence.', why: `"${a}" responds with reasoning instead of insults.` }); },
        ]),
      },
      {
        title: 'Build the argument', std: 'W.AW.8.1', desc: 'Organize claim, reasons, evidence, counterclaim, and conclusion.',
        gen: () => U.mix(4, [
          () => U.order('Tap the parts of an argument paragraph in the most logical order.', U.pick([[
            'Our school should create a community garden.', 'First, a garden would teach students about science and nutrition.', 'For example, students at Lincoln Middle grew 300 pounds of vegetables last year.', 'Some argue that a garden would cost too much to maintain.', 'However, local businesses have offered to donate tools and seeds.', 'For these reasons, a garden would benefit our whole school.',
          ], [
            'Every student should learn to swim before high school.', 'Swimming is a life-saving skill.', 'According to the CDC, drowning is a leading cause of death for young children.', 'Critics say pools are too expensive for schools.', 'Yet many districts partner with local YMCAs at low cost.', 'Clearly, swimming lessons are an investment in student safety.',
          ]]), { list: true, hint: 'Claim → reason → evidence → counterclaim → rebuttal → conclusion.' }),
          () => U.mc('Which sentence would make the best CONCLUSION for an argument about a later school start time?', 'Because sleep affects learning, health, and safety, schools should start no earlier than 8:30 a.m.', ['Sleep is interesting.', 'In this essay, I will talk about sleep.', 'Some people go to bed early.'], { why: 'It restates the claim and sums up the reasons.' }),
        ]),
      },
    ],
  };

  const evidence = {
    id: 'g8evidencew', name: 'Evidence & Citations', icon: '🔖',
    levels: [
      {
        title: 'Choose strong evidence', std: 'W.AW.8.1 · W.SE.8.6', desc: 'Relevant, specific, and credible.',
        gen: () => U.mix(6, [
          () => { const [q, a, o] = U.pick([['Which source is most CREDIBLE for an essay about the health effects of sugar?', 'An article from a medical journal written by doctors', ['A soda company\'s advertisement', 'An anonymous blog post', 'A comment on a social media video']], ['Which source is most CREDIBLE for an essay about New Jersey\'s population?', 'The U.S. Census Bureau website', ['A friend\'s guess', 'A movie set in New Jersey', 'An old travel brochure']], ['Which evidence is most SPECIFIC?', 'In 2023, the school library loaned out 8,452 books, up 20 percent from the year before.', ['A lot of students read books.', 'The library is very popular.', 'Reading is increasing.']]]); return U.mc(q, a, o, { why: `"${a}" is the strongest choice.` }); },
          () => U.sort('Sort the sources by credibility.', ['More credible', 'Less credible'], U.shuffle([...U.sample(['A government science agency report', 'A university research study', 'An encyclopedia article with sources', 'A national newspaper investigation'], 3).map((w) => ({ w, b: 0 })), ...U.sample(['An anonymous online comment', 'An advertisement for the product', 'A rumor from a classmate', 'A website with no author or date'], 3).map((w) => ({ w, b: 1 }))])),
        ]),
      },
      {
        title: 'Introduce and explain quotes', std: 'W.SE.8.6 · W.AW.8.1', desc: 'Lead into quotes and explain why they matter.',
        gen: () => U.mix(6, [
          () => { const [a, o] = U.pick([['According to the American Academy of Pediatrics, schools should start "no earlier than 8:30 a.m."', ['"No earlier than 8:30 a.m." Schools should start later.', 'Schools should start no earlier than 8:30 a.m. (I read this somewhere.)']], ['As historian Ana Ruiz explains, Menlo Park was "a factory of ideas."', ['"A factory of ideas." That is what Menlo Park was.', 'Menlo Park was a factory of ideas, I think someone said.']]]); return U.mc('Which sentence introduces a quotation most effectively?', a, o, { hint: 'Name the source and blend the quote into your sentence.', why: `"${a}" names the source and blends the quote smoothly.` }); },
          () => U.mc('After including a quotation in an essay, what should a writer do next?', 'Explain how the quotation supports the claim', ['Start a new topic right away', 'Repeat the quotation again', 'Add a second quotation with no explanation'], { why: 'Evidence needs explanation (analysis) to connect it to your claim.' }),
        ]),
      },
      {
        title: 'Paraphrase without plagiarism', std: 'W.SE.8.6', desc: 'Put ideas in your own words and give credit.',
        gen: () => U.mix(4, [
          () => { const [orig, a, o] = U.pick([['Original: "Microplastics have been found in oceans, rivers, Arctic ice, and even drinking water."', 'Scientists have discovered tiny plastic pieces nearly everywhere, from remote Arctic ice to the water people drink (Lee, 2022).', ['Microplastics have been found in oceans, rivers, Arctic ice, and even drinking water.', 'Microplastics are found in oceans, rivers, ice, and water.']], ['Original: "Edison\'s team tested thousands of materials before finding a filament that worked."', 'Before they succeeded, Edison and his workers experimented with thousands of possible filaments (Ruiz, 2019).', ['Edison\'s team tested thousands of materials before finding a filament that worked.', 'Edison\'s team tested many materials before finding a working filament.']]]); return U.mc(`${orig}\nWhich is the best PARAPHRASE?`, a, o, { hint: 'A paraphrase uses your own words and sentence structure, and still credits the source.', why: 'It restates the idea in new words and cites the source.' }); },
          () => U.mc('Which is an example of plagiarism?', 'Copying a paragraph from a website into your essay without quotation marks or credit', ['Quoting a source and naming the author', 'Paraphrasing an idea and citing the source', 'Using your own ideas and words'], { why: 'Using someone else\'s words without credit is plagiarism.' }),
        ]),
      },
    ],
  };

  const transitions = {
    id: 'g8transit', name: 'Transitions & Cohesion', icon: '🔗',
    levels: [
      {
        title: 'Choose the transition', std: 'W.AW.8.1 · W.IW.8.2', desc: 'furthermore, however, consequently, for instance.',
        gen: () => U.fromBank(8, [['Teens need more sleep. ___, early start times make that nearly impossible.', 'However'], ['Recycling saves energy. ___, it reduces landfill waste.', 'Furthermore'], ['The storm knocked out power for two days. ___, schools were closed.', 'Consequently'], ['Some inventions changed daily life. ___, the light bulb extended the workday into the night.', 'For instance'], ['The plan is expensive. ___, it could save money over time.', 'Nevertheless'], ['The first experiment failed. ___, the team tried a new material.', 'Subsequently']],
          ([s, a]) => U.mcFixed(`Choose the best transition: ${s}`, a, ['However', 'Furthermore', 'Consequently', 'For instance', 'Nevertheless', 'Subsequently'], { hint: 'However/Nevertheless = contrast. Furthermore = adding. Consequently = result. For instance = example. Subsequently = later in time.', why: `"${a}" shows the right relationship.` })),
      },
      {
        title: 'Transition purposes', std: 'W.AW.8.1', desc: 'Match transitions to the relationship they show.',
        gen: () => U.mix(6, [
          () => U.sort('Sort the transitions by what they do.', ['Contrast', 'Cause & effect'], U.shuffle([...['however', 'on the other hand', 'nevertheless'].map((w) => ({ w, b: 0 })), ...['consequently', 'as a result', 'therefore'].map((w) => ({ w, b: 1 }))])),
          () => U.sort('Sort the transitions by what they do.', ['Adding an idea', 'Giving an example'], U.shuffle([...['furthermore', 'in addition', 'moreover'].map((w) => ({ w, b: 0 })), ...['for instance', 'for example', 'to illustrate'].map((w) => ({ w, b: 1 }))])),
          () => U.mc('Which transition best introduces a counterclaim?', 'Some may argue that', ['For example,', 'In conclusion,', 'First,'], { why: '"Some may argue that" signals the opposing view.' }),
        ]),
      },
      {
        title: 'Cohesive paragraphs', std: 'W.AW.8.1 · W.IW.8.2', desc: 'Make sentences flow and stay on topic.',
        gen: () => U.mix(4, [
          () => { const p = U.pick([['The Pine Barrens hold a huge underground water supply.', 'In fact, the aquifer is estimated at 17 trillion gallons.', 'However, the sandy soil makes it easy to pollute.', 'Therefore, protecting the land above it is essential.'], ['Edison\'s lab worked like a factory of ideas.', 'For example, workers tested thousands of materials.', 'As a result, the lab produced inventions quickly.', 'Consequently, companies still copy this model today.']]); return U.order('Tap the sentences in the order that flows best.', p, { list: true, hint: 'Use the transitions as clues.' }); },
          () => U.mc('Which sentence does NOT belong in a paragraph about the benefits of school gardens?', 'My favorite vegetable is corn.', ['Gardens teach students how food grows.', 'Students who garden often eat more vegetables.', 'Gardens give students hands-on science lessons.'], { why: 'It is a personal preference, not a benefit of school gardens.' }),
        ]),
      },
    ],
  };

  const style = {
    id: 'g8style', name: 'Formal Style & Concision', icon: '🎩',
    levels: [
      {
        title: 'Formal or informal?', std: 'W.AW.8.1 · W.IW.8.2', desc: 'Academic writing avoids slang and casual language.',
        gen: () => U.mix(6, [
          () => U.sort('Sort the sentences by style.', ['Formal (academic)', 'Informal'], U.shuffle([...U.sample(['The evidence suggests that later start times improve attendance.', 'This policy would benefit students in several ways.', 'Researchers have identified three main causes.', 'Therefore, the proposal deserves serious consideration.'], 3).map((w) => ({ w, b: 0 })), ...U.sample(['Honestly, early school is the worst.', 'Kids are gonna be super tired.', 'This is, like, a really big deal.', 'Stuff like this happens all the time.'], 3).map((w) => ({ w, b: 1 }))])),
          () => { const [w, a, o] = U.pick([['Kids are gonna do way better if school starts later.', 'Students are likely to perform better if school starts later.', ['Kids will do way better if school starts later.', 'Students are gonna perform better with later school.']], ['The Hindenburg thing was a total disaster.', 'The Hindenburg crash was a devastating disaster.', ['The Hindenburg thing was really, really bad.', 'The Hindenburg was a disaster, for sure.']]]); return U.mc(`Revise in a formal style: "${w}"`, a, o, { why: `"${a}" uses formal, precise language.` }); },
        ]),
      },
      {
        title: 'Cut the wordiness', std: 'W.WP.8.4 · L.KL.8.2', desc: 'Say more with fewer words.',
        gen: () => U.fromBank(6, [['Due to the fact that it was raining, the game was canceled.', 'Because it was raining, the game was canceled.', ['Due to the fact that it was raining, the game, it was canceled.', 'Because of the fact of the rain, the game was canceled.']], ['In my personal opinion, I think that uniforms are helpful.', 'Uniforms are helpful.', ['In my opinion, I personally think uniforms are helpful.', 'I think that in my opinion uniforms help.']], ['At this point in time, the team is currently practicing.', 'The team is practicing now.', ['At this time, the team is currently practicing right now.', 'Currently, at this point, the team practices.']], ['The reason why he was late was because the bus broke down.', 'He was late because the bus broke down.', ['The reason he was late was because of the reason that the bus broke down.', 'Why he was late was the bus broke down.']]],
          ([w, a, o]) => U.mc(`Which revision is most CONCISE? "${w}"`, a, o, { why: `"${a}" says the same thing in fewer words.` })),
      },
      {
        title: 'Precise word choice', std: 'L.KL.8.2 · W.IW.8.2', desc: 'Replace vague words with precise ones.',
        gen: () => U.fromBank(6, [['The storm did a lot of bad things to the town.', 'The storm destroyed homes and flooded streets throughout the town.', ['The storm did many bad things to the town.', 'The storm was very bad for the town.']], ['The experiment had good results.', 'The experiment showed that the new filter removed 95 percent of the microplastics.', ['The experiment had very good results.', 'The results of the experiment were good.']], ['Edison made a lot of stuff.', 'Edison developed the phonograph, a practical light bulb, and a power system.', ['Edison made many things.', 'Edison made lots of different stuff.']]],
          ([w, a, o]) => U.mc(`Which revision is most PRECISE? "${w}"`, a, o, { why: `"${a}" replaces vague words with specific details.` })),
      },
    ],
  };

  const narrative = {
    id: 'g8narr', name: 'Narrative Technique', icon: '🎬',
    levels: [
      {
        title: 'Show, don\'t tell', std: 'W.NW.8.3', desc: 'Use actions and details instead of naming feelings.',
        gen: () => U.fromBank(6, [['Mia was nervous.', 'Mia\'s hands trembled as she gripped the edge of her desk.', ['Mia was very, very nervous.', 'Mia felt nervous and scared.']], ['The house was old.', 'The porch sagged, and paint peeled from the shutters like dry skin.', ['The house was really old.', 'It was an old, old house.']], ['Jordan was happy.', 'Jordan pumped his fist and sprinted across the field, laughing.', ['Jordan was extremely happy.', 'Jordan felt happy inside.']], ['The room was messy.', 'Clothes spilled out of drawers, and a half-eaten sandwich balanced on a pile of books.', ['The room was very messy.', 'It was a messy room.']]],
          ([t, a, o]) => U.mc(`Which sentence SHOWS instead of tells? (Telling: "${t}")`, a, o, { why: 'It uses specific actions and details to show the feeling or scene.' })),
      },
      {
        title: 'Dialogue and pacing', std: 'W.NW.8.3 · L.SS.8.1', desc: 'Punctuate dialogue and control the pace.',
        gen: () => U.mix(6, [
          () => { const [a, o] = U.pick([['"Hurry up," Leo whispered, "or we\'ll miss the bus."', ['"Hurry up" Leo whispered "or we\'ll miss the bus."', '"Hurry up, Leo whispered, or we\'ll miss the bus."']], ['"Did you hear that?" Ava asked.', ['"Did you hear that"? Ava asked.', '"Did you hear that," Ava asked?']], ['Maya said, "This is the best day ever!"', ['Maya said "This is the best day ever"!', 'Maya said, "this is the best day ever!"']]]); return U.mc('Which sentence punctuates dialogue correctly?', a, o, { hint: 'Punctuation goes inside the quotation marks, and a comma separates the dialogue tag.', why: `"${a}" is punctuated correctly.` }); },
          () => U.mc('A writer wants to SLOW DOWN a suspenseful moment. Which technique works best?', 'Describe each small action and sensory detail in short, separate sentences.', ['Summarize the whole scene in one sentence.', 'Skip ahead to the next day.', 'Remove all description.'], { why: 'Detailed, moment-by-moment description slows the pace and builds suspense.' }),
        ]),
      },
      {
        title: 'Openings, transitions, and endings', std: 'W.NW.8.3', desc: 'Hook the reader, shift time and setting, and reflect.',
        gen: () => U.mix(4, [
          () => U.mc('Which is the most engaging OPENING for a narrative?', 'The lights went out at exactly 7:14, right in the middle of my solo.', ['This is a story about a concert.', 'One time something happened to me.', 'I am going to tell you about my day.'], { why: 'It drops the reader into the action with a specific detail.' }),
          () => U.mc('Which transition best signals a shift in TIME in a narrative?', 'Three years later, on the same dock, I finally understood.', ['Also, the dock was wooden.', 'In conclusion, I learned a lesson.', 'For example, I liked fishing.'], { why: '"Three years later" clearly signals a jump in time.' }),
          () => U.mc('Which is the strongest REFLECTIVE ending?', 'As the boat disappeared past the breakwater, I realized that what I had been missing all those summers was not the sea, but my father.', ['The end.', 'Then I went home and ate dinner.', 'That was my story about the boat.'], { why: 'It reflects on what the narrator learned.' }),
        ]),
      },
    ],
  };

  // Some levels have small banks; top their rounds up with questions from a related level.
  const widen = (lvl, ...from) => { const base = lvl.gen; lvl.gen = (x) => { const out = base(x); const seen = new Set(out.map((q) => q.q + q.a)); for (const f of from) for (const q of U.shuffle(f.gen(x))) { if (out.length >= 6) break; if (!seen.has(q.q + q.a)) { seen.add(q.q + q.a); out.push(q); } } return U.shuffle(out); }; };
  widen(claims.levels[2], claims.levels[1]);
  widen(evidence.levels[1], evidence.levels[0]);
  widen(evidence.levels[2], evidence.levels[1], evidence.levels[0]);
  widen(transitions.levels[2], transitions.levels[1]);
  widen(style.levels[2], style.levels[1]);
  widen(narrative.levels[2], narrative.levels[1]);

  addSubject({
    id: 'g8write', track: 'g8', name: 'Writing', blurb: 'Arguments, evidence, style, and narrative craft', color: 'writing', icon: '🖋️',
    skills: [claims, evidence, transitions, style, narrative],
  });

  // ---- Grade 8 Writing Studio types ----
  const has = (re, text) => re.test(text);
  const G8_GOALS = [
    { sentences: 7, words: 150, paragraphs: 1, label: 'One strong paragraph: 7+ sentences, 150+ words.' },
    { sentences: 14, words: 300, paragraphs: 3, label: 'Three paragraphs, 300+ words.' },
    { sentences: 22, words: 500, paragraphs: 5, label: 'A five-paragraph essay, 500+ words.' },
  ];
  const formal = (text) => {
    const slang = (text.match(/\b(gonna|wanna|kinda|stuff|like,|totally|awesome|super|a lot|lol|ok)\b/gi) || []);
    const contr = (text.match(/\b\w+'(t|re|ll|ve|d|m)\b/gi) || []);
    return [{ ok: slang.length === 0, label: 'Formal style: no slang or casual words', detail: slang.length ? `Found: ${[...new Set(slang.map((x) => x.toLowerCase()))].join(', ')}` : '' },
      { ok: contr.length <= 1, label: 'Few or no contractions (formal writing)', detail: contr.length ? `Found: ${[...new Set(contr)].slice(0, 5).join(', ')}` : '' }];
  };
  const TRANS = ['however', 'furthermore', 'moreover', 'consequently', 'therefore', 'for example', 'for instance', 'in addition', 'as a result', 'nevertheless', 'in contrast', 'similarly', 'in conclusion', 'ultimately'];
  const transCheck = (text, n) => { const used = TRANS.filter((w) => text.toLowerCase().includes(w)); return { ok: used.length >= n, label: `Uses ${n}+ academic transitions (however, furthermore, consequently…)`, detail: used.length ? `You used: ${used.join(', ')}` : '' }; };

  STUDIO.types.push(
    {
      id: 'g8argument', track: 'g8', name: 'Argumentative Essay', icon: '⚖️', std: 'W.AW.8.1', blurb: 'Take a position, support it with evidence, and answer the other side.', goals: G8_GOALS,
      prompts: ['Should middle schools start later in the morning?', 'Should cell phones be banned during the school day?', 'Should students be required to complete community service?', 'Should homework be limited to one hour per night?', 'Should New Jersey ban single-use plastic bags statewide?', 'Should schools replace printed textbooks with digital ones?'],
      plan: [
        { key: 'claim', label: 'Claim (your position)', ph: 'Middle schools should start no earlier than 8:30 a.m.' },
        { key: 'r1', label: 'Reason 1 + evidence', ph: 'Teens\' sleep cycles shift later (AAP recommendation)' },
        { key: 'r2', label: 'Reason 2 + evidence', ph: 'Sleep-deprived students struggle to focus' },
        { key: 'counter', label: 'Counterclaim', ph: 'Some say it would disrupt sports and buses' },
        { key: 'rebut', label: 'Rebuttal', ph: 'Districts that changed adjusted practice times' },
        { key: 'end', label: 'Conclusion', ph: 'Restate claim and why it matters' },
      ],
      starters: ['It is clear that', 'One reason is that', 'According to', 'For example,', 'This shows that', 'Some may argue that', 'However,', 'In conclusion,'],
      words: ['however', 'furthermore', 'for example', 'according to', 'consequently', 'in conclusion'],
      self: ['My claim is clear and debatable.', 'Each reason is supported by specific evidence.', 'I acknowledged and responded to a counterclaim.', 'I used a formal, academic tone.'],
      checks: (text, lvl) => [
        { ok: has(/\b(should|must|ought to|need to)\b/i, text), label: 'States a clear claim (should / must / ought to)', detail: '' },
        { ok: has(/(according to|research|study|studies|survey|data|percent|statistic|"[^"]{8,}")/i, text), label: 'Includes evidence (a source, data, or a quotation)', detail: '' },
        ...(lvl >= 1 ? [{ ok: has(/(some (people )?(may |might )?(argue|say|believe|claim)|opponents|critics|others (believe|argue)|although some|while some)/i, text), label: 'Addresses a counterclaim (Some may argue…)', detail: '' }] : []),
        transCheck(text, lvl === 2 ? 4 : 2), ...formal(text),
      ],
    },
    {
      id: 'g8literary', track: 'g8', name: 'Literary Analysis', icon: '🔍', std: 'RL.CR.8.1 · W.AW.8.1', blurb: 'Make a claim about a story and prove it with quotations.', goals: G8_GOALS,
      prompts: ['How does Priya change in "Static," and what causes the change?', 'What theme does "Low Tide" develop, and how?', 'How does dramatic irony shape the audience\'s experience of "The Surprise"?', 'How does the journal structure of "The Lighthouse Keeper\'s Log" develop its theme?', 'Choose a novel you read this year. How does the main character change?'],
      plan: [
        { key: 'thesis', label: 'Thesis (your claim about the text)', ph: 'In "Static," Priya learns that courage means acting despite fear.' },
        { key: 'e1', label: 'Evidence 1 (quotation)', ph: '"She set the note cards face-down on the podium."' },
        { key: 'a1', label: 'Analysis: how it proves your thesis', ph: 'Putting the cards away shows new confidence' },
        { key: 'e2', label: 'Evidence 2 (quotation)', ph: '"…she had found the signal."' },
        { key: 'end', label: 'Conclusion', ph: 'Why this message matters' },
      ],
      starters: ['In the story', 'The author shows', 'For example, the text states', 'This quotation reveals', 'This suggests that', 'Furthermore,', 'Ultimately,'],
      words: ['for example', 'this shows', 'this suggests', 'furthermore', 'ultimately', 'in addition'],
      self: ['My thesis makes a specific claim about the text.', 'Every quotation is introduced and explained.', 'I wrote about the author\'s choices, not just the plot.', 'I used a formal, academic tone.'],
      checks: (text, lvl) => [
        { ok: (text.match(/["“][^"”]{6,}["”]/g) || []).length >= (lvl === 0 ? 1 : 2), label: `Includes ${lvl === 0 ? 1 : 2}+ direct quotations from the text`, detail: '' },
        { ok: has(/(this (shows|suggests|reveals|demonstrates)|which (shows|suggests|reveals))/i, text), label: 'Explains evidence (This shows… This suggests…)', detail: '' },
        { ok: has(/\b(theme|character|author|narrator|symbol|conflict|tone|irony)\b/i, text), label: 'Uses literary terms (theme, character, author, conflict…)', detail: '' },
        transCheck(text, lvl === 2 ? 3 : 1), ...formal(text),
      ],
    },
    {
      id: 'g8informative', track: 'g8', name: 'Informative Essay', icon: '📘', std: 'W.IW.8.2', blurb: 'Explain a topic clearly with facts, details, and precise language.', goals: G8_GOALS,
      prompts: ['Explain how Thomas Edison\'s Menlo Park lab changed the way inventions are made.', 'Explain why the Pine Barrens are important to New Jersey.', 'Explain the causes and effects of the Hindenburg disaster.', 'Explain how microplastics enter the environment and what can be done.', 'Explain how a bill becomes a law in New Jersey.'],
      plan: [
        { key: 'topic', label: 'Topic and preview', ph: 'The Pine Barrens matter for their water, wildlife, and history.' },
        { key: 'p1', label: 'Point 1 + facts', ph: 'Kirkwood-Cohansey aquifer: about 17 trillion gallons' },
        { key: 'p2', label: 'Point 2 + facts', ph: 'Rare plants: pitch pines, orchids, carnivorous plants' },
        { key: 'p3', label: 'Point 3 + facts', ph: '1978 Pinelands National Reserve' },
        { key: 'end', label: 'Concluding section', ph: 'Why protecting it matters' },
      ],
      starters: ['To understand', 'One important', 'In addition,', 'For instance,', 'As a result,', 'Similarly,', 'In conclusion,'],
      words: ['in addition', 'for instance', 'as a result', 'similarly', 'in contrast', 'in conclusion'],
      self: ['My introduction previews what I will explain.', 'Each paragraph has specific facts or examples.', 'I used precise, subject-specific vocabulary.', 'My conclusion pulls the ideas together.'],
      checks: (text, lvl) => [
        { ok: (text.match(/\d/g) || []).length >= 2 || has(/(for example|for instance|such as)/i, text), label: 'Includes specific facts, numbers, or examples', detail: '' },
        { ok: !has(/\b(I think|I believe|in my opinion)\b/i, text), label: 'Stays objective (no "I think" or "in my opinion")', detail: '' },
        transCheck(text, lvl === 2 ? 4 : 2), ...formal(text),
      ],
    },
    {
      id: 'g8narrative', track: 'g8', name: 'Narrative', icon: '🎬', std: 'W.NW.8.3', blurb: 'Tell a real or imagined story with dialogue, pacing, and reflection.', goals: G8_GOALS.map((g) => ({ ...g, label: g.label.replace('essay', 'story') })),
      prompts: ['Write about a time you had to make a difficult choice.', 'A student finds an old letter hidden in a library book.', 'Write a story told from the point of view of a lighthouse.', 'The power goes out during the biggest storm of the year.', 'Write about a moment that changed how you saw someone.'],
      plan: [
        { key: 'who', label: 'Narrator and characters', ph: 'First person; me and my older brother' },
        { key: 'setting', label: 'Setting and situation', ph: 'A blackout during a winter storm' },
        { key: 'conflict', label: 'Conflict', ph: 'We have to keep our grandmother warm' },
        { key: 'climax', label: 'Turning point', ph: 'My brother gives up his blanket' },
        { key: 'reflect', label: 'Reflection: what changed or was learned', ph: 'I saw him differently after that night' },
      ],
      starters: ['The moment I', 'Suddenly,', 'Without warning,', '"', 'Hours later,', 'Looking back,', 'I realized'],
      words: ['suddenly', 'meanwhile', 'later', 'hours later', 'looking back', 'finally'],
      self: ['My opening hooks the reader.', 'I used dialogue and sensory details.', 'I controlled the pacing in the most important moment.', 'My ending reflects on what the events meant.'],
      checks: (text, lvl) => [
        { ok: has(/["“].+?["”]/, text), label: 'Includes dialogue in quotation marks', detail: '' },
        { ok: has(/\b(smell|smelled|sound|heard|felt|cold|warm|bright|dark|whisper|taste|rough|soft|glow)\w*\b/i, text), label: 'Uses sensory details (sight, sound, touch, smell…)', detail: '' },
        { ok: has(/(I realized|I learned|looking back|now I know|I understood|from then on)/i, text), label: 'Ends with reflection (I realized… Looking back…)', detail: '' },
      ],
    },
  );
})();

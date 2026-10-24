// WRITING — Grade 2 W.2.1–W.2.5, Grade 3 W.3.1–W.3.5 (skills drills + the guided Writing Studio)
(function () {
  const SB = [
    ['The cat is sleeping.', 'I like to read books.', 'We went to the park.', 'My dog can run fast.', 'The sun is very hot.', 'She has a red bike.', 'Can you help me?', 'The frog jumped high.'],
    ['My little brother loves to build towers.', 'Do you want to play tag at recess?', 'The hungry bear ate sweet berries.', 'We planted seeds in the school garden.', 'Grandma baked cookies for the whole class.', 'The bright moon lit up the dark sky.'],
    ['When the bell rang, we lined up for lunch.', 'I wanted to swim, but the pool was closed.', 'The tiny ants carried crumbs back to their hill.', 'Because it was snowing, school started late today.', 'After dinner, my family played a board game together.', 'The brave firefighter climbed the tall ladder quickly.'],
  ];

  const builder = {
    id: 'sentencebuilder', name: 'Sentence Builder', icon: '🧱',
    levels: SB.map((bank, i) => ({
      title: ['Short sentences', 'Longer sentences', 'Two-part sentences'][i], std: ['W.2.5 · L.2.1f', 'L.2.1f', 'L.3.1h · L.3.1i'][i],
      desc: ['Put 4–5 words in order.', 'Put 6–7 words in order.', 'Build sentences with commas and joining words.'][i],
      gen: () => U.fromBank(6, bank, (s) => U.order('Tap the words to build a sentence that makes sense.', s.split(' '), { hint: 'The word with a capital letter goes first. The word with the end mark goes last.' })),
    })),
  };

  const expand = {
    id: 'expand', name: 'Combine & Expand', icon: '🪄',
    levels: [
      {
        title: 'Add describing words', std: 'L.2.1f · W.2.5', desc: 'Make sentences more interesting.',
        gen: () => U.fromBank(6, [
          ['The dog barked.', 'The fluffy brown dog barked loudly.', ['The dog barked the dog.', 'Dog barked.']],
          ['I ate a cookie.', 'I ate a warm, chewy cookie.', ['I ate.', 'A cookie I ate a cookie.']],
          ['The bird sang.', 'The tiny blue bird sang a sweet song.', ['The bird.', 'Bird sang sang.']],
          ['We saw a fish.', 'We saw a shiny orange fish in the pond.', ['We saw.', 'Fish we a saw.']],
          ['The car went.', 'The shiny red car zoomed down the road.', ['The car went went.', 'Car the went.']],
          ['She has a hat.', 'She has a big, floppy purple hat.', ['She has.', 'Hat she has a.']],
        ], ([s, a, w]) => U.mc(`Which sentence tells MORE about "${s}"?`, a, w, { hint: 'Look for describing words that help you picture it.', why: 'It adds details that help the reader make a picture.' })),
      },
      {
        title: 'Combine with and, but, so', std: 'L.2.1f', desc: 'Join two short sentences.',
        gen: () => U.fromBank(6, [
          ['I have a cat.', 'I have a dog.', 'I have a cat and a dog.', ['I have a cat I have a dog.', 'I have a cat, so a dog.']],
          ['It was raining.', 'We played inside.', 'It was raining, so we played inside.', ['It was raining but, we played inside.', 'It was raining we played inside.']],
          ['Sam likes apples.', 'He does not like pears.', 'Sam likes apples, but he does not like pears.', ['Sam likes apples so he does not like pears.', 'Sam likes apples he does not like pears.']],
          ['The sky is blue.', 'The grass is green.', 'The sky is blue, and the grass is green.', ['The sky is blue, but the grass, is green.', 'The sky is blue the grass is green.']],
          ['Mia ran fast.', 'Mia won the race.', 'Mia ran fast and won the race.', ['Mia ran fast Mia won the race.', 'Mia ran fast, but won the race.']],
          ['I was hungry.', 'I ate a snack.', 'I was hungry, so I ate a snack.', ['I was hungry, but I ate a snack.', 'I was hungry I ate a snack.']],
        ], ([a1, a2, a, w]) => U.mc(`Combine: "${a1}" + "${a2}"`, a, w, { hint: 'Use a comma and a joining word, or share the parts that are the same.', why: `"${a}" joins the ideas smoothly.` })),
      },
      {
        title: 'Combine with because, when, after', std: 'L.3.1h · L.3.1i · L.3.3a', desc: 'Show how ideas connect.',
        gen: () => U.fromBank(6, [
          ['We went inside.', 'It started to thunder.', 'We went inside because it started to thunder.', ['We went inside, but it started to thunder.', 'Because we went inside it started to thunder.']],
          ['The bell rang.', 'We ran to the playground.', 'When the bell rang, we ran to the playground.', ['When we ran to the playground, the bell rang because.', 'The bell rang or we ran to the playground.']],
          ['I finished my homework.', 'I watched a show.', 'After I finished my homework, I watched a show.', ['I watched a show after, I finished my homework because.', 'I finished my homework, or I watched a show.']],
          ['Lily wore a coat.', 'It was cold outside.', 'Lily wore a coat because it was cold outside.', ['Lily wore a coat, so it was cold outside.', 'Because Lily wore a coat, it was cold outside.']],
          ['The puppy was tired.', 'It played all day.', 'The puppy was tired because it played all day.', ['The puppy played all day because it was tired.', 'The puppy was tired, or it played all day.']],
        ], ([a1, a2, a, w]) => U.mc(`Which sentence best combines these? "${a1}" "${a2}"`, a, w, { hint: 'Ask: Which idea causes the other? Which happens first?', why: `"${a}" shows how the two ideas are connected.` })),
      },
    ],
  };

  const linking = {
    id: 'linking', name: 'Linking Words', icon: '🔗',
    levels: [
      {
        title: 'First, next, then, last', std: 'W.2.3', desc: 'Words that show order.',
        gen: () => U.fromBank(6, [
          ['___, I put on my shoes. Next, I tied the laces.', 'First'], ['First, we mixed the batter. ___, we poured it in the pan.', 'Next'], ['We packed the car. ___, we drove to the lake.', 'Then'], ['We swam, ate lunch, and hiked. ___, we went home tired and happy.', 'Last'], ['___, I brush my teeth before bed.', 'First'], ['First I washed the dog. ___ I dried him with a towel.', 'Then'],
        ], ([s, a]) => U.mcFixed(`Choose the best linking word: ${s}`, a, ['First', 'Next', 'Then', 'Last'], { why: `"${a}" shows the order.` })),
      },
      {
        title: 'because, also, and', std: 'W.2.1', desc: 'Words that connect opinions and reasons.',
        gen: () => U.fromBank(6, [
          ['I think dogs are the best pets ___ they are loyal.', 'because', ['but', 'or']], ['Dogs are loyal. They are ___ fun to play with.', 'also', ['because', 'but']], ['Summer is great ___ there is no school.', 'because', ['also', 'or']], ['Reading is fun. It ___ helps you learn new words.', 'also', ['because', 'or']], ['I like recess ___ I get to play with my friends.', 'because', ['also', 'but']], ['Apples are tasty, ___ they are good for you.', 'and', ['because', 'or']],
        ], ([s, a, w]) => U.mc(`Choose the best linking word: ${s}`, a, w, { hint: 'because gives a reason. also adds another idea.', why: `"${a}" connects the ideas.` })),
      },
      {
        title: 'for example, therefore, in conclusion', std: 'W.3.1c · W.3.2c · W.3.3c', desc: 'Grade 3 transition words.',
        gen: () => U.fromBank(6, [
          ['Many animals live in the ocean. ___, whales, sharks, and octopuses live there.', 'For example'], ['It is going to rain. ___, you should bring an umbrella.', 'Therefore'], ['___, recycling helps keep our planet clean.', 'In conclusion'], ['Plants need sunlight. ___, a sunflower turns to face the sun.', 'For example'], ['Exercise makes you strong. ___, everyone should play outside every day.', 'Therefore'], ['___, I hope you will join the reading club.', 'In conclusion'], ['I wanted a snack. ___, there were no cookies left.', 'However'], ['Owls hunt at night. ___, they sleep during the day.', 'Therefore'],
        ], ([s, a]) => U.mcFixed(`Choose the best transition: ${s}`, a, ['For example', 'Therefore', 'However', 'In conclusion'], { hint: 'For example = gives an example. Therefore = so. However = but. In conclusion = to finish.', why: `"${a}" fits how the ideas connect.` })),
      },
    ],
  };

  const editing = {
    id: 'editing', name: 'Editing Detective', icon: '🔍',
    levels: [
      {
        title: 'Find the mistake', std: 'W.2.5 · L.2.2', desc: 'Capitals, end marks, and spelling.',
        gen: () => U.fromBank(6, [
          ['[i] like to play outside.', 'i should be I'], ['My dog is named [max].', 'max should be Max'], ['The cat ran [fast]', 'fast needs a period at the end'], ['We went to the [stor].', 'stor should be store'], ['Can you help [me.]', 'me needs a question mark'], ['[she] has a blue hat.', 'she should be She'], ['I saw a big [dogg].', 'dogg should be dog'], ['My friend [sam] is funny.', 'sam should be Sam'],
        ], ([s, why]) => U.tap('Tap the word with a mistake.', s, { hint: 'Check capitals, end marks, and spelling.', why: `Fix: ${why}.` })),
      },
      {
        title: 'Fix it up', std: 'W.2.5 · L.2.2', desc: 'Find mistakes and choose the fix.',
        gen: () => U.mix(6, [
          () => { const [s, why] = U.pick([['We visited [texas] on vacation.', 'Texas is a place, so it needs a capital'], ['I [dont] like rain.', 'dont needs an apostrophe: don\'t'], ['The [childs] played tag.', 'the plural of child is children'], ['Yesterday I [goed] to school.', 'the past of go is went'], ['My mom and [me] baked bread.', 'it should be "Mom and I"'], ['The [boxs] are heavy.', 'the plural of box is boxes']]); return U.tap('Tap the word with a mistake.', s, { why: `Fix: ${why}.` }); },
          () => { const [w, a, o] = U.pick([['Ben and i went to the zoo.', 'Ben and I went to the zoo.', ['Ben and i went to the Zoo.', 'ben and I went to the zoo.']], ['the bird flew away', 'The bird flew away.', ['the bird flew away.', 'The bird flew away']], ['We cant go outside.', "We can't go outside.", ['We ca\'nt go outside.', 'We cant\' go outside.']], ['My Sister likes pizza.', 'My sister likes pizza.', ['my sister likes pizza.', 'My Sister Likes Pizza.']]]); return U.mc(`Fix this sentence: "${w}"`, a, o, { why: `"${a}" is correct.` }); },
        ]),
      },
      {
        title: 'Editor in chief', std: 'W.3.5 · L.3.2 · L.3.1', desc: 'Grade 3 mistakes: quotes, agreement, tense.',
        gen: () => U.mix(6, [
          () => { const [s, why] = U.pick([['The dogs [runs] in the yard.', 'dogs is plural, so use run'], ['Last week we [will] go to the zoo.', 'last week is past, so use went instead of "will go"'], ['My favorite book is [charlotte\'s] Web.', 'titles need capitals: Charlotte\'s'], ['The [leafs] fell off the tree.', 'the plural of leaf is leaves'], ['She is the [most] tallest girl in class.', 'say "tallest", not "most tallest"'], ['The [babys] were sleeping.', 'the plural of baby is babies']]); return U.tap('Tap the word with a mistake.', s, { why: `Fix: ${why}.` }); },
          () => { const [w, a, o] = U.pick([['"Look out! yelled Sam.', '"Look out!" yelled Sam.', ['"Look out! yelled Sam."', 'Look out!" yelled Sam.']], ['We need eggs milk and flour.', 'We need eggs, milk, and flour.', ['We need, eggs milk and flour.', 'We need eggs milk, and, flour.']], ['The birds sings in the morning.', 'The birds sing in the morning.', ['The bird sing in the morning.', 'The birds singed in the morning.']], ['Tomorrow I played soccer.', 'Tomorrow I will play soccer.', ['Tomorrow I plays soccer.', 'Tomorrow I playing soccer.']]]); return U.mc(`Fix this sentence: "${w}"`, a, o, { why: `"${a}" is correct.` }); },
        ]),
      },
    ],
  };

  const PARA = [
    [['I love fall.', 'The leaves turn red and gold.', 'I like to jump in leaf piles.', 'Fall is my favorite season.'], ['My dog is a good friend.', 'He plays fetch with me.', 'He sleeps by my bed.', 'I am lucky to have him.'], ['Lunch is my favorite part of school.', 'I get to sit with my friends.', 'We share funny stories.', 'I always look forward to lunch.'], ['Rainy days can be fun.', 'I splash in puddles with my boots.', 'We play board games inside.', 'I like rainy days a lot.'], ['My grandpa is a great cook.', 'He makes the best pancakes.', 'He lets me stir the soup.', 'I love cooking with Grandpa.'], ['Our class garden is busy.', 'We water the plants every morning.', 'Bees visit the flowers.', 'The garden is a happy place.']],
    [['Butterflies go through big changes.', 'First, a caterpillar hatches from an egg.', 'Then, it makes a chrysalis.', 'Finally, a butterfly comes out.', 'It is amazing how much butterflies change!'], ['Everyone should learn to swim.', 'Swimming keeps you safe near water.', 'It is also great exercise.', 'Plus, it is fun to play in the pool.', 'That is why swimming is an important skill.']],
  ];

  const paragraph = {
    id: 'paragraph', name: 'Paragraph Builder', icon: '📝',
    levels: [
      {
        title: 'Topic sentences', std: 'W.2.1 · W.2.2', desc: 'The first sentence tells what it\'s about.',
        gen: () => U.fromBank(4, PARA[0], (p) => U.mc(`Which is the best TOPIC sentence for these details?\n• ${p[1]}\n• ${p[2]}`, p[0], ['I have a cat.', 'It is Tuesday.', 'Trees are green.', 'Math is hard.'].filter((x) => x !== p[0]), { hint: 'A topic sentence tells the main idea of all the details.', why: `"${p[0]}" tells what the details are about.` })),
      },
      {
        title: 'Order a paragraph', std: 'W.2.2 · W.2.3', desc: 'Topic, details, closing.',
        gen: () => U.mix(4, [() => U.order('Tap the sentences to build the paragraph in order.', U.pick(PARA[0]), { list: true, hint: 'Topic sentence first, then details, then a closing sentence.' }), () => { const p = U.pick(PARA[0]); return U.mc('Which is the best CLOSING sentence?', p[3], [p[1], 'The end of the day.', 'I have shoes.'], { passage: { title: 'Paragraph', kind: 'Draft', text: p.slice(0, 3).join(' ') }, why: 'A closing sentence wraps up the main idea.' }); }]),
      },
      {
        title: 'Build a full paragraph', std: 'W.3.1 · W.3.2 · W.3.3', desc: 'Topic, details with linking words, conclusion.',
        gen: () => U.mix(4, [() => U.order('Tap the sentences to build the paragraph in order.', U.pick(PARA[1]), { list: true, hint: 'Look for linking words like First, Then, Also, and That is why.' }), () => { const p = U.pick(PARA[1]); return U.mc('Which sentence is the conclusion?', p[4], p.slice(0, 4), { why: 'It sums up the paragraph at the end.' }); }, () => { const p = U.pick(PARA[1]); return U.mc('Which sentence does NOT belong in this paragraph?', U.pick(['My cousin has a red car.', 'I ate cereal today.', 'The sky was cloudy.']), p.slice(1, 4), { passage: { title: 'Paragraph', kind: 'Draft', text: p.join(' ') }, hint: 'Every sentence should be about the topic.', why: 'It is not about the topic.' }); }]),
      },
    ],
  };

  addSubject({
    id: 'writing', name: 'Writing', blurb: 'Build sentences, edit, and write your own pieces', color: 'writing', icon: '🖍️',
    skills: [builder, expand, linking, editing, paragraph],
  });

  // ---- Writing Studio projects ----
  // goals per level: [min sentences, min words, extra checks]
  window.STUDIO = {
    goals: [
      { sentences: 3, words: 15, label: 'Write 3 or more sentences.' },
      { sentences: 5, words: 35, label: 'Write 5 or more sentences with linking words.' },
      { sentences: 7, words: 60, label: 'Write a paragraph of 7+ sentences with transitions.' },
    ],
    types: [
      {
        id: 'story', name: 'Story', icon: '🐉', std: 'W.2.3 · W.3.3', blurb: 'Tell what happened: beginning, middle, end.',
        prompts: ['A day when your pet could talk', 'The time you found a secret door', 'Your best birthday ever', 'A trip to the moon', 'When a dinosaur came to school', 'The day it rained candy'],
        plan: [
          { key: 'who', label: 'Who is in your story?', ph: 'My little brother and our dog Lucky' },
          { key: 'where', label: 'Where does it happen?', ph: 'In our backyard' },
          { key: 'begin', label: 'Beginning: How does it start?', ph: 'Lucky started barking at a hole' },
          { key: 'middle', label: 'Middle: What is the problem or big event?', ph: 'We found a treasure map inside' },
          { key: 'end', label: 'End: How does it end? How do they feel?', ph: 'We found toys we lost years ago. We were so happy!' },
        ],
        starters: ['One day,', 'First,', 'Then,', 'Suddenly,', 'After that,', 'Finally,', 'In the end,', 'I felt'],
        words: ['First', 'Next', 'Then', 'Suddenly', 'Later', 'Finally'],
      },
      {
        id: 'opinion', name: 'Opinion', icon: '🗣️', std: 'W.2.1 · W.3.1', blurb: 'Tell what you think and why.',
        prompts: ['What is the best season?', 'Should kids have homework?', 'What is the best pet?', 'Is it better to read a book or watch the movie?', 'What is the best food for lunch?', 'Should recess be longer?'],
        plan: [
          { key: 'opinion', label: 'My opinion is…', ph: 'Summer is the best season.' },
          { key: 'r1', label: 'Reason 1', ph: 'There is no school.' },
          { key: 'r2', label: 'Reason 2', ph: 'I can swim at the pool.' },
          { key: 'r3', label: 'Reason 3 (Grade 3 Challenge)', ph: 'We go camping.' },
          { key: 'end', label: 'Closing: say your opinion again', ph: 'That is why summer is the best!' },
        ],
        starters: ['I think', 'In my opinion,', 'One reason is', 'Also,', 'Another reason is', 'Because', 'For example,', 'That is why'],
        words: ['because', 'also', 'another reason', 'for example', 'that is why', 'in conclusion'],
      },
      {
        id: 'howto', name: 'How-To', icon: '🛠️', std: 'W.2.2 · W.3.2', blurb: 'Teach someone how to do something.',
        prompts: ['How to make a sandwich', 'How to brush your teeth', 'How to plant a seed', 'How to make a paper airplane', 'How to take care of a pet', 'How to get ready for school'],
        plan: [
          { key: 'topic', label: 'What are you teaching?', ph: 'How to make a peanut butter sandwich' },
          { key: 'need', label: 'What do you need?', ph: 'Bread, peanut butter, a knife' },
          { key: 's1', label: 'Step 1', ph: 'Get two slices of bread.' },
          { key: 's2', label: 'Step 2', ph: 'Spread peanut butter on one slice.' },
          { key: 's3', label: 'Step 3', ph: 'Put the slices together.' },
          { key: 'end', label: 'Closing sentence', ph: 'Now you have a yummy snack!' },
        ],
        starters: ['Do you want to learn how to', 'You will need', 'First,', 'Next,', 'Then,', 'After that,', 'Last,', 'Now you can'],
        words: ['First', 'Next', 'Then', 'After that', 'Last', 'Finally'],
      },
      {
        id: 'letter', name: 'Friendly Letter', icon: '💌', std: 'W.2.2 · L.2.2b', blurb: 'Write a letter to someone special.',
        prompts: ['Write to a grandparent about your week', 'Thank a teacher for something', 'Tell a friend about a new game', 'Write to an author you love', 'Invite a friend to a party'],
        plan: [
          { key: 'to', label: 'Who is the letter to?', ph: 'Grandma' },
          { key: 'why', label: 'Why are you writing?', ph: 'To tell her about my soccer game' },
          { key: 'd1', label: 'Detail 1', ph: 'I scored a goal.' },
          { key: 'd2', label: 'Detail 2', ph: 'Our team got pizza after.' },
          { key: 'close', label: 'Closing (Love, Your friend, …)', ph: 'Love,' },
        ],
        starters: ['Dear', 'How are you?', 'I am writing to tell you', 'Guess what?', 'I miss you', 'I hope', 'Love,', 'Your friend,'],
        words: ['Dear', 'Love,', 'Your friend,', 'also', 'because'],
      },
      {
        id: 'info', name: 'All About', icon: '🦁', std: 'W.2.2 · W.3.2', blurb: 'Share facts about a topic you know.',
        prompts: ['All about sharks', 'All about my family', 'All about the ocean', 'All about my favorite sport', 'All about space', 'All about dinosaurs'],
        plan: [
          { key: 'topic', label: 'My topic is…', ph: 'Sharks' },
          { key: 'f1', label: 'Fact 1', ph: 'Sharks have many rows of teeth.' },
          { key: 'f2', label: 'Fact 2', ph: 'Some sharks are as small as a pencil.' },
          { key: 'f3', label: 'Fact 3', ph: 'Sharks have lived for millions of years.' },
          { key: 'end', label: 'Closing sentence', ph: 'Sharks are amazing animals!' },
        ],
        starters: ['Did you know', 'is a', 'One fact is', 'Also,', 'Another fact is', 'For example,', 'In conclusion,', 'That is why'],
        words: ['also', 'another', 'for example', 'in addition', 'in conclusion'],
      },
    ],
  };
})();

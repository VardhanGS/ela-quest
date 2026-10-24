// GRAMMAR & CONVENTIONS — Grade 2 L.2.1/L.2.2, Grade 3 L.3.1/L.3.2
(function () {
  const nouns = {
    id: 'nouns', name: 'Nouns', icon: '🏠',
    levels: [
      {
        title: 'Find the nouns', std: 'L.2.1', desc: 'A noun names a person, place, or thing.',
        gen: () => U.fromBank(8, [
          'The [dog] ran to the [park].', 'My [sister] has a red [ball].', 'A [bird] sat in the [tree].', 'The [baby] drank some [milk].',
          'We saw a [frog] by the [pond].', 'The [teacher] read a [book].', 'My [cat] sleeps on the [bed].', 'The [boy] kicked the [ball] into the [net].',
          'A [fish] swam in the [lake].', 'The [farmer] fed the [pigs].', 'Put the [apple] in the [basket].', 'The [girl] found a [shell] at the [beach].',
        ], (s) => U.tap('Tap all the nouns (people, places, or things).', s, { hint: 'Ask: Is it a person, place, or thing?' })),
      },
      {
        title: 'Proper & collective nouns', std: 'L.2.1a', desc: 'Names like Texas, and group words like a flock.',
        gen: () => U.mix(8, [
          () => {
            const proper = ['Maya', 'Texas', 'Monday', 'Dr. Lee', 'Chicago', 'July', 'Mars', 'Lake Erie', 'Ms. Ortiz', 'Canada'];
            const common = ['girl', 'state', 'day', 'doctor', 'city', 'month', 'planet', 'lake', 'teacher', 'country'];
            const idx = U.sample([...proper.keys()], 3);
            const items = [...idx.map((i) => ({ w: proper[i], b: 0 })), ...U.sample(common.filter((_, i) => !idx.includes(i)), 3).map((w) => ({ w, b: 1 }))];
            return U.sort('Sort the nouns. Proper nouns name a special person, place, or thing and start with a capital letter.', ['Proper noun', 'Common noun'], items);
          },
          () => {
            const bank = [['fish', 'school'], ['birds', 'flock'], ['cows', 'herd'], ['wolves', 'pack'], ['players', 'team'], ['bees', 'swarm'], ['grapes', 'bunch'], ['puppies', 'litter'], ['whales', 'pod'], ['sheep', 'flock']];
            const [thing, group] = U.pick(bank);
            return U.mc(`A ___ of ${thing}`, group, bank.map((x) => x[1]), { hint: 'A collective noun names a group.', why: `We say "a ${group} of ${thing}."` });
          },
          () => {
            const bank = [['We visited [Florida] in [June].', 'proper'], ['[Sam] and [Lily] went to [Lincoln] [School].', 'proper'], ['My dog [Rex] loves [Saturday] mornings.', 'proper'], ['[Grandma] lives in [Ohio].', 'proper'], ['[Ms.] [Kim] took us to the [Bronx] [Zoo].', 'proper']];
            const [s] = U.pick(bank);
            return U.tap('Tap the proper nouns.', s, { hint: 'Proper nouns start with a capital letter (but not just because they start the sentence).' });
          },
        ]),
      },
      {
        title: 'Concrete & abstract nouns', std: 'L.3.1c', desc: 'Some nouns you can touch, some you can\'t.',
        gen: () => U.mix(8, [
          () => {
            const abs = ['love', 'joy', 'bravery', 'idea', 'friendship', 'fear', 'honesty', 'freedom', 'kindness', 'hope', 'courage', 'anger'];
            const con = ['chair', 'apple', 'dog', 'river', 'pencil', 'shoe', 'cloud', 'bread', 'rock', 'teacher', 'drum', 'kite'];
            return U.sort('Sort the nouns. Concrete = you can see or touch it. Abstract = an idea or feeling.', ['Concrete', 'Abstract'], [...U.sample(con, 3).map((w) => ({ w, b: 0 })), ...U.sample(abs, 3).map((w) => ({ w, b: 1 }))]);
          },
          () => {
            const abs = ['love', 'joy', 'bravery', 'friendship', 'fear', 'honesty', 'freedom', 'kindness', 'courage'];
            const con = ['chair', 'apple', 'dog', 'river', 'pencil', 'shoe', 'bread', 'rock', 'drum', 'kite', 'boat'];
            return U.mc('Which noun is abstract (an idea or feeling)?', U.pick(abs), con, { hint: 'Can you touch it? If not, it is abstract.', why: 'You cannot touch it, so it is an abstract noun.' });
          },
          () => U.tap('Tap the abstract noun.', U.pick(['The firefighter showed great [bravery].', 'Our [friendship] is very strong.', 'She felt [joy] when she saw the puppy.', 'He told the truth because [honesty] matters.', 'The birds flew away in [fear].', 'Thank you for your [kindness].']), { hint: 'Look for a word that names a feeling or idea.' }),
        ]),
      },
    ],
  };

  const plurals = {
    id: 'plurals', name: 'Plurals', icon: '🐑',
    levels: [
      {
        title: 'Add -s or -es', std: 'L.2.1', desc: 'More than one: cats, boxes.',
        gen: () => U.fromBank(8, [['cat', 'cats'], ['box', 'boxes'], ['bus', 'buses'], ['dish', 'dishes'], ['fox', 'foxes'], ['dog', 'dogs'], ['church', 'churches'], ['glass', 'glasses'], ['peach', 'peaches'], ['wish', 'wishes'], ['bench', 'benches'], ['kiss', 'kisses'], ['frog', 'frogs'], ['brush', 'brushes'], ['tree', 'trees']],
          ([s, p]) => U.mc(`One ${s}, two ___`, p, p.endsWith('es') ? [s + 's', s + 'ies'] : [s + 'es', s + 'ies'], { hint: 'Add -es to words that end in s, x, z, sh, or ch. Add -s to most other words.', why: `${s} → ${p}` }, 2)),
      },
      {
        title: 'Irregular plurals', std: 'L.2.1b', desc: 'feet, mice, children, teeth.',
        gen: () => U.mix(8, [
          () => {
            const bank = [['man', 'men', ['mans', 'manes']], ['woman', 'women', ['womans', 'womanes']], ['child', 'children', ['childs', 'childes']], ['foot', 'feet', ['foots', 'feets']], ['tooth', 'teeth', ['tooths', 'teeths']], ['mouse', 'mice', ['mouses', 'mices']], ['goose', 'geese', ['gooses', 'geeses']], ['fish', 'fish', ['fishs', 'fishies']], ['sheep', 'sheep', ['sheeps', 'sheepes']], ['deer', 'deer', ['deers', 'deeres']], ['person', 'people', ['persons', 'peoples']], ['ox', 'oxen', ['oxes', 'oxs']]];
            const [s, p, w] = U.pick(bank);
            return U.mc(`One ${s}, two ___`, p, w, { hint: 'This is a special plural. It does not just add -s.', why: `${s} → ${p}` });
          },
          () => {
            const bank = [['Three ___ ran across the kitchen.', 'mice', ['mouses', 'mouse']], ['I brush my ___ every night.', 'teeth', ['tooths', 'tooth']], ['The ___ played on the playground.', 'children', ['childs', 'child']], ['My ___ are cold!', 'feet', ['foots', 'feets']], ['The farmer has ten ___.', 'sheep', ['sheeps', 'sheepes']], ['Many ___ came to the fair.', 'people', ['persons', 'peoples']], ['A flock of ___ honked loudly.', 'geese', ['gooses', 'goose']]];
            const [s, a, w] = U.pick(bank);
            return U.mc(`Choose the right word: ${s}`, a, w, { why: `"${a}" is the plural.` });
          },
        ]),
      },
      {
        title: 'y → ies and f → ves', std: 'L.3.1b', desc: 'babies, leaves, toys.',
        gen: () => U.mix(8, [
          () => {
            const bank = [['baby', 'babies', ['babys', 'babyes']], ['city', 'cities', ['citys', 'cityes']], ['story', 'stories', ['storys', 'storyes']], ['puppy', 'puppies', ['puppys', 'puppyes']], ['berry', 'berries', ['berrys', 'berryes']], ['key', 'keys', ['kies', 'keyes']], ['toy', 'toys', ['toies', 'toyes']], ['day', 'days', ['daies', 'dayes']], ['monkey', 'monkeys', ['monkies', 'monkeyes']]];
            const [s, p, w] = U.pick(bank);
            const hint = p.endsWith('ies') ? 'Consonant + y: change y to i and add -es.' : 'Vowel + y: just add -s.';
            return U.mc(`One ${s}, two ___`, p, w, { hint, why: `${s} → ${p}. ${hint}` });
          },
          () => {
            const bank = [['leaf', 'leaves', ['leafs', 'leafes']], ['knife', 'knives', ['knifes', 'knifs']], ['wolf', 'wolves', ['wolfs', 'wolfes']], ['shelf', 'shelves', ['shelfs', 'shelfes']], ['half', 'halves', ['halfs', 'halfes']], ['life', 'lives', ['lifes', 'lifs']], ['calf', 'calves', ['calfs', 'calfes']], ['loaf', 'loaves', ['loafs', 'loafes']]];
            const [s, p, w] = U.pick(bank);
            return U.mc(`One ${s}, two ___`, p, w, { hint: 'Many words that end in f or fe change to -ves.', why: `${s} → ${p}` });
          },
          () => {
            const bank = ['baby', 'city', 'party', 'pony', 'key', 'toy', 'day', 'boy'];
            const items = U.sample(bank.slice(0, 4), 3).map((w) => ({ w, b: 0 })).concat(U.sample(bank.slice(4), 3).map((w) => ({ w, b: 1 })));
            return U.sort('How do you make each word plural?', ['change y → ies', 'just add -s'], items, { hint: 'Look at the letter before the y. Is it a vowel?' });
          },
        ]),
      },
    ],
  };

  const IRREG = [['sit', 'sat'], ['hide', 'hid'], ['tell', 'told'], ['run', 'ran'], ['eat', 'ate'], ['go', 'went'], ['see', 'saw'], ['come', 'came'], ['give', 'gave'], ['make', 'made'], ['swim', 'swam'], ['sing', 'sang'], ['write', 'wrote'], ['take', 'took'], ['fly', 'flew'], ['think', 'thought'], ['catch', 'caught'], ['buy', 'bought']];

  const verbs = {
    id: 'verbs', name: 'Verbs', icon: '🏃',
    levels: [
      {
        title: 'Action verbs', std: 'L.2.1', desc: 'A verb tells what someone does.',
        gen: () => U.mix(8, [
          () => U.tap('Tap the verb (the action word).', U.pick(['The frog [jumps] into the pond.', 'Maya [paints] a big picture.', 'The baby [cries] at night.', 'We [swim] in the lake.', 'The dog [barks] at the mail carrier.', 'Dad [cooks] dinner.', 'The kids [run] on the playground.', 'Birds [sing] in the morning.', 'Leo [kicks] the ball.', 'The cat [naps] in the sun.']), { hint: 'Ask: What is someone or something doing?' }),
          () => U.mc('Which word is a verb?', U.pick(['jump', 'swim', 'read', 'climb', 'clap', 'throw', 'dance']), ['happy', 'table', 'blue', 'puppy', 'tall', 'school', 'soft'], { why: 'It is an action you can do.' }),
          () => U.sort('Sort the words: noun or verb?', ['Noun', 'Verb'], [...U.sample(['desk', 'river', 'apple', 'shoe', 'cookie', 'window'], 3).map((w) => ({ w, b: 0 })), ...U.sample(['hop', 'write', 'laugh', 'build', 'sleep', 'push'], 3).map((w) => ({ w, b: 1 }))]),
        ]),
      },
      {
        title: 'Irregular past tense', std: 'L.2.1d', desc: 'sat, hid, told, went.',
        gen: () => U.mix(8, [
          () => { const [p, past] = U.pick(IRREG); return U.mc(`Today I ${p}. Yesterday I ___.`, past, [p + 'ed', p + 's', p + 'ing'], { hint: 'This verb is irregular. It does not use -ed.', why: `${p} → ${past}` }); },
          () => {
            const bank = [['Yesterday, Sam ___ to the park.', 'went', ['goed', 'go']], ['Last night, we ___ pizza.', 'ate', ['eated', 'eat']], ['The bird ___ over the house.', 'flew', ['flied', 'flyed']], ['I ___ a letter to Grandma.', 'wrote', ['writed', 'writes']], ['Mia ___ behind the tree.', 'hid', ['hided', 'hide']], ['He ___ me a funny joke.', 'told', ['telled', 'tell']], ['We ___ a song in music class.', 'sang', ['singed', 'sings']], ['She ___ the ball with one hand.', 'caught', ['catched', 'catch']]];
            const [s, a, w] = U.pick(bank);
            return U.mc(`Choose the right verb: ${s}`, a, w, { why: `"${a}" is the past tense.` });
          },
          () => { const [p, past] = U.pick(IRREG); return { t: 'type', q: `Type the past tense of "${p}". (Yesterday I ___.)`, a: [past], hint: 'It does not end in -ed.', why: `${p} → ${past}` }; },
        ]),
      },
      {
        title: 'Past, present, future', std: 'L.3.1d · L.3.1e', desc: 'Verb tenses tell when something happens.',
        gen: () => U.mix(8, [
          () => {
            const bank = [['Tomorrow, we ___ to the zoo.', 'will go', ['went', 'goes']], ['Right now, the baby ___.', 'sleeps', ['slept', 'will sleep']], ['Last week, I ___ my bike.', 'rode', ['will ride', 'ride']], ['Next summer, my family ___ to the beach.', 'will drive', ['drove', 'drives']], ['Every day, Ana ___ her teeth.', 'brushes', ['brushed', 'will brush']], ['Yesterday, the team ___ the game.', 'won', ['wins', 'will win']], ['Soon, the flowers ___.', 'will bloom', ['bloomed', 'blooms']]];
            const [s, a, w] = U.pick(bank);
            return U.mc(`Choose the right verb: ${s}`, a, w, { hint: 'Look for clue words like yesterday, now, or tomorrow.', why: `"${a}" matches the time in the sentence.` });
          },
          () => {
            const bank = [['I will paint a picture.', 'Future'], ['She jumped over the puddle.', 'Past'], ['The dog runs fast.', 'Present'], ['We will eat lunch soon.', 'Future'], ['They played tag at recess.', 'Past'], ['He reads every night.', 'Present'], ['My aunt will visit us.', 'Future'], ['The wind blew hard.', 'Past']];
            const [s, a] = U.pick(bank);
            return U.mcFixed(`When does this happen? "${s}"`, a, ['Past', 'Present', 'Future'], { hint: '"will" means future. -ed often means past.', why: `"${s}" is ${a.toLowerCase()} tense.` });
          },
          () => U.sort('Sort the verbs by tense.', ['Past', 'Present', 'Future'], [['walked', 0], ['sang', 0], ['jumps', 1], ['eats', 1], ['will swim', 2], ['will run', 2]].map(([w, b]) => ({ w, b }))),
        ]),
      },
    ],
  };

  const adj = {
    id: 'adjectives', name: 'Adjectives & Adverbs', icon: '🌈',
    levels: [
      {
        title: 'Describing words', std: 'L.2.1e', desc: 'Adjectives tell about nouns.',
        gen: () => U.mix(8, [
          () => U.tap('Tap the adjective (describing word).', U.pick(['The [fluffy] cat slept.', 'I ate a [juicy] apple.', 'We saw a [tall] giraffe.', 'She wore a [purple] hat.', 'The [loud] drum boomed.', 'It was a [cold] morning.', 'He has a [tiny] puppy.', 'The [shiny] car went by.', 'Look at the [bright] stars.', 'A [hungry] bear ate berries.']), { hint: 'Which word tells what the noun is like?' }),
          () => U.mc('Which word is an adjective?', U.pick(['soft', 'green', 'happy', 'bumpy', 'sweet', 'huge', 'silly']), ['run', 'table', 'sing', 'park', 'jump', 'book'], { why: 'It describes what something is like.' }),
          () => {
            const bank = [['The ___ snail moved across the leaf.', 'slow', ['slowly', 'slows']], ['I have a ___ blanket.', 'warm', ['warmly', 'warms']], ['The ___ lion roared.', 'fierce', ['fiercely', 'fierces']]];
            const [s, a, w] = U.pick(bank);
            return U.mc(`Choose the describing word: ${s}`, a, w, { why: `"${a}" describes the noun.` });
          },
        ]),
      },
      {
        title: 'Adjective or adverb?', std: 'L.2.1e', desc: 'Adverbs tell how: quickly, softly.',
        gen: () => U.mix(8, [
          () => {
            const bank = [['The turtle walked ___.', 'slowly', 'slow'], ['She sang ___.', 'sweetly', 'sweet'], ['He whispered ___.', 'quietly', 'quiet'], ['The rabbit hopped ___.', 'quickly', 'quick'], ['The dog barked ___.', 'loudly', 'loud'], ['Close the door ___.', 'gently', 'gentle'], ['It was a ___ day.', 'sunny', 'sunnily'], ['The ___ kitten purred.', 'happy', 'happily'], ['I have a ___ voice.', 'quiet', 'quietly'], ['He is a ___ runner.', 'quick', 'quickly']];
            const [s, a, w] = U.pick(bank);
            return U.mc(`Choose the right word: ${s}`, a, [w], { hint: 'Describing a noun? Use an adjective. Describing how someone does something? Use an adverb (often ends in -ly).', why: a.endsWith('ly') ? `"${a}" tells HOW, so it is an adverb.` : `"${a}" describes a noun, so it is an adjective.` }, 1);
          },
          () => U.tap('Tap the adverb (it tells how).', U.pick(['The bee buzzed [loudly].', 'Grandpa walked [slowly] to the car.', 'The kids played [nicely] together.', 'Mia [carefully] carried the eggs.', 'The wind blew [softly].', 'He [quickly] ate his lunch.']), { hint: 'Look for the word that tells how. Many end in -ly.' }),
          () => U.sort('Sort: adjective or adverb?', ['Adjective', 'Adverb'], [...U.sample(['brave', 'soft', 'loud', 'kind', 'bright'], 3).map((w) => ({ w, b: 0 })), ...U.sample(['bravely', 'softly', 'loudly', 'kindly', 'brightly'], 3).map((w) => ({ w, b: 1 }))]),
        ]),
      },
      {
        title: 'Comparing: -er, -est, more, most', std: 'L.3.1g', desc: 'tall, taller, tallest; good, better, best.',
        gen: () => U.mix(8, [
          () => {
            const bank = [['A giraffe is ___ than a horse.', 'taller', ['tallest', 'more tall']], ['That was the ___ movie I have ever seen!', 'best', ['goodest', 'better']], ['My cold is ___ today than yesterday.', 'worse', ['badder', 'worst']], ['A cheetah is the ___ land animal.', 'fastest', ['faster', 'most fast']], ['This flower is ___ than that one.', 'more beautiful', ['beautifuler', 'most beautiful']], ['Ice is ___ than water.', 'colder', ['coldest', 'more cold']], ['That is the ___ puzzle in the box.', 'most difficult', ['difficultest', 'more difficult']], ['My bag is ___ than yours.', 'heavier', ['heavyer', 'heaviest']]];
            const [s, a, w] = U.pick(bank);
            return U.mc(`Choose the right word: ${s}`, a, w, { hint: 'Comparing 2 things: -er or more. Comparing 3 or more: -est or most.', why: `"${a}" is correct here.` });
          },
          () => {
            const [b, c, s] = U.pick([['big', 'bigger', 'biggest'], ['happy', 'happier', 'happiest'], ['good', 'better', 'best'], ['small', 'smaller', 'smallest'], ['bad', 'worse', 'worst']]);
            return U.order(`Put the words in order from one to most: ${b}…`, [b, c, s], { list: false, hint: 'The base word comes first, then -er, then -est.' });
          },
          () => {
            const bank = [['bigger', 'Comparing 2 things'], ['biggest', 'Comparing 3 or more'], ['more careful', 'Comparing 2 things'], ['most careful', 'Comparing 3 or more'], ['better', 'Comparing 2 things'], ['best', 'Comparing 3 or more']];
            return U.sort('Sort the words.', ['Comparing 2 things', 'Comparing 3 or more'], bank.map(([w, b]) => ({ w, b: b.startsWith('Comparing 2') ? 0 : 1 })));
          },
        ]),
      },
    ],
  };

  const pronouns = {
    id: 'pronouns', name: 'Pronouns', icon: '🙋',
    levels: [
      {
        title: 'He, she, it, we, they', std: 'L.2.1', desc: 'Pronouns take the place of nouns.',
        gen: () => U.fromBank(8, [['Sam is tall.', 'Sam', 'He'], ['Maya likes art.', 'Maya', 'She'], ['The ball is red.', 'The ball', 'It'], ['Mom and Dad cooked.', 'Mom and Dad', 'They'], ['Ben and I played.', 'Ben and I', 'We'], ['The dogs barked.', 'The dogs', 'They'], ['Grandma baked bread.', 'Grandma', 'She'], ['The cat purred.', 'The cat', 'It'], ['Mr. Diaz is our coach.', 'Mr. Diaz', 'He'], ['Lily and I are friends.', 'Lily and I', 'We']],
          ([s, n, p]) => U.mcFixed(`"${s}" Which pronoun can take the place of "${n}"?`, p, ['He', 'She', 'It', 'We', 'They'], { hint: 'Is it a boy, a girl, a thing, a group with you, or a group without you?', why: `"${n}" → "${p}"` })),
      },
      {
        title: 'Reflexive pronouns', std: 'L.2.1c', desc: 'myself, himself, ourselves …',
        gen: () => U.fromBank(8, [['I made the card all by ___.', 'myself'], ['Leo hurt ___ on the slide.', 'himself'], ['Sara taught ___ to whistle.', 'herself'], ['We cleaned the room by ___.', 'ourselves'], ['The kids served ___ snacks.', 'themselves'], ['The cat licked ___.', 'itself'], ['Did you make that by ___?', 'yourself'], ['They built the fort by ___.', 'themselves'], ['I looked at ___ in the mirror.', 'myself'], ['She wrote a note to ___.', 'herself']],
          ([s, a]) => U.mc(`Choose the right word: ${s}`, a, ['myself', 'himself', 'herself', 'ourselves', 'themselves', 'itself', 'yourself', 'hisself', 'theirselves'], { hint: 'Match the pronoun to who is doing the action.', why: `"${a}" matches who did it.` })),
      },
      {
        title: 'Possessive pronouns & agreement', std: 'L.3.1a', desc: 'his, her, its, their, our.',
        gen: () => U.mix(8, [
          () => {
            const bank = [['The dogs wagged ___ tails.', 'their', ['its', 'his']], ['Maria lost ___ jacket.', 'her', ['their', 'its']], ['The bird built ___ nest.', 'its', ['their', 'it\'s']], ['Jamal rode ___ bike.', 'his', ['her', 'their']], ['We love ___ new teacher.', 'our', ['their', 'my']], ['The girls packed ___ bags.', 'their', ['her', 'its']], ['I brushed ___ hair.', 'my', ['our', 'his']], ['The team won ___ game.', 'its', ['their\'s', 'it\'s']]];
            const [s, a, w] = U.pick(bank);
            return U.mc(`Choose the right pronoun: ${s}`, a, w, { hint: 'The pronoun must match the noun: one or more than one? boy, girl, or thing?', why: `"${a}" agrees with the noun.` });
          },
          () => {
            const bank = [['When [Tom] got home, he fed the cat.', 'he'], ['The [flowers] need water because they are dry.', 'they'], ['[Ella] said she was hungry.', 'she'], ['The [robot] beeped when it turned on.', 'it']];
            const [s, p] = U.pick(bank);
            return U.tap(`In this sentence, who or what does "${p}" stand for? Tap the noun.`, s, { hint: 'Look earlier in the sentence for the noun the pronoun replaces.' });
          },
        ]),
      },
    ],
  };

  const caps = {
    id: 'capitals', name: 'Capital Letters', icon: '🅰️',
    levels: [
      {
        title: 'Sentences, names, and I', std: 'L.2.2', desc: 'Start sentences and names with capitals.',
        gen: () => U.mix(8, [
          () => {
            const bank = [['My dog Max likes to run.', ['my dog Max likes to run.', 'My dog max likes to run.']], ['Ava and I went to the store.', ['Ava and i went to the store.', 'ava and I went to the store.']], ['We met Mr. Brown at the park.', ['We met mr. brown at the park.', 'we met Mr. Brown at the park.']], ['Can Leo come over today?', ['can Leo come over today?', 'Can leo come over today?']], ['I think Kim is funny.', ['i think Kim is funny.', 'I think kim is funny.']]];
            const [a, w] = U.pick(bank);
            return U.mc('Which sentence uses capital letters correctly?', a, w, { hint: 'Check the first word, names, and the word I.', why: 'Sentences, names, and the word I start with capital letters.' });
          },
          () => U.tap('Tap the words that need a capital letter.', U.pick(['[my] friend [jake] has a dog.', '[yesterday] [i] saw a rainbow.', '[mom] and [i] baked cookies.', '[can] [zoe] come to my party?', '[we] played with [ben] at recess.', '[the] cat chased [i]?'].slice(0, 5)), { hint: 'Look at the first word, any names, and the word "i".' }),
        ]),
      },
      {
        title: 'Holidays, places, and products', std: 'L.2.2a', desc: 'Thanksgiving, Grand Canyon, Cheerios.',
        gen: () => U.mix(8, [
          () => {
            const bank = [['We visited the Grand Canyon on Thanksgiving.', ['We visited the grand canyon on thanksgiving.', 'We visited the Grand canyon on Thanksgiving.']], ['I ate Cheerios on New Year\'s Day.', ['I ate cheerios on new year\'s day.', 'I ate Cheerios on new Year\'s day.']], ['My uncle lives near the Mississippi River.', ['My uncle lives near the mississippi river.', 'My Uncle lives near the Mississippi river.']], ['We sang songs on the Fourth of July.', ['We sang songs on the fourth of july.', 'We sang Songs on the Fourth of July.']], ['Dad drives a Honda to Texas.', ['Dad drives a honda to texas.', 'dad drives a Honda to Texas.']]];
            const [a, w] = U.pick(bank);
            return U.mc('Which sentence is written correctly?', a, w, { hint: 'Holidays, product names, and names of places start with capital letters.', why: 'Holidays, product names, and place names are capitalized.' });
          },
          () => U.tap('Tap the words that need a capital letter.', U.pick(['We go to [disney] [world] every [june].', 'On [halloween] we visited [lake] [tahoe].', 'I had [lego] bricks for [christmas].', 'We drove across [ohio] on [labor] [day].', 'Our family flew to [mexico] for [easter].']), { hint: 'Look for holidays, months, places, and brand names.' }),
          () => U.sort('Which words need a capital letter?', ['Capital', 'No capital'], [...U.sample(['thanksgiving', 'florida', 'monday', 'cheerios', 'april', 'paris'], 3).map((w) => ({ w, b: 0 })), ...U.sample(['holiday', 'state', 'day', 'cereal', 'month', 'city'], 3).map((w) => ({ w, b: 1 }))]),
        ]),
      },
      {
        title: 'Titles, letters, and addresses', std: 'L.3.2a · L.3.2b', desc: 'Book titles, greetings, and places.',
        gen: () => U.mix(8, [
          () => {
            const bank = [['My favorite book is The Cat in the Hat.', ['My favorite book is the cat in the hat.', 'My favorite book is The Cat In The Hat.']], ['We read Charlotte\'s Web in class.', ['We read charlotte\'s web in class.', 'We read Charlotte\'s web in class.']], ['Did you see Finding Nemo?', ['Did you see finding nemo?', 'Did you see Finding nemo?']]];
            const [a, w] = U.pick(bank);
            return U.mc('Which title is capitalized correctly?', a, w, { hint: 'Capitalize the first word and important words in a title. Small words like "the", "in", "of" stay lowercase unless they are first.', why: 'Titles capitalize the first and important words.' });
          },
          () => {
            const bank = [['Dear Aunt Rosa,', ['dear aunt rosa,', 'Dear aunt Rosa,']], ['Your friend,', ['your Friend,', 'Your Friend,']], ['Austin, Texas', ['austin, texas', 'Austin, texas']], ['Love,', ['love,', 'LOVE,']], ['Dear Coach Kim,', ['dear coach kim,', 'Dear coach Kim,']]];
            const [a, w] = U.pick(bank);
            return U.mc('Which part of a letter is written correctly?', a, w, { hint: 'Greetings and closings start with a capital letter. Names and places are capitalized too.', why: `"${a}" is correct.` });
          },
          () => U.tap('Tap the words that need a capital letter.', U.pick(['We read [the] [very] [hungry] [caterpillar] today.', 'Our class wrote to [principal] [jones] in [dallas].', 'She sang [twinkle], [twinkle], [little] [star].', 'In [march] we visited [san] [diego], [california].']), { hint: 'Titles, names, months, and places need capitals.' }),
        ]),
      },
    ],
  };

  const punct = {
    id: 'punctuation', name: 'Punctuation', icon: '❗',
    levels: [
      {
        title: 'End marks . ? !', std: 'L.2.2', desc: 'Every sentence needs an end mark.',
        gen: () => U.fromBank(8, [['Where is my hat', '?'], ['I like pizza', '.'], ['Watch out', '!'], ['Can you help me', '?'], ['The sky is blue', '.'], ['Wow, that was amazing', '!'], ['What time is it', '?'], ['We went to the zoo', '.'], ['Look at that huge wave', '!'], ['Do you like dogs', '?'], ['My sister is six', '.'], ['Hooray, we won', '!']],
          ([s, a]) => U.mcFixed(`Which end mark goes here?  "${s}__"`, a, ['.', '?', '!'], { hint: '. tells something. ? asks something. ! shows strong feeling.', why: a === '?' ? 'It asks a question.' : a === '!' ? 'It shows strong feeling.' : 'It tells something.' })),
      },
      {
        title: 'Apostrophes and letter commas', std: 'L.2.2b · L.2.2c', desc: "don't, Sam's, Dear Mom,",
        gen: () => U.mix(8, [
          () => {
            const bank = [['do not', "don't"], ['can not', "can't"], ['I am', "I'm"], ['it is', "it's"], ['we are', "we're"], ['they are', "they're"], ['you will', "you'll"], ['is not', "isn't"], ['did not', "didn't"], ['let us', "let's"], ['she is', "she's"], ['I will', "I'll"]];
            const [l, c] = U.pick(bank);
            return U.mc(`Which contraction means "${l}"?`, c, bank.map((x) => x[1]).concat([c.replace("'", ''), c.replace("'", '').replace(/(.)$/, "'$1")]), { hint: 'An apostrophe takes the place of missing letters.', why: `${l} → ${c}` });
          },
          () => {
            const bank = [["the dog's bone", ['the dogs bone', "the dog's's bone"]], ["Mia's backpack", ['Mias backpack', "Mia,s backpack"]], ["the teacher's desk", ['the teachers desk', "the teacher's' desk"]], ["Dad's car", ['Dads car', "Dad'z car"]]];
            const [a, w] = U.pick(bank);
            return U.mc('Which shows that something belongs to someone?', a, w, { hint: "Add 's to show who owns it.", why: `"${a}" uses 's to show ownership.` });
          },
          () => {
            const bank = [['Dear Grandma,', ['Dear Grandma', 'Dear, Grandma']], ['Love,', ['Love', 'Lo,ve']], ['Your friend,', ['Your friend', 'Your, friend']], ['Dear Mr. Park,', ['Dear Mr. Park', 'Dear, Mr. Park']], ['Sincerely,', ['Sincerely', 'Sincerely.']]];
            const [a, w] = U.pick(bank);
            return U.mc('Which is written correctly for a letter?', a, w, { hint: 'Put a comma after the greeting and the closing of a letter.', why: 'Greetings and closings end with a comma.' });
          },
        ]),
      },
      {
        title: 'Quotation marks & commas in a series', std: 'L.3.2c · L.3.2d', desc: 'Dialogue and lists.',
        gen: () => U.mix(8, [
          () => {
            const bank = [['"Let\'s go outside," said Mom.', ['"Let\'s go outside, said Mom."', 'Let\'s go outside," said Mom.']], ['Ben asked, "Can I have a turn?"', ['Ben asked, "Can I have a turn"?', 'Ben asked "Can I have a turn?']], ['"I found a frog!" yelled Ana.', ['"I found a frog! yelled Ana."', 'I found a frog!" yelled Ana.']], ['Dad said, "Time for bed."', ['Dad said, Time for bed.', '"Dad said, Time for bed."']]];
            const [a, w] = U.pick(bank);
            return U.mc('Which sentence uses quotation marks correctly?', a, w, { hint: 'Quotation marks go around the exact words someone says.', why: 'Only the spoken words are inside the quotation marks.' });
          },
          () => {
            const bank = [['I packed apples, grapes, and crackers.', ['I packed apples grapes and crackers.', 'I packed, apples, grapes, and crackers.']], ['We saw lions, tigers, and bears.', ['We saw lions tigers, and bears.', 'We saw, lions tigers and bears.']], ['She likes red, blue, and green.', ['She likes red blue and green.', 'She, likes red, blue and green.']]];
            const [a, w] = U.pick(bank);
            return U.mc('Which sentence uses commas correctly?', a, w, { hint: 'Use commas to separate three or more things in a list.', why: 'Commas go between items in a list.' });
          },
          () => {
            const bank = [['We live at 12 Oak Street, Denver, Colorado.', ['We live at 12 Oak Street Denver Colorado.', 'We live at, 12 Oak Street Denver, Colorado.']], ['The party is on May 5, 2027.', ['The party is on May, 5 2027.', 'The party is on May 5 2027.']]];
            const [a, w] = U.pick(bank);
            return U.mc('Which is punctuated correctly?', a, w, { hint: 'Put a comma between a city and state, and between the day and year.', why: `"${a}" has the commas in the right places.` });
          },
        ]),
      },
    ],
  };

  const sentences = {
    id: 'sentences', name: 'Sentences', icon: '🧱',
    levels: [
      {
        title: 'Complete sentences & kinds', std: 'L.2.1', desc: 'Telling, asking, exclaiming, commanding.',
        gen: () => U.mix(8, [
          () => {
            const full = ['The cat sat on the mat.', 'We played tag at recess.', 'My brother likes trucks.', 'Birds fly south in fall.', 'The sun is hot.'];
            const frag = ['The big red truck.', 'Ran to the store.', 'After lunch today.', 'My friend and I.', 'Under the bed.'];
            return U.mc('Which one is a complete sentence?', U.pick(full), frag, { hint: 'A complete sentence tells WHO or WHAT and what they DO or ARE.', why: 'It has a naming part and an action part.' });
          },
          () => {
            const bank = [['Please shut the door.', 'Command'], ['What is your name?', 'Question'], ['I have a red bike.', 'Statement'], ['That is so cool!', 'Exclamation'], ['Sit down, please.', 'Command'], ['Where do owls live?', 'Question'], ['Dogs can swim.', 'Statement'], ['We won the game!', 'Exclamation']];
            const [s, a] = U.pick(bank);
            return U.mcFixed(`What kind of sentence is this?  "${s}"`, a, ['Statement', 'Question', 'Exclamation', 'Command'], { hint: 'Statement tells. Question asks. Exclamation shows strong feeling. Command tells someone to do something.', why: `"${s}" is a ${a.toLowerCase()}.` });
          },
          () => U.sort('Sort: complete sentence or not?', ['Complete sentence', 'Not complete'], [...U.sample(['The frog jumped.', 'I love books.', 'Mom drove us home.', 'The baby giggled.'], 3).map((w) => ({ w, b: 0 })), ...U.sample(['In the yard.', 'Jumped high.', 'A happy puppy.', 'Before school.'], 3).map((w) => ({ w, b: 1 }))]),
        ]),
      },
      {
        title: 'Compound sentences', std: 'L.2.1f', desc: 'Join two ideas with and, but, or, so.',
        gen: () => U.mix(8, [
          () => {
            const bank = [['I wanted to play outside, ___ it was raining.', 'but'], ['We can read a book, ___ we can play a game.', 'or'], ['It was cold, ___ I wore a coat.', 'so'], ['Mia likes to draw, ___ she likes to paint.', 'and'], ['The dog was hungry, ___ I fed him.', 'so'], ['I studied hard, ___ the test was still tricky.', 'but'], ['Do you want milk, ___ do you want juice?', 'or'], ['Sam ran fast, ___ he won the race.', 'and']];
            const [s, a] = U.pick(bank);
            return U.mcFixed(`Choose the best joining word: ${s}`, a, ['and', 'but', 'or', 'so'], { hint: 'and = adds, but = different, or = choice, so = because of that.', why: `"${a}" makes the best sense.` });
          },
          () => {
            const bank = [['The sun came out.', 'We went to the park.', 'The sun came out, so we went to the park.', ['The sun came out so, we went to the park.', 'The sun came out, but we went to the park.']], ['I like cats.', 'My sister likes dogs.', 'I like cats, but my sister likes dogs.', ['I like cats, so my sister likes dogs.', 'I like cats but, my sister likes dogs.']], ['We can swim.', 'We can hike.', 'We can swim, or we can hike.', ['We can swim, but or we can hike.', 'We can swim or, we can hike.']]];
            const [a1, a2, a, w] = U.pick(bank);
            return U.mc(`Which sentence best joins these two? "${a1}" "${a2}"`, a, w, { hint: 'Put a comma before the joining word.', why: `"${a}" uses a comma and the right joining word.` });
          },
        ]),
      },
      {
        title: 'Subject-verb agreement & complex sentences', std: 'L.3.1f · L.3.1h · L.3.1i', desc: 'The dog barks. The dogs bark.',
        gen: () => U.mix(8, [
          () => {
            const bank = [['The dogs ___ at night.', 'bark', 'barks'], ['My sister ___ to school.', 'walks', 'walk'], ['The birds ___ in the tree.', 'sing', 'sings'], ['He ___ his lunch every day.', 'packs', 'pack'], ['The children ___ on the swings.', 'play', 'plays'], ['A bee ___ from flower to flower.', 'flies', 'fly'], ['They ___ pizza on Fridays.', 'eat', 'eats'], ['The baby ___ a lot.', 'smiles', 'smile']];
            const [s, a, w] = U.pick(bank);
            return U.mc(`Choose the verb that agrees: ${s}`, a, [w], { hint: 'One person or thing: the verb usually ends in -s. More than one: no -s.', why: `"${a}" agrees with the subject.` }, 1);
          },
          () => {
            const bank = [['We stayed inside ___ it was raining.', 'because', ['but', 'or']], ['I brush my teeth ___ I go to bed.', 'before', ['because', 'or']], ['___ the bell rang, we lined up.', 'When', ['But', 'Or']], ['We ate cake ___ we sang "Happy Birthday."', 'after', ['or', 'so']], ['I will help you ___ you help me.', 'if', ['but', 'or']]];
            const [s, a, w] = U.pick(bank);
            return U.mc(`Choose the best word: ${s}`, a, w, { hint: 'Words like because, when, after, before, and if connect two ideas.', why: `"${a}" makes the sentence make sense.` });
          },
          () => {
            const bank = ['The cats sleep.', 'A frog hops.', 'The girls dance.', 'My dad cooks.', 'The trees grow.', 'Our teacher reads.'];
            const wrong = ['The cats sleeps.', 'A frog hop.', 'The girls dances.', 'My dad cook.', 'The trees grows.', 'Our teacher read every day yesterday.'];
            return U.sort('Sort: does the verb agree?', ['Correct', 'Needs fixing'], [...U.sample(bank, 3).map((w) => ({ w, b: 0 })), ...U.sample(wrong.slice(0, 5), 3).map((w) => ({ w, b: 1 }))]);
          },
        ]),
      },
    ],
  };

  addSubject({
    id: 'grammar', name: 'Grammar', blurb: 'Nouns, verbs, capitals, and punctuation', color: 'grammar', icon: '✏️',
    skills: [nouns, plurals, verbs, adj, pronouns, caps, punct, sentences],
  });
})();

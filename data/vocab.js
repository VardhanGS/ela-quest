// VOCABULARY — Grade 2 L.2.4/L.2.5, Grade 3 L.3.4/L.3.5.
(function () {
  // w word · d meaning · s sentence · syn synonym · ant antonym · g meaning group (synonyms share one; used to avoid
  // two right answers) · og group of the opposite · gr grade
  const W = [
    ['brave', 'not afraid to do something hard', 'The brave firefighter ran toward the smoke.', 'courageous', 'afraid', 'courage', 'fear', 2],
    ['enormous', 'very, very big', 'The enormous whale was longer than a bus.', 'huge', 'tiny', 'big', 'small', 2],
    ['tiny', 'very small', 'The tiny ant carried a crumb.', 'little', 'huge', 'small', 'big', 2],
    ['gentle', 'soft and careful', 'Be gentle when you pet the kitten.', 'soft', 'rough', 'gentle', 'rough', 2],
    ['curious', 'wanting to know or learn about something', 'The curious puppy sniffed the new box.', 'interested', 'bored', 'interest', 'bored', 2],
    ['delicious', 'tastes very good', 'The warm apple pie was delicious.', 'tasty', 'yucky', 'tasty', 'yucky', 2],
    ['shout', 'to say something very loudly', 'You don\'t need to shout. I can hear you.', 'yell', 'whisper', 'loud', 'quiet', 2],
    ['whisper', 'to speak very quietly', 'Please whisper in the library.', 'murmur', 'shout', 'quiet', 'loud', 2],
    ['glad', 'happy about something', 'I am glad you came to my party.', 'happy', 'sad', 'happy', 'sad', 2],
    ['quick', 'fast', 'The quick rabbit hopped away.', 'fast', 'slow', 'fast', 'slow', 2],
    ['noisy', 'making a lot of sound', 'The noisy crowd cheered for the team.', 'loud', 'quiet', 'loud', 'quiet', 2],
    ['begin', 'to start', 'We will begin the game after lunch.', 'start', 'finish', 'start', 'end', 2],
    ['neat', 'clean and tidy', 'Her desk is always neat.', 'tidy', 'messy', 'tidy', 'messy', 2],
    ['grin', 'a big smile', 'He had a big grin after he won.', 'smile', 'frown', 'happy', 'sad', 2],
    ['damp', 'a little wet', 'My socks were damp from the grass.', 'moist', 'dry', 'wet', 'dry', 2],
    ['scared', 'afraid', 'The kitten was scared of the thunder.', 'afraid', 'brave', 'fear', 'courage', 2],
    ['chilly', 'a little cold', 'It was chilly, so I wore a jacket.', 'cool', 'warm', 'cold', 'hot', 2],
    ['gather', 'to bring things together in one place', 'Let\'s gather the leaves into a pile.', 'collect', 'scatter', 'collect', 'scatter', 2],
    ['repair', 'to fix something that is broken', 'Dad will repair my bike.', 'fix', 'break', 'fix', 'break', 2],
    ['journey', 'a long trip', 'Their journey across the ocean took a week.', 'trip', null, 'trip', null, 2],
    ['nervous', 'worried about what will happen', 'I felt nervous before my spelling bee.', 'worried', 'calm', 'fear', 'calm', 2],
    ['polite', 'using good manners', 'It is polite to say thank you.', 'well-mannered', 'rude', 'manners', 'rude', 2],
    ['exhausted', 'very, very tired', 'After the long hike, we were exhausted.', 'worn out', 'energetic', 'tired', 'energy', 3],
    ['cautious', 'careful to stay safe', 'The cautious cat stepped slowly onto the ice.', 'careful', 'careless', 'careful', 'careless', 3],
    ['observe', 'to watch carefully', 'We observe the caterpillar every day.', 'watch', 'ignore', 'look', 'ignore', 3],
    ['fragile', 'easy to break', 'Wrap the fragile glass in paper.', 'delicate', 'sturdy', 'weak', 'strong', 3],
    ['sturdy', 'strong and hard to break', 'We built a sturdy fort out of logs.', 'strong', 'fragile', 'strong', 'weak', 3],
    ['ancient', 'very, very old', 'We saw ancient pots at the museum.', 'old', 'modern', 'old', 'new', 3],
    ['timid', 'shy and easily frightened', 'The timid deer hid behind a tree.', 'shy', 'bold', 'fear', 'courage', 3],
    ['generous', 'happy to share and give', 'My generous neighbor shares her tomatoes.', 'giving', 'selfish', 'giving', 'selfish', 3],
    ['furious', 'very angry', 'He was furious when his tower got knocked down.', 'angry', 'calm', 'anger', 'calm', 3],
    ['vanish', 'to disappear suddenly', 'The magician made the coin vanish.', 'disappear', 'appear', 'disappear', 'appear', 3],
    ['rapid', 'very fast', 'The rapid river rushed over the rocks.', 'swift', 'slow', 'fast', 'slow', 3],
    ['predict', 'to say what you think will happen', 'I predict it will rain today.', 'guess', null, 'guess', null, 3],
    ['investigate', 'to look closely to find out what happened', 'The detective will investigate the missing cookies.', 'examine', null, 'look', null, 3],
    ['accurate', 'correct, with no mistakes', 'Her measurement was accurate.', 'correct', 'wrong', 'correct', 'wrong', 3],
    ['eager', 'excited and ready to do something', 'Maya was eager to open her gift.', 'excited', 'unwilling', 'interest', 'unwilling', 3],
    ['frigid', 'very, very cold', 'The frigid wind made our noses red.', 'freezing', 'hot', 'cold', 'hot', 3],
    ['ordinary', 'normal, not special', 'It was just an ordinary Tuesday.', 'usual', 'special', 'usual', 'special', 3],
    ['brilliant', 'very bright, or very smart', 'The brilliant sun made us squint.', 'bright', 'dim', 'bright', 'dim', 3],
    ['plentiful', 'more than enough', 'Apples are plentiful in the fall.', 'abundant', 'scarce', 'many', 'few', 3],
    ['scarce', 'hard to find; not enough', 'Water is scarce in the desert.', 'rare', 'plentiful', 'few', 'many', 3],
    ['grateful', 'thankful', 'I am grateful for my friends.', 'thankful', 'ungrateful', 'thanks', 'unthankful', 3],
    ['hesitate', 'to stop for a moment because you are unsure', 'I hesitate before I jump into the cold pool.', 'pause', null, 'pause', null, 3],
  ].map(([w, d, s, syn, ant, g, og, gr]) => ({ w, d, s, syn, ant, g, og, gr }));

  const G2 = W.filter((x) => x.gr === 2), G3 = W.filter((x) => x.gr === 3);
  const blank = (o) => o.s.replace(new RegExp(`\\b${o.w}\\b`, 'i'), '___');
  const others = (o, pool, field = 'w', avoid = [o.g]) => pool.filter((x) => x !== o && !avoid.includes(x.g)).map((x) => x[field]);

  const meaning = (pool) => () => { const o = U.pick(pool); return U.mc(`What does "${o.w}" mean?\n"${o.s}"`, o.d, others(o, W, 'd'), { why: `"${o.w}" means ${o.d}.`, hint: 'Read the sentence. What would make sense?' }); };
  const fill = (pool) => () => { const o = U.pick(pool); return U.mc(`Choose the best word: ${blank(o)}`, o.w, others(o, pool), { why: `"${o.w}" means ${o.d}.`, hint: 'Try each word in the blank. Which one makes sense?' }); };
  const wordFor = (pool) => () => { const o = U.pick(pool); return U.mc(`Which word means "${o.d}"?`, o.w, others(o, pool), { why: `"${o.w}" means ${o.d}.` }); };
  const synQ = (pool) => () => { const o = U.pick(pool); return U.mc(`Which word means the SAME as "${o.w}"?`, o.syn, [...others(o, W, 'syn', [o.g]), ...(o.ant ? [o.ant] : [])], { why: `"${o.w}" and "${o.syn}" are synonyms. They mean almost the same thing.`, hint: 'Synonyms are words that mean the same thing.' }); };
  const antQ = (pool) => () => { const o = U.pick(pool.filter((x) => x.ant)); return U.mc(`Which word means the OPPOSITE of "${o.w}"?`, o.ant, [o.syn, ...others(o, W, 'w', [o.g, o.og])], { why: `"${o.w}" and "${o.ant}" are antonyms. They mean opposite things.`, hint: 'Antonyms are words that mean the opposite.' }); };
  const synSort = (pool) => () => {
    const pick = U.sample(pool.filter((x) => x.ant), 6);
    const items = [...pick.slice(0, 3).map((o) => ({ w: `${o.w} – ${o.syn}`, b: 0 })), ...pick.slice(3).map((o) => ({ w: `${o.w} – ${o.ant}`, b: 1 }))];
    return U.sort('Sort the word pairs: do they mean the same, or the opposite?', ['Synonyms (same)', 'Antonyms (opposite)'], items, { hint: 'Read each pair. Do the two words mean the same thing?' });
  };
  const notSyn = (pool) => () => {
    const o = U.pick(pool.filter((x) => x.ant));
    const same = [o.syn, ...W.filter((x) => x.g === o.g && x !== o).map((x) => x.w)];
    return U.mc(`Which word does NOT mean the same as "${o.w}"?`, o.ant, same, { why: `"${o.ant}" is the opposite of "${o.w}". The others mean about the same.` }, 3);
  };

  const SHADES = [
    [['whisper', 'talk', 'shout'], ['walk', 'jog', 'sprint'], ['cool', 'cold', 'freezing'], ['warm', 'hot', 'boiling'], ['drizzle', 'rain', 'downpour'], ['good', 'great', 'amazing']],
    [['nibble', 'eat', 'gobble'], ['like', 'love', 'adore'], ['toss', 'throw', 'hurl'], ['glad', 'happy', 'thrilled'], ['sip', 'drink', 'gulp'], ['big', 'huge', 'enormous']],
    [['breeze', 'wind', 'gale'], ['damp', 'wet', 'soaked'], ['chuckle', 'laugh', 'roar'], ['stroll', 'walk', 'dash'], ['annoyed', 'angry', 'furious'], ['uneasy', 'scared', 'terrified'], ['chilly', 'cold', 'frigid']],
  ];
  const shadeOrder = (sets, label) => () => U.order(`Put the words in order from ${label}.`, U.pick(sets), { hint: 'Which word is the smallest or softest? Start there.' });
  const strongest = (sets) => () => { const s = U.pick(sets); return U.mc(`Which word is the STRONGEST? (${s.join(', ')})`, s[2], s.slice(0, 2), { why: `${s.join(' → ')}: "${s[2]}" is the strongest.` }, 2); };

  const MULTI = [
    [['The [bat] flew out of the cave at night.', 'an animal that flies at night', ['a stick for hitting a ball', 'a kind of hat']], ['I hit the ball with my [bat].', 'a stick for hitting a ball', ['an animal that flies at night', 'a kind of bird']], ['Mom wears a gold [ring].', 'jewelry you wear on a finger', ['the sound a bell makes', 'a circle drawn on paper']], ['I heard the bell [ring].', 'to make a bell sound', ['jewelry you wear on a finger', 'to run in a circle']], ['The leaves change color in the [fall].', 'the season after summer', ['to drop down', 'a waterfall']], ['Be careful not to [fall] off the swing.', 'to drop down', ['the season after summer', 'to fly up']], ['We played tag at the [park].', 'a place with grass and swings', ['to stop a car and leave it', 'a kind of game']], ['Dad will [park] the car.', 'to stop a car and leave it', ['a place with grass and swings', 'to wash something']]],
    [['The [duck] swam across the pond.', 'a bird that says quack', ['to bend down quickly', 'a kind of fish']], ['[Duck] so the ball does not hit you!', 'to bend down quickly', ['a bird that says quack', 'to run fast']], ['A big [wave] crashed on the beach.', 'moving water in the ocean', ['to move your hand hello', 'a kind of shell']], ['[Wave] goodbye to Grandma.', 'to move your hand to say hello or goodbye', ['moving water in the ocean', 'to jump up and down']], ['The elephant lifted water with its [trunk].', "an elephant's long nose", ['the thick stem of a tree', 'a big box for storage']], ['We put our bags in the car [trunk].', 'a space in a car for storing things', ["an elephant's long nose", 'the thick stem of a tree']], ['I wrote a [letter] to my cousin.', 'a note you mail to someone', ['a sign like A or B', 'a kind of stamp']], ['A is the first [letter] of the alphabet.', 'a sign like A, B, or C', ['a note you mail to someone', 'a number']]],
    [['The [pitcher] threw a fast ball.', 'the baseball player who throws to the batter', ['a jug for pouring drinks', 'a kind of picture']], ['Pour the lemonade from the [pitcher].', 'a jug for pouring drinks', ['the baseball player who throws the ball', 'a big cup with a straw']], ['Flowers bloom in the [spring].', 'the season after winter', ['a coil of metal that bounces back', 'to jump up suddenly']], ['The toy had a [spring] inside that made it bounce.', 'a coil of metal that bounces back', ['the season after winter', 'a small pond']], ['We rode the Ferris wheel at the [fair].', 'a fun outdoor event with rides and games', ['being just and following the rules', 'light in color']], ['It is not [fair] to cut in line.', 'just and following the rules', ['a fun outdoor event with rides and games', 'very pretty']], ['The sun [rose] over the hills.', 'went up', ['a flower with thorns', 'a pink color']], ['She smelled the red [rose].', 'a flower with thorns', ['went up', 'a kind of tree']], ['Light the candle with a [match].', 'a small stick that makes fire', ['two things that are the same', 'a game between teams']], ['Find the socks that [match].', 'to be the same or go together', ['a small stick that makes fire', 'to throw away']]],
  ];
  const multiQ = (set) => () => {
    const [s, a, w] = U.pick(set);
    const word = s.match(/\[(.+?)\]/)[1];
    return U.mc(`${s.replace(/\[(.+?)\]/, '“$1”')}\n\nWhat does "${word.toLowerCase()}" mean here?`, a, w, { hint: 'This word has more than one meaning. Use the other words in the sentence.', why: `Here "${word.toLowerCase()}" means ${a}.` });
  };
  const multiPick = (set) => () => {
    const [s, a] = U.pick(set);
    const word = s.match(/\[(.+?)\]/)[1].toLowerCase();
    const other = set.filter(([x, b]) => x.match(/\[(.+?)\]/)[1].toLowerCase() === word && b !== a).map(([x]) => x.replace(/[[\]]/g, ''));
    if (!other.length) return null;
    return U.mc(`In which sentence does "${word}" mean ${a}?`, s.replace(/[[\]]/g, ''), other, { why: `In that sentence, "${word}" means ${a}.` }, 1);
  };

  const REAL = [
    [['Which food is crunchy?', 'a carrot', ['soup', 'pudding', 'yogurt']], ['Which food is juicy?', 'an orange', ['a cracker', 'bread', 'a pretzel']], ['Where would you whisper?', 'in a library', ['at a soccer game', 'on a playground', 'at a parade']], ['Which animal is enormous?', 'an elephant', ['a mouse', 'a ladybug', 'a frog']], ['Which would feel damp?', 'a towel after a bath', ['a dry sock', 'a warm blanket', 'a sunny rock']], ['Which place is usually noisy?', 'a busy fair', ['a library', 'a bedroom at night', 'a quiet park']], ['Which one is tiny?', 'a ladybug', ['a horse', 'a bus', 'a tree']], ['What might you do when you are glad?', 'smile and cheer', ['cry', 'frown', 'stomp your feet']]],
    [['Who is being polite?', 'A boy who says "please" and "thank you."', ['A girl who cuts in line.', 'A kid who yells at a friend.']], ['Who is being brave?', 'A girl who tries the high dive even though she is scared.', ['A boy who runs away from a puppy.', 'A kid who hides under the bed.']], ['Who is being gentle?', 'A boy who softly pets a baby bunny.', ['A girl who slams the door.', 'A kid who throws a toy.']], ['Who is curious?', 'A girl who asks lots of questions about stars.', ['A boy who falls asleep in class.', 'A kid who never looks at books.']], ['Who might feel nervous?', 'A boy about to sing in front of the school.', ['A girl eating ice cream at home.', 'A kid watching a movie in bed.']], ['Which job needs someone to repair things?', 'a mechanic who fixes cars', ['a baker who makes bread', 'a singer on a stage']]],
    [['Which object is fragile?', 'an egg', ['a rock', 'a brick', 'a metal pan']], ['Which is sturdy?', 'a brick wall', ['a paper cup', 'a soap bubble', 'a dry leaf']], ['Who is being generous?', 'A girl who shares her lunch with a friend.', ['A boy who keeps all the crayons.', 'A kid who grabs the last cookie.']], ['Who is being cautious?', 'A boy who looks both ways before crossing.', ['A girl who runs into the street.', 'A kid who climbs a tall fence fast.']], ['Which would be frigid?', 'a winter morning in Alaska', ['a summer day at the beach', 'a cup of hot cocoa']], ['Which is ancient?', 'a dinosaur bone', ['a new toy', 'a fresh apple', 'this morning\'s newspaper']], ['When might water be scarce?', 'in a hot, dry desert', ['in the ocean', 'during a rainstorm']], ['Who might be exhausted?', 'a runner who just finished a long race', ['a baby who just woke up', 'a cat after a nap']]],
  ];
  const realQ = (set) => () => { const [q, a, w] = U.pick(set); return U.mc(q, a, w, { why: `"${a}" fits best.`, hint: 'Think about real life. Which one makes the most sense?' }); };

  addSubject({
    id: 'vocab', name: 'Vocabulary', blurb: 'Word meanings, synonyms, antonyms, and shades of meaning', color: 'vocab', icon: '💬',
    skills: [
      { id: 'meanings', name: 'Word Meanings', icon: '📘', levels: [
        { title: 'Know the word', std: 'L.2.4a', desc: 'Match Grade 2 words to what they mean.', gen: () => U.mix(8, [meaning(G2), wordFor(G2)]) },
        { title: 'Use the word', std: 'L.2.4a · L.2.6', desc: 'Pick the word that fits the sentence.', gen: () => U.mix(8, [fill(G2), fill(W), meaning(W)]) },
        { title: 'Grade 3 words', std: 'L.3.4a · L.3.6', desc: 'Harder words like cautious, fragile, and observe.', gen: () => U.mix(8, [meaning(G3), fill(G3), wordFor(G3)]) },
      ] },
      { id: 'synonyms', name: 'Synonyms', icon: '🤝', levels: [
        { title: 'Same meaning', std: 'L.2.5', desc: 'Find words that mean the same thing.', gen: () => U.mix(8, [synQ(G2)]) },
        { title: 'Same or opposite?', std: 'L.2.5', desc: 'Sort synonyms and antonyms.', gen: () => U.mix(8, [synQ(W), synSort(G2)]) },
        { title: 'Grade 3 synonyms', std: 'L.3.5', desc: 'Synonyms for Grade 3 words.', gen: () => U.mix(8, [synQ(G3), notSyn(W)]) },
      ] },
      { id: 'antonyms', name: 'Antonyms', icon: '↔️', levels: [
        { title: 'Opposites', std: 'L.2.5', desc: 'Find words that mean the opposite.', gen: () => U.mix(8, [antQ(G2)]) },
        { title: 'Opposites in sentences', std: 'L.2.5', desc: 'Opposites of words you know.', gen: () => U.mix(8, [antQ(W), synSort(W)]) },
        { title: 'Grade 3 antonyms', std: 'L.3.5', desc: 'Opposites for Grade 3 words.', gen: () => U.mix(8, [antQ(G3)]) },
      ] },
      { id: 'shades', name: 'Shades of Meaning', icon: '🎚️', levels: [
        { title: 'Soft to strong', std: 'L.2.5b', desc: 'Order words like whisper, talk, shout.', gen: () => U.mix(6, [shadeOrder(SHADES[0], 'softest to strongest')]) },
        { title: 'Closely related verbs', std: 'L.2.5b', desc: 'toss, throw, hurl · nibble, eat, gobble.', gen: () => U.mix(6, [shadeOrder(SHADES[1], 'weakest to strongest'), strongest(SHADES[1])]) },
        { title: 'Degrees of certainty', std: 'L.3.5c', desc: 'Grade 3 word sets: breeze, wind, gale.', gen: () => U.mix(6, [shadeOrder(SHADES[2], 'weakest to strongest'), strongest(SHADES[2])]) },
      ] },
      { id: 'multimeaning', name: 'Multiple-Meaning Words', icon: '🦇', levels: [
        { title: 'Two meanings', std: 'L.2.4a', desc: 'bat, ring, fall, park.', gen: () => U.mix(8, [multiQ(MULTI[0]), multiPick(MULTI[0])]) },
        { title: 'More two-meaning words', std: 'L.2.4a', desc: 'duck, wave, trunk, letter.', gen: () => U.mix(8, [multiQ(MULTI[1]), multiPick(MULTI[1])]) },
        { title: 'Grade 3 words', std: 'L.3.4a', desc: 'pitcher, spring, fair, rose, match.', gen: () => U.mix(8, [multiQ(MULTI[2]), multiPick(MULTI[2])]) },
      ] },
      { id: 'reallife', name: 'Words in Real Life', icon: '🌍', levels: [
        { title: 'Describing words', std: 'L.2.5a', desc: 'Which food is crunchy? Where would you whisper?', gen: () => U.fromBank(8, REAL[0], (x) => realQ([x])()) },
        { title: 'People and actions', std: 'L.2.5a', desc: 'Who is being polite, brave, or gentle?', gen: () => U.fromBank(6, REAL[1], (x) => realQ([x])()) },
        { title: 'Grade 3 connections', std: 'L.3.5b', desc: 'Fragile, sturdy, generous, cautious, and more.', gen: () => U.fromBank(8, REAL[2], (x) => realQ([x])()) },
      ] },
    ],
  });
})();

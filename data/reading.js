// READING COMPREHENSION — Grade 2 RL.2/RI.2, Grade 3 RL.3/RI.3
(function () {
  // Each passage: {title, kind, text (paragraphs split by \n\n), qs:[[question, answer, [wrong...], why, skillTag]]}
  const FICTION = [
    [
      {
        title: 'The Lost Mitten', kind: 'Story',
        text: `Mia loved her red mittens. Grandma had knitted them for her birthday.\n\nOne snowy day, Mia went to the park with her dog, Pip. She built a snowman and went down the slide. When it was time to go home, Mia looked at her hands. One red mitten was gone!\n\nMia looked by the snowman. She looked by the swings. She could not find it. Mia felt sad.\n\nThen Pip started to bark. He dug in the snow under the slide. Out came the red mitten! Mia gave Pip a big hug. "You are the best dog ever," she said.`,
        qs: [
          ['Who is the main character in the story?', 'Mia', ['Grandma', 'Pip', 'The snowman'], 'The story is mostly about Mia.', 'Character'],
          ['What did Mia lose?', 'A red mitten', ['Her dog', 'A blue hat', 'Her sled'], 'The story says, "One red mitten was gone!"', 'Key details'],
          ['Where did Pip find the mitten?', 'Under the slide', ['By the swings', 'In the snowman', 'At home'], 'Pip dug in the snow under the slide.', 'Key details'],
          ['How did Mia feel at the end?', 'Happy and thankful', ['Sad', 'Angry', 'Scared'], 'She hugged Pip and called him the best dog ever.', 'Character feelings'],
          ['What happened FIRST?', 'Mia built a snowman.', ['Pip barked.', 'Mia hugged Pip.', 'Mia found the mitten.'], 'Mia built a snowman before she noticed the mitten was gone.', 'Sequence'],
        ],
      },
      {
        title: "Ben's Big Seed", kind: 'Story',
        text: `Ben found a big, striped seed in his lunch box. "I will plant it!" he said.\n\nHe put the seed in a pot of soil. He gave it water every morning. He set it by the sunny window. For many days, nothing happened. Ben was tired of waiting.\n\nThen one day, a tiny green sprout popped up. Ben clapped his hands. Each week, the plant grew taller and taller.\n\nBy the end of summer, it was taller than Ben! A big yellow flower smiled down at him. It was a sunflower.`,
        qs: [
          ['What did Ben find in his lunch box?', 'A seed', ['A flower', 'A pot', 'A bug'], 'Ben found a big, striped seed.', 'Key details'],
          ['What did Ben do to help the seed grow?', 'He watered it and put it in the sun.', ['He put it in the fridge.', 'He gave it to a friend.', 'He threw it outside.'], 'He watered it every morning and set it by a sunny window.', 'Key details'],
          ['How did Ben feel when nothing happened for many days?', 'Tired of waiting', ['Excited', 'Scared', 'Silly'], 'The story says Ben was tired of waiting.', 'Character feelings'],
          ['What did the seed grow into?', 'A sunflower', ['A tree', 'A rose', 'A pumpkin'], 'At the end, it was a sunflower.', 'Key details'],
          ['What is a lesson from this story?', 'Good things can take time.', ['Never plant seeds.', 'Lunch boxes are fun.', 'Flowers are small.'], 'Ben had to be patient before the sunflower grew.', 'Lesson'],
        ],
      },
    ],
    [
      {
        title: 'The Class Pet', kind: 'Story',
        text: `Every Friday, one student took Nibbles the hamster home for the weekend. This Friday, it was Leo's turn. He was so excited that he skipped all the way to the car.\n\nAt home, Leo made a list: give fresh water, feed seeds, clean the cage. On Saturday morning, he did every job on his list. But when he went to check on Nibbles after lunch, the cage door was open. Nibbles was gone!\n\nLeo's heart thumped. He searched under the couch and behind the bookshelf. Then he heard a tiny scratching sound coming from the closet. He tiptoed over and peeked inside his dad's slipper. There was Nibbles, curled up and fast asleep.\n\nLeo gently carried Nibbles back to the cage. This time he checked the latch twice. On Monday, he told his teacher, "Taking care of a pet is a big job, but I did it!"`,
        qs: [
          ['Why did Leo skip to the car on Friday?', 'He was excited to take Nibbles home.', ['He was late for school.', 'He was cold.', 'He lost his shoe.'], 'It was his turn to take the class pet home.', 'Cause & effect'],
          ['Why did Leo make a list?', 'To remember how to take care of Nibbles', ['To go shopping', 'To do his homework', 'To plan a party'], 'His list had jobs like water, seeds, and cleaning the cage.', 'Inference'],
          ['What does "heart thumped" tell you about Leo?', 'He was worried.', ['He was sleepy.', 'He was bored.', 'He was hungry.'], 'A thumping heart means he was scared and worried.', 'Word meaning'],
          ['Where was Nibbles hiding?', "In Dad's slipper", ['Under the couch', 'Behind the bookshelf', 'In the car'], 'Leo found Nibbles asleep in his dad\'s slipper.', 'Key details'],
          ['What did Leo learn?', 'Taking care of a pet is a big job.', ['Hamsters like slippers best.', 'Pets should stay at school.', 'Lists are not helpful.'], 'He told his teacher that caring for a pet is a big job.', 'Lesson'],
        ],
      },
      {
        title: "Rosa's Kite", kind: 'Story',
        text: `Rosa and Grandpa built a kite out of paper, sticks, and string. Rosa painted a bright orange fish on it. "It will swim in the sky," she said.\n\nThey took the kite to the top of a windy hill. Rosa ran as fast as she could. The kite rose up, wobbled, and crashed into the grass. Rosa tried again. Crash! Her cheeks felt hot, and she wanted to give up.\n\n"Every kite needs a little help," said Grandpa. He tied a long ribbon to the bottom. "A tail helps it stay steady."\n\nRosa ran one more time. This time, the kite climbed higher and higher. The orange fish wiggled its ribbon tail across the clouds. Rosa laughed. "I'm glad we didn't quit!"`,
        qs: [
          ['What did Rosa paint on the kite?', 'An orange fish', ['A blue bird', 'A yellow sun', 'A green frog'], 'She painted a bright orange fish.', 'Key details'],
          ['What was the problem in the story?', 'The kite kept crashing.', ['It was raining.', 'Grandpa was lost.', 'Rosa had no string.'], 'The kite wobbled and crashed into the grass.', 'Problem & solution'],
          ['How did they solve the problem?', 'Grandpa added a long tail.', ['They bought a new kite.', 'They went home.', 'Rosa ran slower.'], 'Grandpa tied a ribbon tail to help it stay steady.', 'Problem & solution'],
          ['"Her cheeks felt hot." This shows Rosa felt…', 'Frustrated', ['Proud', 'Calm', 'Sleepy'], 'Hot cheeks and wanting to give up show frustration.', 'Character feelings'],
          ['What is the lesson of the story?', 'Keep trying, even when it is hard.', ['Kites are too hard to fly.', 'Only grandpas can fly kites.', 'Fish can swim in the sky.'], 'Rosa said, "I\'m glad we didn\'t quit!"', 'Lesson'],
        ],
      },
    ],
    [
      {
        title: 'The Quiet Drummer', kind: 'Story',
        text: `Amara hardly ever talked in class. When the teacher called on her, her voice came out as soft as a whisper. But at home, Amara was not quiet at all. She turned buckets upside down and drummed on them with wooden spoons. Boom, tap, ba-boom!\n\nOne day, Mr. Hill announced a school talent show. Amara's best friend, Jada, nudged her. "You should play your drums," she whispered. Amara shook her head. Just thinking about the stage made her hands tremble.\n\nThat night, Amara practiced anyway. She practiced the next night, and the night after that. Jada came over to listen and clapped along to the beat.\n\nOn the night of the show, Amara peeked out at the crowd. Her knees wobbled. Then she spotted Jada in the front row, clapping the same beat they had practiced. Amara took a deep breath and lifted her spoons.\n\nBoom, tap, ba-boom! The beat filled the whole gym. When she finished, the crowd jumped to its feet and cheered. Amara smiled the biggest smile of her life. She had found a way to speak without saying a single word.`,
        qs: [
          ['Which word best describes Amara at the beginning of the story?', 'Shy', ['Bossy', 'Lazy', 'Rude'], 'She hardly ever talked and spoke in a whisper.', 'Character traits'],
          ['What does "tremble" mean in this story?', 'Shake', ['Clap', 'Grow', 'Wave'], 'Her hands trembled because she was nervous, so they shook.', 'Word meaning'],
          ['How did Jada help Amara?', 'She encouraged her and clapped the beat.', ['She played the drums for her.', 'She told Mr. Hill to cancel the show.', 'She gave her new spoons.'], 'Jada suggested the show, listened to practice, and clapped from the front row.', 'Character'],
          ['Why did Amara practice every night?', 'She wanted to be ready, even though she was nervous.', ['Her teacher made her.', 'She wanted to break the buckets.', 'She was bored.'], 'She practiced "anyway," which shows she wanted to try.', 'Inference'],
          ['What does the last sentence mean?', 'Her music let her share who she is.', ['She lost her voice.', 'She was not allowed to talk.', 'The show was silent.'], 'Amara expressed herself through drumming instead of words.', 'Central message'],
        ],
      },
      {
        title: 'The Crow and the Fox', kind: 'Fable',
        text: `A crow found a piece of cheese on a picnic blanket. She grabbed it in her beak and flew to the top branch of a tall oak tree.\n\nA hungry fox trotted by and smelled the cheese. He sat at the bottom of the tree and looked up. "Good morning, lovely Crow!" he called. "What shiny feathers you have! What bright eyes! I bet your singing voice is the most beautiful in the whole forest. Won't you sing just one song for me?"\n\nThe crow puffed out her chest. No one had ever said such nice things about her before. She opened her beak to sing. "Caw! Caw!"\n\nThe cheese tumbled down, and the fox snapped it up in one gulp. "Thank you," he said, licking his lips. "Your voice is fine, but your thinking needs work. Remember this: be careful of someone who praises you only to get something."\n\nThe crow sat on the branch, hungry and wiser.`,
        qs: [
          ['Why did the fox say nice things to the crow?', 'He wanted her cheese.', ['He wanted to be her friend.', 'He loved her singing.', 'He was lost.'], 'The fox was hungry and tricked the crow into dropping the cheese.', 'Character motivation'],
          ['What does "praises" mean?', 'Says nice things about', ['Yells at', 'Runs away from', 'Helps carry'], 'The fox praised the crow by saying her feathers and eyes were beautiful.', 'Word meaning'],
          ['Why did the crow drop the cheese?', 'She opened her beak to sing.', ['The wind blew it.', 'She gave it to the fox.', 'The branch broke.'], 'When she sang "Caw!", the cheese fell.', 'Cause & effect'],
          ['What is the moral of this fable?', "Don't trust someone who flatters you to get something.", ['Always share your food.', 'Crows sing beautifully.', 'Foxes are good friends.'], 'The fox says to be careful of someone who praises you only to get something.', 'Moral'],
          ['What does "hungry and wiser" tell you about the crow at the end?', 'She lost her food but learned a lesson.', ['She found more cheese.', 'She became a fox.', 'She was happy.'], 'She had no cheese, but now she knows not to fall for tricks.', 'Inference'],
        ],
      },
    ],
  ];

  const NONFICTION = [
    [
      {
        title: 'Busy Bees', kind: 'Nonfiction',
        text: `Honeybees are busy insects. They live together in a home called a hive. One hive can have thousands of bees!\n\nWorker bees fly from flower to flower. They drink a sweet juice called nectar. Back at the hive, they turn the nectar into honey. The honey is food for the bees in winter.\n\nBees also carry a yellow powder called pollen. When bees move pollen from flower to flower, it helps plants make seeds and fruit.\n\nBees can even dance! A special waggle dance tells other bees where to find flowers.`,
        qs: [
          ['What is the main topic of this text?', 'Honeybees', ['Flowers', 'Winter', 'Dancing'], 'The whole text is about what honeybees do.', 'Main topic'],
          ['What is a hive?', 'A home where bees live', ['A kind of flower', 'A sweet juice', 'A bee dance'], 'The text says bees live in a home called a hive.', 'Vocabulary'],
          ['What do bees make from nectar?', 'Honey', ['Pollen', 'Seeds', 'Wax paper'], 'They turn nectar into honey.', 'Key details'],
          ['How do bees help plants?', 'They move pollen from flower to flower.', ['They eat the leaves.', 'They water the plants.', 'They dig holes.'], 'Moving pollen helps plants make seeds and fruit.', 'Key details'],
          ['Why do bees do the waggle dance?', 'To tell other bees where flowers are', ['To stay warm', 'To scare birds', 'To make honey'], 'The dance shows other bees where to find flowers.', 'Key details'],
        ],
      },
      {
        title: 'Frogs Grow Up', kind: 'Nonfiction',
        text: `A frog does not start life looking like a frog. It changes as it grows. This is called a life cycle.\n\nFirst, a mother frog lays eggs in the water. The eggs are soft and look like jelly.\n\nNext, tiny tadpoles hatch from the eggs. A tadpole has a long tail and breathes with gills, like a fish.\n\nThen, the tadpole grows legs. Its tail gets shorter and shorter.\n\nLast, it becomes an adult frog. Now it can hop on land and breathe air!`,
        qs: [
          ['What is a life cycle?', 'The ways an animal changes as it grows', ['A kind of bike', 'A frog\'s home', 'A pond'], 'The text says a frog changes as it grows, and this is called a life cycle.', 'Vocabulary'],
          ['What comes out of a frog egg?', 'A tadpole', ['A fish', 'An adult frog', 'A bug'], 'Tadpoles hatch from the eggs.', 'Key details'],
          ['How is a tadpole like a fish?', 'It breathes with gills.', ['It hops on land.', 'It has fur.', 'It lays eggs.'], 'The text says a tadpole breathes with gills, like a fish.', 'Compare'],
          ['What happens to the tadpole\'s tail?', 'It gets shorter.', ['It gets longer.', 'It turns blue.', 'It becomes a leg.'], 'Its tail gets shorter and shorter.', 'Key details'],
          ['Which word tells you this is the last step?', 'Last', ['First', 'Next', 'Then'], '"Last" is a time-order word for the final step.', 'Sequence'],
        ],
      },
    ],
    [
      {
        title: 'Penguins', kind: 'Nonfiction',
        text: `Penguins are birds, but they cannot fly. Instead, their wings work like flippers. Penguins are amazing swimmers. Some can swim faster than you can ride a bike!\n\nMost penguins live in the southern half of the world. Emperor penguins live in Antarctica, one of the coldest places on Earth. They have thick feathers and a layer of fat to stay warm. On very cold days, they huddle together in a big group.\n\nEmperor penguin dads have a special job. After the mom lays an egg, the dad holds it on top of his feet. A warm flap of skin covers the egg like a blanket. The dad keeps the egg warm for about two months while the mom goes to the sea to find food.\n\nPenguins eat fish, squid, and tiny animals called krill. They catch their food underwater.`,
        qs: [
          ['What is the main idea of this text?', 'Penguins are birds with special ways to live and swim.', ['Penguins can fly very high.', 'Antarctica is hot.', 'Fish are fast.'], 'The text explains how penguins swim, stay warm, and care for eggs.', 'Main idea'],
          ['How do emperor penguins stay warm?', 'Thick feathers, fat, and huddling', ['They wear coats.', 'They fly south.', 'They sleep in caves.'], 'The text names feathers, fat, and huddling together.', 'Key details'],
          ['What does "huddle" mean?', 'Crowd close together', ['Swim fast', 'Fly away', 'Dig a hole'], 'They huddle together in a big group to stay warm.', 'Word meaning'],
          ['Where does the emperor dad keep the egg?', 'On top of his feet', ['In a nest in a tree', 'In the water', 'Under a rock'], 'The dad holds the egg on top of his feet.', 'Key details'],
          ['What does the mom do while the dad keeps the egg warm?', 'Goes to the sea to find food', ['Builds a nest', 'Sleeps on the egg', 'Flies away'], 'The mom goes to the sea to find food.', 'Key details'],
        ],
      },
      {
        title: 'How Do Plants Drink?', kind: 'Nonfiction',
        text: `Plants need water to live, but they do not have mouths. So how do they drink?\n\nPlants drink with their roots. Roots grow under the soil. They are covered with tiny hairs that soak up water like a sponge.\n\nNext, the water travels up the stem. The stem has thin tubes inside, kind of like drinking straws. The water moves up these tubes to the leaves.\n\nYou can see this with a simple experiment. Put a stalk of celery in a cup of water with a few drops of food coloring. Wait one day. The colored water will climb up the celery, and the leaves will change color!\n\nThe leaves use the water, sunlight, and air to make food for the plant.`,
        qs: [
          ['What part of a plant soaks up water?', 'The roots', ['The flowers', 'The leaves', 'The seeds'], 'Plants drink with their roots.', 'Key details'],
          ['The author compares stem tubes to…', 'Drinking straws', ['Sponges', 'Mouths', 'Pipes in a sink'], 'The stem has thin tubes "kind of like drinking straws."', 'Compare'],
          ['What is the celery experiment meant to show?', 'Water moves up through the stem.', ['Celery tastes good.', 'Food coloring is pretty.', 'Plants need music.'], 'The colored water climbs up the celery.', 'Author\'s purpose'],
          ['What would happen FIRST in the experiment?', 'Put celery in colored water.', ['The leaves change color.', 'Wait one day.', 'Eat the celery.'], 'You must put the celery in the water before anything else.', 'Sequence'],
          ['What do leaves use to make food?', 'Water, sunlight, and air', ['Only soil', 'Rocks and sand', 'Food coloring'], 'The last sentence lists water, sunlight, and air.', 'Key details'],
        ],
      },
    ],
    [
      {
        title: 'Our Neighbor, the Moon', kind: 'Nonfiction',
        text: `The Moon is Earth's closest neighbor in space. It is about 239,000 miles away. If you could drive a car there, the trip would take about six months!\n\nThe Moon looks bright at night, but it does not make its own light. Instead, it reflects light from the Sun, like a mirror. As the Moon travels around Earth, we see different amounts of its sunny side. These changing shapes are called phases. Sometimes we see a full, round Moon. Other times we see only a thin sliver, called a crescent.\n\nThe Moon's surface is covered in gray dust and rocks. It also has thousands of craters. Craters are round holes made when space rocks crashed into the Moon long ago. There is no wind or rain on the Moon, so the craters stay the same for millions of years.\n\nIn July 1969, astronaut Neil Armstrong became the first person to walk on the Moon. His footprints are probably still there today, because there is no wind to blow them away.`,
        qs: [
          ['Why does the Moon look bright at night?', 'It reflects light from the Sun.', ['It makes its own light.', 'It is on fire.', 'It is covered in lamps.'], 'The text says it reflects light from the Sun, like a mirror.', 'Key details'],
          ['What are phases?', 'The changing shapes of the Moon we see', ['Holes made by space rocks', 'Astronaut footprints', 'Moon dust'], 'The changing shapes are called phases.', 'Vocabulary'],
          ['What caused the craters?', 'Space rocks crashing into the Moon', ['Wind and rain', 'Astronauts digging', 'Earthquakes on Earth'], 'Craters were made when space rocks crashed into the Moon.', 'Cause & effect'],
          ['Why are Neil Armstrong\'s footprints probably still there?', 'There is no wind on the Moon.', ['Someone guards them.', 'He made them very deep.', 'The Moon is made of cement.'], 'There is no wind to blow them away.', 'Cause & effect'],
          ['What is the author\'s main purpose?', 'To inform readers about the Moon', ['To tell a funny story', 'To convince you to buy a telescope', 'To teach you a song'], 'The text gives facts about the Moon.', 'Author\'s purpose'],
        ],
      },
      {
        title: 'Give It a Second Life', kind: 'Nonfiction',
        text: `What happens to a plastic bottle after you finish your drink? If you toss it in the trash, it might sit in a landfill for hundreds of years. But if you recycle it, it can get a second life.\n\nRecycling means turning used things into new things. Paper, cardboard, glass, metal cans, and many plastics can all be recycled. At a recycling center, machines sort these materials. Then they are cleaned, melted or mashed, and made into something new.\n\nYou might be surprised by what recycled things become. Old plastic bottles can be turned into soft fleece jackets. Used paper can become new notebooks or egg cartons. A metal can can be recycled into a brand-new can again and again.\n\nRecycling helps Earth in three big ways. It saves natural resources, like trees and oil. It saves energy. And it keeps trash out of landfills and oceans. Next time you finish a drink, think before you throw it away. Your bottle could become someone's cozy jacket!`,
        qs: [
          ['What does "recycling" mean?', 'Turning used things into new things', ['Riding a bike in circles', 'Throwing things away', 'Buying new things'], 'The text gives this definition in the second paragraph.', 'Vocabulary'],
          ['What can old plastic bottles become?', 'Fleece jackets', ['Glass windows', 'Egg cartons', 'Trees'], 'The text says bottles can be turned into soft fleece jackets.', 'Key details'],
          ['What happens FIRST at a recycling center?', 'Machines sort the materials.', ['The materials are melted.', 'New jackets are sold.', 'The bottles are thrown in the ocean.'], 'Sorting comes before cleaning and melting.', 'Sequence'],
          ['Which is one way recycling helps Earth?', 'It keeps trash out of oceans.', ['It makes more landfills.', 'It uses more oil.', 'It cuts down trees.'], 'The fourth paragraph lists three ways, including keeping trash out of oceans.', 'Key details'],
          ['What does the author want readers to do?', 'Think before throwing things away', ['Buy more bottles', 'Visit a landfill', 'Stop drinking water'], 'The author ends by asking you to think before you throw it away.', 'Author\'s purpose'],
        ],
      },
    ],
  ];

  const passageQs = (p) => p.qs.map(([q, a, w, why, tag]) => U.mc(q, a, w, { why, tag, passage: { title: p.title, kind: p.kind, text: p.text } }));
  const passageRound = (set) => () => passageQs(U.pick(set));

  const stories = {
    id: 'stories', name: 'Story Time', icon: '📖', passage: true,
    levels: [
      { title: 'Short stories', std: 'RL.2.1 · RL.2.3', desc: 'Characters, details, and what happens.', gen: passageRound(FICTION[0]) },
      { title: 'Longer stories', std: 'RL.2.2 · RL.2.5', desc: 'Problem, solution, and lessons.', gen: passageRound(FICTION[1]) },
      { title: 'Stories & fables', std: 'RL.3.2 · RL.3.3 · RL.3.4', desc: 'Character traits, morals, and word meaning.', gen: passageRound(FICTION[2]) },
    ],
  };

  const facts = {
    id: 'facts', name: 'Fact Finders', icon: '🔎', passage: true,
    levels: [
      { title: 'Animal & nature facts', std: 'RI.2.1 · RI.2.2', desc: 'Main topic and key details.', gen: passageRound(NONFICTION[0]) },
      { title: 'Science reads', std: 'RI.2.3 · RI.2.6', desc: 'How things work and why.', gen: passageRound(NONFICTION[1]) },
      { title: 'Big-idea articles', std: 'RI.3.2 · RI.3.3 · RI.3.8', desc: 'Main idea, cause & effect, author\'s purpose.', gen: passageRound(NONFICTION[2]) },
    ],
  };

  const CC = [
    [
      ['The puppy was so [tiny] that it fit in my hand.', 'very small', ['very loud', 'very fast', 'very wet']],
      ['I was [famished], so I ate two sandwiches.', 'very hungry', ['very sleepy', 'very cold', 'very silly']],
      ['The baby is [asleep]. Please be quiet.', 'sleeping', ['crying', 'eating', 'running']],
      ['Sam was [glad] when his friend came over. He smiled all day.', 'happy', ['mad', 'sick', 'shy']],
      ['The rock was too [heavy] for me to lift.', 'hard to pick up because of its weight', ['light as a feather', 'very soft', 'very shiny']],
      ['It was [chilly] outside, so I wore a sweater.', 'a little cold', ['very hot', 'very dark', 'very windy']],
      ['The kitten was [timid] and hid under the bed.', 'shy and afraid', ['brave', 'loud', 'hungry']],
      ['We had to [hurry] or we would miss the bus.', 'go fast', ['go slowly', 'go to sleep', 'stay home']],
      ['The cookie was [enormous]! It was as big as a plate.', 'very big', ['very small', 'very old', 'very sweet']],
      ['After the long hike, my legs felt [weary].', 'tired', ['strong', 'wet', 'happy']],
    ],
    [
      ['The [ancient] castle was built over a thousand years ago.', 'very old', ['brand new', 'very tall', 'very pretty']],
      ['Lily was [furious] when her brother broke her toy. Her face turned red.', 'very angry', ['very happy', 'very sleepy', 'very calm']],
      ['The road was [narrow], so only one car could fit.', 'not wide', ['very long', 'very bumpy', 'very busy']],
      ['Please [assist] me with these heavy boxes.', 'help', ['drop', 'open', 'hide']],
      ['The [delicate] glass ornament broke when it fell.', 'easy to break', ['very strong', 'very heavy', 'very dirty']],
      ['The desert is [arid]. It hardly ever rains there.', 'very dry', ['very wet', 'very green', 'very cold']],
      ['The magician made the rabbit [vanish]. Poof! It was gone.', 'disappear', ['jump', 'grow', 'sing']],
      ['Maya was [eager] to open her presents. She couldn\'t wait!', 'excited and ready', ['bored', 'scared', 'sleepy']],
      ['We [observed] the ants carefully with a magnifying glass.', 'watched', ['stepped on', 'fed', 'painted']],
      ['The kind man [donated] his old coats to people who needed them.', 'gave away', ['threw away', 'sold', 'hid']],
    ],
    [
      ['The dog began to [bark] at the mail truck.', 'make a loud dog sound', ['the outside of a tree', 'a kind of boat', 'a big shout']],
      ['The [bark] on the old oak tree was rough.', 'the outside covering of a tree', ['a dog sound', 'a kind of leaf', 'a branch']],
      ['We sat on the [bank] of the river and fished.', 'the land beside a river', ['a place to keep money', 'a pile of snow', 'a boat']],
      ['Dad put his money in the [bank].', 'a place to keep money', ['the side of a river', 'a piggy toy', 'a store']],
      ['The feather was so [light] that it floated away.', 'not heavy', ['bright', 'a lamp', 'quick']],
      ['Even though the test was [challenging], Leo kept working until he solved every problem.', 'hard', ['easy', 'funny', 'short']],
      ['The hikers were [cautious] near the cliff edge, taking small, careful steps.', 'careful', ['careless', 'loud', 'tired']],
      ['Unlike her [reckless] brother, Zoe always looked both ways before crossing.', 'careless', ['careful', 'kind', 'slow']],
      ['The storm left the town [damaged]; trees were down and windows were broken.', 'harmed or broken', ['clean', 'quiet', 'sunny']],
      ['After practicing every day, she became an [expert] piano player.', 'someone who is very skilled', ['a beginner', 'a teacher', 'a listener']],
    ],
  ];

  const ccQ = ([s, a, w]) => {
    const word = s.match(/\[(.+?)\]/)[1];
    return U.mc(`${s.replace(/\[(.+?)\]/, '“$1”')}\n\nWhat does "${word}" mean?`, a, w, { hint: 'Look at the other words in the sentence for clues.', why: `The clues in the sentence show that "${word}" means ${a}.` });
  };

  const context = {
    id: 'context', name: 'Context Clues', icon: '🕵️',
    levels: [
      { title: 'Word detectives', std: 'L.2.4a', desc: 'Use the sentence to figure out a word.', gen: () => U.fromBank(8, CC[0], ccQ) },
      { title: 'Tricky words', std: 'L.2.4a · L.2.5', desc: 'Harder words with clues nearby.', gen: () => U.fromBank(8, CC[1], ccQ) },
      { title: 'Multiple meanings & contrast', std: 'L.3.4a · L.3.5', desc: 'Same word, different meaning.', gen: () => U.fromBank(8, CC[2], ccQ) },
    ],
  };

  const SEQ = [
    [['Get two slices of bread.', 'Spread peanut butter on one slice.', 'Put the slices together.'], ['Dig a hole.', 'Drop in a seed.', 'Cover it with soil.'], ['Wake up.', 'Eat breakfast.', 'Go to school.'], ['Roll a big snowball.', 'Stack a smaller ball on top.', 'Add a carrot nose.'], ['Put on socks.', 'Put on shoes.', 'Tie the laces.'], ['The egg cracks.', 'A chick pops out.', 'The chick grows into a hen.']],
    [['Mia lost her mitten.', 'She looked by the swings.', 'Pip dug under the slide.', 'Mia hugged Pip.'], ['Ben planted a seed.', 'He watered it every day.', 'A sprout popped up.', 'It grew into a sunflower.'], ['The caterpillar hatched from an egg.', 'It ate lots of leaves.', 'It made a chrysalis.', 'A butterfly came out.'], ['Rosa built a kite.', 'The kite crashed.', 'Grandpa added a tail.', 'The kite flew high.'], ['Wash your hands.', 'Get out a bowl.', 'Mix the batter.', 'Bake the muffins.']],
    [['First, the class voted to start a garden.', 'Next, they cleared the weeds from the lot.', 'Then, they planted tomato seeds.', 'After a few weeks, green vines appeared.', 'Finally, they picked ripe tomatoes for a salad.'], ['To begin, Amara was too shy to talk.', 'Then Jada told her about the talent show.', 'After that, Amara practiced every night.', 'On show night, she spotted Jada in the crowd.', 'In the end, everyone cheered for her.'], ['First, rain falls from clouds.', 'Next, water flows into rivers.', 'Then, rivers carry water to the ocean.', 'After that, the sun heats the water and it rises.', 'Finally, the water forms new clouds.'], ['The crow found some cheese.', 'She flew up into a tree.', 'The fox praised her feathers.', 'The crow opened her beak to sing.', 'The fox ate the cheese.']],
  ];

  const sequence = {
    id: 'sequence', name: 'Sequence It', icon: '🔢',
    levels: [
      { title: 'First, next, last', std: 'RL.2.5 · RI.2.3', desc: 'Put 3 steps in order.', gen: () => U.mix(6, [() => U.order('Tap the steps in the right order.', U.pick(SEQ[0]), { list: true, hint: 'What has to happen before anything else?' }), () => { const s = U.pick(SEQ[0]); return U.mc(`What happens FIRST?`, s[0], s.slice(1), { why: `"${s[0]}" must happen first.` }); }]) },
      { title: 'Story order', std: 'RL.2.5', desc: 'Put 4 events in order.', gen: () => U.mix(6, [() => U.order('Tap the events in the order they happened.', U.pick(SEQ[1]), { list: true, hint: 'Think about the beginning, middle, and end.' }), () => { const s = U.pick(SEQ[1]); return U.mc(`What happens LAST?`, s[3], s.slice(0, 3), { why: `"${s[3]}" happens at the end.` }); }]) },
      { title: 'Time-order words', std: 'RL.3.3 · RI.3.3 · RI.3.8', desc: 'Use first, then, after that, finally.', gen: () => U.mix(6, [() => U.order('Tap the sentences in order. Use the time-order words!', U.pick(SEQ[2]), { list: true, hint: 'Words like First, Then, and Finally are clues.' }), () => U.mc('Which word or phrase tells you something happens at the END?', U.pick(['Finally', 'In the end', 'Last']), ['First', 'To begin', 'Next', 'Then'], { why: 'It signals the final step.' })]) },
    ],
  };

  const MAIN = [
    [
      ['Dogs make great pets. They love to play. They keep you company. They even help keep your home safe.', 'Dogs make great pets.', ['Dogs like to play fetch.', 'Cats are fun.', 'Homes have doors.']],
      ['There are many things to do at the beach. You can build sandcastles. You can swim in the waves. You can look for shells.', 'There are many things to do at the beach.', ['Waves are big.', 'Sandcastles fall down.', 'Shells are pretty.']],
      ['Apples come in many colors. Some are red. Some are green. Some are yellow.', 'Apples come in many colors.', ['Red is a color.', 'Apples grow on trees.', 'I like bananas.']],
      ['Winter can be fun. You can sled down hills. You can build snow forts. You can drink hot cocoa.', 'Winter can be fun.', ['Snow is cold.', 'Cocoa is hot.', 'Summer is the best.']],
    ],
    [
      ['Owls are good night hunters. Their big eyes help them see in the dark. Their soft feathers let them fly without a sound. Their sharp ears can hear a mouse moving under the snow.', 'Owls have body parts that help them hunt at night.', ['Owls have big eyes.', 'Mice live under snow.', 'Feathers are soft.']],
      ['Exercise is good for your body. It makes your heart strong. It helps your muscles grow. It can even help you sleep better at night.', 'Exercise is good for your body.', ['Sleep is important.', 'Hearts pump blood.', 'Muscles can grow.']],
      ['Libraries offer much more than books. You can use computers there. You can join a story time. Some libraries even lend out games and puzzles.', 'Libraries offer much more than books.', ['Computers are fun.', 'Story time is on Tuesday.', 'Books are heavy.']],
      ['Camels are made for the desert. They can go many days without drinking water. Their wide feet do not sink in sand. Long eyelashes keep sand out of their eyes.', 'Camels are built to live in the desert.', ['Camels have long eyelashes.', 'Sand is hot.', 'Deserts are big.']],
    ],
    [
      ['Many people think octopuses are among the smartest animals in the sea. Octopuses can open jars to get food inside. Some have escaped from their tanks at aquariums. Scientists have even seen them use coconut shells as shelters.', 'Octopuses are very smart animals.', ['Octopuses live in aquariums.', 'Coconuts float in the sea.', 'Jars are hard to open.'], 'Octopuses can open jars to get food inside.'],
      ['Being a firefighter is a hard job. Firefighters carry heavy gear that can weigh more than 50 pounds. They must be ready to work at any time, even in the middle of the night. They often go into hot, smoky buildings to save people.', 'Being a firefighter is a hard job.', ['Firefighters drive red trucks.', 'Smoke is dangerous.', 'Night is dark.'], 'They carry heavy gear that can weigh more than 50 pounds.'],
      ['Trees are important to our planet. They make oxygen that people and animals breathe. Their roots hold soil in place so it does not wash away. Many birds and animals live in trees.', 'Trees are important to our planet.', ['Birds build nests.', 'Soil can wash away.', 'Oxygen is a gas.'], 'Their roots hold soil in place.'],
    ],
  ];

  const mainIdea = {
    id: 'mainidea', name: 'Main Idea', icon: '🎯',
    levels: [
      { title: 'What is it mostly about?', std: 'RI.2.2', desc: 'Find the big idea in a short paragraph.', gen: () => U.fromBank(4, MAIN[0], ([p, a, w]) => U.mc('What is the main idea of this paragraph?', a, w, { passage: { title: 'Read the paragraph', kind: 'Paragraph', text: p }, hint: 'Which sentence tells about ALL the other sentences?', why: `All the other sentences tell more about this idea.` })) },
      { title: 'Main idea in your own words', std: 'RI.2.2 · RI.2.6', desc: 'The main idea is not always the first sentence.', gen: () => U.fromBank(4, MAIN[1], ([p, a, w]) => U.mc('Which sentence best tells the main idea?', a, w, { passage: { title: 'Read the paragraph', kind: 'Paragraph', text: p }, hint: 'The main idea is bigger than any one detail.', why: 'This covers every detail in the paragraph.' })) },
      { title: 'Main idea & supporting details', std: 'RI.3.2', desc: 'Find the idea and the proof.', gen: () => U.shuffle(MAIN[2]).flatMap(([p, a, w, detail]) => { const passage = { title: 'Read the paragraph', kind: 'Paragraph', text: p }; return [U.mc('What is the main idea?', a, w, { passage, why: 'The other sentences support this idea.' }), U.mc(`Which detail supports the main idea "${a}"?`, detail, ['Many animals live in the sea.', 'It was a sunny day.', 'Some people like pizza.'], { passage, why: 'This detail gives proof for the main idea.' })]; }) },
    ],
  };

  const thinker = {
    id: 'thinker', name: 'Think Like a Reader', icon: '💭',
    levels: [
      {
        title: 'Fact or opinion?', std: 'RI.2.6', desc: 'A fact can be proven. An opinion is what someone thinks.',
        gen: () => U.mix(6, [
          () => U.sort('Sort: fact or opinion?', ['Fact', 'Opinion'], [...U.sample(['A week has seven days.', 'Dogs have four legs.', 'Ice is frozen water.', 'The sun is a star.', 'Fish live in water.', 'Spiders have eight legs.'], 3).map((w) => ({ w, b: 0 })), ...U.sample(['Pizza is the best food.', 'Cats are cuter than dogs.', 'Math is boring.', 'Blue is the prettiest color.', 'Summer is the best season.', 'Soccer is more fun than tag.'], 3).map((w) => ({ w, b: 1 }))]),
          () => U.mc('Which sentence is an OPINION?', U.pick(['Recess is the best part of the day.', 'Broccoli tastes yucky.', 'Rainbows are beautiful.']), ['A rainbow has many colors.', 'Recess is after lunch.', 'Broccoli is a vegetable.'], { hint: 'Opinion words: best, worst, yucky, beautiful, I think.', why: 'Not everyone would agree, so it is an opinion.' }),
          () => U.mc('Which sentence is a FACT?', U.pick(['Frogs can live on land and in water.', 'Our school has 300 students.', 'Snow is made of ice crystals.']), ['Frogs are gross.', 'School is too long.', 'Snow days are the best.'], { hint: 'A fact can be checked in a book or measured.', why: 'This can be proven true.' }),
        ]),
      },
      {
        title: 'Cause and effect', std: 'RI.2.3 · RL.2.3', desc: 'Why did it happen? What happened because of it?',
        gen: () => U.fromBank(6, [
          ['It rained all day, so the game was canceled.', 'Why was the game canceled?', 'It rained all day.', ['The team was tired.', 'The ball was lost.']],
          ['Jen forgot to water her plant, so it wilted.', 'What happened because Jen forgot to water her plant?', 'It wilted.', ['It grew taller.', 'It got flowers.']],
          ['The ice melted because the sun came out.', 'What caused the ice to melt?', 'The sun came out.', ['It got colder.', 'Someone ate it.']],
          ['Max studied his spelling words every night. He got 100% on his test.', 'Why did Max get 100%?', 'He studied every night.', ['The test was skipped.', 'He guessed.']],
          ['The baby was tired, so she took a long nap.', 'What was the effect of the baby being tired?', 'She took a long nap.', ['She ate lunch.', 'She played outside.']],
          ['A strong wind blew, and the leaves fell off the tree.', 'What made the leaves fall?', 'A strong wind', ['A bird', 'The rain']],
          ['Because Omar shared his crayons, Lily shared her snack.', 'Why did Lily share her snack?', 'Omar shared his crayons.', ['She was not hungry.', 'Her mom told her to.']],
        ], ([p, q, a, w]) => U.mc(q, a, w, { passage: { title: 'Read', kind: 'Sentence', text: p }, hint: 'Clue words: because, so, since.', why: `"${a}" is the ${q.startsWith('Why') || q.includes('caused') || q.includes('made') ? 'cause' : 'effect'}.` })),
      },
      {
        title: "Author's purpose & inference", std: 'RI.3.8 · RL.3.1', desc: 'Why did the author write it? Read between the lines.',
        gen: () => U.mix(6, [
          () => { const [t, a] = U.pick([['A funny story about a pig who wants to be a ballerina', 'To entertain'], ['A page about how volcanoes form', 'To inform'], ['An ad saying "Buy Crunchy Crackers! They\'re the tastiest!"', 'To persuade'], ['A letter asking the principal for a longer recess', 'To persuade'], ['A book of facts about sharks', 'To inform'], ['A poem about a silly dragon', 'To entertain']]); return U.mcFixed(`Why did the author most likely write this?\n"${t}"`, a, ['To persuade', 'To inform', 'To entertain'], { hint: 'Persuade = convince you. Inform = teach facts. Entertain = make you enjoy it.', why: `The author wrote it ${a.toLowerCase()}.` }); },
          () => { const [p, q, a, w] = U.pick([['Jake put on his raincoat and grabbed his umbrella before going outside.', 'What can you tell about the weather?', 'It is probably raining.', ['It is sunny and hot.', 'It is snowing.']], ['Ella yawned, rubbed her eyes, and put her head down on her desk.', 'How does Ella probably feel?', 'Tired', ['Excited', 'Angry']], ['The kitchen smelled sweet. A warm tray sat on the counter, and there was flour on Dad\'s apron.', 'What was Dad probably doing?', 'Baking', ['Painting', 'Sleeping']], ['Ty looked at the empty bowl and the dog licking its lips.', 'What happened to the food in the bowl?', 'The dog ate it.', ['Ty threw it away.', 'It rained in the bowl.']], ['Nia\'s hands shook as she walked onto the stage holding her violin.', 'How does Nia probably feel?', 'Nervous', ['Bored', 'Sleepy']]]); return U.mc(q, a, w, { passage: { title: 'Read', kind: 'Clues', text: p }, hint: 'Use the clues plus what you already know.', why: 'The clues in the text point to this answer.' }); },
        ]),
      },
    ],
  };

  addSubject({
    id: 'reading', name: 'Reading', blurb: 'Stories, facts, and thinking skills', color: 'reading', icon: '📚',
    skills: [stories, facts, context, sequence, mainIdea, thinker],
  });
})();

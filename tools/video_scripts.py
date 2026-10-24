"""Scripts for the ELA Quest video lessons. `text` is the caption; `say` (optional) is what the narrator speaks
when the spoken form needs to differ (letters and sounds read badly by text-to-speech)."""

def B(text, say=None, **kw):
    d = {'text': text, **kw}
    if say: d['say'] = say
    return d

def quiz(q, opts, a, ask, reveal, passage=None, ask_say=None, reveal_say=None):
    return {'type': 'quiz', 'q': q, 'opts': opts, 'a': a, 'passage': passage,
            'beats': [B(ask, ask_say, role='ask'), {'silent': 3.2, 'cap': 'Think about it…', 'role': 'count'}, B(reveal, reveal_say, role='reveal')]}

def outro(sub):
    return {'type': 'outro', 'title': 'Your turn!', 'sub': sub, 'beats': [B('Now it is your turn. ' + sub)]}

VIDEOS = [
    {
        'id': 'welcome', 'title': 'Welcome to ELA Quest', 'subject': 'mix', 'label': 'Getting started',
        'desc': 'A tour of the app: subjects, levels, stars, and the Writing Studio.', 'practice': None,
        'scenes': [
            {'type': 'title', 'emoji': '🦊', 'title': 'Welcome to ELA Quest!', 'sub': 'Reading · Writing · Words', 'beats': [B('Hi, friend! Welcome to E L A Quest.', 'Hi, friend! Welcome to E. L. A. Quest.'), B("Let's learn how it works.")]},
            {'type': 'bullets', 'heading': 'Four subjects to explore', 'items': [('🔤', 'Phonics', 'sounds and spelling patterns'), ('✏️', 'Grammar', 'how sentences work'), ('📚', 'Reading', 'stories and true facts'), ('🖍️', 'Writing', 'sharing your ideas')],
             'beats': [B('There are four subjects to explore.'), B('Phonics helps you sound out and spell words.'), B('Grammar shows how sentences work.'), B('Reading helps you understand stories and facts.'), B('And Writing helps you share your own ideas.')]},
            {'type': 'levels', 'beats': [B('Every skill has three levels.'), B('Level one is Grade 2 Starter.'), B('Level two is Grade 2 Star.'), B('Level three is the Grade 3 Challenge!'), B('Score seventy percent or more to unlock the next level.')]},
            {'type': 'bullets', 'heading': 'How to play', 'items': [('👀', 'Watch the example first'), ('🔊', 'Tap the speaker to hear words'), ('💡', 'Wrong? Read the hint and try again'), ('⭐', 'Earn stars, XP, and badges')],
             'beats': [B('Here is how to play.'), B('Before each quest, watch the example. It shows you what to do.'), B('Tap the speaker button any time to hear the words.'), B("If you get one wrong, that's okay! Read the hint and try again."), B('You earn stars, X P, and badges as you learn.', 'You earn stars, X. P., and badges as you learn.')]},
            {'type': 'boxes', 'boxes': [('1 · Plan', '📝', 'Jot down your ideas.', 'writing'), ('2 · Write', '✏️', 'Use the sentence starters.', 'writing'), ('3 · Check', '✅', 'Fix capitals and end marks.', 'writing'), ('4 · Publish', '📚', 'Put it on your bookshelf!', 'writing')],
             'beats': [B('In the Writing Studio, you write your own stories, letters, and opinions.'), B('First, plan your ideas.'), B('Next, write with help from sentence starters.'), B('Then, check your work.'), B('Last, publish it to your bookshelf!')]},
            outro('Pick a subject and start your quest!'),
        ],
    },
    {
        'id': 'magic-e', 'title': 'Magic E and Vowel Teams', 'subject': 'phonics', 'label': 'Phonics',
        'desc': 'Short vowels, silent e, and vowel teams like ai, ee, and oa.', 'practice': ['phonics', 'vowels', 1],
        'scenes': [
            {'type': 'title', 'emoji': '🪄', 'title': 'Magic E and Vowel Teams', 'sub': 'Phonics · Vowel Sounds', 'beats': [B("Let's learn how vowels change their sounds.")]},
            {'type': 'bullets', 'heading': 'Short vowels', 'layout': 'tiles', 'items': [('🍎', 'a', 'apple'), ('🥚', 'e', 'egg'), ('🧊', 'i', 'igloo'), ('🐙', 'o', 'octopus'), ('☂️', 'u', 'umbrella')],
             'beats': [B('The vowels are a, e, i, o, and u. They can make short, quick sounds.', 'The vowels are A, E, I, O, and U. They can make short, quick sounds.'), B('Short a, like apple.'), B('Short e, like egg.'), B('Short i, like igloo.'), B('Short o, like octopus.'), B('Short u, like umbrella.')]},
            {'type': 'wordmath', 'heading': 'Silent e makes the vowel say its name', 'rows': [('cap', '+', 'e', 'cape', None), ('kit', '+', 'e', 'kite', None), ('hop', '+', 'e', 'hope', None), ('cub', '+', 'e', 'cube', None)],
             'beats': [B('Now watch what a silent e can do.'), B('Cap. Add a silent e, and it becomes cape! The a says its name.'), B('Kit, plus e, makes kite.'), B('Hop, plus e, makes hope.'), B('Cub, plus e, makes cube.')]},
            {'type': 'bullets', 'heading': 'Vowel teams: the first vowel talks', 'items': [('🌧️', 'rain', 'a-i says long a'), ('🌳', 'tree', 'e-e says long e'), ('⛵', 'boat', 'o-a says long o'), ('💡', 'light', 'i-g-h says long i')],
             'beats': [B('When two vowels go walking, the first one does the talking.'), B('In rain, the a says its name.', 'In rain, the A says its name.'), B('In tree, the e says its name.', 'In tree, the E says its name.'), B('In boat, the o says its name.', 'In boat, the O says its name.'), B('And i, g, h says long i, like in light.', 'And the letters I, G, H, say the long I sound, like in light.')]},
            quiz('Which word has a long a sound?', ['cat', 'cake', 'cap'], 'cake', 'Which word has a long a sound? Cat, cake, or cap?', 'Cake! The silent e makes the a say its name.', ask_say='Which word has a long A sound? Cat, cake, or cap?', reveal_say='Cake! The silent E makes the A say its name.'),
            outro('Practice vowel sounds in ELA Quest!'),
        ],
    },
    {
        'id': 'blends', 'title': 'Digraphs and Blends', 'subject': 'phonics', 'label': 'Phonics',
        'desc': 'sh, ch, th, wh, ck, and blends like fl, st, and fr.', 'practice': ['phonics', 'blends', 0],
        'scenes': [
            {'type': 'title', 'emoji': '🐠', 'title': 'Digraphs and Blends', 'sub': 'Phonics · Letters that work together', 'beats': [B('Some letters work together as a team.')]},
            {'type': 'bullets', 'heading': 'Digraphs: two letters, ONE sound', 'layout': 'tiles', 'items': [('🚢', 'sh', 'ship'), ('🍫', 'ch', 'chip'), ('👍', 'th', 'thumb'), ('🐳', 'wh', 'whale'), ('🦆', 'ck', 'duck')],
             'beats': [B('A digraph is two letters that make one new sound.'), B('S and H make the sound at the start of ship.'), B('C and H make the sound at the start of chip.'), B('T and H make the sound at the start of thumb.'), B('W and H make the sound at the start of whale.'), B('C and K make the sound at the end of duck.')]},
            {'type': 'bullets', 'heading': 'Blends: you hear BOTH sounds', 'layout': 'tiles', 'items': [('🚩', 'fl', 'flag'), ('⭐', 'st', 'star'), ('🐸', 'fr', 'frog'), ('🥁', 'dr', 'drum'), ('✋', 'nd', 'hand')],
             'beats': [B('In a blend, you can hear both letters.'), B('Flag. You hear the f and the l.', 'Flag. You hear the F sound, and the L sound.'), B('Star. You hear the s and the t.', 'Star. You hear the S sound, and the T sound.'), B('Frog starts with f r.', 'Frog starts with F, R.'), B('Drum starts with d r.', 'Drum starts with D, R.'), B('Blends can come at the end too, like n d in hand.', 'Blends can come at the end too, like N, D, in hand.')]},
            quiz('Which letters start the word "ship"?', ['ch', 'sh', 'th'], 'sh', 'Which letters start the word ship?', 'S and H! They make the sound at the start of ship.'),
            quiz('Is "fl" in "flag" a blend or a digraph?', ['blend', 'digraph'], 'blend', 'Is the F L in flag a blend, or a digraph?', 'A blend! You can hear both the f and the l.', ask_say='Is the F, L, in flag a blend, or a digraph?', reveal_say='A blend! You can hear both the F, and the L.'),
            outro('Practice blends and digraphs in ELA Quest!'),
        ],
    },
    {
        'id': 'parts-of-speech', 'title': 'Nouns, Verbs, and Adjectives', 'subject': 'grammar', 'label': 'Grammar',
        'desc': 'Find the naming words, action words, and describing words.', 'practice': ['grammar', 'nouns', 0],
        'scenes': [
            {'type': 'title', 'emoji': '🧱', 'title': 'Nouns, Verbs, and Adjectives', 'sub': 'Grammar · Word jobs', 'beats': [B('Every word in a sentence has a job.')]},
            {'type': 'bullets', 'heading': 'A noun is a person, place, or thing', 'items': [('🧑', 'teacher', 'a person'), ('🏞️', 'park', 'a place'), ('⚽', 'ball', 'a thing')],
             'beats': [B('A noun names a person, a place, or a thing.'), B('Teacher is a person.'), B('Park is a place.'), B('Ball is a thing.')]},
            {'type': 'sentence', 'heading': 'Find the word jobs', 'words': [('The', None), ('fluffy', 'adj'), ('dog', 'noun'), ('runs', 'verb'), ('to', None), ('the', None), ('big', 'adj'), ('park.', 'noun')],
             'beats': [B("Let's look at this sentence."), B('Dog and park are nouns.', hl=['noun']), B('Runs is the verb. A verb is an action word.', hl=['verb']), B('Fluffy and big are adjectives. They describe the nouns.', hl=['adj'])]},
            {'type': 'sort', 'bins': [('Noun', 'noun'), ('Verb', 'verb'), ('Adjective', 'adj')], 'items': [('cat', 0), ('jump', 1), ('happy', 2), ('school', 0), ('sing', 1), ('tall', 2)],
             'beats': [B("Let's sort some words."), B('Cat is a noun.'), B('Jump is a verb.'), B('Happy is an adjective.'), B('School is a noun.'), B('Sing is a verb.'), B('Tall is an adjective.')]},
            quiz('Which word is a verb?', ['apple', 'swim', 'blue'], 'swim', 'Which word is a verb? Apple, swim, or blue?', 'Swim! It is an action you can do.'),
            outro('Practice nouns, verbs, and adjectives!'),
        ],
    },
    {
        'id': 'capitals', 'title': 'Capital Letters and End Marks', 'subject': 'grammar', 'label': 'Grammar',
        'desc': 'When to use capitals, and how to choose . ? or !', 'practice': ['grammar', 'capitals', 0],
        'scenes': [
            {'type': 'title', 'emoji': '🔠', 'title': 'Capital Letters and End Marks', 'sub': 'Grammar · Writing it right', 'beats': [B("Let's learn when to use capital letters and end marks.")]},
            {'type': 'bullets', 'heading': 'Use a capital letter for…', 'items': [('🥇', 'The first word of a sentence', 'The cat sat.'), ('🙋', 'Names of people and pets', 'Maya, Max'), ('👤', 'The word I', 'Mom and I'), ('🗺️', 'Holidays and places', 'Thanksgiving, Texas')],
             'beats': [B('Use a capital letter for these things.'), B('The first word of a sentence.'), B('Names of people and pets.'), B('The word I. All by itself, it is always a capital.'), B('And holidays and places, like Thanksgiving and Texas.')]},
            {'type': 'beforeafter', 'heading': 'Fix it up!', 'pairs': [('my friend jake', 'My friend Jake'), ('jake and i', 'Jake and I'), ('we like pizza', 'We like pizza.')],
             'beats': [B("Let's fix some mistakes."), B('My starts the sentence, and Jake is a name, so both get capitals.'), B('The word I is always a capital.'), B('And every sentence needs an end mark.')]},
            {'type': 'bullets', 'heading': 'Choose the end mark', 'items': [('🔵', '.  period', 'I like pizza.'), ('❓', '?  question mark', 'Do you like pizza?'), ('❗', '!  exclamation mark', 'I love pizza!')],
             'beats': [B('There are three end marks.'), B('A period ends a telling sentence.'), B('A question mark ends an asking sentence.'), B('An exclamation mark shows a strong feeling.')]},
            quiz('Which end mark goes here?  "Where is my hat__"', ['.', '?', '!'], '?', 'Which end mark goes at the end of: Where is my hat?', 'A question mark! The sentence is asking something.'),
            outro('Practice capitals and punctuation!'),
        ],
    },
    {
        'id': 'main-idea', 'title': 'Main Idea and Details', 'subject': 'reading', 'label': 'Reading',
        'desc': 'Find what a text is mostly about, and the details that support it.', 'practice': ['reading', 'mainidea', 0],
        'scenes': [
            {'type': 'title', 'emoji': '🎯', 'title': 'Main Idea and Details', 'sub': 'Reading · The big idea', 'beats': [B('What is a paragraph mostly about? That is the main idea.')]},
            {'type': 'tablelegs', 'main': 'Winter can be fun!', 'details': ['Sledding down hills', 'Building snow forts', 'Drinking hot cocoa'],
             'beats': [B('Think of a table.'), B('The table top is the main idea. Winter can be fun!'), B('The legs are details. They hold up the main idea. Sledding down hills.'), B('Building snow forts.'), B('Drinking hot cocoa.')]},
            {'type': 'bullets', 'heading': 'Ask yourself…', 'items': [('🤔', 'What is it MOSTLY about?'), ('🔗', 'Do ALL the details tell about it?'), ('🐘', 'Is it bigger than one detail?')],
             'beats': [B('To find the main idea, ask yourself three questions.'), B('What is it mostly about?'), B('Do all the details tell about it?'), B('Is it bigger than just one detail?')]},
            quiz('What is the main idea?', ['Dogs make great pets.', 'Dogs like to play.', 'Cats are fun.'], 'Dogs make great pets.', 'Read the paragraph. What is the main idea?', 'Dogs make great pets! All the other sentences tell why.',
                 passage='Dogs make great pets. They love to play. They keep you company. They help keep your home safe.'),
            outro('Practice finding the main idea!'),
        ],
    },
    {
        'id': 'story-elements', 'title': 'Parts of a Story', 'subject': 'reading', 'label': 'Reading',
        'desc': 'Characters, setting, problem, and solution.', 'practice': ['reading', 'stories', 0],
        'scenes': [
            {'type': 'title', 'emoji': '📖', 'title': 'Parts of a Story', 'sub': 'Reading · Story elements', 'beats': [B('Every story is built from the same parts.')]},
            {'type': 'boxes', 'boxes': [('Characters', '🐶', 'Mia and her dog, Pip', 'reading'), ('Setting', '❄️', 'A snowy park', 'grammar'), ('Problem', '😟', 'Mia lost her red mitten.', 'phonics'), ('Solution', '😊', 'Pip found it under the slide!', 'writing')],
             'beats': [B("Let's use the story The Lost Mitten."), B('The characters are who the story is about. Mia and her dog, Pip.'), B('The setting is where it happens. A snowy park.'), B('The problem is what goes wrong. Mia lost her red mitten.'), B('The solution is how it gets fixed. Pip found it under the slide!')]},
            {'type': 'boxes', 'boxes': [('Beginning', '⛄', 'Mia plays in the snow.', 'reading'), ('Middle', '🧤', 'She loses her mitten.', 'reading'), ('End', '🐕', 'Pip finds it!', 'reading')],
             'beats': [B('Stories also have a beginning, a middle, and an end.'), B('Beginning: Mia plays in the snow.'), B('Middle: she loses her mitten.'), B('End: Pip finds it!')]},
            quiz('What is the setting?', ['a windy hill', 'Rosa', 'a kite'], 'a windy hill', 'What is the setting of this sentence?', 'A windy hill! The setting is where the story happens.', passage='Rosa and Grandpa flew a kite on a windy hill.'),
            outro('Read a story in Story Time!'),
        ],
    },
    {
        'id': 'write-story', 'title': 'Write a Story', 'subject': 'writing', 'label': 'Writing',
        'desc': 'Plan a beginning, middle, and end, then add details and linking words.', 'practice': ['writing', 'expand', 0],
        'scenes': [
            {'type': 'title', 'emoji': '🐉', 'title': 'Write a Story', 'sub': 'Writing · Beginning, middle, end', 'beats': [B("Let's write a great story together.")]},
            {'type': 'bullets', 'heading': 'Plan first', 'items': [('🧒', 'Who is in it?'), ('🏡', 'Where does it happen?'), ('💥', 'What is the big event?'), ('🎉', 'How does it end?')],
             'beats': [B('Good writers plan first.'), B('Who is in your story?'), B('Where does it happen?'), B('What is the big event or problem?'), B('And how does it end?')]},
            {'type': 'boxes', 'boxes': [('Beginning', '🐕', 'One day, Lucky barked at a hole in our yard.', 'writing'), ('Middle', '📦', 'Suddenly, we found a shiny box!', 'writing'), ('End', '🧸', 'Inside were my old toys. I was so happy!', 'writing')],
             'beats': [B('Then write a beginning, middle, and end.'), B('Beginning: One day, Lucky barked at a hole in our yard.'), B('Middle: Suddenly, we found a shiny box!'), B('End: Inside were my old toys. I was so happy!')]},
            {'type': 'beforeafter', 'heading': 'Add details', 'pairs': [('The dog barked.', 'The fluffy brown dog barked loudly.'), ('I ate a cookie.', 'I ate a warm, chewy cookie.')],
             'beats': [B('Make your sentences better with describing words.'), B('The dog barked, becomes, the fluffy brown dog barked loudly.'), B('I ate a cookie, becomes, I ate a warm, chewy cookie.')]},
            {'type': 'bullets', 'heading': 'Linking words', 'layout': 'tiles', 'items': [('🥇', 'First', ''), ('➡️', 'Next', ''), ('⚡', 'Suddenly', ''), ('🏁', 'Finally', '')],
             'beats': [B('Linking words help readers follow along.'), B('First.'), B('Next.'), B('Suddenly.'), B('Finally.')]},
            outro('Open the Writing Studio and write a story!'),
        ],
    },
    {
        'id': 'opinion', 'title': 'Opinion Writing with OREO', 'subject': 'writing', 'label': 'Writing',
        'desc': 'Opinion, Reason, Example, Opinion: build a strong opinion paragraph.', 'practice': ['writing', 'paragraph', 1],
        'scenes': [
            {'type': 'title', 'emoji': '🍪', 'title': 'Opinion Writing with OREO', 'sub': 'Writing · Tell what you think and why', 'beats': [B('An opinion tells what you think. Let\'s build one like a cookie!')]},
            {'type': 'oreo', 'layers': [('O', 'Opinion: I think summer is the best season.'), ('R', 'Reason: There is no school.'), ('E', 'Example: I swim at the pool every day.'), ('O', 'Opinion again: That is why summer is the best!')],
             'beats': [B('Use the word OREO to remember the parts.', 'Use the word, Oreo, to remember the parts.'), B('O is for Opinion. I think summer is the best season.'), B('R is for Reason. There is no school.'), B('E is for Example. I swim at the pool every day.'), B('O is for Opinion again. That is why summer is the best!')]},
            {'type': 'bullets', 'heading': 'Opinion linking words', 'layout': 'tiles', 'items': [('💬', 'I think', ''), ('❓', 'because', ''), ('➕', 'also', ''), ('🔍', 'for example', ''), ('✅', 'that is why', '')],
             'beats': [B('These words make your opinion stronger.'), B('I think.'), B('Because.'), B('Also.'), B('For example.'), B('That is why.')]},
            quiz('Which sentence is an opinion?', ['Dogs have four legs.', 'Dogs are the best pets.'], 'Dogs are the best pets.', 'Which sentence is an opinion?', 'Dogs are the best pets! Not everyone agrees, so it is an opinion.'),
            outro('Write an opinion in the Writing Studio!'),
        ],
    },
    {
        'id': 'word-parts', 'title': 'Prefixes and Suffixes', 'subject': 'phonics', 'label': 'Grade 3 Challenge',
        'desc': 'un-, re-, dis-, -ful, -less, -ly: word parts that change meaning.', 'practice': ['phonics', 'wordparts', 1],
        'scenes': [
            {'type': 'title', 'emoji': '🧩', 'title': 'Prefixes and Suffixes', 'sub': 'Grade 3 Challenge · Word parts', 'beats': [B('Small word parts can change what a word means.')]},
            {'type': 'wordmath', 'heading': 'A prefix goes at the FRONT', 'rows': [('un', '+', 'happy', 'unhappy', 'not happy'), ('re', '+', 'tell', 'retell', 'tell again'), ('dis', '+', 'like', 'dislike', 'not like')],
             'beats': [B('A prefix goes at the front of a word.'), B('Un plus happy makes unhappy. It means not happy.', 'Un, plus happy, makes unhappy. It means, not happy.'), B('Re plus tell makes retell. It means tell again.', 'Re, plus tell, makes retell. It means, tell again.'), B('Dis plus like makes dislike. It means not like.', 'Dis, plus like, makes dislike. It means, not like.')]},
            {'type': 'wordmath', 'heading': 'A suffix goes at the END', 'rows': [('help', '+', 'ful', 'helpful', 'full of help'), ('fear', '+', 'less', 'fearless', 'without fear'), ('quick', '+', 'ly', 'quickly', 'in a quick way')],
             'beats': [B('A suffix goes at the end of a word.'), B('Help plus ful makes helpful. Full of help.', 'Help, plus ful, makes helpful. Full of help.'), B('Fear plus less makes fearless. Without fear.', 'Fear, plus less, makes fearless. Without fear.'), B('Quick plus l y makes quickly. In a quick way.', 'Quick, plus L, Y, makes quickly. In a quick way.')]},
            quiz('What does "reread" mean?', ['read again', 'not read', 'read before'], 'read again', 'What does reread mean?', 'Read again! The prefix re means again.', reveal_say='Read again! The prefix, re, means again.'),
            outro('Try the Prefixes and Suffixes skill!'),
        ],
    },
]

VIDEOS += [
    {
        'id': 'spelling', 'title': 'How to Study Spelling Words', 'subject': 'spelling', 'label': 'Spelling Bee',
        'desc': 'Look, say, cover, write, check, plus tips for a real spelling bee.', 'practice': ['spelling', 'starter', 0],
        'scenes': [
            {'type': 'title', 'emoji': '🐝', 'title': 'How to Study Spelling Words', 'sub': 'Spelling Bee · Learn any word', 'beats': [B("Let's learn a trick that helps you spell any word.")]},
            {'type': 'boxes', 'boxes': [('1 · Look', '👀', 'Look closely at every letter.', 'spelling'), ('2 · Say', '🗣️', 'Say the word and each sound.', 'spelling'), ('3 · Cover', '🙈', 'Cover the word so you cannot see it.', 'spelling'), ('4 · Write & check', '✍️', 'Write it, then check each letter.', 'spelling')],
             'beats': [B('Use these four steps to study a word.'), B('First, look closely at every letter.'), B('Next, say the word, and listen to each sound.'), B('Then, cover the word so you cannot see it.'), B('Last, write it from memory, and check each letter.')]},
            {'type': 'wordmath', 'heading': 'Break long words into parts', 'rows': [('birth', '+', 'day', 'birthday', 'two small words'), ('sand', '+', 'wich', 'sandwich', 'two syllables'), ('li', '+', 'brary', 'library', 'li - brar - y')],
             'beats': [B('Long words are easier in small parts.'), B('Birth, plus day, makes birthday.'), B('Sand, plus wich, makes sandwich.'), B('Library has three parts. Li, brar, ee.', 'Library has three parts. Lie, brare, ee.')]},
            {'type': 'bullets', 'heading': 'Spelling bee tips', 'items': [('👂', 'Listen to the whole word'), ('📖', 'Ask to hear it in a sentence'), ('💡', 'Ask what it means'), ('🧠', 'Picture it, then spell slowly')],
             'beats': [B('In a spelling bee, you can use these tips.'), B('Listen carefully to the whole word.'), B('Ask to hear the word in a sentence.'), B('Ask what the word means.'), B('Then picture the word, and spell it slowly, one letter at a time.')]},
            quiz('Which spelling is correct?', ['frend', 'friend', 'freind'], 'friend', 'Which spelling is correct? Look at each one carefully.', 'Friend! Remember: i before e, and the word end is hiding inside.', reveal_say='Friend! Remember, I before E, and the word, end, is hiding inside.'),
            outro('Practice your words in Spelling Bee!'),
        ],
    },
    {
        'id': 'synonyms', 'title': 'Synonyms, Antonyms, and Shades of Meaning', 'subject': 'vocab', 'label': 'Vocabulary',
        'desc': 'Words that mean the same, words that mean the opposite, and words that are stronger.', 'practice': ['vocab', 'synonyms', 0],
        'scenes': [
            {'type': 'title', 'emoji': '💬', 'title': 'Synonyms and Antonyms', 'sub': 'Vocabulary · Word partners', 'beats': [B('Words have partners. Some mean the same, and some mean the opposite.')]},
            {'type': 'beforeafter', 'heading': 'Synonyms mean the SAME', 'pairs': [('big', 'large'), ('glad', 'happy'), ('quick', 'fast')],
             'beats': [B('Synonyms are words that mean the same thing.'), B('Big, and large.'), B('Glad, and happy.'), B('Quick, and fast.')]},
            {'type': 'beforeafter', 'heading': 'Antonyms mean the OPPOSITE', 'pairs': [('hot', 'cold'), ('tiny', 'huge'), ('begin', 'finish')],
             'beats': [B('Antonyms are words that mean the opposite.'), B('Hot, and cold.'), B('Tiny, and huge.'), B('Begin, and finish.')]},
            {'type': 'bullets', 'heading': 'Shades of meaning: soft to strong', 'layout': 'tiles', 'items': [('🤫', 'whisper', 'softest'), ('🙂', 'talk', 'medium'), ('📣', 'shout', 'strongest')],
             'beats': [B('Some words mean almost the same thing, but one is stronger.'), B('Whisper is very soft.'), B('Talk is in the middle.'), B('Shout is the strongest.')]},
            quiz('Which word is the OPPOSITE of "noisy"?', ['loud', 'quiet', 'happy'], 'quiet', 'Which word is the opposite of noisy?', 'Quiet! Noisy and quiet are antonyms.'),
            outro('Practice synonyms and antonyms in Vocabulary!'),
        ],
    },
]

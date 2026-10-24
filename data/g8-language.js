// GRADE 8 LANGUAGE — NJSLS-ELA 2023: L.SS.8.1 (verbals, voice, mood, shifts, punctuation, spelling), L.KL.8.2.
(function () {
  const verbals = {
    id: 'g8verbals', name: 'Verbals', icon: '🔧',
    levels: [
      {
        title: 'Find the verbal', std: 'L.SS.8.1', desc: 'Gerunds (-ing nouns), participles (verb adjectives), and infinitives (to + verb).',
        gen: () => U.mix(8, [
          () => { const [s, a] = U.pick([['[Swimming] is my favorite way to exercise.', 'gerund'], ['The [barking] dog woke the whole street.', 'participle'], ['I want [to learn] Spanish this year.', 'infinitive'], ['Her goal is [to win] the science fair.', 'infinitive'], ['The [frozen] lake sparkled in the sun.', 'participle'], ['[Reading] before bed helps me relax.', 'gerund'], ['We watched the [falling] leaves.', 'participle'], ['He enjoys [cooking] dinner for his family.', 'gerund'], ['[To finish] on time, we split up the work.', 'infinitive'], ['The [broken] window let in a cold draft.', 'participle']]); return U.tap(`Tap the verbal. (Hint: it is a ${a}.)`, s.replace(/\[(to) (\w+)\]/i, '[$1] [$2]'), { why: `It is a ${a}.` }); },
          () => { const [s, w, a] = U.pick([['Swimming is my favorite way to exercise.', 'Swimming', 'Gerund'], ['The barking dog woke the whole street.', 'barking', 'Participle'], ['I want to learn Spanish.', 'to learn', 'Infinitive'], ['The frozen lake sparkled.', 'frozen', 'Participle'], ['Reading before bed helps me relax.', 'Reading', 'Gerund'], ['Her plan is to travel to Peru.', 'to travel', 'Infinitive'], ['The team celebrated its winning goal.', 'winning', 'Participle'], ['Practicing every day made her stronger.', 'Practicing', 'Gerund']]); return U.mcFixed(`"${s}" What kind of verbal is "${w}"?`, a, ['Gerund', 'Participle', 'Infinitive'], { hint: 'Gerund = -ing word used as a noun. Participle = verb form used as an adjective. Infinitive = to + verb.', why: `"${w}" is a ${a.toLowerCase()}.` }); },
        ]),
      },
      {
        title: 'What job does it do?', std: 'L.SS.8.1', desc: 'Explain how a verbal works in the sentence.',
        gen: () => U.mix(8, [
          () => { const [s, w, a] = U.pick([['Hiking in the rain is not my idea of fun.', 'Hiking', 'It is the subject of the sentence (a noun).'], ['She loves painting landscapes.', 'painting', 'It is the direct object (a noun).'], ['The exhausted runners collapsed at the finish line.', 'exhausted', 'It describes the noun "runners" (an adjective).'], ['We need a place to sleep tonight.', 'to sleep', 'It describes the noun "place" (an adjective).'], ['He went to the store to buy milk.', 'to buy', 'It explains why he went (an adverb).'], ['My dream is to become a pilot.', 'to become', 'It renames the subject "dream" (a noun).']]); return U.mc(`"${s}" What job does "${w}" do?`, a, ['It is the subject of the sentence (a noun).', 'It is the direct object (a noun).', 'It describes the noun "runners" (an adjective).', 'It describes the noun "place" (an adjective).', 'It explains why he went (an adverb).', 'It renames the subject "dream" (a noun).', 'It is the main verb of the sentence.'], { why: a }); },
          () => { const [s, a, w] = U.pick([['Running late, Maya grabbed her backpack.', 'Running late', ['Maya grabbed', 'her backpack']], ['The boy wearing the red cap is my cousin.', 'wearing the red cap', ['The boy', 'is my cousin']], ['Covered in mud, the puppy ran inside.', 'Covered in mud', ['the puppy ran', 'ran inside']], ['The cake baked by my aunt won first prize.', 'baked by my aunt', ['The cake', 'won first prize']]]); return U.mc(`Which words make up the participial phrase? "${s}"`, a, w, { hint: 'A participial phrase starts with a participle (-ing or -ed form) and describes a noun.', why: `"${a}" acts like an adjective describing a noun.` }); },
        ]),
      },
      {
        title: 'Write with verbals', std: 'L.SS.8.1 · L.KL.8.2', desc: 'Combine sentences and fix dangling verbals.',
        gen: () => U.mix(8, [
          () => { const [w, a, o] = U.pick([['Walking to school, the rain soaked my shoes.', 'Walking to school, I got my shoes soaked by the rain.', ['Walking to school, my shoes got soaked.', 'The rain soaked my shoes, walking to school.']], ['After finishing the test, the bell rang.', 'After finishing the test, I heard the bell ring.', ['After finishing the test, it was quiet.', 'The bell, after finishing the test, rang.']], ['To win the game, practice is needed.', 'To win the game, the team needs to practice.', ['To win the game, practicing happens.', 'Practice is needed, to win the game.']], ['Barking loudly, I chased the dog.', 'I chased the dog, which was barking loudly.', ['Barking loudly, the chase began.', 'I, barking loudly, chased the dog.']]]); return U.mc(`This sentence has a dangling verbal: "${w}" Which revision fixes it?`, a, o, { hint: 'The person or thing doing the verbal action must come right after the comma.', why: `In "${a}", it is clear who is doing the action.` }); },
          () => { const [a1, a2, a, o] = U.pick([['Lena practiced every day.', 'She wanted to make the team.', 'Lena practiced every day to make the team.', ['Lena practiced every day making the team.', 'Practicing every day was Lena to make the team.']], ['The fans were cheering.', 'They filled the stadium.', 'Cheering fans filled the stadium.', ['Fans filled the stadium to cheer it.', 'The stadium cheering filled with fans.']], ['Marco loves something.', 'He builds model rockets.', 'Marco loves building model rockets.', ['Marco loves to building model rockets.', 'Building, Marco loves model rockets.']]]); return U.mc(`Combine using a verbal: "${a1}" + "${a2}"`, a, o, { why: `"${a}" combines the ideas smoothly with a verbal.` }); },
        ]),
      },
    ],
  };

  const voice = {
    id: 'g8voice', name: 'Active & Passive Voice', icon: '🔄',
    levels: [
      {
        title: 'Active or passive?', std: 'L.SS.8.1', desc: 'Active: the subject does the action. Passive: the subject receives it.',
        gen: () => U.mix(8, [
          () => { const [s, a] = U.pick([['The chef prepared the meal.', 'Active'], ['The meal was prepared by the chef.', 'Passive'], ['Our class planted ten trees.', 'Active'], ['Ten trees were planted by our class.', 'Passive'], ['The storm damaged the bridge.', 'Active'], ['The bridge was damaged in the storm.', 'Passive'], ['The winners will be announced tomorrow.', 'Passive'], ['Maya scored the winning goal.', 'Active'], ['The letter has been signed.', 'Passive'], ['Thousands of fans watched the parade.', 'Active']]); return U.mcFixed(`Is this sentence active or passive? "${s}"`, a, ['Active', 'Passive'], { hint: 'Passive voice uses a form of "be" + a past participle (was prepared, were planted).', why: `"${s}" is in the ${a.toLowerCase()} voice.` }); },
          () => U.sort('Sort the sentences by voice.', ['Active voice', 'Passive voice'], U.shuffle([...U.sample(['The dog chased the ball.', 'Lin painted a mural.', 'The wind knocked over the sign.', 'Scientists discovered a new species.'], 3).map((w) => ({ w, b: 0 })), ...U.sample(['The ball was chased by the dog.', 'A mural was painted by Lin.', 'The sign was knocked over.', 'A new species was discovered.'], 3).map((w) => ({ w, b: 1 }))])),
        ]),
      },
      {
        title: 'Change the voice', std: 'L.SS.8.1', desc: 'Rewrite sentences from passive to active and back.',
        gen: () => U.mix(8, [
          () => { const [p, a, o] = U.pick([['The window was broken by the baseball.', 'The baseball broke the window.', ['The window broke the baseball.', 'The baseball was broken by the window.']], ['The essay was written by Jamal.', 'Jamal wrote the essay.', ['The essay wrote Jamal.', 'Jamal was written by the essay.']], ['The game was won by the Tigers.', 'The Tigers won the game.', ['The game won the Tigers.', 'The Tigers were won by the game.']], ['The cookies were eaten by my brother.', 'My brother ate the cookies.', ['The cookies ate my brother.', 'My brother was eaten by the cookies.']]]); return U.mc(`Rewrite in the ACTIVE voice: "${p}"`, a, o, { hint: 'Move the doer (after "by") to the front as the subject.', why: `"${a}" puts the doer first.` }); },
          () => { const [a, p, o] = U.pick([['The principal canceled the assembly.', 'The assembly was canceled by the principal.', ['The principal was canceled by the assembly.', 'The assembly canceled the principal.']], ['Volunteers cleaned the beach.', 'The beach was cleaned by volunteers.', ['Volunteers were cleaned by the beach.', 'The beach cleaned volunteers.']], ['Edison invented the phonograph.', 'The phonograph was invented by Edison.', ['Edison was invented by the phonograph.', 'The phonograph invented Edison.']]]); return U.mc(`Rewrite in the PASSIVE voice: "${a}"`, p, o, { hint: 'Make the receiver of the action the subject, and add "was/were + past participle."', why: `"${p}" is passive.` }); },
        ]),
      },
      {
        title: 'Choose the voice for effect', std: 'L.KL.8.2 · L.SS.8.1', desc: 'Pick the voice that fits the purpose, and fix shifts in voice.',
        gen: () => U.mix(8, [
          () => { const [q, a, o] = U.pick([['A news report does not know who stole the painting. Which sentence fits best?', 'The painting was stolen last night.', ['Someone stole the painting last night, probably.', 'The thief stole the painting last night.']], ['A science lab report should focus on the procedure, not the student. Which sentence fits best?', 'The solution was heated to 50 degrees.', ['I heated the solution to 50 degrees, which was fun.', 'Me and my partner heated it up.']], ['A coach wants to sound direct and energetic. Which sentence fits best?', 'Our team won the championship!', ['The championship was won by our team.', 'The championship has been won.']]]); return U.mc(q, a, o, { why: `"${a}" uses the voice that fits the purpose.` }); },
          () => { const [w, a, o] = U.pick([['Kai built the robot, and then it was programmed by him.', 'Kai built the robot, and then he programmed it.', ['The robot was built by Kai, and then he programmed it.', 'Kai built the robot, and then programming was done.']], ['We cleaned the room, and then the trash was taken out.', 'We cleaned the room, and then we took out the trash.', ['The room was cleaned, and then we took out the trash.', 'We cleaned the room, and the trash was then taken by us.']], ['The audience clapped, and flowers were thrown onto the stage by them.', 'The audience clapped and threw flowers onto the stage.', ['The audience clapped, and flowers were thrown.', 'Clapping was done, and the audience threw flowers.']]]); return U.mc(`This sentence shifts voice. Which revision fixes it? "${w}"`, a, o, { hint: 'Keep both parts of the sentence in the active voice.', why: `"${a}" stays in the active voice.` }); },
        ]),
      },
    ],
  };

  const mood = {
    id: 'g8mood', name: 'Verb Mood', icon: '🎭',
    levels: [
      {
        title: 'Name the mood', std: 'L.SS.8.1', desc: 'Indicative, imperative, interrogative, conditional, subjunctive.',
        gen: () => U.fromBank(8, [['The museum opens at nine.', 'Indicative'], ['Turn off the lights before you leave.', 'Imperative'], ['Did you finish the reading?', 'Interrogative'], ['If it rains, we would stay inside.', 'Conditional'], ['I wish I were taller.', 'Subjunctive'], ['Please hand in your essays.', 'Imperative'], ['She plays the cello.', 'Indicative'], ['Would you help me carry this?', 'Interrogative'], ['If I had a dog, I would walk it every day.', 'Conditional'], ['The coach insists that every player be on time.', 'Subjunctive'], ['Where did you leave your phone?', 'Interrogative'], ['Bring a water bottle to the game.', 'Imperative']],
          ([s, a]) => U.mcFixed(`Which mood is this verb in? "${s}"`, a, ['Indicative', 'Imperative', 'Interrogative', 'Conditional', 'Subjunctive'], { hint: 'Indicative states facts. Imperative gives commands. Interrogative asks. Conditional says what would happen. Subjunctive expresses wishes or demands.', why: `"${s}" is ${a.toLowerCase()}.` })),
      },
      {
        title: 'The subjunctive', std: 'L.SS.8.1', desc: 'If I were…, I suggest that he be…',
        gen: () => U.fromBank(8, [['If I ___ the principal, I would add more recess.', 'were', ['was', 'am']], ['She wishes she ___ on vacation right now.', 'were', ['was', 'is']], ['The teacher recommends that each student ___ the chapter twice.', 'read', ['reads', 'reading']], ['It is important that he ___ honest.', 'be', ['is', 'was']], ['I demand that the dog ___ off the couch.', 'stay', ['stays', 'stayed']], ['If he ___ more careful, he would not have spilled the paint.', 'had been', ['was', 'would be']], ['My mom asked that I ___ home by six.', 'be', ['am', 'was']], ['If only it ___ Friday!', 'were', ['was', 'is']]],
          ([s, a, w]) => U.mc(`Choose the verb in the subjunctive mood: ${s}`, a, w, { hint: 'For wishes and "if" statements that are not true, use "were." After words like suggest, insist, or demand, use the base verb.', why: `"${a}" is the subjunctive form.` })),
      },
      {
        title: 'Fix mood shifts', std: 'L.SS.8.1 · L.KL.8.2', desc: 'Keep the mood consistent, and use mood for effect.',
        gen: () => U.mix(8, [
          () => { const [w, a, o] = U.pick([['First, preheat the oven, and then you should mix the flour.', 'First, preheat the oven, and then mix the flour.', ['First, you preheat the oven, and then mix the flour should be done.', 'First, preheat the oven, and then you will be mixing the flour.']], ['Please sit down, and you should open your books.', 'Please sit down and open your books.', ['Please sit down, and your books are opened.', 'You sat down, and open your books.']], ['If I were the coach, I will let everyone play.', 'If I were the coach, I would let everyone play.', ['If I was the coach, I will let everyone play.', 'If I am the coach, I would let everyone play.']]]); return U.mc(`This sentence shifts mood. Which revision fixes it? "${w}"`, a, o, { hint: 'Do not switch from a command to a statement, or from conditional to indicative, in the middle.', why: `"${a}" keeps one mood.` }); },
          () => { const [q, a, o] = U.pick([['Which sentence uses the conditional mood to make a polite request?', 'Would you mind closing the window?', ['Close the window.', 'The window is open.']], ['Which sentence uses the imperative mood to give clear directions?', 'Turn left at the library.', ['You might want to turn left.', 'People often turn left at the library.']], ['Which sentence uses the subjunctive to express a wish?', 'I wish the season were longer.', ['The season is long.', 'Make the season longer.']]]); return U.mc(q, a, o, { why: `"${a}" uses the mood for that purpose.` }); },
        ]),
      },
    ],
  };

  const punct = {
    id: 'g8punct', name: 'Commas, Ellipses & Dashes', icon: '⏸️',
    levels: [
      {
        title: 'Show a pause or break', std: 'L.SS.8.1', desc: 'Use commas, ellipses, and dashes for pauses and interruptions.',
        gen: () => U.mix(8, [
          () => { const [q, a, o] = U.pick([['Which shows a sudden interruption in dialogue?', '"I think we should—" Maya stopped as the lights went out.', ['"I think we should." Maya stopped as the lights went out.', '"I think we should, Maya stopped as the lights went out."']], ['Which shows a speaker trailing off?', '"Well… I guess we could try again."', ['"Well, I guess we could try again!"', '"Well—I guess we could try again—"']], ['Which uses dashes to set off an extra comment for emphasis?', 'My little brother—the loudest person I know—fell asleep in the library.', ['My little brother… the loudest person I know… fell asleep in the library.', 'My little brother the loudest person I know, fell asleep in the library.']], ['Which uses commas correctly for a short pause?', 'Honestly, I did not expect to win.', ['Honestly I did not, expect to win.', 'Honestly… I did not expect—to win.']]]); return U.mc(q, a, o, { why: `"${a}" uses the punctuation correctly.` }); },
          () => { const [s, a] = U.pick([['"Wait—don\'t open that door!"', 'A dash, to show a sudden break'], ['"I was going to tell you, but…"', 'An ellipsis, to show trailing off'], ['Yes, I will be there.', 'A comma, to show a short pause'], ['The answer—surprisingly—was zero.', 'Dashes, to add emphasis']]); return U.mc(`What punctuation creates the pause in this sentence, and why? ${s}`, a, ['A dash, to show a sudden break', 'An ellipsis, to show trailing off', 'A comma, to show a short pause', 'Dashes, to add emphasis'].filter((o) => !(a.includes('ash') && o.includes('ash'))), { why: a }); },
        ]),
      },
      {
        title: 'Ellipses for omission', std: 'L.SS.8.1', desc: 'Use an ellipsis to leave out words from a quotation.',
        gen: () => U.mix(6, [
          () => { const [orig, a, o] = U.pick([['"The Pine Barrens, which cover more than a million acres, are home to rare plants."', '"The Pine Barrens … are home to rare plants."', ['"The Pine Barrens, are home to rare plants."', '"The Pine Barrens… which cover… plants."']], ['"Edison\'s lab, located in Menlo Park, produced hundreds of inventions."', '"Edison\'s lab … produced hundreds of inventions."', ['"Edison\'s lab produced… hundreds… of… inventions."', '"Edison\'s lab, located in Menlo Park produced."']], ['"Teenagers, according to many doctors, need more sleep than adults."', '"Teenagers … need more sleep than adults."', ['"Teenagers, according to … doctors."', '"… need more sleep … adults …"']]]); return U.mc(`Original: ${orig}\nWhich quotation correctly uses an ellipsis to leave out the middle part?`, a, o, { hint: 'An ellipsis replaces the words you removed. The quote must still make sense and keep the original meaning.', why: `${a} removes words without changing the meaning.` }); },
          () => U.mc('Why might a writer use an ellipsis inside a quotation in an essay?', 'To leave out words that are not needed, without changing the meaning', ['To add their own opinion to the quote', 'To show that the author was shouting', 'To change what the author meant'], { why: 'An ellipsis shows that some words were left out.' }),
        ]),
      },
      {
        title: 'Advanced punctuation', std: 'L.SS.8.1', desc: 'Semicolons, colons, and coordinate adjectives.',
        gen: () => U.mix(8, [
          () => { const [a, o] = U.pick([['I wanted to go to the concert; however, tickets were sold out.', ['I wanted to go to the concert, however, tickets were sold out.', 'I wanted to go to the concert; however tickets, were sold out.']], ['Bring three things: a pencil, a calculator, and a ruler.', ['Bring three things; a pencil, a calculator, and a ruler.', 'Bring: three things a pencil, a calculator, and a ruler.']], ['It was a cold, windy night.', ['It was a cold windy, night.', 'It was a, cold, windy night.']], ['The storm was fierce; trees fell across the road.', ['The storm was fierce, trees fell across the road.', 'The storm was fierce: trees, fell across the road.']]]); return U.mc('Which sentence is punctuated correctly?', a, o, { hint: 'A semicolon joins two complete sentences. A colon introduces a list. Use a comma between two adjectives that describe the same noun equally.', why: `"${a}" is correct.` }); },
          () => U.mc('Which sentence is a comma splice (two sentences joined by only a comma)?', 'The bus was late, we missed the first class.', ['The bus was late, so we missed the first class.', 'Because the bus was late, we missed the first class.', 'The bus was late; we missed the first class.'], { why: 'Two complete sentences joined by just a comma is a comma splice.' }),
        ]),
      },
    ],
  };

  const usage = {
    id: 'g8usage', name: 'Usage & Spelling', icon: '🧐',
    levels: [
      {
        title: 'Commonly confused words', std: 'L.SS.8.1 · L.KL.8.2', desc: 'affect/effect, than/then, its/it\'s, whose/who\'s.',
        gen: () => U.fromBank(8, [['The new rule will ___ every student.', 'affect', ['effect']], ['The medicine had a strong ___.', 'effect', ['affect']], ['She is taller ___ her brother.', 'than', ['then']], ['We ate dinner, and ___ we did homework.', 'then', ['than']], ['The cat licked ___ paw.', 'its', ["it's"]], ['___ going to rain later.', "It's", ['Its']], ['___ backpack is this?', 'Whose', ["Who's"]], ['___ coming to the party?', "Who's", ['Whose']], ['They left ___ coats in the car.', 'their', ['there', "they're"]], ['I need ___ minutes to finish.', 'fewer', ['less']], ['There is ___ water in the bottle now.', 'less', ['fewer']], ['Please ___ the book on the table.', 'lay', ['lie']]],
          ([s, a, w]) => U.mc(`Choose the right word: ${s}`, a, w, { why: `"${a}" is correct here.` }, w.length)),
      },
      {
        title: 'Modifiers and pronouns', std: 'L.SS.8.1 · L.KL.8.2', desc: 'Fix misplaced modifiers and unclear pronouns.',
        gen: () => U.mix(8, [
          () => { const [w, a, o] = U.pick([['I saw a dog on the way to school wearing a sweater.', 'On the way to school, I saw a dog wearing a sweater.', ['I saw, wearing a sweater, a dog on the way to school.', 'Wearing a sweater on the way, a dog saw me.']], ['She almost ate the whole pizza.', 'She ate almost the whole pizza.', ['Almost she ate the whole pizza.', 'She ate the whole almost pizza.']], ['The teacher handed out tests to the students that were difficult.', 'The teacher handed out difficult tests to the students.', ['The difficult teacher handed out tests.', 'The teacher that was difficult handed out tests.']]]); return U.mc(`Fix the misplaced modifier: "${w}"`, a, o, { hint: 'Put the describing words right next to what they describe.', why: `"${a}" puts the modifier in the right place.` }); },
          () => { const [w, a, o] = U.pick([['When Maria talked to Ella, she was upset.', 'Maria was upset when she talked to Ella.', ['When Maria talked to Ella, they was upset.', 'When she talked to Ella, she was upset.']], ['Take the cake out of the oven and let it cool.', 'Take the cake out of the oven and let the cake cool.', ['Take it out of it and let it cool.', 'Take the oven out of the cake and let it cool.']], ['Jamal told Tyler that his bike was stolen.', "Jamal told Tyler, \"Your bike was stolen.\"", ['Jamal told him that his bike was stolen.', 'He told Tyler that his bike was stolen.']]]); return U.mc(`The pronoun is unclear. Which revision is clearer? "${w}"`, a, o, { why: `"${a}" makes it clear who or what the pronoun means.` }); },
        ]),
      },
      {
        title: 'Spelling conventions', std: 'L.SS.8.1', desc: 'Tricky Grade 8–9 spellings and rules.',
        gen: () => U.fromBank(8, [['necessary', ['neccessary', 'necesary']], ['definitely', ['definately', 'definitly']], ['separate', ['seperate', 'separete']], ['receive', ['recieve', 'receeve']], ['occurred', ['occured', 'ocurred']], ['embarrass', ['embarass', 'embarras']], ['beginning', ['begining', 'beggining']], ['environment', ['enviroment', 'enviornment']], ['government', ['goverment', 'govermment']], ['rhythm', ['rythm', 'rhythem']], ['conscience', ['concience', 'consience']], ['achievement', ['acheivement', 'achievment']]],
          ([a, w]) => U.mc('Which word is spelled correctly?', a, w, { say: a, hint: 'Picture the word. Think of rules like "i before e except after c" and doubling the final consonant.', why: `"${a}" is the correct spelling.` })),
      },
    ],
  };

  addSubject({
    id: 'g8lang', track: 'g8', name: 'Language', blurb: 'Verbals, voice, mood, and punctuation for effect', color: 'grammar', icon: '✒️',
    skills: [verbals, voice, mood, punct, usage],
  });
})();

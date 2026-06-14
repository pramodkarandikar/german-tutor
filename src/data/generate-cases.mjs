import fs from 'fs';

const nouns = [
  // Masculine
  { base: "der Mann", acc: "den Mann", dat: "dem Mann", gen: "des Mannes", gender: "masculine", en: "man" },
  { base: "der Hund", acc: "den Hund", dat: "dem Hund", gen: "des Hundes", gender: "masculine", en: "dog" },
  { base: "der Tisch", acc: "den Tisch", dat: "dem Tisch", gen: "des Tisches", gender: "masculine", en: "table" },
  { base: "der Lehrer", acc: "den Lehrer", dat: "dem Lehrer", gen: "des Lehrers", gender: "masculine", en: "teacher" },
  { base: "der Stuhl", acc: "den Stuhl", dat: "dem Stuhl", gen: "des Stuhls", gender: "masculine", en: "chair" },
  { base: "der Ball", acc: "den Ball", dat: "dem Ball", gen: "des Balles", gender: "masculine", en: "ball" },
  { base: "der Garten", acc: "den Garten", dat: "dem Garten", gen: "des Gartens", gender: "masculine", en: "garden" },
  { base: "der Freund", acc: "den Freund", dat: "dem Freund", gen: "des Freundes", gender: "masculine", en: "friend" },
  { base: "der Baum", acc: "den Baum", dat: "dem Baum", gen: "des Baumes", gender: "masculine", en: "tree" },
  { base: "der Apfel", acc: "den Apfel", dat: "dem Apfel", gen: "des Apfels", gender: "masculine", en: "apple" },
  // Feminine
  { base: "die Frau", acc: "die Frau", dat: "der Frau", gen: "der Frau", gender: "feminine", en: "woman" },
  { base: "die Katze", acc: "die Katze", dat: "der Katze", gen: "der Katze", gender: "feminine", en: "cat" },
  { base: "die Schule", acc: "die Schule", dat: "der Schule", gen: "der Schule", gender: "feminine", en: "school" },
  { base: "die Tür", acc: "die Tür", dat: "der Tür", gen: "der Tür", gender: "feminine", en: "door" },
  { base: "die Blume", acc: "die Blume", dat: "der Blume", gen: "der Blume", gender: "feminine", en: "flower" },
  { base: "die Tasche", acc: "die Tasche", dat: "der Tasche", gen: "der Tasche", gender: "feminine", en: "bag" },
  { base: "die Mutter", acc: "die Mutter", dat: "der Mutter", gen: "der Mutter", gender: "feminine", en: "mother" },
  { base: "die Lampe", acc: "die Lampe", dat: "der Lampe", gen: "der Lampe", gender: "feminine", en: "lamp" },
  { base: "die Stadt", acc: "die Stadt", dat: "der Stadt", gen: "der Stadt", gender: "feminine", en: "city" },
  // Neuter
  { base: "das Kind", acc: "das Kind", dat: "dem Kind", gen: "des Kindes", gender: "neuter", en: "child" },
  { base: "das Auto", acc: "das Auto", dat: "dem Auto", gen: "des Autos", gender: "neuter", en: "car" },
  { base: "das Buch", acc: "das Buch", dat: "dem Buch", gen: "des Buches", gender: "neuter", en: "book" },
  { base: "das Haus", acc: "das Haus", dat: "dem Haus", gen: "des Hauses", gender: "neuter", en: "house" },
  { base: "das Fenster", acc: "das Fenster", dat: "dem Fenster", gen: "des Fensters", gender: "neuter", en: "window" },
  { base: "das Mädchen", acc: "das Mädchen", dat: "dem Mädchen", gen: "des Mädchens", gender: "neuter", en: "girl" },
  { base: "das Wasser", acc: "das Wasser", dat: "dem Wasser", gen: "des Wassers", gender: "neuter", en: "water" },
  { base: "das Sofa", acc: "das Sofa", dat: "dem Sofa", gen: "des Sofas", gender: "neuter", en: "sofa" },
  { base: "das Bett", acc: "das Bett", dat: "dem Bett", gen: "des Bettes", gender: "neuter", en: "bed" }
];

const templates = [
  // Accusative Case
  { tpl: "Ich sehe {blank}.", enTpl: "I see the [noun].", case: "acc", cat: "Accusative Case", sub: "Direct Object", expl: "The verb 'sehen' takes an accusative direct object." },
  { tpl: "Er kauft {blank}.", enTpl: "He buys the [noun].", case: "acc", cat: "Accusative Case", sub: "Direct Object", expl: "The verb 'kaufen' takes an accusative direct object." },
  { tpl: "Wir suchen {blank}.", enTpl: "We are looking for the [noun].", case: "acc", cat: "Accusative Case", sub: "Direct Object", expl: "The verb 'suchen' takes an accusative direct object." },
  { tpl: "Sie liebt {blank}.", enTpl: "She loves the [noun].", case: "acc", cat: "Accusative Case", sub: "Direct Object", expl: "The verb 'lieben' takes an accusative direct object." },
  { tpl: "Hörst du {blank}?", enTpl: "Do you hear the [noun]?", case: "acc", cat: "Accusative Case", sub: "Direct Object", expl: "The verb 'hören' takes an accusative direct object." },
  
  // Dative Case
  { tpl: "Ich helfe {blank}.", enTpl: "I am helping the [noun].", case: "dat", cat: "Dative Case", sub: "Dative Verb", expl: "The verb 'helfen' always requires the dative case." },
  { tpl: "Das Buch gehört {blank}.", enTpl: "The book belongs to the [noun].", case: "dat", cat: "Dative Case", sub: "Dative Verb", expl: "The verb 'gehören' requires the dative case." },
  { tpl: "Ich danke {blank}.", enTpl: "I thank the [noun].", case: "dat", cat: "Dative Case", sub: "Dative Verb", expl: "The verb 'danken' requires the dative case." },
  { tpl: "Es gefällt {blank} nicht.", enTpl: "The [noun] doesn't like it.", case: "dat", cat: "Dative Case", sub: "Dative Verb", expl: "The verb 'gefallen' requires the dative case." },
  { tpl: "Wir glauben {blank}.", enTpl: "We believe the [noun].", case: "dat", cat: "Dative Case", sub: "Dative Verb", expl: "The verb 'glauben' requires the dative case." },

  // Accusative Prepositions
  { tpl: "Das ist für {blank}.", enTpl: "That is for the [noun].", case: "acc", cat: "Accusative Prepositions", sub: "für", expl: "The preposition 'für' always takes the accusative case." },
  { tpl: "Wir gehen durch {blank}.", enTpl: "We are walking through the [noun].", case: "acc", cat: "Accusative Prepositions", sub: "durch", expl: "The preposition 'durch' always takes the accusative case." },
  { tpl: "Er kommt ohne {blank}.", enTpl: "He is coming without the [noun].", case: "acc", cat: "Accusative Prepositions", sub: "ohne", expl: "The preposition 'ohne' always takes the accusative case." },
  { tpl: "Sie laufen gegen {blank}.", enTpl: "They run against the [noun].", case: "acc", cat: "Accusative Prepositions", sub: "gegen", expl: "The preposition 'gegen' always takes the accusative case." },
  { tpl: "Die Katze läuft um {blank}.", enTpl: "The cat runs around the [noun].", case: "acc", cat: "Accusative Prepositions", sub: "um", expl: "The preposition 'um' always takes the accusative case." },

  // Dative Prepositions
  { tpl: "Er kommt aus {blank}.", enTpl: "He comes out of the [noun].", case: "dat", cat: "Dative Prepositions", sub: "aus", expl: "The preposition 'aus' always takes the dative case." },
  { tpl: "Wir sprechen mit {blank}.", enTpl: "We are talking with the [noun].", case: "dat", cat: "Dative Prepositions", sub: "mit", expl: "The preposition 'mit' always takes the dative case." },
  { tpl: "Sie wohnt bei {blank}.", enTpl: "She lives at the [noun]'s.", case: "dat", cat: "Dative Prepositions", sub: "bei", expl: "The preposition 'bei' always takes the dative case." },
  { tpl: "Das ist von {blank}.", enTpl: "This is from the [noun].", case: "dat", cat: "Dative Prepositions", sub: "von", expl: "The preposition 'von' always takes the dative case." },

  // Two-Way Motion (Accusative)
  { tpl: "Ich lege das Buch auf {blank}.", enTpl: "I lay the book on the [noun].", case: "acc", cat: "Two-Way Prepositions", sub: "Motion (Accusative)", expl: "The two-way preposition 'auf' takes the accusative when indicating motion towards a destination." },
  { tpl: "Er geht in {blank}.", enTpl: "He goes into the [noun].", case: "acc", cat: "Two-Way Prepositions", sub: "Motion (Accusative)", expl: "The two-way preposition 'in' takes the accusative when indicating motion towards a destination." },
  { tpl: "Sie stellt den Stuhl neben {blank}.", enTpl: "She puts the chair next to the [noun].", case: "acc", cat: "Two-Way Prepositions", sub: "Motion (Accusative)", expl: "The two-way preposition 'neben' takes the accusative when indicating motion towards a destination." },
  { tpl: "Der Vogel fliegt über {blank}.", enTpl: "The bird flies over the [noun].", case: "acc", cat: "Two-Way Prepositions", sub: "Motion (Accusative)", expl: "The two-way preposition 'über' takes the accusative when indicating motion towards a destination." },
  { tpl: "Wir gehen hinter {blank}.", enTpl: "We go behind the [noun].", case: "acc", cat: "Two-Way Prepositions", sub: "Motion (Accusative)", expl: "The two-way preposition 'hinter' takes the accusative when indicating motion towards a destination." },

  // Two-Way Location (Dative)
  { tpl: "Das Buch liegt auf {blank}.", enTpl: "The book is lying on the [noun].", case: "dat", cat: "Two-Way Prepositions", sub: "Location (Dative)", expl: "The two-way preposition 'auf' takes the dative when indicating a static location (where?)." },
  { tpl: "Er ist in {blank}.", enTpl: "He is in the [noun].", case: "dat", cat: "Two-Way Prepositions", sub: "Location (Dative)", expl: "The two-way preposition 'in' takes the dative when indicating a static location (where?)." },
  { tpl: "Der Stuhl steht neben {blank}.", enTpl: "The chair stands next to the [noun].", case: "dat", cat: "Two-Way Prepositions", sub: "Location (Dative)", expl: "The two-way preposition 'neben' takes the dative when indicating a static location (where?)." },
  { tpl: "Die Lampe hängt über {blank}.", enTpl: "The lamp hangs above the [noun].", case: "dat", cat: "Two-Way Prepositions", sub: "Location (Dative)", expl: "The two-way preposition 'über' takes the dative when indicating a static location (where?)." },
  { tpl: "Wir stehen hinter {blank}.", enTpl: "We stand behind the [noun].", case: "dat", cat: "Two-Way Prepositions", sub: "Location (Dative)", expl: "The two-way preposition 'hinter' takes the dative when indicating a static location (where?)." }
];

let counter = 1;
const exercises = [];

for (const tpl of templates) {
  // Generate 4 exercises for each template by picking random nouns
  const shuffledNouns = [...nouns].sort(() => 0.5 - Math.random());
  for (let i = 0; i < 4; i++) {
    const noun = shuffledNouns[i];
    
    const expected = noun[tpl.case];
    let options = [noun.base, noun.acc, noun.dat, noun.gen];
    // deduplicate
    options = [...new Set(options)];
    
    // Ensure we have exactly 4 options by generating plausible wrong ones if needed
    if (options.length < 4) {
      const parts = noun.base.split(' ');
      const nounWord = parts[1];
      const extraOptions = [`dem ${nounWord}`, `den ${nounWord}`, `des ${nounWord}`, `der ${nounWord}`];
      for (const opt of extraOptions) {
        if (!options.includes(opt)) options.push(opt);
      }
      options = [...new Set(options)].slice(0, 4);
    }
    
    // Randomize options
    options.sort(() => 0.5 - Math.random());

    exercises.push({
      id: counter.toString(),
      german_sentence_template: tpl.tpl,
      base_word_hint: noun.base,
      expected_answer: expected,
      options: options,
      english_translation: tpl.enTpl.replace('[noun]', noun.en),
      grammar_category: tpl.cat,
      sub_category: tpl.sub,
      noun_gender: noun.gender,
      explanation: tpl.expl,
      difficulty_level: "beginner"
    });
    counter++;
  }
}

fs.writeFileSync('d:/Food for thought/experiments/german-tutor-app/src/data/cases-practice.json', JSON.stringify(exercises, null, 2));
console.log(`Successfully generated ${exercises.length} exercises!`);

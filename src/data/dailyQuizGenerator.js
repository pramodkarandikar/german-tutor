import vocabularyData from './vocabulary.json';
import verbsPpData from './verbs_pp.json';
import wordGendersData from './word-genders.json';
import verbPrepositionsData from './verb-prepositions.json';
import oppositesData from './opposites.json';
import adjectivesData from './adjectives.json';
import causalAdverbsData from './causal-adverbs.json';
import expressionsData from './expressions.json';
import casesPracticeData from './cases-practice.json';

// Helper: Fisher-Yates shuffle
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Helper: Pick n unique random items from an array
function pickRandom(arr, n) {
  const shuffled = shuffle(arr);
  return shuffled.slice(0, n);
}

// Helper: Get random distractors (excluding correct answer)
function getDistractors(pool, correctAnswer, accessor, count) {
  const candidates = pool.map(accessor).filter(item => item !== correctAnswer);
  const uniqueCandidates = [...new Set(candidates)];
  return pickRandom(uniqueCandidates, count);
}

const TOPICS = [
  { id: 'vocabulary', name: 'Vocabulary', color: 'text-cyan-600' },
  { id: 'pastParticiples', name: 'Past Participles', color: 'text-red-600' },
  { id: 'wordGenders', name: 'Word Genders', color: 'text-emerald-600' },
  { id: 'verbPrepositions', name: 'Verb Prepositions', color: 'text-orange-600' },
  { id: 'opposites', name: 'Opposites', color: 'text-fuchsia-600' },
  { id: 'adjectives', name: 'Adjectives', color: 'text-blue-600' },
  { id: 'causalAdverbs', name: 'Causal Adverbs', color: 'text-yellow-600' },
  { id: 'expressions', name: 'Expressions', color: 'text-lime-600' },
  { id: 'cases', name: 'Cases', color: 'text-indigo-600' }
];

function generateQuestionForTopic(topicId, item) {
  let sentence = '';
  let options = [];
  let correctAnswer = '';
  let explanation = '';
  const topicObj = TOPICS.find(t => t.id === topicId);
  
  switch(topicId) {
    case 'vocabulary': {
      correctAnswer = item.german;
      sentence = `"_____" means '${item.english}'`;
      const distractors = getDistractors(vocabularyData, correctAnswer, x => x.german, 3);
      options = shuffle([correctAnswer, ...distractors]);
      explanation = item.usage || `${item.german} = ${item.english}`;
      break;
    }
    case 'pastParticiples': {
      correctAnswer = item["Past Participle"].toLowerCase();
      sentence = `The past participle of '${item.German}' (${item.English}) is _____`;
      const distractors = getDistractors(verbsPpData, item["Past Participle"], x => x["Past Participle"].toLowerCase(), 3);
      options = shuffle([correctAnswer, ...distractors]);
      explanation = `${item.German} → ${correctAnswer}`;
      break;
    }
    case 'wordGenders': {
      correctAnswer = item.gender;
      // Der, Die, Das
      const articles = ['Der', 'Die', 'Das'];
      sentence = `The correct article for '${item.word}' is _____`;
      // All 3 plus duplicate of a random wrong one
      const wrongArticles = articles.filter(a => a !== correctAnswer);
      const duplicateWrong = wrongArticles[Math.floor(Math.random() * wrongArticles.length)];
      options = shuffle([...articles, duplicateWrong]);
      explanation = `Rule: ${item.rule}`;
      break;
    }
    case 'verbPrepositions': {
      correctAnswer = item.preposition.toLowerCase();
      sentence = `'${item.verb}' (${item.translation}) takes the preposition _____`;
      const distractors = getDistractors(verbPrepositionsData, item.preposition, x => x.preposition.toLowerCase(), 3);
      options = shuffle([correctAnswer, ...distractors]);
      explanation = `${item.verb} ${correctAnswer} (${item.case})`;
      break;
    }
    case 'opposites': {
      correctAnswer = item["Opposite (German)"].toLowerCase();
      sentence = `The opposite of '${item.German}' (${item.English}) is _____`;
      const distractors = getDistractors(oppositesData, item["Opposite (German)"], x => x["Opposite (German)"].toLowerCase(), 3);
      options = shuffle([correctAnswer, ...distractors]);
      explanation = `${item.German} ↔ ${correctAnswer}`;
      break;
    }
    case 'adjectives': {
      correctAnswer = item.German.toLowerCase();
      sentence = `"_____" means '${item.English}'`;
      const distractors = getDistractors(adjectivesData, item.German, x => x.German.toLowerCase(), 3);
      options = shuffle([correctAnswer, ...distractors]);
      explanation = item.Example || `${item.German} = ${item.English}`;
      break;
    }
    case 'causalAdverbs': {
      correctAnswer = item.German.toLowerCase();
      sentence = `"_____" means '${item.English}'`;
      const distractors = getDistractors(causalAdverbsData, item.German, x => x.German.toLowerCase(), 3);
      options = shuffle([correctAnswer, ...distractors]);
      explanation = item.Example || `${item.German} = ${item.English}`;
      break;
    }
    case 'expressions': {
      correctAnswer = item["German Expression"];
      sentence = `"'_____' means '${item["English Translation"]}'`;
      const distractors = getDistractors(expressionsData, correctAnswer, x => x["German Expression"], 3);
      options = shuffle([correctAnswer, ...distractors]);
      explanation = item.Example || `${correctAnswer}`;
      break;
    }
    case 'cases': {
      correctAnswer = item.expected_answer;
      sentence = item.german_sentence_template.replace('{blank}', '_____') + ` (Hint: ${item.base_word_hint})`;
      options = shuffle([...item.options]);
      explanation = item.explanation;
      break;
    }
  }

  return {
    topic: topicObj.name,
    topicColor: topicObj.color,
    sentence,
    options,
    correctAnswer,
    explanation
  };
}

export function generateDailyQuiz() {
  const pools = [
    { id: 'vocabulary', data: vocabularyData },
    { id: 'pastParticiples', data: verbsPpData },
    { id: 'wordGenders', data: wordGendersData },
    { id: 'verbPrepositions', data: verbPrepositionsData },
    { id: 'opposites', data: oppositesData },
    { id: 'adjectives', data: adjectivesData },
    { id: 'causalAdverbs', data: causalAdverbsData },
    { id: 'expressions', data: expressionsData },
    { id: 'cases', data: casesPracticeData }
  ];

  // 1. Pick 2 items from each topic (18 total)
  let candidates = [];
  for (const pool of pools) {
    const pickedItems = pickRandom(pool.data, 2);
    pickedItems.forEach(item => {
      candidates.push({ topicId: pool.id, item });
    });
  }

  // 2. Drop 3 to get exactly 15, ensuring no topic drops below 1
  candidates = shuffle(candidates);
  
  const finalCandidates = [];
  const topicCounts = {};
  pools.forEach(p => topicCounts[p.id] = 2);
  
  let dropped = 0;
  for (let i = candidates.length - 1; i >= 0; i--) {
    const cand = candidates[i];
    if (dropped < 3 && topicCounts[cand.topicId] > 1) {
      topicCounts[cand.topicId]--;
      dropped++;
    } else {
      finalCandidates.push(cand);
    }
  }

  // 3. Shuffle final 15
  const finalShuffled = shuffle(finalCandidates);

  // 4. Generate questions and assign ids
  return finalShuffled.map((cand, index) => {
    const questionObj = generateQuestionForTopic(cand.topicId, cand.item);
    return {
      id: index,
      ...questionObj
    };
  });
}

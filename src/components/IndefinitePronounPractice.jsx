import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2, Trophy, RefreshCw, ArrowRight, PenTool, BookOpen } from 'lucide-react';
import PageHeader from './common/PageHeader';
import ScoreStreak from './common/ScoreStreak';
import indefinitePronounsData from '../data/indefinite-pronouns.json';

// Helper: Fisher-Yates shuffle
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const IndefinitePronounPractice = () => {
  const [mode, setMode] = useState('practice'); // 'practice' or 'study'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [wordBank, setWordBank] = useState([]);

  // Build quiz questions from examples that contain the pronoun
  const questions = useMemo(() => {
    const qs = [];
    for (const item of indefinitePronounsData) {
      // Use the first form of the pronoun (e.g. "jeder" from "jeder / jede / jedes")
      const primaryPronoun = item.pronoun.split(' / ')[0].trim();
      
      for (const example of item.examples) {
        // Check if the example sentence contains the pronoun (case-insensitive word boundary)
        const regex = new RegExp(`\\b${primaryPronoun}\\b`, 'i');
        if (regex.test(example.german)) {
          const parts = example.german.split(regex);
          // Find the actual matched text to preserve case
          const match = example.german.match(regex);
          qs.push({
            pronoun: item.pronoun,
            primaryPronoun,
            matchedText: match ? match[0] : primaryPronoun,
            english: item.english,
            exampleGerman: example.german,
            exampleEnglish: example.english,
            parts, // sentence split around the pronoun
          });
        }
      }
    }
    return shuffle(qs);
  }, []);

  const currentItem = questions[currentIndex];

  useEffect(() => {
    if (!currentItem) return;

    // Generate word bank: correct answer + 4 random others
    const correctAnswer = currentItem.matchedText;
    const allPronouns = indefinitePronounsData
      .map(p => p.pronoun.split(' / ')[0].trim())
      .filter(w => w.toLowerCase() !== correctAnswer.toLowerCase());
    const distractors = shuffle(allPronouns).slice(0, 4);
    
    setWordBank(shuffle([correctAnswer, ...distractors]));
    setSelectedWord(null);
    setIsCorrect(null);
  }, [currentIndex, currentItem]);

  const playPronunciation = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    window.speechSynthesis.speak(utterance);
  };

  const handleWordSelect = (word) => {
    if (selectedWord !== null) return;

    setSelectedWord(word);
    const correct = word.toLowerCase() === currentItem.matchedText.toLowerCase();
    setIsCorrect(correct);
    setAttempts(prev => prev + 1);

    if (correct) {
      setScore(prev => prev + 1);
      playPronunciation(currentItem.exampleGerman);

      if (currentIndex >= Math.min(9, questions.length - 1)) {
        setTimeout(() => setGameWon(true), 1500);
      }
    } else {
      playPronunciation(word);
    }
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % questions.length);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setAttempts(0);
    setGameWon(false);
    setSelectedWord(null);
    setIsCorrect(null);
  };

  // ─── Study Mode ───
  const renderStudyMode = () => {
    return (
      <div className="space-y-6 animate-[fade-in_0.5s_cubic-bezier(0.19,1,0.22,1)] pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {indefinitePronounsData.map((item, idx) => (
            <div
              key={idx}
              className="bg-surface border-[2px] border-subtle rounded-2xl p-6 hover:border-teal-400/60 transition-all flex flex-col shadow-sm group"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black text-teal-600 tracking-tight">{item.pronoun}</h3>
                <button
                  onClick={() => playPronunciation(item.pronoun.split(' / ')[0])}
                  className="p-2 rounded-full hover:bg-teal-50 text-teal-500 transition-colors"
                  title="Listen"
                >
                  <Volume2 size={18} />
                </button>
              </div>
              <p className="text-sm font-semibold text-text-muted mb-4 bg-background px-3 py-1.5 rounded-lg border border-border inline-block">
                {item.english}
              </p>
              <div className="space-y-3 flex-1">
                {item.examples.map((ex, exIdx) => (
                  <div key={exIdx} className="border-l-2 border-teal-300/50 pl-3">
                    <p className="font-bold text-text text-sm leading-snug">{ex.german}</p>
                    <p className="text-xs text-text-muted italic mt-0.5">{ex.english}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ─── Win Screen ───
  if (gameWon) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-[50vh] animate-[fade-in_0.5s_cubic-bezier(0.19,1,0.22,1)]">
        <div className="text-center space-y-8">
          <div className="w-32 h-32 bg-text text-background rounded-full flex items-center justify-center mx-auto shadow-2xl scale-110">
            <Trophy size={64} strokeWidth={2.5} />
          </div>
          <h3 className="text-3xl md:text-5xl font-black tracking-tight text-text">Wunderbar!</h3>
          <p className="text-2xl text-text-muted font-light">You scored <span className="font-bold text-text">{score}</span> out of <span className="font-bold text-text">{attempts}</span>.</p>
          <div className="pt-8">
            <button
              onClick={handleRestart}
              className="px-8 py-4 bg-text text-background rounded-2xl font-bold text-xl hover:scale-105 hover:shadow-xl transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] inline-flex items-center gap-3 border-4 border-transparent hover:border-border"
            >
              <RefreshCw size={24} strokeWidth={2.5} />
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentItem) return <div className="p-8 text-center">Loading...</div>;

  // ─── Main Render ───
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-[fade-in_0.5s_cubic-bezier(0.19,1,0.22,1)] space-y-6 pb-24">
      <PageHeader
        title="Indefinite Pronouns"
        description={mode === 'practice' ? 'Fill in the blank with the correct indefinite pronoun.' : 'Study all German indefinite pronouns and their usage.'}
        rightContent={mode === 'practice' && <ScoreStreak score={{ correct: score, total: attempts }} />}
      >
        {/* MODE TOGGLE */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
          <div className="inline-flex p-1.5 bg-surface/80 border border-subtle rounded-2xl shadow-sm relative shrink-0">
            <div
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-primary rounded-xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-md shadow-primary/20 pointer-events-none ${mode === 'practice' ? 'left-1.5' : 'left-[calc(50%+1.5px)]'}`}
            />
            <button
              onClick={() => setMode('practice')}
              className={`w-28 sm:w-32 flex items-center justify-center gap-2 px-3 py-2 sm:py-2.5 rounded-xl text-sm font-bold transition-all duration-300 relative z-10 ${mode === 'practice' ? 'text-primary-foreground' : 'text-text-muted hover:text-text'}`}
            >
              <PenTool size={16} strokeWidth={2.5} />
              Practice
            </button>
            <button
              onClick={() => setMode('study')}
              className={`w-28 sm:w-32 flex items-center justify-center gap-2 px-3 py-2 sm:py-2.5 rounded-xl text-sm font-bold transition-all duration-300 relative z-10 ${mode === 'study' ? 'text-primary-foreground' : 'text-text-muted hover:text-text'}`}
            >
              <BookOpen size={16} strokeWidth={2.5} />
              Study
            </button>
          </div>
        </div>
      </PageHeader>

      {mode === 'study' ? renderStudyMode() : (
        <>
          {/* Quiz Card */}
          <div className="mb-8 relative max-w-4xl mx-auto mt-12">
            <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-xl border border-border text-center">

              <h2 className="text-2xl md:text-4xl font-light text-text leading-relaxed mb-8 flex flex-wrap justify-center items-center gap-2">
                <span>{currentItem.parts[0]}</span>
                <span className={`inline-flex items-center justify-center min-w-[120px] h-[50px] border-b-4 font-bold px-4 rounded-t-lg transition-all duration-300
                    ${selectedWord === null ? 'border-text-muted bg-border-subtle/50 text-transparent' :
                      isCorrect ? 'border-green-500 bg-green-50 text-green-600' : 'border-red-500 bg-red-50 text-red-600'}`}
                >
                    {selectedWord || ''}
                </span>
                <span>{currentItem.parts[1]}</span>
              </h2>

              <div className="text-sm md:text-base text-text-muted/80 font-medium bg-background/50 py-3 px-4 rounded-xl inline-block max-w-2xl">
                  <span className="text-lg md:text-xl">"{currentItem.exampleEnglish}"</span>
              </div>

              <AnimatePresence>
                {selectedWord !== null && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="flex justify-center"
                  >
                    <div className="flex flex-col items-center gap-4">
                      {!isCorrect && (
                        <p className="text-red-500 font-bold bg-red-50 px-6 py-2 rounded-full border border-red-100">
                          The correct word was <span className="italic text-red-700">{currentItem.matchedText}</span> ({currentItem.english})
                        </p>
                      )}
                      {isCorrect && (
                        <p className="text-green-600 font-bold bg-green-50 px-6 py-2 rounded-full border border-green-100">
                          <span className="italic">{currentItem.pronoun}</span> — {currentItem.english}
                        </p>
                      )}
                      <button
                        onClick={handleNext}
                        className={`px-8 py-3 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all duration-300 shadow-lg hover:scale-105 border-2
                          ${isCorrect
                            ? 'bg-green-500 text-white border-transparent hover:bg-green-600'
                            : 'bg-text text-background border-transparent hover:bg-black'
                          }`}
                      >
                        Continue <ArrowRight size={24} strokeWidth={2.5} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Word Bank */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-sm text-text-muted font-bold uppercase tracking-[0.2em] mb-4 text-center">Word Bank</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {wordBank.map((word, index) => {
                const isSelected = selectedWord === word;
                const isCorrectAnswer = word.toLowerCase() === currentItem.matchedText.toLowerCase();

                let buttonStyle = 'bg-surface border-2 border-border text-text hover:border-teal-500 hover:shadow-md hover:-translate-y-1';

                if (selectedWord !== null) {
                  if (isSelected) {
                    buttonStyle = isCorrect ? 'bg-green-500 text-white border-green-500 scale-105 shadow-lg' : 'bg-red-500 text-white border-red-500 scale-95 opacity-80';
                  } else if (isCorrectAnswer && !isCorrect) {
                    buttonStyle = 'bg-green-50 text-green-600 border-green-300 border-dashed animate-pulse';
                  } else {
                    buttonStyle = 'bg-background border-border text-text/30 cursor-not-allowed opacity-50';
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleWordSelect(word)}
                    disabled={selectedWord !== null}
                    className={`px-5 py-2.5 rounded-xl text-base md:text-lg font-bold transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] ${buttonStyle}`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default IndefinitePronounPractice;

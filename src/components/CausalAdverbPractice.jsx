import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Trophy, RefreshCw, ArrowRight } from 'lucide-react';
import PageHeader from './common/PageHeader';
import ScoreStreak from './common/ScoreStreak';
import causalAdverbsData from '../data/causal-adverbs.json';

const CausalAdverbPractice = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [wordBank, setWordBank] = useState([]);

  // Prepare questions: filter out ones without proper examples
  const questions = useMemo(() => {
    return causalAdverbsData
      .filter(a => a.Example && !a.Example.startsWith('('))
      .sort(() => Math.random() - 0.5);
  }, []);

  const currentItem = questions[currentIndex];

  useEffect(() => {
    if (!currentItem) return;
    
    // Generate word bank (correct answer + 4 random others)
    const correctAnswer = currentItem.German;
    const otherWords = causalAdverbsData
      .map(a => a.German)
      .filter(w => w !== correctAnswer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
      
    setWordBank([correctAnswer, ...otherWords].sort(() => Math.random() - 0.5));
    setSelectedWord(null);
    setIsCorrect(null);
  }, [currentIndex, currentItem]);

  // parsing example to create the blank
  const parsedExample = useMemo(() => {
    if (!currentItem) return null;
    const exampleText = currentItem.Example;
    const match = exampleText.match(/^(.*?)\s*\((.*?)\)$/);
    const germanEx = match ? match[1].trim() : exampleText;
    const englishEx = match ? match[2].trim() : '';
    
    // Split the german sentence around the target word
    const regex = new RegExp(`\\b${currentItem.German}\\b`, 'i');
    const parts = germanEx.split(regex);
    
    if (parts.length === 1) {
       return { parts: [germanEx, ''], english: englishEx, fullGerman: germanEx };
    }
    
    return { parts, english: englishEx, fullGerman: germanEx };
  }, [currentItem]);

  const playPronunciation = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    window.speechSynthesis.speak(utterance);
  };

  const handleWordSelect = (word) => {
    if (selectedWord !== null) return;
    
    setSelectedWord(word);
    const correct = word === currentItem.German;
    setIsCorrect(correct);
    setAttempts(prev => prev + 1);

    if (correct) {
      setScore(prev => prev + 1);
      playPronunciation(parsedExample.fullGerman);
      
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

  if (!currentItem || !parsedExample) return <div className="p-8 text-center">Loading...</div>;

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

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-[fade-in_0.5s_cubic-bezier(0.19,1,0.22,1)] space-y-6 pb-24">
      <PageHeader 
        title="Causal Adverbs" 
        description="Fill in the blank with the correct causal adverb." 
        rightContent={<ScoreStreak score={{ correct: score, total: attempts }} />} 
      />

      <div className="mb-8 relative max-w-4xl mx-auto mt-12">
        <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-xl border border-border text-center">
            
          <h2 className="text-2xl md:text-4xl font-light text-text leading-relaxed mb-8 flex flex-wrap justify-center items-center gap-2">
            <span>{parsedExample.parts[0]}</span>
            <span className={`inline-flex items-center justify-center min-w-[120px] h-[50px] border-b-4 font-bold px-4 rounded-t-lg transition-all duration-300
                ${selectedWord === null ? 'border-text-muted bg-border-subtle/50 text-transparent' : 
                  isCorrect ? 'border-green-500 bg-green-50 text-green-600' : 'border-red-500 bg-red-50 text-red-600'}`}
            >
                {selectedWord || ''}
            </span>
            <span>{parsedExample.parts[1]}</span>
          </h2>
          
          <div className="text-sm md:text-base text-text-muted/80 font-medium bg-background/50 py-3 px-4 rounded-xl inline-block max-w-2xl">
              <span className="text-lg md:text-xl">"{parsedExample.english}"</span>
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
                      The correct word was <span className="italic text-red-700">{currentItem.German}</span> ({currentItem.English})
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

      <div className="max-w-4xl mx-auto">
         <h3 className="text-sm text-text-muted font-bold uppercase tracking-[0.2em] mb-4 text-center">Word Bank</h3>
         <div className="flex flex-wrap justify-center gap-3">
            {wordBank.map((word, index) => {
              const isSelected = selectedWord === word;
              const isCorrectAnswer = word === currentItem.German;
              
              let buttonStyle = "bg-surface border-2 border-border text-text hover:border-amber-500 hover:shadow-md hover:-translate-y-1";
              
              if (selectedWord !== null) {
                  if (isSelected) {
                      buttonStyle = isCorrect ? "bg-green-500 text-white border-green-500 scale-105 shadow-lg" : "bg-red-500 text-white border-red-500 scale-95 opacity-80";
                  } else if (isCorrectAnswer && !isCorrect) {
                      buttonStyle = "bg-green-50 text-green-600 border-green-300 border-dashed animate-pulse";
                  } else {
                      buttonStyle = "bg-background border-border text-text/30 cursor-not-allowed opacity-50";
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
    </div>
  );
};

export default CausalAdverbPractice;

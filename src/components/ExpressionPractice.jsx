import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Check, ArrowRight, Trophy, Volume2 } from 'lucide-react';
import expressionsData from '../data/expressions.json';

const ExpressionPractice = ({ onBack }) => {
  const [currentExpr, setCurrentExpr] = useState(null);
  const [wordBank, setWordBank] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [status, setStatus] = useState('playing'); // playing, correct, incorrect

  const initializeRound = () => {
    if (expressionsData.length === 0) return;

    // Pick a random expression
    const randomIdx = Math.floor(Math.random() * expressionsData.length);
    const expr = expressionsData[randomIdx];
    setCurrentExpr(expr);

    // Split the expression into words
    const targetWords = expr['German Expression'].split(' ');
    
    // Pick decoy words from other expressions
    const decoys = new Set();
    while (decoys.size < 3) {
      const randomDecoyIdx = Math.floor(Math.random() * expressionsData.length);
      if (randomDecoyIdx !== randomIdx) {
        const words = expressionsData[randomDecoyIdx]['German Expression'].split(' ');
        const randomWord = words[Math.floor(Math.random() * words.length)];
        if (!targetWords.includes(randomWord)) {
          decoys.add(randomWord);
        }
      }
    }

    // Combine and shuffle
    const allWords = [...targetWords, ...Array.from(decoys)]
      .map((word, index) => ({ id: `${word}-${index}`, word }))
      .sort(() => Math.random() - 0.5);

    setWordBank(allWords);
    setSelectedWords([]);
    setStatus('playing');
  };

  useEffect(() => {
    initializeRound();
  }, []);

  const playPronunciation = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    window.speechSynthesis.speak(utterance);
  };

  const handleWordClick = (wordObj) => {
    if (status !== 'playing') return;
    
    // Move from bank to selected
    setWordBank(prev => prev.filter(w => w.id !== wordObj.id));
    setSelectedWords(prev => [...prev, wordObj]);
  };

  const handleSelectedClick = (wordObj) => {
    if (status !== 'playing') return;
    
    // Move from selected to bank
    setSelectedWords(prev => prev.filter(w => w.id !== wordObj.id));
    setWordBank(prev => [...prev, wordObj]);
  };

  const handleCheck = () => {
    if (selectedWords.length === 0) return;

    const userSentence = selectedWords.map(w => w.word).join(' ');
    if (userSentence === currentExpr['German Expression']) {
      setStatus('correct');
      setScore(prev => prev + 10);
      setStreak(prev => prev + 1);
      playPronunciation(currentExpr['German Expression']);
    } else {
      setStatus('incorrect');
      setStreak(0);
      setTimeout(() => setStatus('playing'), 1500);
    }
  };

  const handleNext = () => {
    initializeRound();
  };

  if (!currentExpr) return null;

  // Format the example to highlight where the expression might be
  const exampleText = currentExpr['Example'];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-[fade-in_0.5s_cubic-bezier(0.19,1,0.22,1)] pb-24 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary/80 to-accent mb-3">
            Expression Builder
          </h1>
          <p className="text-text-muted">Construct the German idiom</p>
        </div>
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-xs text-text-muted uppercase font-bold tracking-widest mb-1">Streak</div>
            <div className="font-black text-2xl text-text">{streak}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-text-muted uppercase font-bold tracking-widest mb-1">Score</div>
            <div className="font-black text-2xl text-primary">{score}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-4">
        {/* Context Card */}
        <div className="bg-surface border border-border rounded-3xl p-4 md:p-5 shadow-sm text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent opacity-50"></div>
          
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-text mb-4 leading-tight">
            {currentExpr['English Translation']}
          </h2>
          
          {exampleText && (
            <div className="text-sm md:text-base text-text-muted/90 font-medium bg-background/50 py-3 px-4 rounded-xl inline-block max-w-2xl">
              Beispiel: {exampleText}
            </div>
          )}
        </div>

        {/* Builder Area */}
        <div className="space-y-3 mt-1">
          {/* Selected Words Area (The slots) */}
          <div 
            className={`min-h-[60px] p-3 rounded-2xl border-2 flex flex-wrap gap-2 items-center justify-center transition-all duration-300
              ${status === 'correct' ? 'border-green-500 bg-green-500/10' : 
                status === 'incorrect' ? 'border-red-500 bg-red-500/10 animate-[shake_0.5s_ease-in-out]' : 
                'border-dashed border-border bg-surface/50'}`}
          >
            <AnimatePresence mode="popLayout">
              {selectedWords.length === 0 && status === 'playing' && (
                <span className="text-text-muted/50 font-medium select-none absolute">
                  Tap words to build the expression
                </span>
              )}
              {selectedWords.map((wordObj) => (
                <motion.button
                  key={wordObj.id}
                  layoutId={wordObj.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={() => handleSelectedClick(wordObj)}
                  className={`px-4 py-3 rounded-xl font-bold text-lg shadow-sm transition-transform active:scale-95
                    ${status === 'correct' ? 'bg-green-500 text-white' : 
                      status === 'incorrect' ? 'bg-red-500 text-white' : 
                      'bg-text text-background'}`}
                  disabled={status !== 'playing'}
                >
                  {wordObj.word}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {/* Word Bank */}
          <div className="min-h-[80px] p-2 flex flex-wrap gap-3 items-center justify-center">
            <AnimatePresence mode="popLayout">
              {wordBank.map((wordObj) => (
                <motion.button
                  key={wordObj.id}
                  layoutId={wordObj.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={() => handleWordClick(wordObj)}
                  className="px-5 py-3 rounded-xl font-bold text-lg bg-surface border-2 border-border text-text shadow-sm hover:border-primary/50 hover:text-primary transition-all active:scale-95"
                >
                  {wordObj.word}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mt-2">
          <AnimatePresence mode="wait">
            {status === 'playing' ? (
              <motion.button
                key="check"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={handleCheck}
                disabled={selectedWords.length === 0}
                className={`px-8 py-4 rounded-2xl font-black text-xl flex items-center gap-2 transition-all duration-300 ${
                  selectedWords.length > 0 
                    ? 'bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 active:scale-95' 
                    : 'bg-surface border-2 border-border text-text-muted cursor-not-allowed'
                }`}
              >
                <Check size={24} strokeWidth={3} />
                Check Answer
              </motion.button>
            ) : status === 'correct' ? (
              <motion.button
                key="next"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleNext}
                className="px-8 py-4 rounded-2xl font-black text-xl flex items-center gap-2 bg-text text-background hover:bg-primary shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Continue
                <ArrowRight size={24} strokeWidth={3} />
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ExpressionPractice;

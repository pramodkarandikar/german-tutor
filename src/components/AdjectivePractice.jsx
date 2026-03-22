import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Trophy, RefreshCw, ArrowRight } from 'lucide-react';
import adjectivesData from '../data/adjectives.json'; // Ensure this path is correct

const AdjectivePractice = () => {
 const [currentIndex, setCurrentIndex] = useState(0);
 const [options, setOptions] = useState([]);
 const [selectedOption, setSelectedOption] = useState(null);
 const [isCorrect, setIsCorrect] = useState(null);
 const [score, setScore] = useState(0);
 const [attempts, setAttempts] = useState(0);
 const [gameWon, setGameWon] = useState(false);

 // Shuffle adjectives on load
 const questions = useMemo(() => {
 return [...adjectivesData].sort(() => Math.random() - 0.5);
 }, []);

 const currentAdjective = questions[currentIndex];

 // Generate options when the question changes
 useEffect(() => {
 if (!currentAdjective) return;

 const generateOptions = () => {
 const correctAnswer = currentAdjective.German;
 // Get 3 random other adjectives
 const others = questions
 .filter(a => a.German !== correctAnswer)
 .sort(() => Math.random() - 0.5)
 .slice(0, 3)
 .map(a => a.German);

 // Combine and shuffle options
 const allOptions = [correctAnswer, ...others].sort(() => Math.random() - 0.5);
 setOptions(allOptions);
 };

 generateOptions();
 setSelectedOption(null);
 setIsCorrect(null);
 }, [currentIndex, currentAdjective, questions]);

 const playPronunciation = (text) => {
 const utterance = new SpeechSynthesisUtterance(text);
 utterance.lang = 'de-DE';
 window.speechSynthesis.speak(utterance);
 };

 const handleOptionSelect = (option) => {
 // Prevent clicking if already answered
 if (selectedOption !== null) return;

 setSelectedOption(option);
 const correct = option === currentAdjective.German;
 setIsCorrect(correct);
 setAttempts(prev => prev + 1);

 if (correct) {
 setScore(prev => prev + 1);
 // Auto play correct pronunciation
 playPronunciation(currentAdjective.German);

 if (currentIndex >= Math.min(19, questions.length - 1)) {
 // Win condition after 20 attempts, or max questions
 setTimeout(() => setGameWon(true), 1500);
 }
 } else {
 // If incorrect, still show them the right pronunciation
 playPronunciation(currentAdjective.German);
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
 setSelectedOption(null);
 setIsCorrect(null);
 }

 if (!currentAdjective) return <div className="p-8 text-center">Loading...</div>;

 if (gameWon) {
 return (
 <div className="max-w-6xl mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-[50vh] animate-[fade-in_0.5s_cubic-bezier(0.19,1,0.22,1)]">
 <div className="text-center space-y-8">
 <div className="w-32 h-32 bg-text text-background rounded-full flex items-center justify-center mx-auto shadow-2xl scale-110">
 <Trophy size={64} strokeWidth={2.5} />
 </div>
 <h3 className="text-3xl md:text-5xl font-black tracking-tight text-text">Great job!</h3>
 <p className="text-2xl text-text-muted font-light">You scored <span className="font-bold text-text">{score}</span> out of <span className="font-bold text-text">{attempts}</span>.</p>
 <div className="pt-8">
 <button
 onClick={handleRestart}
 className="px-10 py-5 bg-text text-background rounded-[2rem] font-bold text-2xl hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] inline-flex items-center gap-4 border-4 border-transparent hover:border-border"
 >
 <RefreshCw size={28} strokeWidth={2.5} />
 Play Again
 </button>
 </div>
 </div>
 </div>
 );
 }

 return (
 <div className="max-w-6xl mx-auto p-4 md:p-8 animate-[fade-in_0.5s_cubic-bezier(0.19,1,0.22,1)] space-y-6 pb-24">
 <div className="flex flex-col mb-6 gap-3 text-center md:text-left">
 <div>
 <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary/80 to-accent mb-3">Adjectives</h1>
 <p className="text-base md:text-lg text-text-muted max-w-2xl font-light">
 Select the correct German translation.
 </p>
 </div>

 <div className="flex gap-8 justify-center md:justify-start mt-6">
 <div className="text-center md:text-left bg-transparent">
 <div className="text-sm text-text-muted uppercase font-bold tracking-[0.2em] mb-1">Score</div>
 <div className="font-black text-4xl leading-none text-primary">{score}</div>
 </div>
 <div className="text-center md:text-left bg-transparent">
 <div className="text-sm text-text-muted uppercase font-bold tracking-[0.2em] mb-1">Attempts</div>
 <div className="font-black text-4xl leading-none text-text">{attempts}</div>
 </div>
 </div>
 </div>

 <div className="mb-8 relative">
 <div className="text-center mb-8">
 <span className="text-sm text-text-muted font-bold uppercase tracking-[0.3em] mb-4 block">English</span>
 <h2 className="text-2xl md:text-3xl font-black text-text font-sans tracking-tight">{currentAdjective.English}</h2>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
 {options.map((option, index) => {
 let buttonClass ="bg-transparent border-[2px] border-subtle text-text hover:border-border hover:shadow-xl :bg-white/5";

 if (selectedOption !== null) {
 if (option === currentAdjective.German) {
 buttonClass ="bg-green-500 text-white border-green-500 scale-105 shadow-2xl z-10";
 } else if (option === selectedOption && !isCorrect) {
 buttonClass ="bg-red-500/10 text-red-600 border-red-500";
 } else {
 buttonClass ="bg-transparent border-subtle text-text/30 cursor-not-allowed";
 }
 }

 return (
 <button
 key={index}
 onClick={() => handleOptionSelect(option)}
 disabled={selectedOption !== null}
 className={`px-6 py-5 rounded-2xl text-xl md:text-2xl font-bold tracking-tight transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] text-center flex items-center justify-between group ${buttonClass}`}
 >
 <span className="flex-1 truncate text-center">{option}</span>
 {option === currentAdjective.German && selectedOption !== null && (
 <div
 className="p-3 -mr-2 rounded-full hover:bg-black/20 text-white transition-colors cursor-pointer"
 onClick={(e) => { e.stopPropagation(); playPronunciation(option); }}
 title="Play pronunciation"
 >
 <Volume2 size={28} strokeWidth={2.5} />
 </div>
 )}
 </button>
 );
 })}
 </div>
 </div>

 <AnimatePresence>
 {selectedOption !== null && (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -20 }}
 className="mt-16 border-l-[6px] border-primary pl-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 max-w-4xl mx-auto"
 >
 <div className="flex-1">
 <h4 className="text-xl font-bold font-mono uppercase tracking-[0.2em] text-text-muted mb-4 flex items-center gap-4">
 Example Sentence
 <button
 onClick={() => playPronunciation(currentAdjective.Example)}
 className="p-2 rounded-full border-2 border-subtle hover:border-text hover:bg-text hover:text-background transition-all"
 title="Play Example Sentence"
 >
 <Volume2 size={20} strokeWidth={2.5} />
 </button>
 </h4>
 <p className="text-2xl md:text-3xl text-text italic font-light leading-snug">
 {currentAdjective.Example}
 </p>
 </div>
 <button
 onClick={handleNext}
 className={`px-10 py-5 rounded-[2rem] font-bold text-2xl flex items-center gap-4 transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] whitespace-nowrap shadow-xl hover:scale-105 border-4
 ${isCorrect
 ? 'bg-green-500 text-white border-transparent hover:border-green-600'
 : 'bg-text text-background border-transparent hover:border-border'
 }`}
 >
 Next <ArrowRight size={28} strokeWidth={2.5} />
 </button>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
};

export default AdjectivePractice;

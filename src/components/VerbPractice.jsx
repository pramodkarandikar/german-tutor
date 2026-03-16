import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, CheckCircle2, XCircle, ArrowRight, RefreshCw, BookOpen, PenTool } from 'lucide-react';
import verbsData from '../data/verbs_pp.json'; // Make sure this path relative to this file is correct

const VerbPractice = ({ onComplete }) => {
    const [mode, setMode] = useState('practice'); // 'practice' or 'study'
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    // Shuffle verbs on load
    const questions = useMemo(() => {
        return [...verbsData].sort(() => Math.random() - 0.5);
    }, []);

    const currentVerb = questions[currentIndex];

    const playPronunciation = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'de-DE';
        window.speechSynthesis.speak(utterance);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!userInput.trim() || isSubmitted) return;

        const correctPP = currentVerb['Past Participle'].trim().toLowerCase();
        const userPP = userInput.trim().toLowerCase();

        const correct = correctPP === userPP;
        setIsCorrect(correct);
        setIsSubmitted(true);
        setAttempts(prev => prev + 1);

        if (correct) {
            setScore(prev => prev + 1);
            // Optionally auto-play correct pronunciation
            // playPronunciation(currentVerb['Past Participle']);
        }
    };

    const handleNext = () => {
        setUserInput('');
        setIsSubmitted(false);
        setIsCorrect(null);
        setCurrentIndex(prev => (prev + 1) % questions.length);
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setUserInput('');
        setIsSubmitted(false);
        setIsCorrect(null);
        setScore(0);
        setAttempts(0);
        // Note: to truly shuffle again we'd need to re-generate the memoized questions or use a state
    }

    const renderStudyMode = () => {
        if (!verbsData || verbsData.length === 0) return <div>No data available.</div>;

        const filteredVerbs = verbsData.filter(v => 
            v.German.toLowerCase().includes(searchQuery.toLowerCase()) || 
            v.English.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v['Past Participle'].toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            <div className="space-y-6 animate-[fade-in_0.5s_cubic-bezier(0.19,1,0.22,1)]">
                <div className="relative mb-6">
                    <input 
                        type="text" 
                        placeholder="Search verbs, past participles or translations..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-6 text-2xl font-bold bg-transparent border-4 border-text/10 focus:border-text rounded-2xl text-text outline-none transition-all placeholder:text-text/20"
                    />
                </div>
                
                <div className="flex flex-col gap-6">
                    {filteredVerbs.map((item, idx) => (
                        <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-4 border-text/10 pb-8 hover:border-primary/50 transition-colors">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-2">
                                    <h3 className="text-2xl md:text-3xl font-black text-text tracking-tight">{item.German}</h3>
                                    <button
                                        onClick={() => playPronunciation(item.German)}
                                        className="p-3 rounded-full text-text border-2 border-transparent hover:border-text/10 hover:bg-text/5 transition-all"
                                        title="Play pronunciation"
                                    >
                                        <Volume2 size={24} strokeWidth={2.5} />
                                    </button>
                                </div>
                                <p className="text-xl md:text-2xl text-text-muted italic font-light">{item.English}</p>
                            </div>
                            
                            <div className="md:w-1/3 md:text-right">
                                <span className="text-sm text-text-muted uppercase font-bold tracking-[0.2em] block mb-2">Past Participle</span>
                                <span className="text-3xl font-bold text-primary dark:text-blue-400">{item['Past Participle']}</span>
                            </div>
                        </div>
                    ))}
                    {filteredVerbs.length === 0 && (
                        <div className="text-center py-16 text-3xl font-bold text-text/20 italic">
                            No verbs found matching your search.
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (!currentVerb && mode === 'practice') return <div>Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6 pb-24">
            <div className="flex flex-col mb-6 px-4 gap-3 mt-4 text-center md:text-left">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text mb-4">Verbs Practice.</h1>
                    <p className="text-base md:text-lg text-text-muted max-w-2xl font-light">
                        {mode === 'practice' ? 'Type the Past Participle for the given verb.' : 'Study the list of verbs and their past participles.'}
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-6">
                    <div className="flex items-center gap-2 bg-text text-background p-1.5 rounded-2xl shadow-xl w-full sm:w-auto">
                        <button
                            onClick={() => setMode('practice')}
                            className={`flex flex-1 sm:flex-none items-center justify-center gap-3 px-8 py-3.5 rounded-xl text-lg font-bold transition-all duration-300 ${
                                mode === 'practice' 
                                ? 'bg-background text-text shadow-md scale-[1.02]' 
                                : 'text-background/70 hover:text-background hover:bg-white/10'
                            }`}
                        >
                            <PenTool size={20} strokeWidth={2.5} />
                            Practice
                        </button>
                        <button
                            onClick={() => setMode('study')}
                            className={`flex flex-1 sm:flex-none items-center justify-center gap-3 px-8 py-3.5 rounded-xl text-lg font-bold transition-all duration-300 ${
                                mode === 'study' 
                                ? 'bg-background text-text shadow-md scale-[1.02]' 
                                : 'text-background/70 hover:text-background hover:bg-white/10'
                            }`}
                        >
                            <BookOpen size={20} strokeWidth={2.5} />
                            Study
                        </button>
                    </div>

                    {mode === 'practice' && (
                        <div className="flex items-center w-full sm:w-auto mt-4 sm:mt-0 justify-end sm:justify-start">
                            <div className="flex flex-col items-center bg-transparent px-6 py-2">
                                <span className="text-sm text-text-muted uppercase font-bold tracking-[0.2em] mb-1">Score</span>
                                <div className="font-black flex items-center justify-center text-text gap-2 tracking-tighter">
                                    <span className="text-4xl leading-none text-primary">{score}</span>
                                    <span className="text-2xl text-text-muted mt-1 opacity-50">/ {attempts}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {mode === 'study' ? renderStudyMode() : (
                <>
                    <div className="text-center space-y-16 transition-all duration-300 max-w-4xl mx-auto pt-10">
                        <div className="space-y-6 select-none relative">
                            <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-sm text-text-muted font-bold uppercase tracking-[0.3em]">Infinitive</span>
                            <div className="flex items-center justify-center gap-6">
                                <h2 className="text-2xl md:text-3xl font-black text-text tracking-tight font-sans">{currentVerb.German}</h2>
                                <button
                                    onClick={() => playPronunciation(currentVerb.German)}
                                    className="p-4 rounded-full text-text border-2 border-transparent hover:border-text/10 hover:bg-text/5 transition-all outline-none"
                                    title="Play pronunciation"
                                >
                                    <Volume2 size={36} strokeWidth={2.5} />
                                </button>
                            </div>
                            <p className="text-2xl text-text-muted italic font-light">{currentVerb.English}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
                            <div>
                                <label htmlFor="pastParticiple" className="sr-only">Past Participle</label>
                                <div className="relative">
                                    <input
                                        id="pastParticiple"
                                        type="text"
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        disabled={isSubmitted}
                                        className={`w-full px-6 py-5 rounded-2xl border-[3px] bg-transparent text-text text-2xl md:text-3xl font-bold text-center tracking-tight shadow-sm outline-none transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)]
                                            ${!isSubmitted
                                                ? 'border-text/10 focus:border-text focus:shadow-xl'
                                                : isCorrect
                                                    ? 'border-green-500 bg-green-500/10 text-green-600 dark:text-green-400'
                                                    : 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400'
                                            }`}
                                        placeholder="e.g. gewesen"
                                        autoFocus
                                        autoComplete="off"
                                    />
                                    {isSubmitted && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            {isCorrect ? (
                                                <CheckCircle2 className="text-green-500" size={24} />
                                            ) : (
                                                <XCircle className="text-red-500" size={24} />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <AnimatePresence>
                                {isSubmitted && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, y: -10 }}
                                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`p-4 rounded-xl flex items-center justify-between ${isCorrect ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}
                                    >
                                        <div>
                                            <p className={`font-semibold ${isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                                                {isCorrect ? 'Richtig! (Correct!)' : 'Falsch! (Incorrect!)'}
                                            </p>
                                            {!isCorrect && (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-red-700 dark:text-red-300">Correct answer:</span>
                                                    <strong className="text-red-900 dark:text-red-100 font-sans text-lg">{currentVerb['Past Participle']}</strong>
                                                    <button
                                                        onClick={(e) => { e.preventDefault(); playPronunciation(currentVerb['Past Participle']); }}
                                                        className="p-1 rounded-full text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                                                        title="Play pronunciation"
                                                    >
                                                        <Volume2 size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={(e) => { e.preventDefault(); handleNext(); }}
                                            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${isCorrect
                                                ? 'bg-green-600 text-white hover:bg-green-700'
                                                : 'bg-red-600 text-white hover:bg-red-700'
                                                }`}
                                        >
                                            Next <ArrowRight size={18} />
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {!isSubmitted && (
                                <button
                                    type="submit"
                                    disabled={!userInput.trim()}
                                    className="w-full py-6 rounded-[2rem] bg-text hover:bg-primary text-background font-black text-2xl tracking-tight shadow-xl disabled:opacity-20 disabled:hover:bg-text disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02]"
                                >
                                    Check Answer
                                </button>
                            )}
                        </form>
                    </div>

                    <div className="mt-16 flex justify-center border-t-2 border-text/5 pt-8">
                        <button
                            onClick={handleRestart}
                            className="flex items-center gap-3 text-text-muted hover:text-text transition-all duration-300 text-lg font-bold uppercase tracking-widest hover:scale-105"
                        >
                            <RefreshCw size={24} strokeWidth={2.5} />
                            Reset Score
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default VerbPractice;

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
                        className="w-full p-6 text-2xl font-bold bg-transparent border-2 border-subtle focus:border-border rounded-2xl text-text outline-none transition-all placeholder:text-text/20"
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
                    {filteredVerbs.map((item, idx) => (
                        <div key={idx} className="bg-transparent border-[2px] border-subtle rounded-2xl p-6 hover:border-primary/50 hover:shadow-lg transition-all flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between gap-4 mb-2">
                                    <h3 className="text-2xl md:text-3xl font-black text-text tracking-tight">{item.German}</h3>
                                    <button
                                        onClick={() => playPronunciation(item.German)}
                                        className="p-2 rounded-full text-text hover:bg-text/5 transition-all"
                                        title="Play pronunciation"
                                    >
                                        <Volume2 size={20} strokeWidth={2.5} />
                                    </button>
                                </div>
                                <p className="text-lg md:text-xl text-text-muted italic font-light mb-6">{item.English}</p>
                            </div>

                            <div className="pt-4 border-t-2 border-subtle">
                                <span className="text-xs text-text-muted uppercase font-bold tracking-[0.2em] block mb-1">Past Participle</span>
                                <span className="text-2xl font-bold text-primary dark:text-blue-400">{item['Past Participle']}</span>
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
        <div className="max-w-6xl mx-auto p-4 md:p-8 pb-24 relative">
            {/* Background Decorative Elements */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* HEADER BLOCK */}
            <div className="mb-6 text-center md:text-left relative z-10">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 mb-3">Verbs Practice</h1>
                        <p className="text-sm md:text-base text-text-muted max-w-2xl font-light mb-6">
                            {mode === 'practice' ? 'Type the Past Participle for the given verb.' : 'Study the list of verbs and their past participles.'}
                        </p>

                        {/* MODE TOGGLE */}
                        <div className="inline-flex p-1.5 bg-surface/80 border border-subtle rounded-2xl shadow-sm relative">
                            {/* Sliding Background */}
                            <div
                                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-primary rounded-xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-md shadow-primary/20 pointer-events-none ${mode === 'practice' ? 'left-1.5' : 'left-[calc(50%+1.5px)]'}`}
                            />
                            <button
                                onClick={() => setMode('practice')}
                                className={`w-36 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative z-10 ${mode === 'practice'
                                    ? 'text-primary-foreground'
                                    : 'text-text-muted hover:text-text'
                                    }`}
                            >
                                <PenTool size={18} strokeWidth={2.5} />
                                Practice
                            </button>
                            <button
                                onClick={() => setMode('study')}
                                className={`w-36 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative z-10 ${mode === 'study'
                                    ? 'text-primary-foreground'
                                    : 'text-text-muted hover:text-text'
                                    }`}
                            >
                                <BookOpen size={18} strokeWidth={2.5} />
                                Study
                            </button>
                        </div>
                    </div>

                    {mode === 'practice' && (
                        <div className="flex items-center gap-6 justify-center md:justify-end shrink-0 bg-surface/50 backdrop-blur-md border border-subtle px-7 py-4 rounded-[2rem] shadow-sm">
                            <div className="text-center md:text-left">
                                <div className="text-[10px] text-text-muted uppercase font-black tracking-[0.2em] mb-1">Score</div>
                                <div className="font-black text-text tracking-tighter">
                                    <span className="text-3xl md:text-4xl leading-none text-primary">{score}</span><span className="text-xl md:text-2xl text-text-muted opacity-50 ml-1">/ {attempts}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MAIN LAYOUT */}
            <div className="relative z-10 min-h-[400px] w-full">
                {mode === 'study' ? renderStudyMode() : (
                    <div className="flex flex-col items-center gap-4 w-full max-w-4xl mx-auto">
                        <div className="bg-surface/20 backdrop-blur-sm border border-subtle rounded-[2rem] p-5 md:p-6 shadow-sm relative overflow-hidden w-full">
                            <div className="text-center space-y-4 transition-all duration-300 mx-auto relative z-10">
                                <div className="space-y-2 select-none relative pt-1 pb-1">
                                    <span className="absolute top-0 left-1/2 -translate-x-1/2 text-xs text-text-muted font-bold uppercase tracking-[0.3em] block">Infinitive</span>
                                    <div className="flex items-center justify-center gap-3 mt-3">
                                        <h2 className="text-2xl md:text-4xl font-black text-text tracking-tight pt-1">{currentVerb.German}</h2>
                                        <button
                                            onClick={() => playPronunciation(currentVerb.German)}
                                            className="p-1.5 rounded-full text-text border-2 border-transparent hover:border-text hover:bg-text/5 transition-all outline-none mt-1 shadow-sm"
                                            title="Play pronunciation"
                                        >
                                            <Volume2 size={20} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                    <p className="text-base md:text-lg text-text-muted italic font-light">{currentVerb.English}</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
                                    <div>
                                        <label htmlFor="pastParticiple" className="sr-only">Past Participle</label>
                                        <div className="relative">
                                            <input
                                                id="pastParticiple"
                                                type="text"
                                                value={userInput}
                                                onChange={(e) => setUserInput(e.target.value)}
                                                disabled={isSubmitted}
                                                className={`w-full px-4 py-3 rounded-xl border-[2px] bg-surface text-text text-lg md:text-xl font-bold text-center tracking-tight shadow-sm outline-none transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)]
                                                    ${!isSubmitted
                                                        ? 'border-subtle focus:border-text focus:shadow-xl'
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
                                                        <CheckCircle2 className="text-green-500" size={32} />
                                                    ) : (
                                                        <XCircle className="text-red-500" size={32} />
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
                                                className={`p-4 rounded-[1.25rem] flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm border ${isCorrect ? 'bg-green-100 dark:bg-green-900/30 border-green-500/20' : 'bg-red-100 dark:bg-red-900/30 border-red-500/20'}`}
                                            >
                                                <div className="flex-1 text-center md:text-left">
                                                    <p className={`font-black text-base mb-1 tracking-tight ${isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                                                        {isCorrect ? 'Richtig! (Correct!)' : 'Falsch! (Incorrect!)'}
                                                    </p>
                                                    {!isCorrect && (
                                                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 mt-1">
                                                            <span className="text-red-700/80 dark:text-red-300/80 font-bold uppercase tracking-wider text-[10px]">Correct answer:</span>
                                                            <div className="flex items-center gap-2">
                                                                <strong className="text-red-900 dark:text-red-100 font-sans text-lg tracking-tight">{currentVerb['Past Participle']}</strong>
                                                                <button
                                                                    onClick={(e) => { e.preventDefault(); playPronunciation(currentVerb['Past Participle']); }}
                                                                    className="p-1.5 rounded-full text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors shadow-sm bg-white/50 dark:bg-black/20"
                                                                    title="Play pronunciation"
                                                                >
                                                                    <Volume2 size={16} strokeWidth={2} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={(e) => { e.preventDefault(); handleNext(); }}
                                                    className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm hover:scale-105 shrink-0 w-full md:w-auto justify-center ${isCorrect
                                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                                        : 'bg-red-600 text-white hover:bg-red-700'
                                                        }`}
                                                >
                                                    Next <ArrowRight size={16} className="ml-1" />
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {!isSubmitted && (
                                        <button
                                            type="submit"
                                            disabled={!userInput.trim()}
                                            className="w-full py-3.5 rounded-[1.25rem] bg-text hover:bg-primary text-background font-black text-lg tracking-tight shadow-xl disabled:opacity-20 disabled:hover:bg-text disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02]"
                                        >
                                            Check Answer
                                        </button>
                                    )}
                                </form>
                            </div>

                            <div className="mt-5 flex justify-center">
                                <button
                                    onClick={handleRestart}
                                    className="flex items-center gap-2 text-text-muted hover:text-text transition-all duration-300 text-[11px] font-bold uppercase tracking-widest hover:scale-105"
                                >
                                    <RefreshCw size={14} strokeWidth={2.5} />
                                    Reset Score
                                </button>
                            </div>
                        </div>

                        {/* Pro Tip - Moved inside Practice mode below the card */}
                        <div className="flex flex-col gap-1.5 bg-indigo-500/5 dark:bg-indigo-400/5 p-4 rounded-3xl border border-indigo-500/10 backdrop-blur-sm w-full mx-auto max-w-4xl">
                            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-0.5">
                                <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Pro Tip</span>
                            </div>
                            <p className="text-xs text-text-muted font-medium leading-[1.5]">
                                Remember to include "sein" or "haben" if practicing perfect constructions (e.g. "ist gegangen"). But here, just type the participle itself (e.g. "gegangen").
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerbPractice;

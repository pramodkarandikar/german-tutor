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
            <div className="space-y-6 animate-fade-in">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search verbs, past participles or translations..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-4 bg-surface border border-border rounded-xl text-text focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredVerbs.map((item, idx) => (
                        <div key={idx} className="bg-surface p-5 rounded-2xl shadow-sm border border-border flex flex-col hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-xl font-bold text-text">{item.German}</h3>
                                    <button
                                        onClick={() => playPronunciation(item.German)}
                                        className="p-1 rounded-full text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                                        title="Play pronunciation"
                                    >
                                        <Volume2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2 mb-4">
                                <div className="flex flex-col">
                                    <span className="text-xs text-text-muted uppercase font-semibold">Past Participle</span>
                                    <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">{item['Past Participle']}</span>
                                </div>
                            </div>
                            <div className="mt-auto">
                                <p className="text-text-muted italic">{item.English}</p>
                            </div>
                        </div>
                    ))}
                    {filteredVerbs.length === 0 && (
                        <div className="col-span-full text-center p-8 text-text-muted">
                            No verbs found matching your search.
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (!currentVerb && mode === 'practice') return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-4 animate-fade-in space-y-6">
            <div className="flex flex-col mb-8 px-4 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-text mb-2">Verbs Practice</h1>
                    <p className="text-text-muted">
                        {mode === 'practice' ? 'Type the Past Participle for the given verb.' : 'Study the list of verbs and their past participles.'}
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                    <div className="flex items-center gap-4 bg-surface p-1 rounded-xl shadow-sm border border-border w-full sm:w-auto">
                        <button
                            onClick={() => setMode('practice')}
                            className={`flex flex-1 sm:flex-none items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                                mode === 'practice' 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'text-text-muted hover:text-text hover:bg-background'
                            }`}
                        >
                            <PenTool size={18} />
                            Practice
                        </button>
                        <button
                            onClick={() => setMode('study')}
                            className={`flex flex-1 sm:flex-none items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                                mode === 'study' 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'text-text-muted hover:text-text hover:bg-background'
                            }`}
                        >
                            <BookOpen size={18} />
                            Study
                        </button>
                    </div>

                    {mode === 'practice' && (
                        <div className="flex items-center w-full sm:w-auto mt-4 sm:mt-0 justify-end sm:justify-start">
                            <div className="flex flex-col items-center bg-surface border border-border px-6 py-2 rounded-xl shadow-sm">
                                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider mb-1">Score</span>
                                <div className="font-bold flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <span className="text-xl leading-none">{score}</span>
                                    <span className="text-sm text-text-muted ml-1">/ {attempts}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {mode === 'study' ? renderStudyMode() : (
                <>
                    <div className="bg-surface rounded-2xl shadow-sm border border-border p-8 relative overflow-hidden max-w-2xl mx-auto">
                        <div className="text-center mb-10">
                            <span className="text-sm text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wider mb-2 block">Infinitive</span>
                            <div className="flex items-center justify-center gap-3">
                                <h2 className="text-4xl font-bold text-text font-sans">{currentVerb.German}</h2>
                                <button
                                    onClick={() => playPronunciation(currentVerb.German)}
                                    className="p-2 rounded-full text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                                    title="Play pronunciation"
                                >
                                    <Volume2 size={24} />
                                </button>
                            </div>
                            <p className="text-lg text-text-muted mt-2">{currentVerb.English}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="pastParticiple" className="block text-sm font-medium text-text-muted mb-2">Past Participle</label>
                                <div className="relative">
                                    <input
                                        id="pastParticiple"
                                        type="text"
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        disabled={isSubmitted}
                                        className={`w-full px-4 py-4 rounded-xl border-2 bg-background text-text text-lg shadow-inner outline-none transition-all
                                            ${!isSubmitted
                                                ? 'border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                                                : isCorrect
                                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                                    : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
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
                                    className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Check Answer
                                </button>
                            )}
                        </form>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={handleRestart}
                            className="flex items-center gap-2 text-text-muted hover:text-text transition-colors text-sm font-medium"
                        >
                            <RefreshCw size={16} />
                            Reset Score
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default VerbPractice;

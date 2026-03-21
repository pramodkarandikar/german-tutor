import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from '../contexts/DataContext';
import { Check, X, RefreshCw, HelpCircle, Flame, BookOpen, PenTool } from 'lucide-react';

const WordGenderPractice = () => {
    const { wordGenders } = useContext(DataContext);
    const [mode, setMode] = useState('practice'); // 'practice' or 'study'
    const [currentWord, setCurrentWord] = useState(null);
    const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect', null
    const [streak, setStreak] = useState(0);
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        if (mode === 'practice' && !currentWord) {
            nextWord();
        }
    }, [wordGenders, mode]);

    const nextWord = () => {
        if (wordGenders && wordGenders.length > 0) {
            const randomIndex = Math.floor(Math.random() * wordGenders.length);
            setCurrentWord(wordGenders[randomIndex]);
            setFeedback(null);
            setShowHint(false);
        }
    };

    const handleGuess = (gender) => {
        if (!currentWord) return;

        if (gender.toLowerCase() === currentWord.gender.toLowerCase()) {
            setFeedback('correct');
            setStreak(s => s + 1);
            setTimeout(nextWord, 1500);
        } else {
            setFeedback('incorrect');
            setStreak(0);
            setShowHint(true);
        }
    };

    const toggleMode = () => {
        setMode(prev => prev === 'practice' ? 'study' : 'practice');
    };

    const renderStudyMode = () => {
        if (!wordGenders || wordGenders.length === 0) return <div>No data available.</div>;

        // Group by gender
        const rules = {
            'Der': [],
            'Die': [],
            'Das': []
        };

        // Extract unique rules and an example
        wordGenders.forEach(item => {
            if (!rules[item.gender]) return;
            const existingRule = rules[item.gender].find(r => r.rule === item.rule);
            if (!existingRule) {
                rules[item.gender].push({ rule: item.rule, example: item.word });
            }
        });

        const structuredRules = [
            { gender: 'Der', color: 'blue', rules: rules['Der'] },
            { gender: 'Die', color: 'red', rules: rules['Die'] },
            { gender: 'Das', color: 'green', rules: rules['Das'] },
        ];

        return (
            <div className="grid lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto animate-[fade-in_0.5s_cubic-bezier(0.19,1,0.22,1)]">
                {structuredRules.map((category, idx) => (
                    <div key={idx} className={`bg-surface/20 backdrop-blur-sm border-[2px] rounded-[2rem] p-6 shadow-sm flex flex-col h-full border-${category.color}-500/20`}>
                        <div className={`text-2xl font-black mb-6 pb-4 border-b-[3px] border-${category.color}-500/20 text-${category.color}-600 dark:text-${category.color}-400`}>
                            {category.gender}
                        </div>
                        <div className="space-y-4 flex-1">
                            {category.rules.map((r, idx) => (
                                <div key={idx} className="flex flex-col gap-1 bg-transparent border-l-4 border-subtle pl-3 py-1 hover:border-primary/50 transition-colors">
                                    <div className="text-base font-bold text-text tracking-tight leading-snug">{r.rule}</div>
                                    <div className="text-text-muted text-sm italic font-light">
                                        <span className="font-bold font-sans text-text">{r.example}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    if (!currentWord && mode === 'practice') return <div className="text-center p-8">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 pb-24 relative">
            {/* Background Decorative Elements */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* HEADER BLOCK */}
            {/* HEADER BLOCK */}
            <div className="mb-6 text-center md:text-left relative z-10">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 mb-3">Word Gender</h1>
                        <p className="text-sm md:text-base text-text-muted max-w-2xl font-light mb-6">
                            {mode === 'practice' ? 'Master the articles (der/die/das) through rapid repetition.' : 'Study the comprehensive vocabulary list.'}
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
                                <div className="text-[10px] text-text-muted uppercase font-black tracking-[0.2em] mb-1">Streak</div>
                                <div className={`font-black flex items-center justify-center md:justify-start gap-1.5 ${streak > 2 ? 'text-orange-500' : 'text-text'}`}>
                                    <Flame size={24} strokeWidth={streak > 2 ? 3 : 2} fill={streak > 2 ? "currentColor" : "none"} className={streak > 2 ? 'animate-pulse' : ''} />
                                    <span className="text-3xl md:text-4xl leading-none tracking-tighter">{streak}</span>
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
                                <div className="space-y-2 select-none mb-4">
                                    <span className="text-xs text-text-muted font-bold uppercase tracking-[0.3em] mb-2 block">Select Article</span>
                                    <h3 className="text-2xl md:text-4xl font-black text-text tracking-tight leading-tight">
                                        {currentWord.word}
                                    </h3>
                                    <div className="h-5 mt-2">
                                        {showHint && currentWord.translation && (
                                            <p className="text-base md:text-lg text-text-muted italic font-light animate-[fade-in_0.3s_ease-out]">{currentWord.translation}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-2xl mx-auto">
                                    {['Der', 'Die', 'Das'].map((gender) => (
                                        <button
                                            key={gender}
                                            onClick={() => handleGuess(gender)}
                                            disabled={feedback === 'correct'}
                                            className={`
                                                flex flex-col items-center justify-center py-2.5 px-3 rounded-[1.25rem] text-xl md:text-2xl font-black tracking-tight transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] transform active:scale-95
                                                ${feedback === 'correct' && gender.toLowerCase() === currentWord.gender.toLowerCase()
                                                    ? 'bg-green-500 text-white border-2 border-green-500 scale-105 shadow-xl'
                                                    : feedback === 'incorrect'
                                                        ? gender.toLowerCase() === currentWord.gender.toLowerCase()
                                                            ? 'bg-green-500/20 text-green-500 border-2 border-green-500/30'
                                                            : 'bg-surface/40 text-text/30 border-2 border-border/30 scale-95 opacity-50'
                                                        : `bg-surface text-text border-2 border-border hover:border-primary hover:text-primary hover:shadow-md hover:-translate-y-1`
                                                }
                                            `}
                                        >
                                            {gender}
                                        </button>
                                    ))}
                                </div>

                                {/* Feedback Area */}
                                <div className="h-16 flex items-center justify-center mt-4">
                                    {feedback === 'correct' && (
                                        <div className="flex items-center gap-2 text-green-500 animate-bounce bg-green-500/10 px-5 py-2.5 rounded-[1.25rem] border border-green-500/20">
                                            <Check size={24} strokeWidth={2.5} />
                                            <span className="text-xl font-black tracking-tight">Richtig! Correct!</span>
                                        </div>
                                    )}
                                    {feedback === 'incorrect' && (
                                        <div className="w-full max-w-xl mx-auto border border-red-500/20 rounded-[1rem] overflow-hidden shadow-sm animate-[fade-in_0.3s_cubic-bezier(0.19,1,0.22,1)]">
                                            <div className="flex items-center justify-center gap-2 text-red-500 bg-red-500/10 px-4 py-2">
                                                <X size={18} strokeWidth={2.5} />
                                                <span className="text-base font-black tracking-tight">Falsch! Try again.</span>
                                            </div>
                                            {currentWord.rule && (
                                                <div className="text-sm text-text bg-surface/80 px-3 py-2 border-t border-red-500/10 flex flex-col items-center justify-center text-center">
                                                    <p className="font-bold text-text-muted mb-0.5 uppercase tracking-widest text-[9px]">Rule Hint</p>
                                                    <p className="font-medium text-text text-sm">{currentWord.rule}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 flex justify-center">
                                <button
                                    onClick={nextWord}
                                    className="flex items-center gap-2 text-text-muted hover:text-text transition-all duration-300 font-bold uppercase tracking-widest text-[11px] hover:scale-105"
                                >
                                    <RefreshCw size={14} strokeWidth={2.5} />
                                    Skip Word
                                </button>
                            </div>
                        </div>

                        {/* Pro Tip - Moved inside Practice mode below the card */}
                        <div className="flex flex-col gap-1.5 bg-indigo-500/5 dark:bg-indigo-400/5 p-4 rounded-3xl border border-indigo-500/10 backdrop-blur-sm w-full mx-auto max-w-4xl">
                            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-0.5">
                                <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Pro Tip</span>
                            </div>
                            <p className="text-xs text-text-muted font-medium leading-[1.5]">
                                Focus on the word endings: <span className="text-indigo-600 dark:text-indigo-400 font-bold">-keit</span>, <span className="text-indigo-600 dark:text-indigo-400 font-bold">-heit</span>, <span className="text-indigo-600 dark:text-indigo-400 font-bold">-ung</span> are always DIE. <span className="text-indigo-600 dark:text-indigo-400 font-bold">-er</span> is often DER. <span className="text-indigo-600 dark:text-indigo-400 font-bold">-chen</span> is always DAS!
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WordGenderPractice;


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

        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 animate-[fade-in_0.5s_cubic-bezier(0.19,1,0.22,1)]">
                {Object.keys(rules).map(gender => (
                    <div key={gender} className={`border-[3px] rounded-2xl p-4 lg:p-6 flex flex-col ${
                        gender === 'Der' ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/50' :
                        gender === 'Die' ? 'bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-900/50' :
                        'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-900/50'
                    }`}>
                        <h2 className={`text-2xl md:text-3xl font-black tracking-tight mb-4 border-b-[3px] pb-3 ${
                            gender === 'Der' ? 'text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50' :
                            gender === 'Die' ? 'text-red-500 dark:text-red-400 border-red-200 dark:border-red-900/50' : 
                            'text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/50'
                            }`}>
                            {gender}
                        </h2>
                        <div className="flex flex-col gap-4">
                            {rules[gender].map((r, idx) => (
                                <div key={idx} className="flex flex-col gap-1 bg-transparent border-l-4 border-text/20 pl-3 py-1 hover:border-primary/50 transition-colors">
                                    <div className="text-base font-bold text-text tracking-tight leading-snug">{r.rule}</div>
                                    <div className="text-text-muted text-sm italic font-light">Ex: <span className="font-bold font-sans text-text">{r.example}</span></div>
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
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6 pb-24">
            <div className="flex flex-col mb-6 px-4 gap-3 text-center md:text-left">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent mb-4">Word Gender</h1>
                    <p className="text-base md:text-lg text-text-muted max-w-2xl font-light">
                        {mode === 'practice' ? 'Master the articles (der/die/das) through rapid repetition.' : 'Learn the patterns and rules for noun genders.'}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-6">
                    <div className="flex items-center gap-2 bg-surface border-[3px] border-text/10 p-1.5 rounded-2xl shadow-sm w-full sm:w-auto flex-1 md:flex-none">
                        <button
                            onClick={() => setMode('practice')}
                            className={`flex flex-1 sm:flex-none items-center justify-center gap-3 px-8 py-3.5 rounded-xl text-lg font-bold transition-all duration-300 ${mode === 'practice'
                                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]'
                                : 'text-text-muted hover:text-primary hover:bg-primary/5'
                                }`}
                        >
                            <PenTool size={20} strokeWidth={2.5} />
                            Practice
                        </button>
                        <button
                            onClick={() => setMode('study')}
                            className={`flex flex-1 sm:flex-none items-center justify-center gap-3 px-8 py-3.5 rounded-xl text-lg font-bold transition-all duration-300 ${mode === 'study'
                                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]'
                                : 'text-text-muted hover:text-primary hover:bg-primary/5'
                                }`}
                        >
                            <BookOpen size={20} strokeWidth={2.5} />
                            Study
                        </button>
                    </div>

                    {mode === 'practice' && (
                        <div className="flex items-center w-full sm:w-auto mt-4 sm:mt-0 justify-end sm:justify-start">
                            <div className="flex flex-col items-center bg-transparent px-6 py-2">
                                <div className="text-sm text-text-muted uppercase font-bold tracking-[0.2em] mb-1">Streak</div>
                                <div className={`font-black flex items-center justify-center gap-2 ${streak > 2 ? 'text-orange-500' : 'text-text'}`}>
                                    <Flame size={24} strokeWidth={streak > 2 ? 3 : 2} fill={streak > 2 ? "currentColor" : "none"} className={streak > 2 ? 'animate-pulse' : ''} />
                                    <span className="text-3xl leading-none tracking-tighter">{streak}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {mode === 'study' ? renderStudyMode() : (
                <>
                    <div className="text-center space-y-4 transition-all duration-300 max-w-4xl mx-auto pt-2">
                        <div className="space-y-2 select-none">
                            <h3 className="text-2xl md:text-3xl font-black text-text tracking-tight font-sans">
                                {currentWord.word}
                            </h3>
                            <div className="h-6">
                                {showHint && currentWord.translation && (
                                    <p className="text-xl md:text-2xl text-text-muted italic font-light animate-[fade-in_0.3s_ease-out]">{currentWord.translation}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto px-4">
                            {['Der', 'Die', 'Das'].map((gender) => (
                                <button
                                    key={gender}
                                    onClick={() => handleGuess(gender)}
                                    disabled={feedback === 'correct'}
                                    className={`
                                        py-4 lg:py-5 px-6 rounded-2xl md:rounded-[2rem] text-3xl font-black tracking-tight transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] transform active:scale-95
                                        ${feedback === 'correct' && gender.toLowerCase() === currentWord.gender.toLowerCase()
                                            ? 'bg-green-500 text-white border-[4px] border-green-500 scale-105 shadow-2xl'
                                            : feedback === 'incorrect'
                                                ? 'bg-surface text-text/20 border-[4px] border-text/5 cursor-not-allowed'
                                                : `border-[4px] text-text hover:text-white hover:-translate-y-2 hover:shadow-xl ${
                                                    gender === 'Der' ? 'bg-blue-100 hover:bg-blue-500 border-blue-200 dark:bg-blue-900/40 dark:border-blue-800' :
                                                    gender === 'Die' ? 'bg-red-100 hover:bg-red-500 border-red-200 dark:bg-red-900/40 dark:border-red-800' :
                                                    'bg-green-100 hover:bg-green-500 border-green-200 dark:bg-green-900/40 dark:border-green-800'
                                                }`
                                        }
                                    `}
                                >
                                    {gender}
                                </button>
                            ))}
                        </div>

                        {/* Feedback Area */}
                        <div className="h-16 flex items-center justify-center">
                            {feedback === 'correct' && (
                                <div className="flex items-center gap-2 text-green-600 animate-bounce">
                                    <Check size={24} />
                                    <span className="text-lg font-medium">Richtig! Correct!</span>
                                </div>
                            )}
                            {feedback === 'incorrect' && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center gap-2 text-red-500">
                                        <X size={24} />
                                        <span className="text-lg font-medium">Falsch! Try again.</span>
                                    </div>
                                    {currentWord.rule && (
                                        <div className="text-sm text-text-muted bg-background p-3 rounded-lg border border-border">
                                            <p className="font-semibold text-text">Rule Hint:</p>
                                            <p>{currentWord.rule}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={nextWord}
                            className="flex items-center gap-2 text-text-muted hover:text-text transition-colors"
                        >
                            <RefreshCw size={16} />
                            Skip Word
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default WordGenderPractice;


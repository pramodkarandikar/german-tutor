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
            <div className="space-y-8 animate-fade-in">
                {Object.keys(rules).map(gender => (
                    <div key={gender} className="bg-surface rounded-2xl shadow-sm border border-border p-6">
                        <h2 className={`text-2xl font-bold mb-4 ${
                            gender === 'Der' ? 'text-blue-500' :
                            gender === 'Die' ? 'text-red-500' : 'text-green-500'
                        }`}>{gender}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {rules[gender].map((r, idx) => (
                                <div key={idx} className="bg-background p-4 rounded-xl border border-border">
                                    <div className="font-semibold text-text mb-1">{r.rule}</div>
                                    <div className="text-text-muted italic text-sm">Example: {r.example}</div>
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
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex flex-col mb-8 px-4 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-text mb-2">Word Gender</h1>
                    <p className="text-text-muted">
                        {mode === 'practice' ? 'Choose the correct article for the noun.' : 'Learn the rules for noun genders.'}
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
                                <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider mb-1">Streak</div>
                                <div className={`font-bold flex items-center justify-center gap-1 ${streak > 2 ? 'text-orange-500' : 'text-text-muted'}`}>
                                    <Flame size={18} fill={streak > 2 ? "currentColor" : "none"} />
                                    <span className="text-xl leading-none">{streak}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {mode === 'study' ? renderStudyMode() : (
                <>
                    <div className="bg-surface rounded-2xl shadow-xl p-8 text-center space-y-8 transition-all duration-300 hover:shadow-2xl max-w-2xl mx-auto">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-text tracking-tight font-sans">
                                {currentWord.word}
                            </h3>
                            {showHint && currentWord.translation && (
                                <p className="text-text-muted italic">{currentWord.translation}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                            {['Der', 'Die', 'Das'].map((gender) => (
                                <button
                                    key={gender}
                                    onClick={() => handleGuess(gender)}
                                    disabled={feedback === 'correct'}
                                    className={`
                                        py-4 px-6 rounded-xl text-xl font-bold transition-all transform active:scale-95
                                        ${feedback === 'correct' && gender.toLowerCase() === currentWord.gender.toLowerCase()
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-500'
                                            : feedback === 'incorrect'
                                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                                : 'bg-background border-2 border-border text-text hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                        }
                                    `}
                                >
                                    {gender}
                                </button>
                            ))}
                        </div>

                        {/* Feedback Area */}
                        <div className="h-24 flex items-center justify-center">
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


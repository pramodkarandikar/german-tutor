import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from '../contexts/DataContext';
import { Check, X, RefreshCw, HelpCircle } from 'lucide-react';

const WordGenderPractice = () => {
    const { wordGenders } = useContext(DataContext);
    const [currentWord, setCurrentWord] = useState(null);
    const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect', null
    const [streak, setStreak] = useState(0);
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        nextWord();
    }, [wordGenders]);

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

    if (!currentWord) return <div className="text-center p-8">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-text">Word Gender Practice</h2>
                <p className="text-text-muted">Choose the correct article for the noun.</p>
                <div className="flex justify-center items-center gap-2">
                    <span className="text-sm font-medium text-amber-600">Streak: {streak}</span>
                </div>
            </div>

            <div className="bg-surface rounded-2xl shadow-xl p-8 text-center space-y-8 transition-all duration-300 hover:shadow-2xl">
                <div className="space-y-4">
                    <h3 className="text-5xl font-bold text-text tracking-tight">
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
        </div>
    );
};

export default WordGenderPractice;


import React, { useState, useMemo, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, XCircle, RefreshCw, HelpCircle, Flame } from 'lucide-react';
import CategoryFilter from './CategoryFilter';
import { DataContext } from '../contexts/DataContext';

const WritingPractice = () => {
    const { vocabulary } = useContext(DataContext);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect', or null
    const [score, setScore] = useState({ correct: 0, total: 0 });
    const [streak, setStreak] = useState(0);
    const inputRef = useRef(null);
    const nextButtonRef = useRef(null);
    const timerRef = useRef(null);

    // Filter cards based on selection and shuffle initially
    const cards = useMemo(() => {
        let filtered = vocabulary;
        if (selectedCategories.length > 0) {
            filtered = vocabulary.filter(item => selectedCategories.includes(item.category));
        }
        // Always randomize for practice mode to make it challenging
        return [...filtered].sort(() => Math.random() - 0.5);
    }, [selectedCategories, vocabulary]);

    useEffect(() => {
        setCurrentIndex(0);
        setScore({ correct: 0, total: 0 });
        setStreak(0);
        setFeedback(null);
        setUserInput('');
        if (timerRef.current) clearTimeout(timerRef.current);
    }, [selectedCategories]);

    const currentCard = cards[currentIndex];

    // Reset current index if it becomes invalid (e.g. data change)
    useEffect(() => {
        if (cards.length > 0 && currentIndex >= cards.length) {
            setCurrentIndex(0);
        }
    }, [cards, currentIndex]);


    const checkAnswer = () => {
        if (!userInput.trim()) return;

        const normalize = (str) => str.toLowerCase().trim().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
        const isCorrect = normalize(userInput) === normalize(currentCard.german);

        setFeedback(isCorrect ? 'correct' : 'incorrect');

        if (isCorrect) {
            setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
            setStreak(prev => prev + 1);
            // Auto-advance after delay
            timerRef.current = setTimeout(() => {
                handleNext();
            }, 1500);
        } else {
            setScore(prev => ({ ...prev, total: prev.total + 1 }));
            setStreak(0);
            // Focus 'Next' button so Enter works to skip
            setTimeout(() => nextButtonRef.current?.focus(), 50);
        }
    };

    const handleNext = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setFeedback(null);
        setUserInput('');
        setCurrentIndex((prev) => (prev + 1) % cards.length);
        // Focus back on input
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleGiveUp = () => {
        setFeedback('incorrect');
        setStreak(0);
        setScore(prev => ({ ...prev, total: prev.total + 1 }));
        setTimeout(() => nextButtonRef.current?.focus(), 50);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (feedback === 'correct') {
                // If waiting for auto-advance, skip immediately
                handleNext();
            } else if (feedback === 'incorrect') {
                handleNext();
            } else {
                checkAnswer();
            }
        }
    };

    const handleCategoryToggle = (category) => {
        if (category === 'All') {
            setSelectedCategories([]);
            return;
        }
        setSelectedCategories(prev => {
            if (prev.includes(category)) {
                return prev.filter(c => c !== category);
            } else {
                return [...prev, category];
            }
        });
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    if (cards.length === 0) {
        return <div className="text-center text-gray-500 mt-10">No cards found for these categories.</div>;
    }

    if (!currentCard) return null;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-end mb-8 px-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-text mb-2">Writing Practice</h1>
                    <p className="text-text-muted">Translate the words to German</p>
                </div>

                <div className="flex gap-6">
                    <div className="text-center">
                        <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Score</div>
                        <div className="font-bold text-xl text-gray-700">
                            <span className="text-blue-600">{score.correct}</span><span className="text-gray-300">/</span>{score.total}
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="text-xs text-text-muted uppercase font-bold tracking-wider">Streak</div>
                        <div className={`font-bold text-xl flex items-center justify-center gap-1 ${streak > 2 ? 'text-orange-500' : 'text-text-muted'}`}>
                            <Flame size={20} fill={streak > 2 ? "currentColor" : "none"} />
                            {streak}
                        </div>
                    </div>
                </div>
            </div>

            <CategoryFilter
                categories={[...new Set(vocabulary.map(item => item.category))].sort()}
                selectedCategories={selectedCategories}
                onToggleCategory={handleCategoryToggle}
            />

            <div className="bg-surface rounded-2xl shadow-xl overflow-hidden mt-6 border border-border">
                <div className="p-8 text-center relative">
                    <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-xs font-semibold rounded-full mb-4">
                        English
                    </span>
                    <h3 className="text-2xl font-bold text-text font-sans mb-2">{currentCard.english}</h3>

                    {/* Hint area */}
                    {currentCard.usage && feedback === 'incorrect' && (
                        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-sm rounded-lg animate-fade-in">
                            <span className="font-bold">Hint/Usage:</span> "{currentCard.usage}"
                        </div>
                    )}
                </div>

                <div className="p-8 bg-background border-t border-border">
                    {!feedback ? (
                        <div className="relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type the German word..."
                                className="w-full px-5 py-4 text-lg bg-surface border-2 border-border text-text rounded-xl focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-900/50 outline-none transition-all"
                                autoFocus
                            />
                            <button
                                onClick={checkAnswer}
                                disabled={!userInput.trim()}
                                className="absolute right-3 top-3 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="text-center animate-fade-in">
                            {feedback === 'correct' ? (
                                <div className="mb-6 flex flex-col items-center">
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-3">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h4 className="text-xl font-bold text-green-700 dark:text-green-400">Richtig! (Correct)</h4>
                                    <p className="text-text-muted mt-1 text-lg">{currentCard.german}</p>
                                    <p className="text-sm text-text-muted mt-2">Next card in 1.5s...</p>
                                </div>
                            ) : (
                                <div className="mb-6 flex flex-col items-center">
                                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-3">
                                        <XCircle size={32} />
                                    </div>
                                    <h4 className="text-xl font-bold text-red-700 dark:text-red-400">Falsch (Incorrect)</h4>
                                    <div className="mt-2 text-lg">
                                        <span className="text-text-muted line-through mr-2">{userInput}</span>
                                        <span className="text-green-600 dark:text-green-400 font-bold">{currentCard.german}</span>
                                    </div>
                                </div>
                            )}

                            <button
                                ref={nextButtonRef}
                                onClick={handleNext}
                                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                                className="px-8 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-colors flex items-center gap-2 mx-auto"
                            >
                                <RefreshCw size={18} />
                                Next Card <span className="text-xs opacity-50 font-normal ml-1">(Enter)</span>
                            </button>
                        </div>
                    )}

                    <div className="mt-4 text-center">
                        <button
                            onClick={handleGiveUp}
                            className={`text-sm text-text-muted hover:text-text flex items-center gap-1 mx-auto ${feedback ? 'hidden' : ''}`}
                        >
                            <HelpCircle size={14} />
                            I don't know
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WritingPractice;

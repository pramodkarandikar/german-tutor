
import React, { useState, useMemo, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, RefreshCw, HelpCircle, Flame, Layers } from 'lucide-react';
import CategoryFilter from './CategoryFilter';
import { DataContext } from '../contexts/DataContext';

const MultipleChoice = () => {
    const { vocabulary } = useContext(DataContext);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [score, setScore] = useState({ correct: 0, total: 0 });
    const [streak, setStreak] = useState(0);

    // Filter cards based on selection and shuffle initially
    const cards = useMemo(() => {
        let filtered = vocabulary;
        if (selectedCategories.length > 0) {
            filtered = vocabulary.filter(item => selectedCategories.includes(item.category));
        }
        return [...filtered].sort(() => Math.random() - 0.5);
    }, [selectedCategories, vocabulary]);

    useEffect(() => {
        // Reset state when category changes or data updates
        setCurrentIndex(0);
        setScore({ correct: 0, total: 0 });
        setStreak(0);
        setSelectedOption(null);
        setIsCorrect(null);
    }, [selectedCategories, vocabulary]); // Depend on vocabulary to reset if file uploads

    const currentCard = cards[currentIndex];

    // Generate options for the current card
    useEffect(() => {
        if (!currentCard) return;

        const distractors = vocabulary
            .filter(item => item.german !== currentCard.german)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(item => item.german);

        const allOptions = [...distractors, currentCard.german].sort(() => Math.random() - 0.5);
        setOptions(allOptions);
        setSelectedOption(null);
        setIsCorrect(null);
    }, [currentIndex, currentCard, vocabulary]);

    const handleOptionClick = (option) => {
        if (selectedOption) return; // Prevent multiple clicks

        setSelectedOption(option);
        const correct = option === currentCard.german;
        setIsCorrect(correct);

        if (correct) {
            setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
            setStreak(prev => prev + 1);
            // Auto advance
            setTimeout(handleNext, 1200);
        } else {
            setScore(prev => ({ ...prev, total: prev.total + 1 }));
            setStreak(0);
        }
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % cards.length);
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

    if (cards.length === 0) {
        return <div className="text-center text-gray-500 mt-10">No cards found for these categories.</div>;
    }

    if (!currentCard) return null;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-end mb-8 px-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-text mb-2">Multiple Choice</h1>
                    <p className="text-text-muted">Select the correct German translation</p>
                </div>

                <div className="flex gap-6">
                    <div className="text-center bg-surface border border-border px-4 py-2 rounded-xl shadow-sm">
                        <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider mb-1">Score</div>
                        <div className="font-bold text-lg text-text">
                            <span className="text-blue-600">{score.correct}</span><span className="text-text-muted mx-1">/</span>{score.total}
                        </div>
                    </div>

                    <div className="text-center bg-surface border border-border px-4 py-2 rounded-xl shadow-sm">
                        <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider mb-1">Streak</div>
                        <div className={`font-bold text-lg flex items-center justify-center gap-1 ${streak > 2 ? 'text-orange-500' : 'text-text-muted'}`}>
                            <Flame size={16} fill={streak > 2 ? "currentColor" : "none"} />
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
                <div className="p-10 text-center bg-background border-b border-border">
                    <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-semibold rounded-full mb-4">
                        Translate this
                    </span>
                    <h3 className="text-2xl font-bold text-text font-sans">{currentCard.english}</h3>
                </div>

                <div className="p-8 grid grid-cols-1 gap-3">
                    {options.map((option, index) => {
                        let btnClass = "p-4 rounded-xl border-2 text-lg font-medium transition-all text-left flex justify-between items-center ";

                        if (selectedOption) {
                            if (option === currentCard.german) {
                                btnClass += "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400"; // Correct answer (always show)
                            } else if (option === selectedOption) {
                                btnClass += "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400"; // Wrong selection
                            } else {
                                btnClass += "border-border text-text-muted opacity-50"; // Other options
                            }
                        } else {
                            btnClass += "border-border hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-text cursor-pointer hover:shadow-md";
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleOptionClick(option)}
                                disabled={!!selectedOption}
                                className={btnClass}
                            >
                                <span>{option}</span>
                                {selectedOption && option === currentCard.german && <CheckCircle size={20} className="text-green-600" />}
                                {selectedOption && option === selectedOption && option !== currentCard.german && <XCircle size={20} className="text-red-600" />}
                            </button>
                        );
                    })}
                </div>

                {selectedOption && !isCorrect && (
                    <div className="p-4 bg-background border-t border-border flex justify-center animate-fade-in-up">
                        <button
                            onClick={handleNext}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <RefreshCw size={18} />
                            Next Question
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MultipleChoice;

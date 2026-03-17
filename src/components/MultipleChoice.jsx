
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
        <div className="max-w-5xl mx-auto p-4 md:p-8 pb-24">
            <div className="flex flex-col mb-6 px-4 gap-3 text-center md:text-left">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 mb-4">Multiple Choice</h1>
                    <p className="text-base md:text-lg text-text-muted max-w-2xl font-light">Select the correct German translation.</p>
                </div>

                <div className="flex gap-8 justify-center md:justify-start mt-6">
                    <div className="text-center md:text-left bg-transparent">
                        <div className="text-sm text-text-muted uppercase font-bold tracking-[0.2em] mb-1">Score</div>
                        <div className="font-black text-text tracking-tighter">
                            <span className="text-4xl leading-none text-primary">{score.correct}</span><span className="text-2xl text-text-muted opacity-50 ml-1">/ {score.total}</span>
                        </div>
                    </div>

                    <div className="text-center md:text-left bg-transparent">
                        <div className="text-sm text-text-muted uppercase font-bold tracking-[0.2em] mb-1">Streak</div>
                        <div className={`font-black flex items-center justify-center md:justify-start gap-2 ${streak > 2 ? 'text-orange-500' : 'text-text'}`}>
                            <Flame size={24} strokeWidth={streak > 2 ? 3 : 2} fill={streak > 2 ? "currentColor" : "none"} className={streak > 2 ? 'animate-pulse' : ''} />
                            <span className="text-3xl leading-none tracking-tighter">{streak}</span>
                        </div>
                    </div>
                </div>
            </div>

            <CategoryFilter
                categories={[...new Set(vocabulary.map(item => item.category))].sort()}
                selectedCategories={selectedCategories}
                onToggleCategory={handleCategoryToggle}
            />

            <div className="mt-6">
                <div className="text-center mb-8">
                    <span className="text-sm text-text-muted font-bold uppercase tracking-[0.3em] mb-4 block">Translate this</span>
                    <h3 className="text-2xl md:text-3xl font-black text-text font-sans tracking-tight">{currentCard.english}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {options.map((option, index) => {
                        let btnClass = "px-6 py-5 rounded-2xl text-xl md:text-2xl font-bold tracking-tight transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] text-center flex justify-between items-center ";

                        if (selectedOption) {
                            if (option === currentCard.german) {
                                btnClass += "bg-green-500 text-white border-green-500 scale-105 shadow-2xl z-10 border-[3px]";
                            } else if (option === selectedOption) {
                                btnClass += "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500 border-[3px]";
                            } else {
                                btnClass += "bg-transparent border-text/5 text-text/30 cursor-not-allowed border-[3px]";
                            }
                        } else {
                            btnClass += "bg-transparent border-[3px] border-text/10 text-text hover:border-text hover:shadow-xl dark:hover:bg-white/5 cursor-pointer";
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleOptionClick(option)}
                                disabled={!!selectedOption}
                                className={btnClass}
                            >
                                <span className="flex-1 text-center">{option}</span>
                                {selectedOption && option === currentCard.german && <CheckCircle size={28} strokeWidth={2.5} className="text-white" />}
                                {selectedOption && option === selectedOption && option !== currentCard.german && <XCircle size={28} strokeWidth={2.5} className="text-red-500" />}
                            </button>
                        );
                    })}
                </div>

                {selectedOption && !isCorrect && (
                    <div className="flex justify-center mt-12 animate-[fade-in_0.3s_ease-out]">
                        <button
                            onClick={handleNext}
                            className="px-10 py-5 bg-text text-background rounded-[2rem] font-bold text-2xl hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] flex items-center gap-4"
                        >
                            <RefreshCw size={28} strokeWidth={2.5} />
                            Next Question
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MultipleChoice;

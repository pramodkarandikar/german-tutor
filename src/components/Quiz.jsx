
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Shuffle } from 'lucide-react';
import Flashcard from './Flashcard';
import CategoryFilter from './CategoryFilter';
import { DataContext } from '../contexts/DataContext';

const Quiz = () => {
    const { vocabulary } = useContext(DataContext);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isRandom, setIsRandom] = useState(true);

    // Extract unique categories
    const categories = useMemo(() => {
        return [...new Set(vocabulary.map(item => item.category))].sort();
    }, [vocabulary]);

    // Filter cards based on selection
    const cards = useMemo(() => {
        let filtered = vocabulary;
        if (selectedCategories.length > 0) {
            filtered = vocabulary.filter(item => selectedCategories.includes(item.category));
        }
        return isRandom ? [...filtered].sort(() => Math.random() - 0.5) : filtered;
    }, [selectedCategories, isRandom, vocabulary]);

    // Reset index when category changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [selectedCategories, isRandom]);

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % cards.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    };

    const toggleRandom = () => {
        setIsRandom(!isRandom);
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
        return <div className="text-center text-text-muted mt-10">No cards found for these categories.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-end mb-8 px-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-text mb-2">Flashcards</h1>
                    <p className="text-text-muted">Master your German skills with interactive flashcards</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10">
                <CategoryFilter
                    categories={categories}
                    selectedCategories={selectedCategories}
                    onToggleCategory={handleCategoryToggle}
                />
                <button
                    onClick={toggleRandom}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm border
             ${isRandom ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' : 'bg-surface text-text hover:bg-background border-border drop-shadow-sm'}`}
                >
                    <Shuffle size={18} />
                    {isRandom ? 'Randomized' : 'Sequential'}
                </button>
            </div>

            <div className="relative h-80 flex items-center justify-center">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentIndex}
                        initial={{ x: direction * 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -direction * 50, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute w-full"
                    >
                        <Flashcard card={cards[currentIndex]} />
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="flex justify-center items-center gap-8 mt-8">
                <button
                    onClick={handlePrev}
                    className="p-3 rounded-full bg-surface shadow-md hover:bg-background hover:shadow-lg transition-all text-text border border-border"
                    aria-label="Previous card"
                >
                    <ChevronLeft size={24} />
                </button>
                <span className="text-sm font-medium text-text-muted">
                    {currentIndex + 1} / {cards.length}
                </span>
                <button
                    onClick={handleNext}
                    className="p-3 rounded-full bg-surface shadow-md hover:bg-background hover:shadow-lg transition-all text-text border border-border"
                    aria-label="Next card"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default Quiz;

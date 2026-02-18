
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
    const [isRandom, setIsRandom] = useState(false);

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
        return <div className="text-center text-gray-500 mt-10">No cards found for these categories.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-2">Flashcards</h1>
            <p className="text-center text-gray-500 mb-8">Master your German skills with interactive flashcards</p>

            <CategoryFilter
                categories={categories}
                selectedCategories={selectedCategories}
                onToggleCategory={handleCategoryToggle}
            />

            <div className="flex justify-end mb-4">
                <button
                    onClick={toggleRandom}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-colors
             ${isRandom ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                    <Shuffle size={14} />
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
                    className="p-3 rounded-full bg-white shadow-md hover:bg-gray-50 hover:shadow-lg transition-all text-gray-600 border border-gray-100"
                    aria-label="Previous card"
                >
                    <ChevronLeft size={24} />
                </button>
                <span className="text-sm font-medium text-gray-400">
                    {currentIndex + 1} / {cards.length}
                </span>
                <button
                    onClick={handleNext}
                    className="p-3 rounded-full bg-white shadow-md hover:bg-gray-50 hover:shadow-lg transition-all text-gray-600 border border-gray-100"
                    aria-label="Next card"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default Quiz;

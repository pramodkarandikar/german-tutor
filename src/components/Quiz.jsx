
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
        <div className="max-w-4xl mx-auto p-4 md:p-8 animate-[fade-in_0.5s_cubic-bezier(0.19,1,0.22,1)] pb-24">
            <div className="mb-6 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 mb-4">
                    Flashcards
                </h1>
                <p className="text-base md:text-lg text-text-muted max-w-2xl font-light">
                    Master your vocabulary with interactive, spaced repetition style practice.
                </p>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
                <CategoryFilter
                    categories={categories}
                    selectedCategories={selectedCategories}
                    onToggleCategory={handleCategoryToggle}
                />
                <button
                    onClick={toggleRandom}
                    className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-bold transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] border-2
             ${isRandom ? 'bg-text text-background border-text shadow-xl scale-[1.02]' : 'bg-transparent text-text border-subtle hover:border-border'}`}
                >
                    <Shuffle size={20} strokeWidth={2.5} />
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

            <div className="flex justify-center items-center gap-10 mt-8">
                <button
                    onClick={handlePrev}
                    className="p-4 rounded-full bg-surface border-2 border-subtle hover:border-border hover:bg-text hover:text-background transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-110 group shadow-sm"
                    aria-label="Previous card"
                >
                    <ChevronLeft size={28} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <span className="text-lg font-bold font-mono text-text tracking-widest">
                    {String(currentIndex + 1).padStart(2, '0')} <span className="text-text/30 mx-2">/</span> {String(cards.length).padStart(2, '0')}
                </span>
                <button
                    onClick={handleNext}
                    className="p-4 rounded-full bg-surface border-2 border-subtle hover:border-border hover:bg-text hover:text-background transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-110 group shadow-sm"
                    aria-label="Next card"
                >
                    <ChevronRight size={28} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default Quiz;

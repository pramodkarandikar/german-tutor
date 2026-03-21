
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

    // Reset index when cards change (filtering or randomization)
    useEffect(() => {
        if (currentIndex >= cards.length) {
            setCurrentIndex(0);
        }
    }, [cards.length, currentIndex]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') {
                handleNext();
            } else if (e.key === 'ArrowLeft') {
                handlePrev();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [cards.length]); // Re-bind if cards length changes to ensure handleNext/Prev use latest state

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
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-surface border border-subtle rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                    <Shuffle className="text-text-muted opacity-20" size={40} />
                </div>
                <h3 className="text-xl font-black text-text mb-2">No cards found</h3>
                <p className="text-text-muted max-w-xs mb-8">Try selecting different categories or clearing your filters.</p>
                <button
                    onClick={() => handleCategoryToggle('All')}
                    className="px-8 py-3 bg-text text-background font-black rounded-2xl hover:scale-105 transition-transform"
                >
                    Clear All Filters
                </button>
            </div>
        );
    }

    const currentCard = cards[currentIndex] || cards[0];
    const progress = ((currentIndex + 1) / cards.length) * 100;

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 animate-[fade-in_0.5s_cubic-bezier(0.19,1,0.22,1)] pb-32 md:pb-24 relative">
            {/* Background Decorative Elements */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="mb-10 text-center md:text-left relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 mb-3">
                            Flashcards
                        </h1>
                        <p className="text-base md:text-lg text-text-muted max-w-2xl font-light">
                            Master your vocabulary with interactive, spaced repetition style practice.
                        </p>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] opacity-80">
                            Session Progress
                        </span>
                        <div className="w-48 h-2 bg-surface/50 border border-subtle rounded-full overflow-hidden shadow-sm backdrop-blur-sm">
                            <motion.div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8 relative z-10 min-h-[460px]">
                {/* Left Sidebar for Controls on Desktop */}
                <div className="w-full lg:w-72 flex flex-col gap-4 order-2 lg:order-1 h-auto">
                    <div className="bg-surface/40 backdrop-blur-md border border-subtle rounded-[2.5rem] p-6 space-y-5 shadow-sm">
                        <div>
                            <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3">Filters</h3>
                            <CategoryFilter
                                categories={categories}
                                selectedCategories={selectedCategories}
                                onToggleCategory={handleCategoryToggle}
                            />
                        </div>

                        <div className="pt-5 border-t border-subtle">
                            <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3">Mode</h3>
                            <button
                                onClick={toggleRandom}
                                className={`w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl font-bold transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] border-2
                                    ${isRandom
                                        ? 'bg-text text-background border-text shadow-xl scale-[1.02]'
                                        : 'bg-surface text-text border-subtle hover:border-border hover:bg-surface/80'}`}
                            >
                                <Shuffle size={18} strokeWidth={2.5} />
                                {isRandom ? 'Randomized' : 'Sequential'}
                            </button>
                        </div>
                    </div>

                    <div className="hidden lg:flex flex-col gap-2 bg-indigo-500/5 dark:bg-indigo-400/5 p-6 rounded-[2rem] border border-indigo-500/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Keyboard Tip</span>
                        </div>
                        <p className="text-xs text-text-muted font-medium leading-[1.6]">
                            Use <span className="text-text font-black">arrow keys</span> to quickly switch between cards.
                        </p>
                    </div>
                </div>

                {/* Main Card Area */}
                <div className="flex-1 w-full order-1 lg:order-2 flex flex-col justify-between">
                    <div className="relative h-[380px] flex items-center justify-center mb-10 w-full max-w-2xl mx-auto">
                        {/* Card Stack Effect (Decorative) */}
                        {/* <div className="absolute w-[88%] h-[340px] bg-surface/30 border border-subtle/50 rounded-[2.5rem] translate-y-10 scale-[0.88] opacity-20 -z-10" />
                        <div className="absolute w-[94%] h-[360px] bg-surface/50 border border-subtle/80 rounded-[2.5rem] translate-y-5 scale-[0.94] opacity-50 -z-10" /> */}

                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={currentIndex}
                                initial={{ x: direction * 80, opacity: 0, scale: 0.98 }}
                                animate={{ x: 0, opacity: 1, scale: 1 }}
                                exit={{ x: -direction * 80, opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                                className="absolute w-full"
                            >
                                <Flashcard card={currentCard} />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-center items-center gap-10 bg-surface/60 backdrop-blur-md border border-subtle p-2 rounded-full w-fit mx-auto shadow-sm">
                        <button
                            onClick={handlePrev}
                            className="p-4 rounded-full bg-surface border border-subtle hover:border-border hover:bg-text hover:text-background transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-110 group active:scale-95 shadow-sm"
                            aria-label="Previous card"
                        >
                            <ChevronLeft size={24} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
                        </button>

                        <div className="px-2 flex flex-col items-center min-w-[120px]">
                            <span className="text-3xl font-black font-mono text-text tracking-tighter leading-none">
                                {String(currentIndex + 1).padStart(2, '0')}
                            </span>
                            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mt-1.5 opacity-60">
                                OF {String(cards.length).padStart(2, '0')}
                            </span>
                        </div>

                        <button
                            onClick={handleNext}
                            className="p-4 rounded-full bg-surface border border-subtle hover:border-border hover:bg-text hover:text-background transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-110 group active:scale-95 shadow-sm"
                            aria-label="Next card"
                        >
                            <ChevronRight size={24} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Quiz;


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
        <div className="max-w-5xl mx-auto p-4 md:p-8 pb-24">
            <div className="flex flex-col mb-6 px-4 gap-3 mt-4 text-center md:text-left">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text mb-4">Writing Practice.</h1>
                    <p className="text-base md:text-lg text-text-muted max-w-2xl font-light">Translate the words to German.</p>
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

            <div className="mt-6 max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <span className="text-sm text-text-muted font-bold uppercase tracking-[0.3em] mb-4 block">English</span>
                    <h3 className="text-2xl md:text-3xl font-black text-text font-sans tracking-tight mb-3">{currentCard.english}</h3>

                    {/* Hint area */}
                    {currentCard.usage && feedback === 'incorrect' && (
                        <div className="mt-8 border-l-[6px] border-primary pl-8 py-4 text-left max-w-xl mx-auto animate-[fade-in_0.3s_ease-out]">
                            <span className="text-lg font-bold text-text-muted uppercase tracking-[0.2em]">Hint/Usage</span>
                            <p className="text-2xl text-text italic font-light mt-2">"{currentCard.usage}"</p>
                        </div>
                    )}
                </div>

                <div className="max-w-2xl mx-auto">
                    {!feedback ? (
                        <div className="space-y-6">
                            <div className="relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type the German word..."
                                    className="w-full px-6 py-5 text-2xl md:text-3xl font-bold text-center tracking-tight bg-transparent border-[3px] border-text/10 text-text rounded-2xl focus:border-text focus:shadow-xl outline-none transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] placeholder:text-text/15"
                                    autoFocus
                                />
                                <button
                                    onClick={checkAnswer}
                                    disabled={!userInput.trim()}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-text text-background rounded-2xl hover:bg-primary disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300"
                                >
                                    <Send size={28} strokeWidth={2.5} />
                                </button>
                            </div>
                            <div className="text-center">
                                <button
                                    onClick={handleGiveUp}
                                    className="text-lg text-text-muted hover:text-text flex items-center gap-2 mx-auto font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105"
                                >
                                    <HelpCircle size={22} strokeWidth={2.5} />
                                    I don't know
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center animate-[fade-in_0.5s_cubic-bezier(0.19,1,0.22,1)] space-y-8">
                            {feedback === 'correct' ? (
                                <div className="space-y-4">
                                    <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl">
                                        <CheckCircle size={48} strokeWidth={2.5} />
                                    </div>
                                    <h4 className="text-2xl md:text-3xl font-black text-green-500 tracking-tight">Richtig!</h4>
                                    <p className="text-3xl text-text font-bold">{currentCard.german}</p>
                                    <p className="text-lg text-text-muted">Next card in 1.5s...</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="w-24 h-24 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl">
                                        <XCircle size={48} strokeWidth={2.5} />
                                    </div>
                                    <h4 className="text-2xl md:text-3xl font-black text-red-500 tracking-tight">Falsch.</h4>
                                    <div className="text-3xl">
                                        <span className="text-text/30 line-through mr-4 font-bold">{userInput}</span>
                                        <span className="text-green-500 font-black">{currentCard.german}</span>
                                    </div>
                                </div>
                            )}

                            <button
                                ref={nextButtonRef}
                                onClick={handleNext}
                                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                                className="px-10 py-5 bg-text text-background rounded-[2rem] font-bold text-2xl hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] flex items-center gap-4 mx-auto"
                            >
                                <RefreshCw size={28} strokeWidth={2.5} />
                                Next Card <span className="text-sm opacity-40 font-normal ml-2">(Enter)</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WritingPractice;

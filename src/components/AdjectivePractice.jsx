import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Trophy, RefreshCw, ArrowRight } from 'lucide-react';
import adjectivesData from '../data/adjectives.json'; // Ensure this path is correct

const AdjectivePractice = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [gameWon, setGameWon] = useState(false);

    // Shuffle adjectives on load
    const questions = useMemo(() => {
        return [...adjectivesData].sort(() => Math.random() - 0.5);
    }, []);

    const currentAdjective = questions[currentIndex];

    // Generate options when the question changes
    useEffect(() => {
        if (!currentAdjective) return;

        const generateOptions = () => {
            const correctAnswer = currentAdjective.German;
            // Get 3 random other adjectives
            const others = questions
                .filter(a => a.German !== correctAnswer)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3)
                .map(a => a.German);

            // Combine and shuffle options
            const allOptions = [correctAnswer, ...others].sort(() => Math.random() - 0.5);
            setOptions(allOptions);
        };

        generateOptions();
        setSelectedOption(null);
        setIsCorrect(null);
    }, [currentIndex, currentAdjective, questions]);

    const playPronunciation = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'de-DE';
        window.speechSynthesis.speak(utterance);
    };

    const handleOptionSelect = (option) => {
        // Prevent clicking if already answered
        if (selectedOption !== null) return;

        setSelectedOption(option);
        const correct = option === currentAdjective.German;
        setIsCorrect(correct);
        setAttempts(prev => prev + 1);

        if (correct) {
            setScore(prev => prev + 1);
            // Auto play correct pronunciation
            playPronunciation(currentAdjective.German);

            if (currentIndex >= Math.min(19, questions.length - 1)) {
                // Win condition after 20 attempts, or max questions
                setTimeout(() => setGameWon(true), 1500);
            }
        } else {
            // If incorrect, still show them the right pronunciation
            playPronunciation(currentAdjective.German);
        }
    };

    const handleNext = () => {
        setCurrentIndex(prev => (prev + 1) % questions.length);
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setScore(0);
        setAttempts(0);
        setGameWon(false);
        setSelectedOption(null);
        setIsCorrect(null);
    }

    if (!currentAdjective) return <div className="p-8 text-center">Loading...</div>;

    if (gameWon) {
        return (
            <div className="max-w-2xl mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh] animate-fade-in">
                <div className="bg-surface rounded-2xl shadow-xl border border-border p-12 text-center w-full">
                    <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Trophy size={48} />
                    </div>
                    <h3 className="text-3xl font-bold text-text mb-2">Great job!</h3>
                    <p className="text-text-muted mb-8 text-lg">You scored {score} out of {attempts}.</p>
                    <button
                        onClick={handleRestart}
                        className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2 shadow-md"
                    >
                        <RefreshCw size={20} />
                        Play Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-4 animate-fade-in">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-text mb-2">Adjectives Quiz</h1>
                    <p className="text-text-muted">Select the correct German translation.</p>
                </div>
                <div className="flex gap-6">
                    <div className="text-center">
                        <div className="text-sm text-text-muted font-semibold uppercase tracking-wider">Score</div>
                        <div className="text-2xl font-bold font-sans text-blue-600 dark:text-blue-400">{score}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-text-muted font-semibold uppercase tracking-wider">Attempts</div>
                        <div className="text-2xl font-bold font-sans text-text">{attempts}</div>
                    </div>
                </div>
            </div>

            <div className="bg-surface rounded-2xl shadow-sm border border-border p-8 mb-8 relative">
                <div className="text-center mb-10">
                    <span className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider mb-2 block">English</span>
                    <h2 className="text-4xl font-bold text-text font-sans">{currentAdjective.English}</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {options.map((option, index) => {
                        let buttonClass = "bg-background border-border text-text hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20";

                        if (selectedOption !== null) {
                            if (option === currentAdjective.German) {
                                // Highlight correct answer
                                buttonClass = "bg-green-100 border-green-500 text-green-800 dark:bg-green-900/40 dark:text-green-200 dark:border-green-600 ring-2 ring-green-500";
                            } else if (option === selectedOption && !isCorrect) {
                                // Highlight wrong selection
                                buttonClass = "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/40 dark:text-red-200 dark:border-red-600";
                            } else {
                                // Dim other options
                                buttonClass = "bg-background border-border text-text opacity-50";
                            }
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleOptionSelect(option)}
                                disabled={selectedOption !== null}
                                className={`p-5 rounded-xl border-2 text-xl font-medium transition-all text-center flex items-center justify-between group ${buttonClass}`}
                            >
                                <span className="flex-1">{option}</span>
                                {option === currentAdjective.German && selectedOption !== null && (
                                    <div
                                        className="p-2 -mr-2 rounded-full hover:bg-white/20 dark:hover:bg-black/20"
                                        onClick={(e) => { e.stopPropagation(); playPronunciation(option); }}
                                        title="Play pronunciation"
                                    >
                                        <Volume2 size={20} />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence>
                {selectedOption !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-surface border border-border rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6"
                    >
                        <div className="flex-1">
                            <h4 className="font-semibold text-text mb-2 flex items-center gap-2">
                                Example Sentence
                                <button
                                    onClick={() => playPronunciation(currentAdjective.Example)}
                                    className="p-1 rounded-full text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                                    title="Play Example Sentence"
                                >
                                    <Volume2 size={16} />
                                </button>
                            </h4>
                            <p className="text-lg text-text-muted italic border-l-4 border-primary pl-4 py-1">
                                {currentAdjective.Example}
                            </p>
                        </div>
                        <button
                            onClick={handleNext}
                            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${isCorrect
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90'
                                }`}
                        >
                            Next <ArrowRight size={20} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdjectivePractice;

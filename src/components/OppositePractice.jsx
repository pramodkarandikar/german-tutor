import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Trophy, Volume2 } from 'lucide-react';
import oppositesData from '../data/opposites.json';

const OppositePractice = () => {
    const [cards, setCards] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [gameWon, setGameWon] = useState(false);

    const initializeGame = () => {
        // Select up to 6 random pairs
        const numPairs = Math.min(6, oppositesData.length);
        if (numPairs < 2) return;

        const selectedItems = [...oppositesData]
            .sort(() => Math.random() - 0.5)
            .slice(0, numPairs);

        // Create cards (German Word and German Opposite)
        const gameCards = selectedItems.flatMap(item => [
            { id: `${item.German}-base`, content: item.German, type: 'base', pairId: item.German, example: item['Example '] },
            { id: `${item.German}-opp`, content: item['Opposite (German)'], type: 'opposite', pairId: item.German, example: item['Example '] }
        ]).sort(() => Math.random() - 0.5);

        setCards(gameCards);
        setSelectedCards([]);
        setMatchedPairs([]);
        setScore(0);
        setAttempts(0);
        setGameWon(false);
    };

    useEffect(() => {
        initializeGame();
    }, []);

    const playPronunciation = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'de-DE';
        window.speechSynthesis.speak(utterance);
    };

    const handleCardClick = (card) => {
        // Play pronunciation immediately on click
        playPronunciation(card.content);

        // Ignore if already matched or selected or 2 cards already selected
        if (matchedPairs.includes(card.pairId) ||
            selectedCards.find(c => c.id === card.id) ||
            selectedCards.length >= 2) {
            return;
        }

        const newSelected = [...selectedCards, card];
        setSelectedCards(newSelected);

        if (newSelected.length === 2) {
            setAttempts(prev => prev + 1);
            const [first, second] = newSelected;

            if (first.pairId === second.pairId) {
                // Match found
                setMatchedPairs(prev => [...prev, first.pairId]);
                setScore(prev => prev + 10);
                setSelectedCards([]);

                // Check win condition
                const totalPairs = cards.length / 2;
                if (matchedPairs.length + 1 === totalPairs) {
                    setTimeout(() => setGameWon(true), 500);
                }
            } else {
                // No match, reset after delay
                setTimeout(() => {
                    setSelectedCards([]);
                }, 1000);
            }
        }
    };

    if (oppositesData.length < 2) {
        return <div className="text-center text-text-muted mt-10">Not enough data to play Opposite Pairs.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 animate-fade-in">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-text mb-2">Opposites Game</h1>
                    <p className="text-text-muted">Find the matching German antonyms (e.g. groß ↔ klein)</p>
                </div>

                <div className="flex gap-6">
                    <div className="text-center">
                        <div className="text-sm text-text-muted uppercase font-bold tracking-wider">Score</div>
                        <div className="font-bold text-2xl text-blue-600 dark:text-blue-400">{score}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-text-muted uppercase font-bold tracking-wider">Attempts</div>
                        <div className="font-bold text-2xl text-text">{attempts}</div>
                    </div>
                </div>
            </div>

            {gameWon ? (
                <div className="bg-surface rounded-2xl shadow-xl border border-border p-12 text-center mt-6 animate-fade-in">
                    <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Trophy size={48} />
                    </div>
                    <h3 className="text-3xl font-bold text-text mb-2">Excellent!</h3>
                    <p className="text-text-muted mb-8 text-lg">You cleared the board in {attempts} attempts.</p>
                    <button
                        onClick={initializeGame}
                        className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2 shadow-md mx-auto"
                    >
                        <RefreshCw size={20} />
                        Play Again
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                    {cards.map((card) => {
                        const isSelected = selectedCards.find(c => c.id === card.id);
                        const isMatched = matchedPairs.includes(card.pairId);

                        if (isMatched) {
                            return <div key={card.id} className="h-32"></div>; // Placeholder
                        }

                        let cardClass = "bg-surface text-text border-border hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20";
                        const isIncorrect = selectedCards.length === 2 && !isMatched && isSelected;

                        if (isSelected && !isIncorrect) {
                            cardClass = "bg-blue-600 text-white border-blue-600 scale-105 shadow-xl z-10";
                        } else if (isIncorrect) {
                            cardClass = "bg-red-500 text-white border-red-600 animate-[shake_0.5s_ease-in-out]";
                        }

                        return (
                            <motion.div
                                key={card.id}
                                layoutId={card.id}
                                onClick={() => handleCardClick(card)}
                                className={`h-32 rounded-xl flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all duration-200 shadow-sm border-2 relative group ${cardClass}`}
                                whileHover={!isSelected ? { scale: 1.02 } : {}}
                                whileTap={!isSelected ? { scale: 0.95 } : {}}
                            >
                                <span className="font-sans text-xl font-bold leading-tight select-none">
                                    {card.content}
                                </span>

                                <div className={`absolute bottom-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'text-blue-200' : 'text-text-muted'}`}>
                                    <Volume2 size={16} />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {!gameWon && (
                <div className="text-center mt-12">
                    <button
                        onClick={initializeGame}
                        className="text-text-muted hover:text-text flex items-center gap-2 mx-auto text-sm font-medium transition-colors"
                    >
                        <RefreshCw size={16} />
                        Reset Board
                    </button>
                </div>
            )}
        </div>
    );
};

export default OppositePractice;

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
        <div className="max-w-6xl mx-auto p-4 md:p-8 animate-[fade-in_0.5s_cubic-bezier(0.19,1,0.22,1)] pb-24">
            <div className="flex flex-col mb-6 gap-3 text-center md:text-left">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 mb-3">Opposites</h1>
                    <p className="text-base md:text-lg text-text-muted max-w-2xl font-light">
                        Find the matching German antonyms pairs (e.g. groß ↔ klein).
                    </p>
                </div>

                <div className="flex gap-8 justify-center md:justify-start mt-6">
                    <div className="text-center md:text-left bg-transparent">
                        <div className="text-sm text-text-muted uppercase font-bold tracking-[0.2em] mb-1">Score</div>
                        <div className="font-black text-4xl leading-none text-primary">{score}</div>
                    </div>
                    <div className="text-center md:text-left bg-transparent">
                        <div className="text-sm text-text-muted uppercase font-bold tracking-[0.2em] mb-1">Attempts</div>
                        <div className="font-black text-4xl leading-none text-text">{attempts}</div>
                    </div>
                </div>
            </div>

            {gameWon ? (
                <div className="text-center mt-16 space-y-8 animate-[fade-in_0.5s_cubic-bezier(0.19,1,0.22,1)]">
                    <div className="w-32 h-32 bg-text text-background rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl scale-110">
                        <Trophy size={64} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-3xl md:text-5xl font-black tracking-tight text-text">Excellent!</h3>
                    <p className="text-2xl text-text-muted font-light">You cleared the board in <span className="font-bold text-text">{attempts}</span> attempts.</p>
                    <div className="pt-8">
                        <button
                            onClick={initializeGame}
                            className="px-10 py-5 bg-text text-background rounded-[2rem] font-bold text-2xl hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] inline-flex items-center gap-4 border-4 border-transparent hover:border-border"
                        >
                            <RefreshCw size={28} strokeWidth={2.5} />
                            Play Again
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 px-2">
                    {cards.map((card) => {
                        const isSelected = selectedCards.find(c => c.id === card.id);
                        const isMatched = matchedPairs.includes(card.pairId);

                        if (isMatched) {
                            return <div key={card.id} className="h-28 md:h-32 border-[2px] border-dashed border-subtle rounded-2xl md:rounded-[2rem]"></div>; // Placeholder
                        }

                        let cardClass = "bg-transparent text-text border-[2px] border-subtle hover:border-border hover:shadow-lg dark:hover:bg-white/5";
                        const isIncorrect = selectedCards.length === 2 && !isMatched && isSelected;

                        if (isSelected && !isIncorrect) {
                            cardClass = "bg-text text-background border-text scale-105 shadow-2xl z-10";
                        } else if (isIncorrect) {
                            cardClass = "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500 animate-[shake_0.5s_ease-in-out]";
                        }

                        return (
                            <motion.div
                                key={card.id}
                                layoutId={card.id}
                                onClick={() => handleCardClick(card)}
                                className={`h-28 md:h-32 rounded-2xl md:rounded-[2rem] flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] relative group select-none ${cardClass}`}
                                whileTap={!isSelected ? { scale: 0.95 } : {}}
                            >
                                <span className={`font-sans text-lg md:text-xl xl:text-2xl font-black tracking-tight leading-none ${isSelected && !isIncorrect ? 'text-background' : 'text-text'}`}>
                                    {card.content}
                                </span>

                                <div className={`absolute bottom-4 right-4 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${isSelected && !isIncorrect ? 'text-background/50 hover:bg-background/20' : 'text-text/30 hover:bg-text/5 hover:text-text'}`}>
                                    <Volume2 size={24} strokeWidth={2.5} />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {!gameWon && (
                <div className="mt-12 flex justify-center">
                    <button
                        onClick={initializeGame}
                        className="flex items-center gap-3 text-text-muted hover:text-text transition-all duration-300 text-lg font-bold uppercase tracking-widest hover:scale-105"
                    >
                        <RefreshCw size={24} strokeWidth={2.5} />
                        Reset Board
                    </button>
                </div>
            )}
        </div>
    );
};

export default OppositePractice;

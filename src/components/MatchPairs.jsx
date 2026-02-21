
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Trophy, Flame } from 'lucide-react';
import CategoryFilter from './CategoryFilter';
import { DataContext } from '../contexts/DataContext';

const MatchPairs = () => {
    const { vocabulary } = useContext(DataContext);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [cards, setCards] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [gameWon, setGameWon] = useState(false);

    // Filter vocabulary based on category
    const filteredVocabulary = useMemo(() => {
        let filtered = vocabulary;
        if (selectedCategories.length > 0) {
            filtered = vocabulary.filter(item => selectedCategories.includes(item.category));
        }
        return filtered;
    }, [selectedCategories, vocabulary]);

    // Initialize game
    const initializeGame = () => {
        // Select up to 6 random items
        const numPairs = Math.min(6, filteredVocabulary.length);

        if (numPairs < 2) return; // Need at least 2 pairs

        const selectedItems = [...filteredVocabulary]
            .sort(() => Math.random() - 0.5)
            .slice(0, numPairs);

        // Create cards (German and English)
        const gameCards = selectedItems.flatMap(item => [
            { id: `${item.id}-de`, content: item.german, type: 'german', pairId: item.id },
            { id: `${item.id}-en`, content: item.english, type: 'english', pairId: item.id }
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
    }, [selectedCategories, vocabulary]); // Re-init if category or data changes

    const handleCardClick = (card) => {
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

    if (filteredVocabulary.length < 2) {
        return <div className="text-center text-gray-500 mt-10">Not enough words in this category to play Match Pairs (Need at least 2).</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-end mb-8 px-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-text mb-2">Match Pairs</h1>
                    <p className="text-text-muted">Find the matching German and English pairs</p>
                </div>

                <div className="flex gap-6">
                    <div className="text-center">
                        <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Score</div>
                        <div className="font-bold text-xl text-blue-600">{score}</div>
                    </div>

                    <div className="text-center">
                        <div className="text-xs text-text-muted uppercase font-bold tracking-wider">Attempts</div>
                        <div className="font-bold text-xl text-text">{attempts}</div>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <CategoryFilter
                    categories={[...new Set(vocabulary.map(item => item.category))].sort()}
                    selectedCategories={selectedCategories}
                    onToggleCategory={handleCategoryToggle}
                />
            </div>

            {gameWon ? (
                <div className="bg-surface rounded-2xl shadow-xl p-12 text-center mt-6 animate-fade-in">
                    <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Trophy size={48} />
                    </div>
                    <h3 className="text-3xl font-bold text-text mb-2">Excellent!</h3>
                    <p className="text-text-muted mb-8">You cleared the board in {attempts} attempts.</p>
                    <button
                        onClick={initializeGame}
                        className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                    >
                        <RefreshCw size={18} />
                        Play Again
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                    {cards.map((card) => {
                        const isSelected = selectedCards.find(c => c.id === card.id);
                        const isMatched = matchedPairs.includes(card.pairId);

                        if (isMatched) {
                            return <div key={card.id} className="h-24"></div>; // Placeholder to keep grid layout
                        }

                        return (
                            <motion.div
                                key={card.id}
                                layoutId={card.id}
                                onClick={() => handleCardClick(card)}
                                className={`h-24 rounded-xl flex items-center justify-center p-4 text-center cursor-pointer transition-all duration-200 shadow-sm border-2
                  ${isSelected
                                        ? 'bg-blue-600 text-white border-blue-600 scale-105 shadow-xl z-10'
                                        : 'bg-surface text-text border-border hover:border-blue-200 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="font-medium text-base leading-tight select-none">
                                    {card.content}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {!gameWon && (
                <div className="text-center mt-8">
                    <button
                        onClick={initializeGame}
                        className="text-text-muted hover:text-text flex items-center gap-1 mx-auto text-sm"
                    >
                        <RefreshCw size={14} />
                        Reset Board
                    </button>
                </div>
            )}
        </div>
    );
};

export default MatchPairs;

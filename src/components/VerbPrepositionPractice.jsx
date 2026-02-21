import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from '../contexts/DataContext';
import { Check, X, RefreshCw, ArrowRight, ChevronDown, Flame } from 'lucide-react';

const VerbPrepositionPractice = () => {
    const { verbPrepositions } = useContext(DataContext);
    const [currentVerb, setCurrentVerb] = useState(null);
    const [prepositionInput, setPrepositionInput] = useState('');
    const [caseInput, setCaseInput] = useState('');
    const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect', null
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        nextVerb();
    }, [verbPrepositions]);

    const nextVerb = () => {
        if (verbPrepositions && verbPrepositions.length > 0) {
            const randomIndex = Math.floor(Math.random() * verbPrepositions.length);
            setCurrentVerb(verbPrepositions[randomIndex]);
            setPrepositionInput('');
            setCaseInput('');
            setFeedback(null);
        }
    };

    const checkAnswer = () => {
        if (!currentVerb) return;

        const isPrepCorrect = prepositionInput.toLowerCase().trim() === currentVerb.preposition.toLowerCase().trim();
        const isCaseCorrect = caseInput.toLowerCase().trim() === currentVerb.case.toLowerCase().trim();

        if (isPrepCorrect && isCaseCorrect) {
            setFeedback('correct');
            setStreak(s => s + 1);
        } else {
            setFeedback('incorrect');
            setStreak(0);
        }
    };

    if (!currentVerb) return <div className="text-center p-8">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            <div className="flex justify-between items-end mb-8 px-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-text mb-2">Verb Prepositions</h1>
                    <p className="text-text-muted">Enter the correct preposition and case.</p>
                </div>
                <div className="flex gap-6">
                    <div className="text-center">
                        <div className="text-xs text-text-muted uppercase font-bold tracking-wider">Streak</div>
                        <div className={`font-bold text-xl flex items-center justify-center gap-1 ${streak > 2 ? 'text-orange-500' : 'text-text-muted'}`}>
                            <Flame size={20} fill={streak > 2 ? "currentColor" : "none"} />
                            {streak}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-surface rounded-2xl shadow-xl p-8 space-y-8 transition-all duration-300 hover:shadow-2xl">
                <div className="text-center space-y-4">
                    <h3 className="text-2xl font-bold text-text tracking-tight">
                        {currentVerb.verb}
                    </h3>
                    <p className="text-xl text-text-muted italic">
                        {currentVerb.translation}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-text-muted">Preposition</label>
                        <input
                            type="text"
                            value={prepositionInput}
                            onChange={(e) => setPrepositionInput(e.target.value)}
                            placeholder="e.g. auf"
                            disabled={feedback === 'correct'}
                            className="w-full p-3 bg-background border border-border text-text rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-text-muted">Case</label>
                        <div className="relative">
                            <select
                                value={caseInput}
                                onChange={(e) => setCaseInput(e.target.value)}
                                disabled={feedback === 'correct'}
                                className="w-full p-3 bg-background border border-border text-text rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none appearance-none"
                            >
                                <option value="">Select Case</option>
                                <option value="Akkusativ">Akkusativ</option>
                                <option value="Dativ">Dativ</option>
                                <option value="Genitiv">Genitiv</option>
                                <option value="Nominativ">Nominativ</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={20} />
                        </div>
                    </div>
                </div>

                {/* Feedback Area */}
                <div className="min-h-[100px] flex items-center justify-center">
                    {feedback === null && (
                        <button
                            onClick={checkAnswer}
                            disabled={!prepositionInput || !caseInput}
                            className={`
                                w-full py-3 px-6 rounded-xl text-lg font-bold text-white transition-all transform active:scale-95
                                ${!prepositionInput || !caseInput
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                                }
                            `}
                        >
                            Check Answer
                        </button>
                    )}

                    {feedback === 'correct' && (
                        <div className="w-full space-y-4">
                            <div className="flex items-center justify-center gap-2 text-green-600 animate-bounce">
                                <Check size={28} />
                                <span className="text-xl font-bold">Richtig! Correct!</span>
                            </div>
                            <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-green-800">
                                <p className="font-medium italic">"{currentVerb.example}"</p>
                            </div>
                            <button
                                onClick={nextVerb}
                                className="w-full py-3 px-6 rounded-xl text-lg font-bold text-white bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2"
                            >
                                Next Verb <ArrowRight size={20} />
                            </button>
                        </div>
                    )}

                    {feedback === 'incorrect' && (
                        <div className="w-full space-y-4">
                            <div className="flex items-center justify-center gap-2 text-red-500">
                                <X size={28} />
                                <span className="text-xl font-bold">Leider Falsch.</span>
                            </div>
                            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 space-y-2">
                                <p>Correct Answer:</p>
                                <p className="font-bold text-lg">{currentVerb.preposition} + {currentVerb.case}</p>
                                <p className="italic text-sm text-text-muted">"{currentVerb.example}"</p>
                            </div>
                            <button
                                onClick={nextVerb} // Or retry? Let's next for flow
                                className="w-full py-3 px-6 rounded-xl text-lg font-bold text-text-muted bg-background hover:bg-surface border border-border transition-all transform active:scale-95"
                            >
                                Next Verb
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-center">
                <button
                    onClick={nextVerb}
                    className="flex items-center gap-2 text-text-muted hover:text-text transition-colors"
                >
                    <RefreshCw size={16} />
                    Skip
                </button>
            </div>
        </div>
    );
};

export default VerbPrepositionPractice;

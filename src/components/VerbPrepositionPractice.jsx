import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from '../contexts/DataContext';
import { Check, X, RefreshCw, ArrowRight, ChevronDown, Flame, BookOpen, PenTool } from 'lucide-react';

const VerbPrepositionPractice = () => {
    const { verbPrepositions } = useContext(DataContext);
    const [mode, setMode] = useState('practice'); // 'practice' or 'study'
    const [currentVerb, setCurrentVerb] = useState(null);
    const [prepositionInput, setPrepositionInput] = useState('');
    const [caseInput, setCaseInput] = useState('');
    const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect', null
    const [streak, setStreak] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (mode === 'practice' && !currentVerb) {
            nextVerb();
        }
    }, [verbPrepositions, mode]);

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

    const renderStudyMode = () => {
        if (!verbPrepositions || verbPrepositions.length === 0) return <div>No data available.</div>;

        const filteredVerbs = verbPrepositions.filter(v => 
            v.verb.toLowerCase().includes(searchQuery.toLowerCase()) || 
            v.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.preposition.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.case.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            <div className="space-y-6 animate-fade-in">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search verbs, translations, prepositions, or cases..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-4 bg-surface border border-border rounded-xl text-text focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredVerbs.map((item, idx) => (
                        <div key={idx} className="bg-surface p-6 rounded-2xl shadow-sm border border-border flex flex-col h-full hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-text">{item.verb}</h3>
                                <div className="text-sm font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full">
                                    {item.preposition} + {item.case}
                                </div>
                            </div>
                            <p className="text-text-muted italic mb-4">{item.translation}</p>
                            <div className="mt-auto">
                                <p className="text-sm text-text-muted italic border-l-2 border-blue-500 pl-3 py-1">"{item.example}"</p>
                            </div>
                        </div>
                    ))}
                    {filteredVerbs.length === 0 && (
                        <div className="col-span-full text-center p-8 text-text-muted">
                            No verbs found matching your search.
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (!currentVerb && mode === 'practice') return <div className="text-center p-8">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex flex-col mb-8 px-4 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-text mb-2">Verb Prepositions</h1>
                    <p className="text-text-muted">
                        {mode === 'practice' ? 'Enter the correct preposition and case.' : 'Study the list of verbs and their prepositions.'}
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                    <div className="flex items-center gap-4 bg-surface p-1 rounded-xl shadow-sm border border-border w-full sm:w-auto">
                        <button
                            onClick={() => setMode('practice')}
                            className={`flex flex-1 sm:flex-none items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                                mode === 'practice' 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'text-text-muted hover:text-text hover:bg-background'
                            }`}
                        >
                            <PenTool size={18} />
                            Practice
                        </button>
                        <button
                            onClick={() => setMode('study')}
                            className={`flex flex-1 sm:flex-none items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                                mode === 'study' 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'text-text-muted hover:text-text hover:bg-background'
                            }`}
                        >
                            <BookOpen size={18} />
                            Study
                        </button>
                    </div>

                    {mode === 'practice' && (
                        <div className="flex items-center w-full sm:w-auto mt-4 sm:mt-0 justify-end sm:justify-start">
                            <div className="flex flex-col items-center bg-surface border border-border px-6 py-2 rounded-xl shadow-sm">
                                <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider mb-1">Streak</div>
                                <div className={`font-bold flex items-center justify-center gap-1 ${streak > 2 ? 'text-orange-500' : 'text-text-muted'}`}>
                                    <Flame size={18} fill={streak > 2 ? "currentColor" : "none"} />
                                    <span className="text-xl leading-none">{streak}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {mode === 'study' ? renderStudyMode() : (
                <>
                    <div className="bg-surface rounded-2xl shadow-xl p-8 space-y-8 transition-all duration-300 hover:shadow-2xl max-w-2xl mx-auto">
                        <div className="text-center space-y-4">
                            <h3 className="text-2xl font-bold text-text font-sans tracking-tight">
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
                </>
            )}
        </div>
    );
};

export default VerbPrepositionPractice;


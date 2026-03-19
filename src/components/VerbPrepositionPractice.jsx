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
            <div className="space-y-6 animate-[fade-in_0.5s_cubic-bezier(0.19,1,0.22,1)]">
                <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder="Search verbs, translations, prepositions, or cases..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-6 text-2xl font-bold bg-transparent border-2 border-subtle focus:border-border rounded-2xl text-text outline-none transition-all placeholder:text-text/20"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVerbs.map((item, idx) => (
                        <div key={idx} className="bg-transparent border-[2px] border-subtle rounded-2xl p-6 hover:border-primary/50 hover:shadow-lg transition-all flex flex-col justify-between">
                            <div>
                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                    <h3 className="text-2xl md:text-3xl font-black text-text tracking-tight">{item.verb}</h3>
                                    <span className="text-sm font-bold text-primary border-2 border-subtle px-3 py-1 rounded-lg">
                                        {item.preposition} + {item.case}
                                    </span>
                                </div>
                                <p className="text-lg md:text-xl text-text-muted italic font-light mb-6">{item.translation}</p>
                            </div>

                            <div className="pt-4 border-t-2 border-subtle">
                                <span className="text-xs text-text-muted uppercase font-bold tracking-[0.2em] block mb-2">Example</span>
                                <p className="text-base text-text italic font-medium leading-relaxed">"{item.example}"</p>
                            </div>
                        </div>
                    ))}
                    {filteredVerbs.length === 0 && (
                        <div className="text-center py-16 text-3xl font-bold text-text/20 italic">
                            No verbs found matching your search.
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (!currentVerb && mode === 'practice') return <div className="text-center p-8">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6 pb-24">
            <div className="flex flex-col mb-6 px-4 gap-3 text-center md:text-left">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 mb-4">Verb Prepositions</h1>
                    <p className="text-base md:text-lg text-text-muted max-w-2xl font-light">
                        {mode === 'practice' ? 'Enter the correct preposition and case.' : 'Study the list of verbs and their prepositions.'}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-6">
                    <div className="flex items-center gap-2 bg-surface border-[2px] border-subtle p-1.5 rounded-2xl shadow-sm w-full sm:w-auto flex-1 md:flex-none">
                        <button
                            onClick={() => setMode('practice')}
                            className={`flex flex-1 sm:flex-none items-center justify-center gap-3 px-8 py-3.5 rounded-xl text-lg font-bold transition-all duration-300 ${mode === 'practice'
                                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]'
                                : 'text-text-muted hover:text-primary hover:bg-primary/5'
                                }`}
                        >
                            <PenTool size={20} strokeWidth={2.5} />
                            Practice
                        </button>
                        <button
                            onClick={() => setMode('study')}
                            className={`flex flex-1 sm:flex-none items-center justify-center gap-3 px-8 py-3.5 rounded-xl text-lg font-bold transition-all duration-300 ${mode === 'study'
                                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]'
                                : 'text-text-muted hover:text-primary hover:bg-primary/5'
                                }`}
                        >
                            <BookOpen size={20} strokeWidth={2.5} />
                            Study
                        </button>
                    </div>

                    {mode === 'practice' && (
                        <div className="flex items-center w-full sm:w-auto mt-4 sm:mt-0 justify-end sm:justify-start">
                            <div className="flex flex-col items-center bg-transparent px-6 py-2">
                                <div className="text-sm text-text-muted uppercase font-bold tracking-[0.2em] mb-1">Streak</div>
                                <div className={`font-black flex items-center justify-center gap-2 ${streak > 2 ? 'text-orange-500' : 'text-text'}`}>
                                    <Flame size={24} strokeWidth={streak > 2 ? 3 : 2} fill={streak > 2 ? "currentColor" : "none"} className={streak > 2 ? 'animate-pulse' : ''} />
                                    <span className="text-3xl leading-none tracking-tighter">{streak}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {mode === 'study' ? renderStudyMode() : (
                <>
                    <div className="text-center space-y-8 transition-all duration-300 max-w-4xl mx-auto pt-4">
                        <div className="space-y-6 select-none">
                            <h3 className="text-2xl md:text-3xl font-black text-text tracking-tight font-sans">
                                {currentVerb.verb}
                            </h3>
                            <p className="text-2xl text-text-muted italic font-light">
                                {currentVerb.translation}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                            <div>
                                <label className="sr-only">Preposition</label>
                                <input
                                    type="text"
                                    value={prepositionInput}
                                    onChange={(e) => setPrepositionInput(e.target.value)}
                                    placeholder="Preposition (e.g. auf)"
                                    disabled={feedback === 'correct'}
                                    className="w-full px-6 py-4 rounded-xl border-2 bg-transparent text-text text-xl md:text-2xl font-bold text-center tracking-tight outline-none transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] border-subtle focus:border-border focus:shadow-xl placeholder:text-text/30"
                                />
                            </div>
                            <div className="relative">
                                <label className="sr-only">Case</label>
                                <select
                                    value={caseInput}
                                    onChange={(e) => setCaseInput(e.target.value)}
                                    disabled={feedback === 'correct'}
                                    className="w-full px-6 py-4 rounded-xl border-2 bg-transparent text-text text-xl md:text-2xl font-bold text-center tracking-tight outline-none transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] border-subtle focus:border-border focus:shadow-xl appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-surface text-text">Select Case</option>
                                    <option value="Akkusativ" className="bg-surface text-text">Akkusativ</option>
                                    <option value="Dativ" className="bg-surface text-text">Dativ</option>
                                    <option value="Genitiv" className="bg-surface text-text">Genitiv</option>
                                    <option value="Nominativ" className="bg-surface text-text">Nominativ</option>
                                </select>
                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={28} strokeWidth={2.5} />
                            </div>
                        </div>

                        {/* Feedback Area */}
                        <div className="min-h-[120px] flex items-center justify-center">
                            {feedback === null && (
                                <button
                                    onClick={checkAnswer}
                                    disabled={!prepositionInput || !caseInput}
                                    className="w-full max-w-2xl py-6 rounded-[2rem] bg-text hover:bg-primary text-background font-black text-2xl tracking-tight shadow-xl disabled:opacity-20 disabled:hover:bg-text disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02]"
                                >
                                    Check Answer
                                </button>
                            )}

                            {feedback === 'correct' && (
                                <div className="w-full space-y-8 animate-[fade-in_0.5s_cubic-bezier(0.19,1,0.22,1)]">
                                    <div className="flex items-center justify-center gap-4 text-green-500">
                                        <Check size={36} strokeWidth={3} />
                                        <span className="text-4xl font-black tracking-tighter">Richtig!</span>
                                    </div>
                                    <div className="border-l-[6px] border-green-500 pl-8 py-4 text-left max-w-xl mx-auto">
                                        <p className="text-2xl text-text italic font-light">"{currentVerb.example}"</p>
                                    </div>
                                    <button
                                        onClick={nextVerb}
                                        className="w-full max-w-2xl py-6 rounded-[2rem] bg-green-500 hover:bg-green-600 text-white font-black text-2xl tracking-tight shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-4 mx-auto"
                                    >
                                        Next Verb <ArrowRight size={28} strokeWidth={2.5} />
                                    </button>
                                </div>
                            )}

                            {feedback === 'incorrect' && (
                                <div className="w-full space-y-8 animate-[fade-in_0.5s_cubic-bezier(0.19,1,0.22,1)]">
                                    <div className="flex items-center justify-center gap-4 text-red-500">
                                        <X size={36} strokeWidth={3} />
                                        <span className="text-4xl font-black tracking-tighter">Leider Falsch.</span>
                                    </div>
                                    <div className="border-l-[6px] border-red-500 pl-8 py-4 text-left max-w-xl mx-auto space-y-3">
                                        <p className="text-lg text-text-muted uppercase font-bold tracking-[0.2em]">Correct Answer</p>
                                        <p className="text-3xl font-black text-text">{currentVerb.preposition} + {currentVerb.case}</p>
                                        <p className="text-xl text-text italic font-light">"{currentVerb.example}"</p>
                                    </div>
                                    <button
                                        onClick={nextVerb}
                                        className="w-full max-w-2xl py-6 rounded-[2rem] bg-text hover:bg-primary text-background font-black text-2xl tracking-tight shadow-xl transition-all duration-300 hover:scale-[1.02] mx-auto"
                                    >
                                        Next Verb
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-16 flex justify-center pt-8">
                        <button
                            onClick={nextVerb}
                            className="flex items-center gap-3 text-text-muted hover:text-text transition-all duration-300 text-lg font-bold uppercase tracking-widest hover:scale-105"
                        >
                            <RefreshCw size={24} strokeWidth={2.5} />
                            Skip
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default VerbPrepositionPractice;


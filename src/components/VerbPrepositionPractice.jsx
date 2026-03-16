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
                        className="w-full p-6 text-2xl font-bold bg-transparent border-4 border-text/10 focus:border-text rounded-2xl text-text outline-none transition-all placeholder:text-text/20"
                    />
                </div>
                
                <div className="flex flex-col gap-6">
                    {filteredVerbs.map((item, idx) => (
                        <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-4 border-text/10 pb-8 hover:border-primary/50 transition-colors">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-2">
                                    <h3 className="text-2xl md:text-3xl font-black text-text tracking-tight">{item.verb}</h3>
                                    <span className="text-lg font-black text-primary bg-transparent border-[3px] border-primary/30 px-4 py-1.5 rounded-xl">
                                        {item.preposition} + {item.case}
                                    </span>
                                </div>
                                <p className="text-xl md:text-2xl text-text-muted italic font-light">{item.translation}</p>
                            </div>
                            <div className="md:w-1/3">
                                <p className="text-xl text-text italic border-l-4 border-text/20 pl-6 py-1 font-light">"{item.example}"</p>
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
            <div className="flex flex-col mb-6 px-4 gap-3 mt-4 text-center md:text-left">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text mb-4">Verb Prepositions.</h1>
                    <p className="text-base md:text-lg text-text-muted max-w-2xl font-light">
                        {mode === 'practice' ? 'Enter the correct preposition and case.' : 'Study the list of verbs and their prepositions.'}
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-6">
                    <div className="flex items-center gap-2 bg-text text-background p-1.5 rounded-2xl shadow-xl w-full sm:w-auto">
                        <button
                            onClick={() => setMode('practice')}
                            className={`flex flex-1 sm:flex-none items-center justify-center gap-3 px-8 py-3.5 rounded-xl text-lg font-bold transition-all duration-300 ${
                                mode === 'practice' 
                                ? 'bg-background text-text shadow-md scale-[1.02]' 
                                : 'text-background/70 hover:text-background hover:bg-white/10'
                            }`}
                        >
                            <PenTool size={20} strokeWidth={2.5} />
                            Practice
                        </button>
                        <button
                            onClick={() => setMode('study')}
                            className={`flex flex-1 sm:flex-none items-center justify-center gap-3 px-8 py-3.5 rounded-xl text-lg font-bold transition-all duration-300 ${
                                mode === 'study' 
                                ? 'bg-background text-text shadow-md scale-[1.02]' 
                                : 'text-background/70 hover:text-background hover:bg-white/10'
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
                    <div className="text-center space-y-16 transition-all duration-300 max-w-4xl mx-auto pt-10">
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
                                    className="w-full px-6 py-5 rounded-2xl border-[3px] bg-transparent text-text text-2xl md:text-3xl font-bold text-center tracking-tight outline-none transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] border-text/10 focus:border-text focus:shadow-xl placeholder:text-text/15"
                                />
                            </div>
                            <div className="relative">
                                <label className="sr-only">Case</label>
                                <select
                                    value={caseInput}
                                    onChange={(e) => setCaseInput(e.target.value)}
                                    disabled={feedback === 'correct'}
                                    className="w-full px-6 py-5 rounded-2xl border-[3px] bg-transparent text-text text-2xl md:text-3xl font-bold text-center tracking-tight outline-none transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] border-text/10 focus:border-text focus:shadow-xl appearance-none cursor-pointer"
                                >
                                    <option value="">Select Case</option>
                                    <option value="Akkusativ">Akkusativ</option>
                                    <option value="Dativ">Dativ</option>
                                    <option value="Genitiv">Genitiv</option>
                                    <option value="Nominativ">Nominativ</option>
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

                    <div className="mt-16 flex justify-center border-t-2 border-text/5 pt-8">
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


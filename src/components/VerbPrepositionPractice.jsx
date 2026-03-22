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
 <div className="relative mb-6 w-full">
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
 <div className="max-w-6xl mx-auto p-4 md:p-8 pb-24 relative">
 {/* Background Decorative Elements */}
 <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none"/>
 <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none"/>

 {/* HEADER BLOCK */}
 <div className="mb-6 text-center md:text-left relative z-10">
 <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
 <div className="flex-1">
 <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary/80 to-accent mb-3">Verb Prepositions</h1>
 <p className="text-sm md:text-base text-text-muted max-w-2xl font-light mb-6">
 {mode === 'practice' ? 'Enter the correct preposition and case.' : 'Study the list of verbs and their prepositions.'}
 </p>

 <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4">
 {/* MODE TOGGLE */}
 <div className="inline-flex p-1.5 bg-surface/80 border border-subtle rounded-2xl shadow-sm relative shrink-0">
 {/* Sliding Background */}
 <div
 className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-primary rounded-xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-md shadow-primary/20 pointer-events-none ${mode === 'practice' ? 'left-1.5' : 'left-[calc(50%+1.5px)]'}`}
 />
 <button
 onClick={() => setMode('practice')}
 className={`w-36 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative z-10 ${mode === 'practice'
 ? 'text-primary-foreground'
 : 'text-text-muted hover:text-text'
 }`}
 >
 <PenTool size={18} strokeWidth={2.5} />
 Practice
 </button>
 <button
 onClick={() => setMode('study')}
 className={`w-36 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative z-10 ${mode === 'study'
 ? 'text-primary-foreground'
 : 'text-text-muted hover:text-text'
 }`}
 >
 <BookOpen size={18} strokeWidth={2.5} />
 Study
 </button>
 </div>

 {/* Pro Tip - Moved next to toggle */}
 {mode === 'practice' && (
 <div className="flex flex-col gap-1 bg-primary/5 px-4 py-2.5 rounded-2xl border border-primary/10 shadow-sm max-w-lg">
 <div className="flex items-center gap-1.5 text-primary">
 <span className="text-[9px] font-black uppercase tracking-widest leading-none">Pro Tip</span>
 </div>
 <p className="text-[11px] text-text-muted font-medium leading-snug">
 Certain prepositions always take a specific case (e.g.,"mit"is always Dativ), but many verbs require"Two-Way Prepositions"which change depending on context!
 </p>
 </div>
 )}
 </div>
 </div>

 {mode === 'practice' && (
 <div className="flex items-center gap-6 justify-center md:justify-end shrink-0 bg-surface/50 backdrop-blur-md border border-subtle px-7 py-4 rounded-[2rem] shadow-sm">
 <div className="text-center md:text-left">
 <div className="text-[10px] text-text-muted uppercase font-black tracking-[0.2em] mb-1">Streak</div>
 <div className={`font-black flex items-center justify-center md:justify-start gap-1.5 ${streak > 2 ? 'text-orange-500' : 'text-text'}`}>
 <Flame size={24} strokeWidth={streak > 2 ? 3 : 2} fill={streak > 2 ?"currentColor":"none"} className={streak > 2 ? 'animate-pulse' : ''} />
 <span className="text-3xl md:text-4xl leading-none tracking-tighter">{streak}</span>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>

 {/* MAIN LAYOUT */}
 <div className="relative z-10 min-h-[400px] w-full">
 {mode === 'study' ? renderStudyMode() : (
 <div className="flex flex-col items-center gap-4 w-full max-w-4xl mx-auto">
 <div className="bg-surface/20 backdrop-blur-sm border border-subtle rounded-[2rem] p-5 md:p-6 shadow-sm relative overflow-hidden w-full">
 <div className="text-center space-y-4 transition-all duration-300 mx-auto relative z-10">
 <div className="space-y-2 select-none relative pt-1 pb-1">
 <span className="absolute top-0 left-1/2 -translate-x-1/2 text-xs text-text-muted font-bold uppercase tracking-[0.3em] block">Verb</span>
 <h3 className="text-2xl md:text-4xl font-black text-text tracking-tight mt-3">
 {currentVerb.verb}
 </h3>
 <p className="text-base md:text-lg text-text-muted italic font-light mt-1">
 {currentVerb.translation}
 </p>
 </div>

 <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto px-2">
 <div>
 <label className="sr-only">Preposition</label>
 <input
 type="text"
 value={prepositionInput}
 onChange={(e) => setPrepositionInput(e.target.value)}
 placeholder="Preposition (e.g. auf)"
 disabled={feedback === 'correct'}
 className="w-full px-4 py-3 rounded-xl border-[2px] bg-surface text-text text-base md:text-lg font-bold text-center tracking-tight outline-none transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] border-subtle focus:border-text focus:shadow-xl placeholder:text-text/30"
 autoComplete="off"
 />
 </div>
 <div className="relative">
 <label className="sr-only">Case</label>
 <select
 value={caseInput}
 onChange={(e) => setCaseInput(e.target.value)}
 disabled={feedback === 'correct'}
 className="w-full px-4 py-3 rounded-xl border-[2px] bg-surface text-text text-base md:text-lg font-bold text-center tracking-tight outline-none transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] border-subtle focus:border-text focus:shadow-xl appearance-none cursor-pointer"
 >
 <option value=""className="bg-surface text-text">Select Case</option>
 <option value="Akkusativ"className="bg-surface text-text">Akkusativ</option>
 <option value="Dativ"className="bg-surface text-text">Dativ</option>
 <option value="Genitiv"className="bg-surface text-text">Genitiv</option>
 <option value="Nominativ"className="bg-surface text-text">Nominativ</option>
 </select>
 <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"size={20} strokeWidth={2.5} />
 </div>
 </div>

 {/* Feedback Area */}
 <div className="min-h-[80px] flex items-center justify-center mt-3">
 {feedback === null && (
 <button
 onClick={checkAnswer}
 disabled={!prepositionInput || !caseInput}
 className="w-full max-w-2xl py-3.5 rounded-[1.25rem] bg-text hover:bg-primary text-background font-black text-lg tracking-tight shadow-xl disabled:opacity-20 disabled:hover:bg-text disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02]"
 >
 Check Answer
 </button>
 )}

 {feedback === 'correct' && (
 <div className="w-full space-y-4 animate-[fade-in_0.5s_cubic-bezier(0.19,1,0.22,1)] bg-green-500/5 p-5 rounded-[1.25rem] border border-green-500/20">
 <div className="flex items-center justify-center gap-2 text-green-500">
 <Check size={28} strokeWidth={3} />
 <span className="text-2xl font-black tracking-tighter">Richtig!</span>
 </div>
 <div className="border-l-[3px] border-green-500 pl-3 py-1 text-left max-w-xl mx-auto">
 <p className="text-lg text-text italic font-light leading-relaxed">"{currentVerb.example}"</p>
 </div>
 <button
 onClick={nextVerb}
 className="w-full max-w-2xl py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-base tracking-tight shadow-md transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 mx-auto"
 >
 Next Verb <ArrowRight size={18} strokeWidth={2.5} />
 </button>
 </div>
 )}

 {feedback === 'incorrect' && (
 <div className="w-full space-y-4 animate-[fade-in_0.5s_cubic-bezier(0.19,1,0.22,1)] bg-red-500/5 p-5 rounded-[1.25rem] border border-red-500/20">
 <div className="flex items-center justify-center gap-2 text-red-500">
 <X size={28} strokeWidth={3} />
 <span className="text-2xl font-black tracking-tighter">Leider Falsch.</span>
 </div>
 <div className="border-l-[3px] border-red-500 pl-3 py-1 text-left max-w-xl mx-auto space-y-1">
 <p className="text-[10px] text-text-muted uppercase font-bold tracking-[0.2em]">Correct Answer</p>
 <p className="text-xl font-black text-text">{currentVerb.preposition} + {currentVerb.case}</p>
 <p className="text-sm text-text italic font-light mt-1">"{currentVerb.example}"</p>
 </div>
 <button
 onClick={nextVerb}
 className="w-full max-w-2xl py-3 rounded-xl bg-text hover:bg-primary text-background font-bold text-base tracking-tight shadow-md transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 mx-auto"
 >
 Next Verb <ArrowRight size={18} strokeWidth={2.5} />
 </button>
 </div>
 )}
 </div>
 </div>

 <div className="mt-5 flex justify-center">
 <button
 onClick={nextVerb}
 className="flex items-center gap-2 text-text-muted hover:text-text transition-all duration-300 text-[11px] font-bold uppercase tracking-widest hover:scale-105"
 >
 <RefreshCw size={14} strokeWidth={2.5} />
 Skip
 </button>
 </div>
 </div>


 </div>
 )}
 </div>
 </div>
 );
};

export default VerbPrepositionPractice;


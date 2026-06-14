import React, {useState, useContext, useEffect, useMemo} from 'react';
import {DataContext} from '../contexts/DataContext';
import {Check, X, RefreshCw, ArrowRight, Briefcase, Eye, EyeOff, ChevronDown, PenTool, BookOpen} from 'lucide-react';
import PageHeader from './common/PageHeader';
import ScoreStreak from './common/ScoreStreak';

const CasesPractice = () => {
    const {casesPractice} = useContext(DataContext);
    const [mode, setMode] = useState('practice'); // 'practice' or 'study'
    const [currentExercise, setCurrentExercise] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect' | null
    const [streak, setStreak] = useState(0);
    const [filterCategory, setFilterCategory] = useState('All');
    const [showLabels, setShowLabels] = useState(false);

    const categories = useMemo(() => {
        if (!casesPractice) return ['All'];
        const cats = new Set(casesPractice.map(c => c.grammar_category));
        return ['All', ...Array.from(cats)];
    }, [casesPractice]);

    useEffect(() => {
        if (casesPractice && casesPractice.length > 0 && !currentExercise) {
            nextExercise();
        }
    }, [casesPractice]);

    const filteredExercises = useMemo(() => {
        if (!casesPractice) return [];
        if (filterCategory === 'All') return casesPractice;
        return casesPractice.filter(c => c.grammar_category === filterCategory);
    }, [casesPractice, filterCategory]);

    const nextExercise = () => {
        if (filteredExercises.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredExercises.length);
            setCurrentExercise(filteredExercises[randomIndex]);
            setSelectedAnswer(null);
            setFeedback(null);
        }
    };

    useEffect(() => {
        nextExercise();
    }, [filterCategory]);

    const handleSelect = (option) => {
        if (feedback !== null) return; // Prevent changing answer after submitting
        setSelectedAnswer(option);
    };

    const checkAnswer = () => {
        if (!currentExercise || !selectedAnswer) return;

        if (selectedAnswer === currentExercise.expected_answer) {
            setFeedback('correct');
            setStreak(s => s + 1);
        } else {
            setFeedback('incorrect');
            setStreak(0);
        }
    };

    const renderStudyMode = () => {
        const grouped = casesPractice.reduce((acc, curr) => {
            if (!acc[curr.grammar_category]) acc[curr.grammar_category] = [];
            acc[curr.grammar_category].push(curr);
            return acc;
        }, {});

        return (
            <div className="space-y-6 animate-[fade-in_0.5s_cubic-bezier(0.19,1,0.22,1)] pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Object.entries(grouped).map(([category, exercises]) => (
                        <div key={category}
                             className="bg-surface border-[2px] border-subtle rounded-2xl p-6 hover:border-primary/50 transition-all flex flex-col shadow-sm">
                            <h3 className="text-xl font-black text-text mb-4 text-primary">{category}</h3>
                            <div className="space-y-4">
                                {exercises.map(ex => {
                                    const parts = ex.german_sentence_template.split('{blank}');
                                    return (
                                        <div key={ex.id} className="border-l-2 border-primary/30 pl-3">
                                            <p className="font-bold text-text mb-1 leading-snug">
                                                {parts[0]}<span
                                                className="text-primary bg-primary/10 px-1 py-0.5 rounded">{ex.expected_answer}</span>{parts[1]}
                                            </p>
                                            <p className="text-sm text-text-muted italic mb-2">"{ex.english_translation}"</p>
                                            <p className="text-[11px] font-medium text-text bg-background border border-border inline-block px-2 py-1 rounded shadow-sm leading-snug">
                                                {ex.explanation}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (!casesPractice || casesPractice.length === 0) {
        return <div className="text-center p-8 text-text">Loading cases practice...</div>;
    }

    if (!currentExercise) return null;

    // Split sentence to insert the blank or the chosen answer
    const parts = currentExercise.german_sentence_template.split('{blank}');

    return (
        <div className="space-y-4 animate-[fade-in_0.5s_cubic-bezier(0.19,1,0.22,1)] max-w-6xl mx-auto">
            <PageHeader
                title="Cases Practice"
                description={mode === 'practice' ? "Master German Accusative and Dative cases" : "Study the grammar rules for cases"}
                rightContent={mode === 'practice' && <ScoreStreak streak={streak}/>}
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
                    {/* MODE TOGGLE */}
                    <div
                        className="inline-flex p-1.5 bg-surface/80 border border-subtle rounded-2xl shadow-sm relative shrink-0">
                        <div
                            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-primary rounded-xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-md shadow-primary/20 pointer-events-none ${mode === 'practice' ? 'left-1.5' : 'left-[calc(50%+1.5px)]'}`}
                        />
                        <button
                            onClick={() => setMode('practice')}
                            className={`w-28 sm:w-32 flex items-center justify-center gap-2 px-3 py-2 sm:py-2.5 rounded-xl text-sm font-bold transition-all duration-300 relative z-10 ${mode === 'practice' ? 'text-primary-foreground' : 'text-text-muted hover:text-text'}`}
                        >
                            <PenTool size={16} strokeWidth={2.5}/>
                            Practice
                        </button>
                        <button
                            onClick={() => setMode('study')}
                            className={`w-28 sm:w-32 flex items-center justify-center gap-2 px-3 py-2 sm:py-2.5 rounded-xl text-sm font-bold transition-all duration-300 relative z-10 ${mode === 'study' ? 'text-primary-foreground' : 'text-text-muted hover:text-text'}`}
                        >
                            <BookOpen size={16} strokeWidth={2.5}/>
                            Study
                        </button>
                    </div>

                    {mode === 'practice' && (
                        <div className="flex items-center gap-2 sm:gap-4">
                            <div className="relative inline-block">
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="appearance-none w-36 sm:w-48 p-2 md:p-3 pr-10 rounded-xl bg-surface border-2 border-subtle text-text text-sm md:text-base font-medium shadow-sm focus:border-primary outline-none cursor-pointer hover:bg-surface-hover transition-all truncate"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <div
                                    className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-muted">
                                    <ChevronDown size={18}/>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </PageHeader>

            {mode === 'study' ? renderStudyMode() : (
                <div
                    className="bg-surface rounded-3xl p-4 md:p-6 shadow-sm border-[2px] border-subtle flex flex-col items-center max-w-4xl mx-auto">
                    <div className="mb-4 w-full">
                        {showLabels && (
                            <div
                                className="flex flex-wrap items-center justify-center gap-2 mb-4 text-sm font-bold animate-[fade-in_0.2s_ease-out]">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                {currentExercise.grammar_category}
              </span>
                                <span
                                    className="px-3 py-1 rounded-full bg-surface-hover text-text-muted border border-border">
                {currentExercise.noun_gender}
              </span>
                            </div>
                        )}

                        <div className="text-center flex items-center justify-center py-4">
                            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-text tracking-tight leading-relaxed">
                                {parts[0]}
                                <span className={`inline-block mx-2 border-b-4 pb-1 min-w-[120px] transition-colors ${
                                    feedback === 'correct' ? 'text-green-500 border-green-500' :
                                        feedback === 'incorrect' ? 'text-red-500 border-red-500' :
                                            selectedAnswer ? 'text-primary border-primary' : 'text-text-muted border-border/50'
                                }`}>
                {selectedAnswer || ''}
              </span>
                                {parts[1]}
                            </h2>
                        </div>
                        <p className="text-center text-text-muted text-lg mt-4 italic">"{currentExercise.english_translation}"</p>
                        <div className="text-center mt-2">
            <span
                className="text-sm font-medium text-text bg-background border border-border px-3 py-1 rounded-lg shadow-sm">
              Hint: {currentExercise.base_word_hint}
            </span>
                        </div>
                    </div>

                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentExercise.options.map((option, idx) => {
                            const isSelected = selectedAnswer === option;
                            const isCorrect = option === currentExercise.expected_answer;
                            const showCorrect = feedback !== null && isCorrect;
                            const showIncorrect = feedback === 'incorrect' && isSelected;

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleSelect(option)}
                                    disabled={feedback !== null}
                                    className={`p-4 md:p-5 rounded-2xl border-[2px] font-bold text-lg md:text-xl transition-all duration-300 flex items-center justify-between ${
                                        showCorrect ? 'bg-green-100 border-green-500 text-green-700' :
                                            showIncorrect ? 'bg-red-100 border-red-500 text-red-700' :
                                                isSelected ? 'bg-primary border-primary text-primary-foreground' :
                                                    'bg-background border-border text-text hover:border-primary/50 hover:bg-surface'
                                    } ${feedback !== null ? 'cursor-default' : 'active:scale-95'}`}
                                >
                                    <span>{option}</span>
                                    {showCorrect && <Check size={24} className="text-green-600"/>}
                                    {showIncorrect && <X size={24} className="text-red-600"/>}
                                </button>
                            );
                        })}
                    </div>

                    {feedback !== null && (
                        <div
                            className={`mt-6 w-full p-4 md:p-5 rounded-2xl animate-[fade-in_0.3s_ease-out] ${feedback === 'correct' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <div
                                    className={`p-2 rounded-full shrink-0 self-start sm:self-center ${feedback === 'correct' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {feedback === 'correct' ? <Check size={24}/> : <X size={24}/>}
                                </div>
                                <div className="flex-1">
                                    <h3 className={`text-lg font-bold mb-1 ${feedback === 'correct' ? 'text-green-800' : 'text-red-800'}`}>
                                        {feedback === 'correct' ? 'Sehr gut!' : 'Nicht ganz!'}
                                    </h3>
                                    <p className="text-text text-sm md:text-base font-medium leading-relaxed">
                                        {currentExercise.explanation}
                                    </p>
                                </div>
                                <div className="shrink-0 self-end sm:self-center mt-2 sm:mt-0">
                                    <button
                                        onClick={nextExercise}
                                        className="flex items-center gap-2 px-6 py-3 bg-text text-background rounded-xl font-bold hover:bg-primary hover:text-primary-foreground transition-all active:scale-95 shadow-md text-sm md:text-base"
                                    >
                                        Next <ArrowRight size={18}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {feedback === null && selectedAnswer && (
                        <div className="mt-6 w-full flex justify-end animate-[fade-in_0.2s_ease-out]">
                            <button
                                onClick={checkAnswer}
                                className="flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-base md:text-lg hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all shadow-md"
                            >
                                Check Answer <Check size={20}/>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CasesPractice;

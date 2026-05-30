import React, { useState } from 'react';
import { BookOpen, PenTool, LayoutGrid, Edit3, List, Repeat, Languages, MessageCircle, Menu, X, Tags, Puzzle, Zap, Wand2 } from 'lucide-react';


const Navigation = ({ currentView, setCurrentView, overlayView, setOverlayView, children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    const navItems = [
        { id: 'flashcards', label: 'Flashcards', description: 'Review essential vocabulary definitions', icon: BookOpen, color: 'text-cyan-600', blockBg: 'bg-cyan-100', blockHoverBg: 'bg-cyan-200', border: 'border-cyan-300', shadow: 'hover:shadow-cyan-300/50' },
        { id: 'mcq', label: 'Multiple Choice', description: 'Test your knowledge with quick quizzes', icon: LayoutGrid, color: 'text-purple-600', blockBg: 'bg-purple-100', blockHoverBg: 'bg-purple-200', border: 'border-purple-300', shadow: 'hover:shadow-purple-300/50' },
        { id: 'gender', label: 'Word Gender', description: 'Master Der, Die, and Das rules', icon: Tags, color: 'text-emerald-600', blockBg: 'bg-emerald-100', blockHoverBg: 'bg-emerald-200', border: 'border-emerald-300', shadow: 'hover:shadow-emerald-300/50' },
        { id: 'prepositions', label: 'Prepositions', description: 'Learn verb prepositions effectively', icon: Puzzle, color: 'text-orange-600', blockBg: 'bg-orange-100', blockHoverBg: 'bg-orange-200', border: 'border-orange-300', shadow: 'hover:shadow-orange-300/50' },
        { id: 'verb_practice', label: 'Verbs Practice', description: 'Using past participles of common German verbs', icon: Edit3, color: 'text-red-600', blockBg: 'bg-red-100', blockHoverBg: 'bg-red-200', border: 'border-red-300', shadow: 'hover:shadow-red-300/50' },
        { id: 'adjective_practice', label: 'Adjectives Quiz', description: 'Practice adjectives for different scenarios', icon: List, color: 'text-blue-600', blockBg: 'bg-blue-100', blockHoverBg: 'bg-blue-200', border: 'border-blue-300', shadow: 'hover:shadow-blue-300/50' },
        { id: 'opposite_practice', label: 'Opposites Match', description: 'Match opposing word pairs rapidly', icon: Repeat, color: 'text-fuchsia-600', blockBg: 'bg-fuchsia-100', blockHoverBg: 'bg-fuchsia-200', border: 'border-fuchsia-300', shadow: 'hover:shadow-fuchsia-300/50' },
        { id: 'causal_adverbs', label: 'Causal Adverbs', description: 'Practice using causal adverbs', icon: Zap, color: 'text-yellow-600', blockBg: 'bg-yellow-100', blockHoverBg: 'bg-yellow-200', border: 'border-yellow-300', shadow: 'hover:shadow-yellow-300/50' },
        { id: 'expression_practice', label: 'Idioms Builder', description: 'Reconstruct expressions', icon: Wand2, color: 'text-lime-600', blockBg: 'bg-lime-100', blockHoverBg: 'bg-lime-200', border: 'border-lime-300', shadow: 'hover:shadow-lime-300/50' },
    ];

    const bottomItems = [
        { id: 'alphabet', label: 'German Alphabet', icon: Languages },
        { id: 'pronunciation', label: 'Pronunciation', icon: MessageCircle },
        { id: 'study_menu', label: 'Study', icon: BookOpen },
    ];

    const handleNavClick = (viewId) => {
        setCurrentView(viewId);
        setIsMenuOpen(false);
    };

    const handleBottomClick = (viewId) => {
        setOverlayView(viewId);
    };

    return (
        <div className="min-h-screen bg-background text-text flex overflow-hidden relative">
            {/* Top Left - Logo */}
            <div className="fixed top-0 left-4 md:left-8 z-[60]">
                <div className="bg-white/80 backdrop-blur-xl shadow-lg border-2 border-neutral-300 px-7 pt-5 md:pt-6 pb-4 md:pb-5 rounded-b-2xl flex flex-col items-center justify-center transition-all duration-300 hover:shadow-xl group">
                    <div className="flex gap-0 w-full mb-3 rounded-full overflow-hidden">
                        <div className="h-[3px] flex-1 bg-neutral-900 transition-all duration-500 group-hover:h-[4px]"></div>
                        <div className="h-[3px] flex-1 bg-red-600 transition-all duration-500 group-hover:h-[4px]"></div>
                        <div className="h-[3px] flex-1 bg-yellow-500 transition-all duration-500 group-hover:h-[4px]"></div>
                    </div>
                    <h1 className="text-xl md:text-2xl font-sans font-black tracking-tight leading-none select-none text-text transition-all duration-500">
                        Wise Umlaut
                    </h1>
                </div>
            </div>

            {/* Top Right - Controls & Hamburger */}
            <div className="fixed top-4 md:top-6 right-4 md:right-6 z-[60] flex items-center gap-2">
                <div className="flex items-center gap-1 px-1.5 py-1.5 md:px-2 md:py-2 bg-surface/70 backdrop-blur-xl border border-white/10 shadow-lg rounded-full transition-all duration-300 hover:shadow-xl hover:bg-surface/90">
                    {/* Always visible secondary actions */}
                    {bottomItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleBottomClick(item.id)}
                            className={`p-2 md:p-2.5 rounded-full transition-all duration-300 group relative
 ${overlayView === item.id
                                    ? 'bg-primary text-primary-foreground shadow-md scale-105'
                                    : 'text-text-muted hover:bg-primary/10 hover:text-primary :bg-primary/20 hover:scale-105'}`}
                            title={item.label}
                        >
                            <item.icon size={18} strokeWidth={overlayView === item.id ? 2.5 : 2} className="transition-transform md:w-[20px] md:h-[20px]" />
                        </button>
                    ))}

                    <div className="w-[1px] h-6 bg-border mx-1"></div>

                    {/* Menu Toggle Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`p-2 md:p-2.5 rounded-full transition-all duration-300 hover:scale-105
 ${isMenuOpen ? 'bg-primary text-primary-foreground shadow-md' : 'text-text hover:bg-primary/10 hover:text-primary :bg-primary/20'}`}
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <X size={20} className="md:w-[22px] md:h-[22px]" /> : <Menu size={20} className="md:w-[22px] md:h-[22px]" />}
                    </button>
                </div>
            </div>

            {/* Fullscreen Overlay Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[50] bg-background animate-in fade-in duration-300 flex flex-col items-center justify-start p-4 pt-20 md:p-6 md:pt-24 overflow-y-auto">
                    <div className="w-full max-w-4xl mb-6 mt-4 md:mt-8 text-center animate-in slide-in-from-bottom-4 duration-500 delay-100">
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text mb-2">Los geht's!</h2>
                        <p className="text-text-muted text-sm md:text-base">Select a practice mode to begin</p>
                    </div>

                    <div className="w-full max-w-6xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 pb-20 px-4 md:pb-6">
                        {navItems.map((item, index) => {
                            const isActive = currentView === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavClick(item.id)}
                                    className={`group flex flex-col items-center justify-center gap-2 p-4 md:p-5 rounded-[1.5rem] transition-all duration-500 w-full text-center outline-none animate-in zoom-in-95 fill-mode-both min-h-[8.5rem] md:min-h-[9.5rem] border-[1px]
 ${isActive
                                            ? `${item.blockHoverBg} ${item.border} shadow-sm scale-[1.02]`
                                            : `${item.blockBg} border-border/60 shadow-sm hover:${item.blockHoverBg} hover:${item.border} ${item.shadow} hover:shadow-md hover:scale-[1.03] active:scale-95`}`}
                                    style={{ animationDelay: `${index * 40 + 100}ms` }}
                                >
                                    <div className={`flex items-center justify-center w-12 h-12 md:w-[3.25rem] md:h-[3.25rem] rounded-2xl transition-all duration-500 mb-0.5 ${item.color} shadow-sm bg-surface
 ${isActive
                                            ? `scale-110`
                                            : `opacity-90 group-hover:opacity-100 group-hover:scale-110`}`}
                                    >
                                        <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} className="w-[22px] h-[22px] md:w-[26px] md:h-[26px]" />
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <h3 className={`text-sm md:text-base font-black tracking-tight transition-colors duration-300
 ${isActive ? item.color : 'text-text group-hover:' + item.color}`}>
                                            {item.label}
                                        </h3>
                                        <p className="text-[11px] md:text-xs text-text-muted font-medium px-2 leading-snug opacity-90 group-hover:opacity-100 transition-opacity">
                                            {item.description}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 w-full min-h-screen transition-all duration-300 bg-background text-text">
                <div className="pt-12 md:pt-16 pb-12 px-4 md:px-6 w-full max-w-7xl mx-auto h-full box-border">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Navigation;

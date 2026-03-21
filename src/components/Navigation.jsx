import React, { useState } from 'react';
import { BookOpen, PenTool, LayoutGrid, Type, Link2, Edit3, List, Repeat, Languages, MessageCircle, Menu, X } from 'lucide-react';
import ThemeSelector from './ThemeSelector';

const Navigation = ({ currentView, setCurrentView, overlayView, setOverlayView, children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    const navItems = [
        { id: 'flashcards', label: 'Flashcards', icon: BookOpen },
        { id: 'mcq', label: 'Multiple Choice', icon: LayoutGrid },
        { id: 'gender', label: 'Word Gender', icon: Type },
        { id: 'prepositions', label: 'Prepositions', icon: Link2 },
        { id: 'verb_practice', label: 'Verbs Practice', icon: Edit3 },
        { id: 'adjective_practice', label: 'Adjectives Quiz', icon: List },
        { id: 'opposite_practice', label: 'Opposites Match', icon: Repeat },
    ];

    const bottomItems = [
        { id: 'alphabet', label: 'German Alphabet', icon: Languages },
        { id: 'pronunciation', label: 'Pronunciation', icon: MessageCircle },
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
            <div className="fixed top-4 md:top-6 left-4 md:left-6 z-[60]">
                <div className="flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:bg-surface/90">
                    <h1 className="text-xl md:text-2xl font-logo tracking-tighter leading-none select-none text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                        Wise Umlaut
                    </h1>
                </div>
            </div>

            {/* Top Right - Controls & Hamburger */}
            <div className="fixed top-4 md:top-6 right-4 md:right-6 z-[60] flex items-center gap-2">
                <div className="flex items-center gap-1 px-1.5 py-1.5 md:px-2 md:py-2 bg-surface/70 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-lg rounded-full transition-all duration-300 hover:shadow-xl hover:bg-surface/90">
                    {/* Always visible secondary actions */}
                    {bottomItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleBottomClick(item.id)}
                            className={`p-2 md:p-2.5 rounded-full transition-all duration-300 group relative
                                ${overlayView === item.id
                                    ? 'bg-primary text-primary-foreground shadow-md scale-105'
                                    : 'text-text-muted hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 hover:scale-105'}`}
                            title={item.label}
                        >
                            <item.icon size={18} strokeWidth={overlayView === item.id ? 2.5 : 2} className="transition-transform md:w-[20px] md:h-[20px]" />
                        </button>
                    ))}
                    <div className="w-[1px] h-6 bg-border mx-1"></div>
                    <ThemeSelector />
                    <div className="w-[1px] h-6 bg-border mx-1"></div>

                    {/* Menu Toggle Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`p-2 md:p-2.5 rounded-full transition-all duration-300 hover:scale-105
                            ${isMenuOpen ? 'bg-primary text-primary-foreground shadow-md' : 'text-text hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20'}`}
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <X size={20} className="md:w-[22px] md:h-[22px]" /> : <Menu size={20} className="md:w-[22px] md:h-[22px]" />}
                    </button>
                </div>
            </div>

            {/* Fullscreen Overlay Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[50] bg-background/95 backdrop-blur-2xl animate-in fade-in duration-300 flex flex-col items-center justify-center p-6 pt-28 overflow-y-auto">
                    <div className="w-full max-w-4xl mb-6 text-center animate-in slide-in-from-bottom-4 duration-500 delay-100">
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text mb-2">Where would you like to start?</h2>
                        <p className="text-text-muted text-sm md:text-base">Select a practice mode to begin</p>
                    </div>

                    <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 pb-20">
                        {navItems.map((item, index) => {
                            const isActive = currentView === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavClick(item.id)}
                                    className={`group flex flex-col items-center justify-center gap-3 p-5 md:p-6 rounded-[1.5rem] transition-all duration-500 w-full text-center outline-none animate-in zoom-in-95 fill-mode-both min-h-[9rem] md:min-h-[10rem]
                                        ${isActive
                                            ? 'bg-primary/10 border-2 border-primary shadow-2xl shadow-primary/20 scale-[1.02]'
                                            : 'bg-surface/50 hover:bg-surface-hover hover:scale-[1.02] active:scale-95 border border-white/5 dark:border-white/5 backdrop-blur-sm shadow-md hover:shadow-xl'}`}
                                    style={{ animationDelay: `${index * 40 + 100}ms` }}
                                >
                                    <div className={`flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl transition-all duration-500
                                        ${isActive
                                            ? 'bg-primary text-primary-foreground shadow-inner shadow-primary/40'
                                            : 'bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:scale-110'}`}
                                    >
                                        <item.icon size={26} strokeWidth={isActive ? 2.5 : 2} className="md:w-[32px] md:h-[32px]" />
                                    </div>
                                    <div>
                                        <h3 className={`text-base md:text-lg font-bold tracking-tight transition-colors duration-300
                                            ${isActive ? 'text-primary' : 'text-text group-hover:text-primary'}`}>
                                            {item.label}
                                        </h3>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 w-full min-h-screen transition-all duration-300 bg-background text-text">
                <div className="pt-24 md:pt-28 pb-12 px-4 md:px-6 w-full max-w-5xl mx-auto h-full box-border">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Navigation;

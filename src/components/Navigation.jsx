import React from 'react';
import { BookOpen, PenTool, LayoutGrid, Type, Link2, Edit3, List, Repeat, Languages, MessageCircle } from 'lucide-react';
import ThemeSelector from './ThemeSelector';

const Navigation = ({ currentView, setCurrentView, overlayView, setOverlayView, children }) => {
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
    };

    const handleBottomClick = (viewId) => {
        setOverlayView(viewId);
    };

    return (
        <div className="min-h-screen bg-background text-text flex overflow-hidden relative">
            {/* Top Left - Logo */}
            <div className="fixed top-4 md:top-6 left-4 md:left-6 z-40">
                <div className="px-5 py-2.5 md:px-6 md:py-3 bg-surface/70 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-lg rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:bg-surface/90">
                    <h1 className="text-xl md:text-2xl font-logo tracking-tighter leading-none select-none text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                        Wise Umlaut
                    </h1>
                </div>
            </div>

            {/* Top Right - Controls */}
            <div className="fixed top-4 md:top-6 right-4 md:right-6 z-40 flex items-center gap-2">
                <div className="flex items-center gap-1 px-1.5 py-1.5 md:px-2 md:py-2 bg-surface/70 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-lg rounded-full transition-all duration-300 hover:shadow-xl hover:bg-surface/90">
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
                </div>
            </div>

            {/* Bottom Center - Floating Dock */}
            <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-max px-2 md:px-4">
                <div className="flex items-center gap-1 md:gap-2 px-2 py-2 md:px-3 md:py-3 bg-surface/80 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-full transition-all duration-500 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                    {navItems.map(item => {
                        const isActive = currentView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                className="relative group flex items-center justify-center min-w-[2.5rem] md:min-w-[3.5rem]"
                            >
                                <div className={`flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                                    ${isActive
                                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/40 scale-[1.15] md:scale-125 z-20'
                                        : 'bg-transparent text-text-muted hover:bg-surface-hover hover:scale-[1.15] md:hover:scale-125 hover:z-20 hover:shadow-xl hover:text-primary dark:hover:text-primary'
                                    }`}
                                >
                                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={`transition-transform duration-300 md:w-[24px] md:h-[24px] ${isActive ? 'scale-110' : ''}`} />
                                </div>

                                {/* Tooltip */}
                                <div className={`absolute -top-14 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-2 bg-surface/95 backdrop-blur-sm border border-white/10 dark:border-white/5 text-text text-[13px] md:text-sm font-semibold px-3 py-1.5 rounded-xl shadow-xl pointer-events-none whitespace-nowrap z-30 flex items-center gap-1.5
                                    ${isActive ? 'text-primary' : ''}`}>
                                    {item.label}
                                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 w-full min-h-screen transition-all duration-300 bg-background text-text">
                <div className="pt-24 md:pt-28 pb-32 md:pb-40 px-4 md:px-6 w-full max-w-5xl mx-auto h-full box-border">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Navigation;

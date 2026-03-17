import React, { useState } from 'react';
import { BookOpen, PenTool, LayoutGrid, Type, Link2, Menu, X, Edit3, List, Repeat, Settings, Languages, MessageCircle } from 'lucide-react';
import ThemeSelector from './ThemeSelector';

const Navigation = ({ currentView, setCurrentView, overlayView, setOverlayView, children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { id: 'flashcards', label: 'Flashcards', icon: BookOpen },
        { id: 'mcq', label: 'Multiple Choice', icon: LayoutGrid },
        { id: 'writing', label: 'Writing Practice', icon: PenTool },
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
        setIsMobileMenuOpen(false);
    };

    const handleBottomClick = (viewId) => {
        setOverlayView(viewId);
        setIsMobileMenuOpen(false);
    };

    const NavButton = ({ item, isOverlay = false }) => {
        const isActive = isOverlay ? overlayView === item.id : currentView === item.id;
        return (
            <button
                onClick={() => isOverlay ? handleBottomClick(item.id) : handleNavClick(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] group
                    ${isActive
                        ? 'bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 scale-[1.02]'
                        : 'text-text-muted hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary font-medium'
                    }`}
            >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={`transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110 shrink-0 ${isActive ? 'text-primary-foreground' : 'text-text-muted group-hover:text-primary'}`} />
                <span className="text-[15px] truncate tracking-tight">{item.label}</span>
            </button>
        );
    };

    return (
        <div className="min-h-screen bg-background text-text flex overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-72 bg-surface shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)] fixed h-full z-20">
                <div className="p-6 flex shrink-0 items-center justify-start gap-2">
                    <h1 className="text-3xl font-black tracking-tighter leading-none select-none text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                        Wise Umlaut.
                    </h1>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1 flex flex-col custom-scrollbar">
                    {navItems.map(item => (
                        <NavButton key={item.id} item={item} />
                    ))}
                </div>

                <div className="p-4 bg-surface shrink-0 border-t border-border/50">
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 px-2">Back to Basics</h3>
                    <div className="space-y-1 mb-2">
                        {bottomItems.map(item => (
                            <NavButton key={item.id} item={item} isOverlay />
                        ))}
                    </div>
                    <div className="mt-3 flex justify-between items-center px-2">
                        <div className="text-xs text-text-muted">v0.1.0</div>
                        <ThemeSelector />
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-surface/90 backdrop-blur-md z-30 px-6 h-20 flex items-center justify-between shadow-sm">
                <span className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                    Wise Umlaut.
                </span>
                <div className="flex items-center gap-2">
                    <ThemeSelector />
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-text-muted hover:bg-background rounded-lg"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Drawer Side Panel */}
            <div className={`md:hidden fixed inset-y-0 left-0 w-[85%] max-w-sm bg-surface shadow-2xl z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="p-8">
                        <h2 className="text-3xl font-black tracking-tighter text-text">Menu.</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-2">
                        {navItems.map(item => (
                            <NavButton key={item.id} item={item} />
                        ))}
                    </div>

                    <div className="p-6 bg-surface space-y-2">
                        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 px-4">Back to Basics</h3>
                        {bottomItems.map(item => (
                            <NavButton key={item.id} item={item} isOverlay />
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-72 pt-20 md:pt-0 min-h-screen transition-all duration-300 bg-background text-text">
                <div className="p-4 md:p-12 lg:p-16 max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Navigation;

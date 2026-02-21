import React, { useState } from 'react';
import { BookOpen, PenTool, LayoutGrid, Puzzle, Settings, Type, Link2, Menu, X } from 'lucide-react';
import ThemeSelector from './ThemeSelector';

const Navigation = ({ currentView, setCurrentView, children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { id: 'flashcards', label: 'Flashcards', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
        { id: 'writing', label: 'Writing Practice', icon: PenTool, color: 'text-purple-600', bg: 'bg-purple-50' },
        { id: 'mcq', label: 'Multiple Choice', icon: LayoutGrid, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { id: 'match', label: 'Match Pairs', icon: Puzzle, color: 'text-orange-600', bg: 'bg-orange-50' },
        { id: 'gender', label: 'Word Gender', icon: Type, color: 'text-pink-600', bg: 'bg-pink-50' },
        { id: 'prepositions', label: 'Prepositions', icon: Link2, color: 'text-teal-600', bg: 'bg-teal-50' },
    ];

    const bottomItems = [
        { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-600', bg: 'bg-gray-100' },
    ];

    const handleNavClick = (viewId) => {
        setCurrentView(viewId);
        setIsMobileMenuOpen(false);
    };

    const NavButton = ({ item }) => (
        <button
            onClick={() => handleNavClick(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${currentView === item.id
                    ? `${item.bg} dark:bg-slate-700 dark:text-primary font-semibold shadow-sm`
                    : 'text-text-muted hover:bg-surface hover:text-text'
                }`}
        >
            <item.icon size={20} className={`transition-transform group-hover:scale-110 ${currentView === item.id ? 'text-primary' : 'text-text-muted group-hover:text-text'}`} />
            <span className="text-sm">{item.label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-background text-text flex">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-border fixed h-full z-20">
                <div className="p-6 border-b border-border">
                    <h1 className="text-2xl font-heading tracking-wide font-normal bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                        Wise Umlaut
                    </h1>
                    <p className="text-xs text-text-muted mt-1">Master your German skills</p>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    <div className="mb-6 px-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                        Practice Modes
                    </div>
                    {navItems.map(item => (
                        <NavButton key={item.id} item={item} />
                    ))}
                </div>

                <div className="p-4 border-t border-border">
                    {bottomItems.map(item => (
                        <NavButton key={item.id} item={item} />
                    ))}
                    <div className="mt-4 flex justify-between items-center px-2">
                        <div className="text-xs text-text-muted">v0.1.0</div>
                        <ThemeSelector />
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-surface border-b border-border z-30 px-4 h-16 flex items-center justify-between">
                <span className="text-lg font-heading tracking-wide font-normal bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    Wise Umlaut
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
            <div className={`md:hidden fixed inset-y-0 left-0 w-3/4 max-w-xs bg-surface shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-xl font-bold text-text">Menu</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
                        {navItems.map(item => (
                            <NavButton key={item.id} item={item} />
                        ))}
                    </div>

                    <div className="p-4 border-t border-border bg-background">
                        {bottomItems.map(item => (
                            <NavButton key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen transition-all duration-300 bg-background text-text">
                <div className="p-4 md:p-8 max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Navigation;

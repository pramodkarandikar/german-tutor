import React, { useState } from 'react';
import { BookOpen, PenTool, LayoutGrid, Puzzle, Settings, Type, Link2, Menu, X } from 'lucide-react';

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
                    ? `${item.bg} ${item.color} font-semibold shadow-sm`
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
        >
            <item.icon size={20} className={`transition-transform group-hover:scale-110 ${currentView === item.id ? item.color : 'text-gray-400 group-hover:text-gray-600'}`} />
            <span className="text-sm">{item.label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-20">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Wise Umlaut
                    </h1>
                    <p className="text-xs text-gray-400 mt-1">Master your German skills</p>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    <div className="mb-6 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Practice Modes
                    </div>
                    {navItems.map(item => (
                        <NavButton key={item.id} item={item} />
                    ))}
                </div>

                <div className="p-4 border-t border-gray-100">
                    {bottomItems.map(item => (
                        <NavButton key={item.id} item={item} />
                    ))}
                    <div className="mt-4 text-center text-xs text-gray-300">
                        v0.1.0
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30 px-4 h-16 flex items-center justify-between">
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Wise Umlaut
                </span>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Drawer Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Drawer Side Panel */}
            <div className={`md:hidden fixed inset-y-0 left-0 w-3/4 max-w-xs bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800">Menu</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
                        {navItems.map(item => (
                            <NavButton key={item.id} item={item} />
                        ))}
                    </div>

                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                        {bottomItems.map(item => (
                            <NavButton key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen transition-all duration-300">
                <div className="p-4 md:p-8 max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Navigation;

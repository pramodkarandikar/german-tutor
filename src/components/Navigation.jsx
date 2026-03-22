import React, { useState } from 'react';
import { BookOpen, PenTool, LayoutGrid, Type, Link2, Edit3, List, Repeat, Languages, MessageCircle, Menu, X } from 'lucide-react';


const Navigation = ({ currentView, setCurrentView, overlayView, setOverlayView, children }) => {
 const [isMenuOpen, setIsMenuOpen] = useState(true);

 const navItems = [
 { id: 'flashcards', label: 'Flashcards', description: 'Review essential vocabulary definitions', icon: BookOpen, color: 'text-rose-500', bg: 'bg-rose-500/5', hover: 'hover:bg-rose-500/15', border: 'border-rose-500/30' },
 { id: 'mcq', label: 'Multiple Choice', description: 'Test your knowledge with quick quizzes', icon: LayoutGrid, color: 'text-amber-500', bg: 'bg-amber-500/5', hover: 'hover:bg-amber-500/15', border: 'border-amber-500/30' },
 { id: 'gender', label: 'Word Gender', description: 'Master Der, Die, and Das rules', icon: Type, color: 'text-emerald-500', bg: 'bg-emerald-500/5', hover: 'hover:bg-emerald-500/15', border: 'border-emerald-500/30' },
 { id: 'prepositions', label: 'Prepositions', description: 'Learn verb prepositions effectively', icon: Link2, color: 'text-blue-500', bg: 'bg-blue-500/5', hover: 'hover:bg-blue-500/15', border: 'border-blue-500/30' },
 { id: 'verb_practice', label: 'Verbs Practice', description: 'Conjugate common German verbs', icon: Edit3, color: 'text-purple-500', bg: 'bg-purple-500/5', hover: 'hover:bg-purple-500/15', border: 'border-purple-500/30' },
 { id: 'adjective_practice', label: 'Adjectives Quiz', description: 'Practice correct adjective endings', icon: List, color: 'text-teal-500', bg: 'bg-teal-500/5', hover: 'hover:bg-teal-500/15', border: 'border-teal-500/30' },
 { id: 'opposite_practice', label: 'Opposites Match', description: 'Match opposing word pairs rapidly', icon: Repeat, color: 'text-pink-500', bg: 'bg-pink-500/5', hover: 'hover:bg-pink-500/15', border: 'border-pink-500/30' },
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
 <div className="fixed top-0 left-4 md:left-8 z-[60]">
 <div className="bg-text shadow-xl border-x border-b border-white/10 px-6 pt-5 md:pt-7 pb-4 md:pb-5 rounded-b-[2rem] flex items-center justify-center transition-all duration-300 hover:shadow-2xl group">
 <h1 className="text-xl md:text-2xl font-logo tracking-tighter leading-none select-none text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent group-hover:from-accent group-hover:to-primary transition-all duration-500">
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
 <item.icon size={18} strokeWidth={overlayView === item.id ? 2.5 : 2} className="transition-transform md:w-[20px] md:h-[20px]"/>
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
 {isMenuOpen ? <X size={20} className="md:w-[22px] md:h-[22px]"/> : <Menu size={20} className="md:w-[22px] md:h-[22px]"/>}
 </button>
 </div>
 </div>

 {/* Fullscreen Overlay Menu */}
 {isMenuOpen && (
 <div className="fixed inset-0 z-[50] bg-background animate-in fade-in duration-300 flex flex-col items-center justify-center p-6 pt-28 overflow-y-auto">
 <div className="w-full max-w-4xl mb-6 text-center animate-in slide-in-from-bottom-4 duration-500 delay-100">
 <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text mb-2">Where would you like to start?</h2>
 <p className="text-text-muted text-sm md:text-base">Select a practice mode to begin</p>
 </div>

 <div className="w-full max-w-6xl grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 pb-20 px-4">
 {navItems.map((item, index) => {
 const isActive = currentView === item.id;
 // Adding the color class safely using style instead if needed, but tailwind processes these in dev
 return (
 <button
 key={item.id}
 onClick={() => handleNavClick(item.id)}
 className={`group flex flex-col items-center justify-center gap-2 p-4 md:p-5 rounded-[1.5rem] transition-all duration-500 w-full text-center outline-none animate-in zoom-in-95 fill-mode-both min-h-[8.5rem] md:min-h-[9.5rem] border-[1.5px]
 ${isActive
 ?`${item.bg} ${item.border} border-solid shadow-xl scale-[1.02]`
 :`${item.bg} border-transparent backdrop-blur-sm shadow-md ${item.hover} hover:border-white/10 :border-white/5 hover:shadow-xl hover:scale-[1.03] active:scale-95`}`}
 style={{ animationDelay:`${index * 40 + 100}ms` }}
 >
 <div className={`flex items-center justify-center w-12 h-12 md:w-[3.25rem] md:h-[3.25rem] rounded-2xl transition-all duration-500 mb-0.5
 ${isActive
 ?`bg-surface shadow-md ${item.color}`
 :`bg-surface/60 ${item.color} shadow-sm group-hover:bg-surface group-hover:scale-110 group-hover:shadow-md`}`}
 >
 <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} className="w-[22px] h-[22px] md:w-[26px] md:h-[26px]"/>
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
 <div className="pt-24 md:pt-28 pb-12 px-4 md:px-6 w-full max-w-5xl mx-auto h-full box-border">
 {children}
 </div>
 </main>
 </div>
 );
};

export default Navigation;

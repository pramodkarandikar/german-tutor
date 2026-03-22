
import React, { useState, useEffect } from 'react';
import { DataProvider } from './contexts/DataContext';
import Quiz from './components/Quiz';
import WritingPractice from './components/WritingPractice';
import MultipleChoice from './components/MultipleChoice';
import Settings from './components/Settings';
import WordGenderPractice from './components/WordGenderPractice';
import VerbPrepositionPractice from './components/VerbPrepositionPractice';
import VerbPractice from './components/VerbPractice';
import AdjectivePractice from './components/AdjectivePractice';
import OppositePractice from './components/OppositePractice';
import Navigation from './components/Navigation';

import Alphabet from './components/Alphabet';
import PronunciationRules from './components/PronunciationRules';
import { X } from 'lucide-react';

function App() {
 const [currentView, setCurrentView] = useState('flashcards');
 const [overlayView, setOverlayView] = useState(null);
 const [isClosing, setIsClosing] = useState(false);

 const closeOverlay = () => {
 if (!overlayView) return;
 setIsClosing(true);
 setTimeout(() => {
 setOverlayView(null);
 setIsClosing(false);
 }, 200);
 };

 useEffect(() => {
 const handleKeyDown = (e) => {
 if (e.key === 'Escape' && overlayView && !isClosing) closeOverlay();
 };
 window.addEventListener('keydown', handleKeyDown);
 return () => window.removeEventListener('keydown', handleKeyDown);
 }, [overlayView, isClosing]);

 return (
 <DataProvider>
 <Navigation currentView={currentView} setCurrentView={setCurrentView} overlayView={overlayView} setOverlayView={setOverlayView}>
 {currentView === 'flashcards' && <Quiz />}
 {currentView === 'writing' && <WritingPractice />}
 {currentView === 'mcq' && <MultipleChoice />}
 {currentView === 'gender' && <WordGenderPractice />}
 {currentView === 'prepositions' && <VerbPrepositionPractice />}
 {currentView === 'verb_practice' && <VerbPractice />}
 {currentView === 'adjective_practice' && <AdjectivePractice />}
 {currentView === 'opposite_practice' && <OppositePractice />}
 {currentView === 'settings' && <Settings />}
 </Navigation>

 {overlayView && (
 <div 
 className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 pb-20 md:pb-6 overflow-hidden ${isClosing ? 'animate-out fade-out duration-200' : 'animate-in fade-in duration-200'}`} 
 onClick={(e) => { 
 if (e.target === e.currentTarget) closeOverlay(); 
 }}
 >
 <div className={`relative w-full max-w-6xl bg-background rounded-3xl shadow-2xl flex flex-col max-h-full overflow-hidden ${isClosing ? 'animate-out fade-out zoom-out-95 duration-200' : 'animate-in fade-in zoom-in-95 duration-200'}`}>
 <button 
 onClick={closeOverlay} 
 className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-surface/80 hover:bg-primary/10 hover:text-primary transition-all text-text-muted z-50 backdrop-blur-sm shadow-sm border border-border"
 aria-label="Close"
 >
 <X size={24} />
 </button>
 <div className="flex-1 overflow-y-auto p-4 pt-16 sm:p-8 sm:pt-20 custom-scrollbar">
 {overlayView === 'alphabet' && <Alphabet />}
 {overlayView === 'pronunciation' && <PronunciationRules />}
 </div>
 </div>
 </div>
 )}
 </DataProvider>
 );
}


export default App;

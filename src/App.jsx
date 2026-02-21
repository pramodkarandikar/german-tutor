
import React, { useState } from 'react';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './context/ThemeContext';
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

function App() {
  const [currentView, setCurrentView] = useState('flashcards');

  return (
    <DataProvider>
      <ThemeProvider>
        <Navigation currentView={currentView} setCurrentView={setCurrentView}>
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
      </ThemeProvider>
    </DataProvider>
  );
}


export default App;

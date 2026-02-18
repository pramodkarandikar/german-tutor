
import React, { useState } from 'react';
import { DataProvider } from './contexts/DataContext';
import Quiz from './components/Quiz';
import WritingPractice from './components/WritingPractice';
import MultipleChoice from './components/MultipleChoice';
import MatchPairs from './components/MatchPairs';
import Settings from './components/Settings';
import WordGenderPractice from './components/WordGenderPractice';
import VerbPrepositionPractice from './components/VerbPrepositionPractice';
import Navigation from './components/Navigation';

function App() {
  const [currentView, setCurrentView] = useState('flashcards');

  return (
    <DataProvider>
      <Navigation currentView={currentView} setCurrentView={setCurrentView}>
        {currentView === 'flashcards' && <Quiz />}
        {currentView === 'writing' && <WritingPractice />}
        {currentView === 'mcq' && <MultipleChoice />}
        {currentView === 'match' && <MatchPairs />}
        {currentView === 'gender' && <WordGenderPractice />}
        {currentView === 'prepositions' && <VerbPrepositionPractice />}
        {currentView === 'settings' && <Settings />}
      </Navigation>
    </DataProvider>
  );
}


export default App;

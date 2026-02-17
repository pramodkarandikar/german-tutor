
import React, { useState } from 'react';
import { DataProvider } from './contexts/DataContext';
import Quiz from './components/Quiz';
import WritingPractice from './components/WritingPractice';
import MultipleChoice from './components/MultipleChoice';
import MatchPairs from './components/MatchPairs';
import Settings from './components/Settings';
import { BookOpen, PenTool, LayoutGrid, Puzzle, Settings as SettingsIcon } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('flashcards');

  return (
    <DataProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                German Tutor
              </span>
              <div className="flex space-x-1 overflow-x-auto">
                <button
                  onClick={() => setCurrentView('flashcards')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                    ${currentView === 'flashcards'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <BookOpen size={18} />
                  Flashcards
                </button>
                <button
                  onClick={() => setCurrentView('writing')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                    ${currentView === 'writing'
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <PenTool size={18} />
                  Writing
                </button>
                <button
                  onClick={() => setCurrentView('mcq')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                    ${currentView === 'mcq'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <LayoutGrid size={18} />
                  Multiple Choice
                </button>
                <button
                  onClick={() => setCurrentView('match')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                    ${currentView === 'match'
                      ? 'bg-orange-50 text-orange-700'
                      : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Puzzle size={18} />
                  Match Pairs
                </button>
                <button
                  onClick={() => setCurrentView('settings')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                    ${currentView === 'settings'
                      ? 'bg-gray-100 text-gray-800'
                      : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <SettingsIcon size={18} />
                  Settings
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow py-8 px-4">
          {currentView === 'flashcards' && <Quiz />}
          {currentView === 'writing' && <WritingPractice />}
          {currentView === 'mcq' && <MultipleChoice />}
          {currentView === 'match' && <MatchPairs />}
          {currentView === 'settings' && <Settings />}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
          <div className="max-w-4xl mx-auto px-4 text-center text-gray-400 text-sm">
            Built with React & Tailwind CSS
          </div>
        </footer>
      </div>
    </DataProvider>
  );
}

export default App;

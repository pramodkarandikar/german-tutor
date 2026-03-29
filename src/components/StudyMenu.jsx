import React from 'react';
import { BookOpen } from 'lucide-react';

const StudyMenu = ({ onSelect }) => {
  const materials = [
    { id: 'vocabulary', label: 'Vocabulary', desc: 'Current vocab words', color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' },
    { id: 'word-genders', label: 'Word Genders', desc: 'Nouns by gender', color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/30' },
    { id: 'verbs_pp', label: 'Verbs PP', desc: 'Past Participles', color: 'text-teal-500', bg: 'bg-teal-500/10', border: 'border-teal-500/30' },
    { id: 'verb-prepositions', label: 'Verb Prepositions', desc: 'Verbs + Prep', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
    { id: 'opposites', label: 'Opposites', desc: 'Opposite pairs', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    { id: 'adjectives', label: 'Adjectives', desc: 'Adjective uses', color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
    { id: 'da-usage', label: 'Da Usage', desc: 'New da-usage list', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    { id: 'expressions', label: 'Expressions', desc: 'Common phrases', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    { id: 'articles-and-more', label: 'Articles & More', desc: 'Grammar tables', color: 'text-sky-500', bg: 'bg-sky-500/10', border: 'border-sky-500/30' },
    { id: 'local-prepositions', label: 'Local Prepositions', desc: 'Wo, wohin, woher', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  ];

  return (
    <div className="animate-fade-in p-4 pb-12 w-full max-w-6xl mx-auto flex flex-col items-center">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent mb-3">
          Study Material
        </h1>
        <p className="text-text-muted text-base md:text-lg">Select a reference list to review</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-5xl">
        {materials.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 outline-none animate-in fade-in fill-mode-both border border-border bg-surface hover:bg-surface-hover shadow-sm hover:shadow active:scale-[0.98]`}
            style={{ animationDelay: `${idx * 30}ms` }}
          >
            <div className="flex items-center gap-3">

              <div className="text-left">
                <h3 className={`text-sm md:text-base font-bold tracking-tight text-text group-hover:${item.color} transition-colors`}>
                  {item.label}
                </h3>
              </div>
            </div>
            <p className="text-xs text-text-muted opacity-80 group-hover:opacity-100">
              {item.desc}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudyMenu;

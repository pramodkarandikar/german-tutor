import React from 'react';
import { Volume2, Info } from 'lucide-react';
import alphabetData from '../data/alphabet.json';

const Alphabet = () => {
    // Utility function to play audio using SpeechSynthesis
    const playAudio = (text, lang = 'de-DE') => {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech to prevent overlapping and buffering
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            window.speechSynthesis.speak(utterance);
        } else {
            console.error('Speech Synthesis API not supported in this browser.');
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 animate-fade-in pb-12">
            <div className="mb-10 text-center md:text-left">
                <h1 className="text-4xl font-extrabold text-text mb-4">German Alphabet</h1>
                <p className="text-lg text-text-muted max-w-3xl">
                    Master the basics! The German alphabet has 26 standard letters, 3 umlauts (Ä, Ö, Ü), and one special letter (ß).
                    Click the speaker icons to hear the pronunciation.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {alphabetData.map((item, index) => (
                    <div 
                        key={index} 
                        className="bg-surface rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                    >
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-5xl font-bold text-text mb-1 font-sans">{item.letter}</h2>
                                    <div className="flex items-center gap-2">
                                        <span className="text-primary font-mono bg-primary/10 px-2 py-0.5 rounded text-sm">{item.phonetic}</span>
                                        <span className="text-text-muted text-sm italic">sounds like "{item.sound}"</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => playAudio(item.letter.split(' ')[0])} 
                                    className="p-3 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-colors flex-shrink-0"
                                    aria-label={`Play pronunciation for ${item.letter}`}
                                    title={`Play letter`}
                                >
                                    <Volume2 size={24} />
                                </button>
                            </div>

                            <div className="mb-5 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/50 flex gap-3">
                                <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                                    {item.pronunciation_tip}
                                </p>
                            </div>

                            <div className="border-t border-border pt-4">
                                <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-2">Example</p>
                                <div className="flex justify-between items-center group/word cursor-pointer" onClick={() => playAudio(item.example_word)}>
                                    <div>
                                        <p className="font-bold text-lg text-text group-hover/word:text-primary transition-colors">
                                            {item.example_word}
                                        </p>
                                        <p className="text-sm text-text-muted">{item.example_translation}</p>
                                    </div>
                                    <button 
                                        className="p-2 text-text-muted opacity-50 group-hover/word:opacity-100 group-hover/word:text-primary transition-all hover:bg-primary/10 rounded-full"
                                        aria-label={`Play word ${item.example_word}`}
                                    >
                                        <Volume2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Alphabet;

import React from 'react';
import { Volume2, BookOpen } from 'lucide-react';
import pronunciationData from '../data/pronunciation-rules.json';

const PronunciationRules = () => {
    // Utility function to play audio using SpeechSynthesis
    const playAudio = (text, lang = 'de-DE') => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            window.speechSynthesis.speak(utterance);
        } else {
            console.error('Speech Synthesis API not supported in this browser.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 animate-fade-in pb-12">
            <div className="mb-10 text-center md:text-left">
                <h1 className="text-4xl font-extrabold text-text mb-4 inline-flex items-center gap-4">
                    <BookOpen size={36} className="text-primary" />
                    Pronunciation Rules
                </h1>
                <p className="text-lg text-text-muted max-w-2xl">
                    German spelling is very phonetic. Once you learn how combinations of letters are pronounced, you can read almost any word correctly!
                </p>
            </div>

            <div className="space-y-6">
                {pronunciationData.map((item, index) => (
                    <div 
                        key={index} 
                        className="bg-surface rounded-2xl p-6 md:p-8 border border-border shadow-sm hover:shadow-md transition-all group flex flex-col md:flex-row gap-6 items-start"
                    >
                        {/* Rule Display */}
                        <div className="md:w-1/3 flex-shrink-0">
                            <h2 className="text-3xl font-bold text-primary mb-2 font-mono tracking-tight">{item.rule}</h2>
                            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full font-mono text-sm border border-primary/20">
                                {item.phonetic}
                            </span>
                        </div>

                        {/* Explanation & Example */}
                        <div className="flex-1 w-full relative">
                            <p className="text-text text-lg mb-6 leading-relaxed">
                                {item.explanation}
                            </p>

                            <div className="bg-background rounded-xl p-4 border border-border flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Example</span>
                                    <span className="text-xl font-bold text-text mb-1">{item.example_word}</span>
                                    <span className="text-sm text-text-muted italic">{item.example_translation}</span>
                                </div>
                                <button 
                                    onClick={() => playAudio(item.example_word)}
                                    className="p-4 bg-primary text-white rounded-full hover:bg-primary/90 hover:scale-105 transition-all shadow-md flex-shrink-0"
                                    aria-label={`Listen to ${item.example_word}`}
                                    title="Play example"
                                >
                                    <Volume2 size={24} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PronunciationRules;

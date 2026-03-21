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
        <div className="max-w-6xl mx-auto p-4 md:p-6 animate-[fade-in_0.5s_cubic-bezier(0.19,1,0.22,1)] pb-16">
            <div className="mb-6 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 mb-3">
                    Pronunciation
                </h1>
                <p className="text-base md:text-lg text-text-muted max-w-2xl font-light">
                    German spelling is beautifully phonetic. Master these letter combinations, and you can read anything.
                </p>
            </div>

            <div className="flex flex-col">
                {pronunciationData.map((item, index) => (
                    <div
                        key={index}
                        className="group flex flex-col md:flex-row gap-4 md:gap-8 py-5 md:py-6 border-b border-subtle dark:border-subtle hover:border-primary/40 transition-colors duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] items-start"
                    >
                        {/* Rule Display */}
                        {(() => {
                            const match = item.rule.match(/^([^(]+?)(\s*\(.*\))?$/);
                            const mainRule = match ? match[1].trim() : item.rule;
                            const qualifier = match && match[2] ? match[2].trim() : null;
                            return (
                                <div className="md:w-[200px] flex-shrink-0 flex flex-col gap-1">
                                    <h2 className="text-2xl md:text-3xl font-black text-text font-sans tracking-tight leading-tight group-hover:text-primary transition-colors duration-500 select-none">
                                        {mainRule}
                                    </h2>
                                    {qualifier && (
                                        <p className="text-xs md:text-sm text-text-muted font-medium leading-snug">
                                            {qualifier}
                                        </p>
                                    )}
                                    <div>
                                        <span className="inline-block border border-accent/30 text-accent px-2.5 py-0.5 rounded-full font-mono text-xs font-bold">
                                            {item.phonetic}
                                        </span>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Explanation & Example */}
                        <div className="flex-1 w-full flex flex-col justify-between h-full pt-1 min-w-0">
                            <p className="text-text text-sm md:text-base font-medium mb-3 leading-relaxed">
                                {item.explanation}
                            </p>

                            <div className="flex flex-wrap items-center justify-between gap-2 w-full">
                                <div
                                    className="group/word cursor-pointer flex-1 min-w-0"
                                    onClick={() => playAudio(item.example_word)}
                                >
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl md:text-2xl font-bold text-text mb-0.5 group-hover/word:text-primary transition-colors duration-300 truncate">
                                            {item.example_word}
                                        </h3>
                                        <Volume2 size={18} className="text-text-muted opacity-0 -translate-x-4 group-hover/word:opacity-100 group-hover/word:translate-x-0 group-hover/word:text-primary transition-all duration-300 ease-out shrink-0" strokeWidth={2} />
                                    </div>
                                    <p className="text-sm text-text-muted font-light italic">{item.example_translation}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PronunciationRules;

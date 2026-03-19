import React, { useState } from 'react';
import { Volume2, Info, Music, X, PlayCircle } from 'lucide-react';
import alphabetData from '../data/alphabet.json';

const Alphabet = () => {
    const [showSong, setShowSong] = useState(false);

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
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-center md:text-left">
                <div className="md:w-2/3">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 mb-3">German Alphabet</h1>
                    <p className="text-base text-text-muted">
                        Master the basics! The German alphabet has 26 standard letters, 3 umlauts (Ä, Ö, Ü), and one special letter (ß).
                        Click the speaker icons to hear the pronunciation.
                    </p>
                </div>

                {/* Song Tooltip / Button */}
                <div className="relative flex justify-center md:justify-end md:w-1/3">
                    <button
                        onClick={() => setShowSong(!showSong)}
                        className={`inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold transition-all shadow-sm border border-transparent z-10
                            ${showSong
                                ? 'bg-purple-600 text-white shadow-md'
                                : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 hover:border-purple-300'
                            }`}
                        aria-expanded={showSong}
                        aria-controls="song-tooltip"
                    >
                        {showSong ? <X size={20} /> : <Music size={20} />}
                        {showSong ? 'Close Song' : 'Sing the Alphabet Song!'}
                    </button>

                    {/* Tooltip / Popup Container */}
                    {showSong && (
                        <div
                            id="song-tooltip"
                            className="absolute top-[120%] right-0 md:right-0 z-50 w-[340px] sm:w-[400px] bg-surface border border-border rounded-2xl shadow-2xl p-5 animate-in fade-in zoom-in-95 duration-200 origin-top-right md:origin-top-right text-left"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-lg flex items-center gap-2 text-text">
                                    <PlayCircle size={18} className="text-primary" />
                                    Das Alphabet-Lied
                                </h3>
                            </div>

                            <div className="aspect-video w-full rounded-xl overflow-hidden mb-4 bg-background border border-border shadow-inner">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src="https://www.youtube.com/embed/Hgx0RTx0aFg"
                                    title="German Alphabet Song"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>

                            {/* Decorative pointer icon pointing up to the button */}
                            <div className="absolute -top-[7px] right-14 w-3.5 h-3.5 bg-surface border-t border-l border-border transform rotate-45 rounded-sm"></div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12 mt-6 pb-12">
                {alphabetData.map((item, index) => (
                    <div
                        key={index}
                        className="relative group flex flex-col justify-start"
                    >
                        {/* Massive Typography & Play Button */}
                        <div className="relative h-[80px] md:h-[90px] lg:h-[100px] w-full mb-4 border-b-2 border-subtle dark:border-subtle border-solid transition-colors duration-500 group-hover:border-primary/50">
                            <h2 className="absolute bottom-1 md:bottom-2 left-0 text-[3.5rem] sm:text-[4rem] lg:text-[4.5rem] xl:text-[5rem] leading-none font-black text-text font-sans tracking-tighter group-hover:text-primary transition-colors duration-700 ease-out select-none whitespace-nowrap z-0 pr-14" style={{ transformOrigin: 'left bottom' }}>
                                {item.letter}
                            </h2>
                            <button
                                onClick={() => playAudio(item.letter.split(' ')[0])}
                                className="absolute bottom-2 md:bottom-3 right-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-surface border border-border text-text hover:bg-primary hover:text-white hover:border-primary transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] shadow-sm group-hover:scale-105 z-10"
                                aria-label={`Play pronunciation for ${item.letter}`}
                                title={`Play letter`}
                            >
                                <Volume2 size={24} className="md:w-7 md:h-7" strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Phonetics & Sound */}
                        <div className="min-h-[60px] flex items-start sm:items-center gap-3 mb-4 pl-2 flex-wrap">
                            <span className="text-lg font-mono text-accent tracking-tight font-medium shrink-0">{item.phonetic}</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-border hidden sm:block shrink-0 mt-1 sm:mt-0"></div>
                            <span className="text-sm text-text-muted italic tracking-wide leading-snug">sounds like "{item.sound}"</span>
                        </div>

                        {/* Example Word & Tip Sequence, vertically spaced out for rhythm */}
                        <div className="space-y-4 pl-2">
                            <div className="group/word cursor-pointer flex justify-between items-center" onClick={() => playAudio(item.example_word)}>
                                <div>
                                    <p className="text-xl font-bold text-text mb-1 group-hover/word:text-primary transition-colors duration-300">
                                        {item.example_word}
                                    </p>
                                    <p className="text-base text-text-muted font-light">{item.example_translation}</p>
                                </div>
                                <button
                                    className="p-3 text-text-muted opacity-0 -translate-x-4 group-hover/word:opacity-100 group-hover/word:translate-x-0 group-hover/word:text-primary transition-all duration-300 ease-out rounded-full hover:bg-primary/10"
                                    aria-label={`Play word ${item.example_word}`}
                                >
                                    <PlayCircle size={24} strokeWidth={1.5} />
                                </button>
                            </div>

                            {item.pronunciation_tip && (
                                <p className="text-sm text-text-muted leading-relaxed border-l-[3px] border-accent/30 pl-4 py-1">
                                    {item.pronunciation_tip}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Alphabet;

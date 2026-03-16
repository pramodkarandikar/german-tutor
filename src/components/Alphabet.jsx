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
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 text-center md:text-left">
                <div className="md:w-2/3">
                    <h1 className="text-4xl font-extrabold text-text mb-4">German Alphabet</h1>
                    <p className="text-lg text-text-muted">
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

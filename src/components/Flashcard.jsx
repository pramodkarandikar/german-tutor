
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Repeat, Volume2 } from 'lucide-react';

const Flashcard = ({ card, onNext }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const playPronunciation = (e) => {
        e.stopPropagation();
        const utterance = new SpeechSynthesisUtterance(card.german);
        utterance.lang = 'de-DE';
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="perspective-1000 w-full max-w-xl mx-auto h-[380px] cursor-pointer group/card" onClick={handleFlip}>
            <motion.div
                className="relative w-full h-full text-center transform-style-3d cursor-pointer"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
            >
                {/* Front Side */}
                <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-primary/10 via-surface to-accent/10 dark:from-primary/10 dark:via-surface dark:to-accent/10 border-2 border-subtle rounded-[2.5rem] flex flex-col items-center justify-center p-10 md:p-12 transition-all duration-500 group-hover/card:border-primary/30 group-hover/card:shadow-2xl group-hover/card:-translate-y-1 overflow-hidden">
                    <div className="absolute top-6 left-8 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-[10px] font-mono text-text-muted font-black uppercase tracking-[0.3em]">{card.category}</span>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-6 w-full px-4 text-center">
                        <h2 className="text-4xl md:text-5xl font-black text-text  tracking-tight leading-[1.1] break-words hyphens-auto max-w-full">
                            {card.german}
                        </h2>

                        <div className="flex items-center gap-3">
                            <div className="h-[1.5px] w-6 bg-text/10" />
                            <button
                                onClick={playPronunciation}
                                className="p-3.5 rounded-full text-text-muted border-2 border-subtle hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300 ease-out hover:scale-110 active:scale-95 bg-surface/50 backdrop-blur-sm"
                                aria-label="Play pronunciation"
                                title="Play pronunciation"
                            >
                                <Volume2 size={24} strokeWidth={2} />
                            </button>
                            <div className="h-[1.5px] w-6 bg-text/10" />
                        </div>
                    </div>

                    <div className="absolute bottom-6 text-[9px] font-mono text-text/30 uppercase tracking-[0.4em] font-black">
                        Tap to flip
                    </div>
                </div>

                {/* Back Side */}
                <div className="absolute w-full h-full backface-hidden bg-text text-background rounded-[2.5rem] rotate-y-180 flex flex-col items-center justify-center p-10 md:p-12 shadow-2xl relative overflow-hidden">
                    {/* Decorative Background Element */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-background/5 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-background/5 rounded-full blur-3xl" />

                    <span className="absolute top-6 text-[9px] font-mono text-background/40 uppercase tracking-[0.4em] font-black">
                        English Translation
                    </span>

                    <h2 className="text-3xl md:text-4xl font-black font-sans tracking-tight mb-8 relative z-10 text-center px-6 leading-[1.1] break-words">
                        {card.english}
                    </h2>

                    {card.usage && (
                        <div className="max-w-md relative z-10 w-full px-4">
                            <div className="w-10 h-[2px] bg-background/20 mx-auto mb-6" />
                            <p className="text-background/80 text-lg md:text-xl font-medium italic leading-relaxed text-center opacity-90 line-clamp-4">
                                "{card.usage}"
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Flashcard;

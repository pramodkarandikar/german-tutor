
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
        <div className="perspective-1000 w-full max-w-md mx-auto h-64 cursor-pointer" onClick={handleFlip}>
            <motion.div
                className="relative w-full h-full text-center transform-style-3d"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.2, type: "tween", ease: "easeInOut" }}
            >
                {/* Front */}
                <div className="absolute w-full h-full backface-hidden bg-surface border-[3px] border-text/10 dark:border-text/5 rounded-[2rem] flex flex-col items-center justify-center p-8 md:p-12 transition-colors hover:border-primary/30">
                    <span className="text-xs font-mono text-text-muted font-bold uppercase tracking-[0.2em] mb-4">{card.category}</span>
                    <div className="flex items-center justify-center gap-4 relative w-full px-6">
                        <h2 className="text-2xl md:text-3xl font-black text-text font-sans tracking-tight">{card.german}</h2>
                        <button
                            onClick={playPronunciation}
                            className="absolute right-0 p-3 rounded-full text-text border-2 border-transparent hover:border-text/10 hover:bg-text/5 transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-110"
                            aria-label="Play pronunciation"
                            title="Play pronunciation"
                        >
                            <Volume2 size={28} strokeWidth={2} />
                        </button>
                    </div>
                </div>

                {/* Back */}
                <div className="absolute w-full h-full backface-hidden bg-text text-background rounded-[2rem] rotate-y-180 flex flex-col items-center justify-center p-8 md:p-12 shadow-2xl">
                    <h2 className="text-3xl md:text-4xl font-black font-sans tracking-tight mb-6">{card.english}</h2>
                    {card.usage && (
                        <p className="text-background/80 text-lg md:text-xl font-light italic border-t border-background/20 pt-6 mt-2 max-w-sm">
                            "{card.usage}"
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Flashcard;

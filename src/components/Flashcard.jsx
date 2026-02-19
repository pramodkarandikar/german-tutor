
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Repeat } from 'lucide-react';

const Flashcard = ({ card, onNext }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div className="perspective-1000 w-full max-w-md mx-auto h-64 cursor-pointer" onClick={handleFlip}>
            <motion.div
                className="relative w-full h-full text-center transition-all duration-500 transform-style-3d"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.15, type: "spring", stiffness: 260, damping: 20 }}
            >
                {/* Front */}
                <div className="absolute w-full h-full backface-hidden bg-surface border-2 border-border rounded-xl shadow-xl flex flex-col items-center justify-center p-6">
                    <span className="text-sm text-primary font-semibold uppercase tracking-wider mb-2">{card.category}</span>
                    <h2 className="text-3xl font-bold text-text">{card.german}</h2>
                    <div className="mt-8 text-text-muted text-xs flex items-center gap-1">
                        <Repeat size={14} />
                        <span>Tap to reveal</span>
                    </div>
                </div>

                {/* Back */}
                <div className="absolute w-full h-full backface-hidden bg-primary dark:bg-surface dark:border-2 dark:border-primary text-primary-foreground dark:text-text rounded-xl shadow-xl rotate-y-180 flex flex-col items-center justify-center p-6">
                    <h2 className="text-2xl font-bold mb-4">{card.english}</h2>
                    {card.usage && (
                        <p className="text-primary-foreground/80 dark:text-text-muted text-sm italic border-t border-primary-foreground/20 dark:border-border pt-4 mt-2">
                            "{card.usage}"
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Flashcard;

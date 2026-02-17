
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
                <div className="absolute w-full h-full backface-hidden bg-white border-2 border-blue-100 rounded-xl shadow-xl flex flex-col items-center justify-center p-6">
                    <span className="text-sm text-blue-500 font-semibold uppercase tracking-wider mb-2">{card.category}</span>
                    <h2 className="text-3xl font-bold text-gray-800">{card.german}</h2>
                    <div className="mt-8 text-gray-400 text-xs flex items-center gap-1">
                        <Repeat size={14} />
                        <span>Tap to reveal</span>
                    </div>
                </div>

                {/* Back */}
                <div className="absolute w-full h-full backface-hidden bg-blue-600 text-white rounded-xl shadow-xl rotate-y-180 flex flex-col items-center justify-center p-6">
                    <h2 className="text-2xl font-bold mb-4">{card.english}</h2>
                    {card.usage && (
                        <p className="text-blue-100 text-sm italic border-t border-blue-500 pt-4 mt-2">
                            "{card.usage}"
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Flashcard;

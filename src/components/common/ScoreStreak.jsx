import React from 'react';
import { Flame } from 'lucide-react';

const ScoreStreak = ({ score, streak }) => {
    return (
        <div className="flex items-center gap-4 justify-center shrink-0 bg-surface/50 backdrop-blur-md border border-subtle px-5 py-3 rounded-2xl shadow-sm">
            {score !== undefined && score !== null && (
                <>
                    <div className="text-center md:text-right">
                        <div className="text-[10px] text-text-muted uppercase font-black tracking-[0.2em] mb-1">Score</div>
                        <div className="font-black text-text tracking-tighter">
                            {typeof score === 'object' ? (
                                <>
                                    <span className="text-2xl md:text-3xl leading-none text-primary">{score.correct || 0}</span>
                                    <span className="text-lg md:text-xl text-text-muted opacity-50 ml-1">/ {score.total || 0}</span>
                                </>
                            ) : (
                                <span className="text-2xl md:text-3xl leading-none text-primary">{score}</span>
                            )}
                        </div>
                    </div>
                    {streak !== undefined && streak !== null && (
                        <div className="w-[2px] h-10 bg-border/50 rounded-full" />
                    )}
                </>
            )}
            
            {streak !== undefined && streak !== null && (
                <div className="text-center md:text-left">
                    <div className="text-[10px] text-text-muted uppercase font-black tracking-[0.2em] mb-1">Streak</div>
                    <div className={`font-black flex items-center justify-center md:justify-start gap-1.5 ${streak > 2 ? 'text-orange-500' : 'text-text'}`}>
                        <Flame size={20} strokeWidth={streak > 2 ? 3 : 2} fill={streak > 2 ? "currentColor" : "none"} className={streak > 2 ? 'animate-pulse' : ''} />
                        <span className="text-2xl md:text-3xl leading-none tracking-tighter">{streak}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScoreStreak;

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, ChevronUp, Filter, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CategoryFilter = ({ categories, selectedCategories, onToggleCategory }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const getLabel = () => {
        if (selectedCategories.length === 0) return 'All Categories';
        if (selectedCategories.length === 1) return selectedCategories[0];
        return `${selectedCategories.length} Selected`;
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-2xl font-bold transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] border-2 shadow-sm
 ${isOpen
                        ? 'bg-text text-background border-text'
                        : 'bg-surface text-text border-subtle hover:border-border'}`}
            >
                <div className="flex items-center gap-3">
                    <Filter size={18} className={isOpen ? 'text-background' : 'text-primary'} />
                    <span className="text-sm truncate max-w-[140px]">{getLabel()}</span>
                </div>
                <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {mounted && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 pointer-events-none">
                            {/* Backdrop */}
                            <motion.div
                                key="backdrop"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                                className="absolute inset-0 bg-background/60 backdrop-blur-md pointer-events-auto"
                            />

                            {/* Modal */}
                            <motion.div
                                key="modal"
                                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                                className="relative w-full max-w-4xl max-h-full flex flex-col bg-surface border-2 border-subtle/50 rounded-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto ring-1 ring-border/10"
                            >
                                <div className="p-8 pb-6 flex items-center justify-between border-b border-subtle bg-surface/50 backdrop-blur-md sticky top-0 z-10 shrink-0">
                                    <div className="pr-12">
                                        <h2 className="text-3xl font-black text-text tracking-tight">Focus your study</h2>
                                        <p className="text-base text-text-muted mt-2">Select one or more categories</p>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-4 rounded-full bg-surface border border-subtle hover:border-border hover:bg-text/5 transition-colors text-text-muted hover:text-text shadow-sm"
                                        aria-label="Close filters"
                                    >
                                        <X size={28} strokeWidth={2.5} />
                                    </button>
                                </div>

                                <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-surface/30">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                                        {categories.map((category) => {
                                            const isSelected = selectedCategories.includes(category);
                                            return (
                                                <button
                                                    key={category}
                                                    onClick={() => onToggleCategory(category)}
                                                    className={`flex items-center justify-between px-6 py-5 rounded-2xl text-[15px] font-bold transition-all duration-300 border-2 group
 ${isSelected
                                                            ? 'bg-text text-background border-text shadow-md scale-[1.03]'
                                                            : 'bg-surface text-text border-subtle hover:border-border hover:bg-surface/80 hover:shadow-sm'}`}
                                                >
                                                    <span className="text-left leading-tight pr-3 break-words hyphens-auto">{category}</span>
                                                    {isSelected && <Check size={20} strokeWidth={3} className="shrink-0" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="p-4 sm:p-8 bg-surface border-t border-subtle flex flex-wrap sm:flex-nowrap gap-4 sm:gap-6 shrink-0 backdrop-blur-md">
                                    <button
                                        onClick={() => {
                                            onToggleCategory('All');
                                            setIsOpen(false);
                                        }}
                                        className={`flex-[1] flex items-center justify-center gap-2 py-4 sm:py-5 px-4 rounded-2xl font-black transition-all text-[15px] sm:text-base border-2
 ${selectedCategories.length === 0
                                                ? 'bg-gradient-to-r from-primary to-accent text-white border-transparent shadow-md'
                                                : 'bg-surface text-text border-subtle hover:border-border hover:bg-surface/80'}`}
                                    >
                                        <span>Show All</span>
                                        {selectedCategories.length === 0 && <Check size={18} strokeWidth={3} />}
                                    </button>
                                    <button
                                        onClick={() => onToggleCategory('All')}
                                        className="flex-[1] py-4 sm:py-5 px-4 rounded-2xl border-2 border-subtle font-black text-text-muted hover:text-text hover:border-border transition-all text-[15px] sm:text-base"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="flex-[1] sm:flex-[2] py-4 sm:py-5 px-4 rounded-2xl bg-text text-background font-black border-2 border-text hover:bg-transparent hover:text-text transition-all shadow-xl text-[15px] sm:text-base tracking-wide"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export default CategoryFilter;

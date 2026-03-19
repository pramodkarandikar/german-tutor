
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

const CategoryFilter = ({ categories, selectedCategories, onToggleCategory }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getLabel = () => {
        if (selectedCategories.length === 0) return 'All';
        if (selectedCategories.length === 1) return selectedCategories[0];
        return `${selectedCategories.length} Selected`;
    };

    return (
        <div>
            <div className="flex justify-center">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] border-[2px]
                        ${isExpanded
                            ? 'bg-text text-background border-text shadow-xl'
                                    : 'bg-transparent text-text-muted border-subtle hover:border-border hover:text-text'}`}
                >
                    <Filter size={22} strokeWidth={2.5} />
                    <span>Filter: <span className="font-black">{getLabel()}</span></span>
                    {isExpanded ? <ChevronUp size={22} strokeWidth={2.5} /> : <ChevronDown size={22} strokeWidth={2.5} />}
                </button>
            </div>

            {isExpanded && (
                <div className="flex flex-wrap gap-3 justify-center mt-6 animate-[fade-in_0.3s_ease-out] py-6">
                    <button
                        onClick={() => onToggleCategory('All')}
                        className={`px-6 py-3 rounded-2xl text-base font-bold transition-all duration-300 border-[2px]
                  ${selectedCategories.length === 0
                                ? 'bg-text text-background border-text shadow-lg scale-105'
                                : 'bg-transparent text-text-muted border-subtle hover:border-text hover:text-text'}`}
                    >
                        All
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => onToggleCategory(category)}
                            className={`px-6 py-3 rounded-2xl text-base font-bold transition-all duration-300 border-[2px]
                    ${selectedCategories.includes(category)
                                    ? 'bg-text text-background border-text shadow-lg scale-105'
                                    : 'bg-transparent text-text-muted border-subtle hover:border-border hover:text-text'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryFilter;

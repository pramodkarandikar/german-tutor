
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
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm border
                        ${isExpanded
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                            : 'bg-surface text-text hover:bg-background border-border shadow-sm'}`}
                >
                    <Filter size={18} />
                    <span>Filter: <span className="font-bold text-blue-600">{getLabel()}</span></span>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
            </div>

            {isExpanded && (
                <div className="flex flex-wrap gap-2 justify-center mt-4 animate-fade-in bg-surface p-4 rounded-2xl border border-border shadow-lg">
                    <button
                        onClick={() => onToggleCategory('All')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 
                  ${selectedCategories.length === 0
                                ? 'bg-primary text-primary-foreground shadow-md scale-105'
                                : 'bg-background text-text-muted hover:bg-surface border border-border'}`}
                    >
                        All
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => onToggleCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 
                    ${selectedCategories.includes(category)
                                    ? 'bg-primary text-primary-foreground shadow-md scale-105'
                                    : 'bg-background text-text-muted hover:bg-surface border border-border'}`}
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

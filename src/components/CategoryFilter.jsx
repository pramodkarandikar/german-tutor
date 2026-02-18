
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
        <div className="mb-8">
            <div className="flex justify-center">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm border
                        ${isExpanded
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'}`}
                >
                    <Filter size={18} />
                    <span>Filter: <span className="font-bold text-blue-600">{getLabel()}</span></span>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
            </div>

            {isExpanded && (
                <div className="flex flex-wrap gap-2 justify-center mt-4 animate-fade-in bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <button
                        onClick={() => onToggleCategory('All')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 
                  ${selectedCategories.length === 0
                                ? 'bg-blue-600 text-white shadow-lg scale-105'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                    >
                        All
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => onToggleCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 
                    ${selectedCategories.includes(category)
                                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
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

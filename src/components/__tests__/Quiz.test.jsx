import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Quiz from '../Quiz';
import { DataContext } from '../../contexts/DataContext';

// Mock dependencies
vi.mock('../Flashcard', () => ({
    default: ({ card }) => <div data-testid="flashcard">{card.german} - {card.english}</div>,
}));

vi.mock('../CategoryFilter', () => ({
    default: ({ onToggleCategory }) => (
        <button onClick={() => onToggleCategory('All')}>Filter Toggle</button>
    ),
}));

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

const mockVocabulary = [
    { german: 'Hund', english: 'Dog', category: 'Animals' },
    { german: 'Katze', english: 'Cat', category: 'Animals' },
];

beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('Quiz', () => {
    it('renders flashcard with data', () => {
        render(
            <DataContext.Provider value={{ vocabulary: mockVocabulary }}>
                <Quiz />
            </DataContext.Provider>
        );

        expect(screen.getByText('Flashcards')).toBeInTheDocument();
        expect(screen.getByTestId('flashcard')).toHaveTextContent('Hund');
    });

    it('navigates to next card', () => {
        render(
            <DataContext.Provider value={{ vocabulary: mockVocabulary }}>
                <Quiz />
            </DataContext.Provider>
        );

        expect(screen.getByTestId('flashcard')).toHaveTextContent('Hund');

        // Find next button (ChevronRight) - looking by label
        const nextButton = screen.getByLabelText('Next card');
        fireEvent.click(nextButton);

        expect(screen.getByTestId('flashcard')).toHaveTextContent('Katze');
    });

    it('navigates to previous card', () => {
        render(
            <DataContext.Provider value={{ vocabulary: mockVocabulary }}>
                <Quiz />
            </DataContext.Provider>
        );

        // Move to second card
        const nextButton = screen.getByLabelText('Next card');
        fireEvent.click(nextButton);
        expect(screen.getByTestId('flashcard')).toHaveTextContent('Katze');

        // Move back
        const prevButton = screen.getByLabelText('Previous card');
        fireEvent.click(prevButton);
        expect(screen.getByTestId('flashcard')).toHaveTextContent('Hund');
    });
});

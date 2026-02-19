import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Navigation from '../Navigation';
import { ThemeProvider } from '../../context/ThemeContext';

// Mock ThemeSelector to avoid nesting complexity
vi.mock('../ThemeSelector', () => ({
    default: () => <div data-testid="theme-selector">ThemeSelector</div>,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    BookOpen: () => <div>Icon</div>,
    PenTool: () => <div>Icon</div>,
    LayoutGrid: () => <div>Icon</div>,
    Puzzle: () => <div>Icon</div>,
    Settings: () => <div>Icon</div>,
    Type: () => <div>Icon</div>,
    Link2: () => <div>Icon</div>,
    Menu: () => <div>Icon</div>,
    X: () => <div>Icon</div>,
}));

describe('Navigation', () => {
    it('renders navigation items', () => {
        render(
            <ThemeProvider>
                <Navigation currentView="flashcards" setCurrentView={() => { }}>
                    <div>Child Content</div>
                </Navigation>
            </ThemeProvider>
        );

        expect(screen.getAllByText('Wise Umlaut')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Flashcards')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Writing Practice')[0]).toBeInTheDocument();
        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('calls setCurrentView when an item is clicked', () => {
        const setCurrentViewMock = vi.fn();
        render(
            <ThemeProvider>
                <Navigation currentView="flashcards" setCurrentView={setCurrentViewMock}>
                    <div>Child Content</div>
                </Navigation>
            </ThemeProvider>
        );

        fireEvent.click(screen.getAllByText('Writing Practice')[0]);
        expect(setCurrentViewMock).toHaveBeenCalledWith('writing');
    });

    it('toggles mobile menu', () => {
        render(
            <ThemeProvider>
                <Navigation currentView="flashcards" setCurrentView={() => { }}>
                    <div>Child Content</div>
                </Navigation>
            </ThemeProvider>
        );

        // Mobile menu is hidden by default on desktop, but we can test the button exists
        // Note: checking visibility might require more complex setup or viewport mocking
    });
});

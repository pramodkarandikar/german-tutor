import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ThemeSelector from '../ThemeSelector';
import { ThemeProvider } from '../../context/ThemeContext';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    Sun: () => <div data-testid="sun-icon">Sun</div>,
    Moon: () => <div data-testid="moon-icon">Moon</div>,
}));

describe('ThemeSelector', () => {
    it('renders correctly', () => {
        render(
            <ThemeProvider>
                <ThemeSelector />
            </ThemeProvider>
        );
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('toggles theme on click', () => {
        const { container } = render(
            <ThemeProvider>
                <ThemeSelector />
            </ThemeProvider>
        );

        const button = screen.getByRole('button');

        // Initial state should be light (Moon icon visible)
        expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
        expect(document.documentElement.classList.contains('light')).toBe(true);

        // Click to toggle to dark
        fireEvent.click(button);
        expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
        expect(document.documentElement.classList.contains('dark')).toBe(true);

        // Click to toggle back to light
        fireEvent.click(button);
        expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
        expect(document.documentElement.classList.contains('light')).toBe(true);
    });
});

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Alphabet from '../Alphabet';

// Mock speech synthesis
Object.defineProperty(window, 'speechSynthesis', {
 value: {
 cancel: vi.fn(),
 speak: vi.fn(),
 },
 writable: true,
});
Object.defineProperty(global, 'SpeechSynthesisUtterance', {
 value: vi.fn(),
 writable: true,
});

describe('Alphabet', () => {
 it('renders the alphabet component', () => {
 render(<Alphabet />);
 expect(screen.getByText('German Alphabet')).toBeInTheDocument();
 expect(screen.getByText('Master the basics!', { exact: false })).toBeInTheDocument();
 });
});

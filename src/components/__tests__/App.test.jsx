import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../../App';

describe('App', () => {
 it('renders the navigation and default view', () => {
 render(<App />);
 expect(screen.getAllByText('Wise Umlaut.')[0]).toBeInTheDocument();
 expect(screen.getAllByText('Flashcards', { exact: false })[0]).toBeInTheDocument();
 });
});

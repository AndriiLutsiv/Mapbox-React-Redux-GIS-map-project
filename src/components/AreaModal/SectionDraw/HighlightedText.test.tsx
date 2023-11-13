import { render, screen } from '@testing-library/react';
import { HighlightedText } from './HiglightedText';

describe('HighlightedText', () => {
    it('renders the component correctly', () => {
        render(<HighlightedText text="Couple of words" userInput="Couple" />);
        
        const componentPart1 = screen.getByText('Couple');
        const componentPart2 = screen.getByText('of words');
        expect(componentPart1).toBeInTheDocument();
        expect(componentPart2).toBeInTheDocument();
    });

    it('highlights the user input in the text', () => {
        render(<HighlightedText text="Couple of words" userInput="Couple" />);
        
        const highlightedText = screen.getByText('Couple');
        expect(highlightedText).toHaveClass('highlighted');
    });

    it("doesn't highlight the text if the user input is not found in the text", () => {
        render(<HighlightedText text="Couple of words" userInput="Single" />);
        
        const nonHighlightedText = screen.getByText('Couple of words');
        expect(nonHighlightedText).toHaveClass('unhighlighted');  
    });
});

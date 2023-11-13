import { render, screen } from '@testing-library/react';
import NotFound from './NotFound';

describe('NotFound Component', () => {
    it('renders NotFound component', () => {
        render(<NotFound />);
        const element = screen.getByTestId('NotFound');
        expect(element).toBeInTheDocument();
    });
});

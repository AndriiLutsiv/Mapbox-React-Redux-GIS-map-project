import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from 'constants/routes';
import ProjectCard from './ProjectCard';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useLocation: jest.fn(),
}));

describe('ProjectCard', () => {
    const mockNavigate = jest.fn();
    const mockLocation = { pathname: '/projects' };

    beforeEach(() => {
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        (useLocation as jest.Mock).mockReturnValue(mockLocation);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    const mockProps = {
        uuid: '1',
        name: 'Test Project',
        num_of_properties: 5,
        head_end: 'ABC Exchange',
        link: `/projects/${ROUTES.MAP}`,
    };

    it('renders the project card with correct name, property count, and telephone exchange', () => {
        render(
            <MemoryRouter>
                <ProjectCard {...mockProps} />
            </MemoryRouter>
        );

        expect(screen.getByText(mockProps.name)).toBeInTheDocument();
        expect(screen.getByText(/5\b/)).toBeInTheDocument();
        expect(screen.getByText(/ABC Exchange/i)).toBeInTheDocument();
    });

    it('navigates to the map route when the project card is clicked', () => {
        render(
            <MemoryRouter>
                <ProjectCard {...mockProps} />
            </MemoryRouter>
        );

        const projectCard = screen.getByTestId('ProjectCard');
        fireEvent.click(projectCard);

        expect(mockNavigate).toHaveBeenCalledWith(`${mockLocation.pathname}/${mockProps.uuid}`);
    });
});

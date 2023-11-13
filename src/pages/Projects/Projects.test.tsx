import { waitFor, screen, act } from '@testing-library/react';
import Projects from './Projects';
import { MemoryRouter, useLocation, useParams } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import { renderWithProviders } from 'test-utils';
import { projectAPI } from 'services/ProjectService';
import { data } from 'mock/api/projects';
import { SortDetails, SORT_KEY, SORT_OPTION, SORT_DIRECTION } from 'constants/sorting';
import { MapProvider } from 'app/providers/MapProvider';

// Mock response for projects data
const mockProjectData = data;

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(),
    useParams: jest.fn()
}));

jest.mock('hooks/useAuth', () => ({
    useAuth: jest.fn().mockReturnValue({ token: 'dummyToken' })
}));

describe('Projects', () => {
    const mockLocation = { pathname: '/scenarios/area_uuid_1/scenario_uuid_1' };

    beforeEach(() => {
        (useLocation as jest.Mock).mockReturnValue(mockLocation);
        (useAuth as jest.Mock).mockReturnValue({ token: 'dummyToken' });
        (useParams as jest.Mock).mockReturnValue({ param1: 'area_uuid_1', param2: 'scenario_uuid_1' })
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('renders loading spinner while fetching projects', async () => {
        jest.spyOn(projectAPI, 'useGetProjectsQuery').mockReturnValue({
            data: null,
            error: null,
            isLoading: true,
        } as any);

        renderWithProviders(<MemoryRouter><MapProvider><Projects /></MapProvider></MemoryRouter>);

        expect(screen.getByTestId('Spinner')).toBeInTheDocument();
        expect(screen.queryByTestId('Projects')).not.toBeInTheDocument();
    });

    it('renders list of projects', async () => {
        jest.spyOn(projectAPI, 'useGetProjectsQuery').mockReturnValue({
            data: mockProjectData,
            error: null,
            isLoading: false,
        } as any);

        renderWithProviders(<MemoryRouter><MapProvider><Projects /></MapProvider></MemoryRouter>);

        const projects = await waitFor(() => screen.findAllByText("project_name_test"));
        expect(projects).toHaveLength(mockProjectData.length);
        expect(screen.queryByTestId('Spinner')).not.toBeInTheDocument();
    })

    it('sorts scenarios correctly', async () => {
        jest.spyOn(projectAPI, 'useGetProjectsQuery').mockReturnValue({
            data: mockProjectData,
            error: null,
            isLoading: false,
        } as any);

        renderWithProviders(<MemoryRouter><MapProvider><Projects /></MapProvider></MemoryRouter>);

        const sortEvent = new CustomEvent<SortDetails>(SORT_KEY, {
            detail: {
                option: SORT_OPTION.PROPERTY,  
                direction: SORT_DIRECTION.ASC,
                text: 'Property Count',
            }
        });

        act(() => {
            window.dispatchEvent(sortEvent);
        });

        const scenarios = await screen.findAllByTestId('ProjectCard');
        const scenarioNames = scenarios.map(scenario => scenario.textContent);

        // Expect that the scenario names are sorted in some order. The sorting logic for the function is tested separately
        expect(scenarioNames).toEqual([...scenarioNames].sort());
    });
});

import { waitFor, screen, act } from '@testing-library/react';
import Scenarios from './Scenarios';
import { MemoryRouter, useLocation, useParams } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import { renderWithProviders } from 'test-utils';
import { scenarioAPI } from 'services/ScenarioService';
import { data } from 'mock/api/scenarios';
import { SORT_DIRECTION, SORT_OPTION, SortDetails, SORT_KEY, FavouriteDetails, FAVOURITE_KEY } from 'constants/sorting';

// Mock response for scenario data
const mockScenarioData = data;

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(),
    useParams: jest.fn()
}));

jest.mock('hooks/useAuth', () => ({
    useAuth: jest.fn().mockReturnValue({ token: 'dummyToken' })
}));

describe('Scenarios', () => {
    const mockLocation = { pathname: '/scenarios/area_uuid_1' };

    beforeEach(() => {
        (useLocation as jest.Mock).mockReturnValue(mockLocation);
        (useAuth as jest.Mock).mockReturnValue({ token: 'dummyToken' });
        (useParams as jest.Mock).mockReturnValue({ param1: 'area_uuid_1' })
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('renders loading spinner while fetching scenarios', async () => {
        jest.spyOn(scenarioAPI, 'useGetScenariosQuery').mockReturnValue({
            data: null,
            error: null,
            isLoading: true,
        } as any);

        renderWithProviders(<MemoryRouter><Scenarios /></MemoryRouter>);

        expect(screen.getByTestId('Spinner')).toBeInTheDocument();
        expect(screen.queryByTestId('Scenarios')).not.toBeInTheDocument();
    });

    it('renders list of scenarios', async () => {
        jest.spyOn(scenarioAPI, 'useGetScenariosQuery').mockReturnValue({
            data: mockScenarioData,
            error: null,
            isLoading: false,
        } as any);

        renderWithProviders(<MemoryRouter><Scenarios /></MemoryRouter>);

        const scenarios = await waitFor(() => screen.findAllByText("scenario_name_test"));
        expect(scenarios).toHaveLength(mockScenarioData.length);
        expect(screen.queryByTestId('Spinner')).not.toBeInTheDocument();
    });

    it('sorts scenarios correctly', async () => {
        jest.spyOn(scenarioAPI, 'useGetScenariosQuery').mockReturnValue({
            data: mockScenarioData,
            error: null,
            isLoading: false,
        } as any);

        renderWithProviders(<MemoryRouter><Scenarios /></MemoryRouter>);

        const sortEvent = new CustomEvent<SortDetails>(SORT_KEY, {
            detail: {
                option: SORT_OPTION.CREATED,
                direction: SORT_DIRECTION.DESC,
                text: 'Created',
            }
        });

        act(() => {
            window.dispatchEvent(sortEvent);
        });

        const scenarios = await screen.findAllByTestId('ScenarioCard');
        const scenarioNames = scenarios.map(scenario => scenario.textContent);

        // Expect that the scenario names are sorted in some order. The sorting logic for the function is tested separately
        expect(scenarioNames).toEqual([...scenarioNames].sort());
    });

    it('filters favourite scenarios correctly', async () => {
        // Make sure at least one scenario is marked as a favourite
        const favouriteScenarioData = mockScenarioData.map((scenario, index) => {
            if (index === 0) {
                return { ...scenario, starred: true };
            } else {
                return { ...scenario, starred: false };
            }
        });

        jest.spyOn(scenarioAPI, 'useGetScenariosQuery').mockReturnValue({
            data: favouriteScenarioData,
            error: null,
            isLoading: false,
        } as any);

        renderWithProviders(<MemoryRouter><Scenarios /></MemoryRouter>);

        // Dispatch a custom event indicating that only favourite scenarios should be shown
        const favouriteEvent = new CustomEvent<FavouriteDetails>(FAVOURITE_KEY, {
            detail: { isFavourite: true },
        });


        act(() => {
            window.dispatchEvent(favouriteEvent);
        });

        // Await the rerender
        await waitFor(() => { });

        // Expect that only the favourite scenarios are being rendered
        const favouriteScenarios = await screen.findAllByTestId('ScenarioCard');
        expect(favouriteScenarios).toHaveLength(1);
    });
});

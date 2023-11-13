import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import ScenarioCard from './ScenarioCard';
import { renderWithProviders } from 'test-utils';
import { format } from 'date-fns';
import { scenarioAPI } from 'services/ScenarioService';
import { data } from 'mock/api/scenarios';

// Mock response for scenarioCard data
const mockScenarioData = data[0];

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('ScenarioCard', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    const mockProps = {
        uuid: "scenario_uuid_1",
        area_uuid: "area_uuid_1",
        name: "scenario_name_test",
        description: "scenario_description_test",
        last_updated: "2019-08-24T14:15:22Z",
        created_on: "2019-08-24T14:15:22Z",
        starred: false,
        num_of_projects: 0,
        link: '/test',
    };

    it('renders the scenario card with correct props', () => {
        renderWithProviders(<MemoryRouter><ScenarioCard {...mockProps} /></MemoryRouter>);
        expect(screen.getByText(mockProps.name)).toBeInTheDocument();
        expect(screen.getByText(mockProps.description)).toBeInTheDocument();
        expect(screen.getByText(`Projects: ${mockProps.num_of_projects}`)).toBeInTheDocument();
    });

    it('renders the created_on date correctly', () => {
        renderWithProviders(<MemoryRouter><ScenarioCard {...mockProps} /></MemoryRouter>);
        expect(screen.getByText(`Created on: ${format(new Date(mockProps.created_on), 'dd/MM/yy')}`)).toBeInTheDocument();
    });

    it('renders the last_updated date correctly', () => {
        renderWithProviders(<MemoryRouter><ScenarioCard {...mockProps} /></MemoryRouter>);
        expect(screen.getByText(`Last modified: ${format(new Date(mockProps.last_updated), 'dd/MM/yy')}`)).toBeInTheDocument();
    });

    it('calls navigate function when scenario card is clicked', () => {
        renderWithProviders(<MemoryRouter><ScenarioCard {...mockProps} /></MemoryRouter>);
        fireEvent.click(screen.getByTestId('ScenarioCard'));
        expect(mockNavigate).toHaveBeenCalledWith(mockProps.link);
    });

    it('renders the input field in edit state when clicked and changes value in input when edited', () => {
        renderWithProviders(<MemoryRouter><ScenarioCard {...mockProps} /></MemoryRouter>);

        // Click on the edit options
        fireEvent.click(screen.getByTestId('CardSettings_options'));
        // Click on "rename" option
        fireEvent.click(screen.getByTestId('card-settings-edit-text'));

        const inputField = screen.getByTestId('ScenarioCardTitle');

        expect(inputField).toBeInTheDocument();

        fireEvent.change(inputField, { target: { value: 'new_scenario_name_test' } });

        expect(inputField).toHaveValue('new_scenario_name_test');
    });

    it('calls toggleFavourite function when star icon is clicked', async () => {
        const mockToggleFavourite = jest.fn();
        jest.spyOn(scenarioAPI, 'useUpdateScenarioMutation').mockReturnValue([
            mockToggleFavourite,
            { data: mockScenarioData, error: null, isLoading: false },
        ] as any);

        renderWithProviders(<MemoryRouter><ScenarioCard {...mockProps} /></MemoryRouter>);

        const starIcon = screen.getByTestId('star-icon');
        fireEvent.click(starIcon);

        await waitFor(() => {
            expect(mockToggleFavourite).toHaveBeenCalled();
        });
    });

});

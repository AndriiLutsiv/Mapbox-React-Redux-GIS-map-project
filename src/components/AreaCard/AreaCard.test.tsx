import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import AreaCard from './AreaCard';
import { areaAPI } from 'services/AreaService';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

jest.mock('hooks/useAuth', () => ({
    useAuth: () => ({
        token: 'dummy_token',
    }),
}));

describe('AreaCard', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

        jest.spyOn(areaAPI, 'useDeleteAreaMutation').mockReturnValue([
            jest.fn().mockResolvedValue({}),
            { error: null, isLoading: false },
        ] as any);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    const mockProps = {
        uuid: '1',
        name: 'Test Area',
        description: 'Test description',
        geometry: null,
        link: '/test',
        setAreaUuid: () => { },
        setShowModal: () => { }
    };

    it('renders the area card with correct name and description', () => {
        render(
            <MemoryRouter>
                <AreaCard {...mockProps} />
            </MemoryRouter>
        );
        expect(screen.getByText(mockProps.name)).toBeInTheDocument();
        expect(screen.getByText(mockProps.description)).toBeInTheDocument();
    });

    it('calls navigate function when area card is clicked', () => {
        render(
            <MemoryRouter>
                <AreaCard {...mockProps} />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByText(mockProps.name));
        expect(mockNavigate).toHaveBeenCalledWith('/test');
    });

    it('calls handleDelete when delete button is clicked', async () => {
        const mockDeleteArea = jest.fn().mockResolvedValue({});

        jest.spyOn(areaAPI, 'useDeleteAreaMutation').mockReturnValue([
            mockDeleteArea,
            { error: null, isLoading: false },
        ] as any);

        render(
            <MemoryRouter>
                <AreaCard {...mockProps} />
            </MemoryRouter>
        );

        // Click on the edit options
        fireEvent.click(screen.getByTestId('CardSettings_options'));
        expect(screen.getByText(/delete/i)).toBeInTheDocument();
        // Click on "delete" option
        fireEvent.click(screen.getByText(/delete/i));

        await waitFor(() => {
            expect(mockDeleteArea).toHaveBeenCalledWith("1");
        });
    });
});

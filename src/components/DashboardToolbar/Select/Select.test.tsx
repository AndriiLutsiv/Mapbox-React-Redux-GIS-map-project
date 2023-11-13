import React from 'react';
import { screen } from '@testing-library/react';
import Select from './Select';
import { MemoryRouter } from 'react-router-dom';
import { MapProvider } from 'app/providers/MapProvider';
import { renderWithProviders } from 'test-utils';


describe('Select component', () => {
    it('renders without errors', () => {
        renderWithProviders(<MemoryRouter><MapProvider><Select /></MapProvider></MemoryRouter>);

        const favouriteElement = screen.getByTestId('Select');
        expect(favouriteElement).toBeInTheDocument();
    });
});

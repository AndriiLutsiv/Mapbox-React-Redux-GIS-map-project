import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sort from './Sort';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MapProvider } from 'app/providers/MapProvider';
import { renderWithProviders } from 'test-utils';

describe('Sort', () => {
    it('renders Sort component', () => {
        renderWithProviders(<MemoryRouter><MapProvider><Sort /></MapProvider></MemoryRouter>);

        const favouriteElement = screen.getByTestId('Sort');
        expect(favouriteElement).toBeInTheDocument();
    });

    it('renders Select when on scenarios page', () => {
        renderWithProviders(
            <MemoryRouter initialEntries={["/areas/param1"]}>
                <Routes>
                    <Route path="/areas/:param1" element={<MapProvider><Sort /></MapProvider>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByTestId('Sort')).toBeInTheDocument();
        expect(screen.getByTestId('Select')).toBeInTheDocument();
    });

    it('renders Select when on projects page', () => {
        renderWithProviders(
            <MemoryRouter initialEntries={["/areas/param1/param2"]}>
                <Routes>
                    <Route path="/areas/:param1/:param2" element={<MapProvider><Sort /></MapProvider>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByTestId('Sort')).toBeInTheDocument();
        expect(screen.getByTestId('Select')).toBeInTheDocument();
    });

    it('renders Favourite when on scenarios page', () => {
        renderWithProviders(
            <MemoryRouter initialEntries={["/areas/param1"]}>
                <Routes>
                    <Route path="/areas/:param1" element={<MapProvider><Sort /></MapProvider>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByTestId('Sort')).toBeInTheDocument();
        expect(screen.getByTestId('Favourite')).toBeInTheDocument();
    });

    it('does not render Favourite when on projects page', () => {
        renderWithProviders(
            <MemoryRouter initialEntries={["/areas/param1/param2"]}>
                <Routes>
                    <Route path="/areas/:param1/:param2" element={<MapProvider><Sort /></MapProvider>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByTestId('Sort')).toBeInTheDocument();
        expect(screen.queryByTestId('Favourite')).not.toBeInTheDocument();
    });

    it('renders Add Area button when on areas page', () => {
        renderWithProviders(
            <MemoryRouter initialEntries={["/areas"]}>
                <Routes>
                    <Route path="/areas" element={<MapProvider><Sort /></MapProvider>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/add area/i)).toBeInTheDocument();
    });

    it('renders Add Scenario button when on scenarios page', () => {
        renderWithProviders(
            <MemoryRouter initialEntries={["/areas/param1"]}>
                <Routes>
                    <Route path="/areas/:param1" element={<MapProvider><Sort /></MapProvider>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/add scenario/i)).toBeInTheDocument();
    });

    it('renders Add Project button when on projects page', () => {
        renderWithProviders(
            <MemoryRouter initialEntries={["/areas/param1/param2"]}>
                <Routes>
                    <Route path="/areas/:param1/:param2" element={<MapProvider> <Sort /></MapProvider>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/add project/i)).toBeInTheDocument();
    });
});

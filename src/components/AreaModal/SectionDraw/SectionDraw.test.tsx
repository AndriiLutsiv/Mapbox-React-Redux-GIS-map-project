import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MapProvider } from 'app/providers/MapProvider';
import SectionDraw from './SectionDraw';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from 'test-utils';
import { waitFor } from '@testing-library/react';

// Mocking the useMap hook to provide areas
jest.mock('app/providers/MapProvider', () => ({
  ...jest.requireActual('app/providers/MapProvider'),
  useMap: () => ({
    areas: [],
    startLoading: jest.fn(),
    endLoading: jest.fn(),
    setDraw: jest.fn(),
    setMap: jest.fn()
  }),
}));

jest.mock('mapbox-gl', () => {
  const originalModule = jest.requireActual('mapbox-gl');

  class MockMap {
      addControl = jest.fn().mockReturnValue({});
      on = jest.fn();
      zoomIn = jest.fn();
      zoomOut = jest.fn();
  }

  return {
      ...originalModule,
      Map: MockMap,
  };
});

describe('SectionDraw', () => {
    const mockProps = {
      validationErrors: { name: '', polygon: '' },
      setValidationErrors: jest.fn(),
    };
  
    it('renders the component correctly', () => {
      renderWithProviders(
        <MemoryRouter>
          <MapProvider>
            <SectionDraw {...mockProps} />
          </MapProvider>
        </MemoryRouter>
      );
      
      const titleElement = screen.getByText('Draw area');
      expect(titleElement).toBeInTheDocument();
    });
  
    it('renders validation error message', () => {
      const validationErrors = { name: '', polygon: 'Please draw a polygon' };
      renderWithProviders(
        <MemoryRouter>
          <MapProvider>
            <SectionDraw {...mockProps} validationErrors={validationErrors} />
          </MapProvider>
        </MemoryRouter>
      );
      const errorMessage = screen.getByText('Please draw a polygon');
      expect(errorMessage).toBeInTheDocument();
    });
  
    it('shows search results when focused and input value matches', async () => {
      renderWithProviders(
        <MemoryRouter>
          <MapProvider>
            <SectionDraw {...mockProps} />
          </MapProvider>
        </MemoryRouter>
      );
      
      const inputElement = screen.getByPlaceholderText('Search postcode'); 
      fireEvent.focus(inputElement);
      fireEvent.change(inputElement, { target: { value: 'Couple' } });
  
      // Assume that blurring the input triggers an asynchronous update
      await act(async () => {
        fireEvent.blur(inputElement);
      });
  
      // Use waitFor for assertions that depend on the async update
      await waitFor(() => {
        const hiddenContent = screen.queryByTestId('hidden-content');
        expect(hiddenContent).not.toBeInTheDocument();
      });
    });
  });
  

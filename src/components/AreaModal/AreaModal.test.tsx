import { screen, waitFor } from '@testing-library/react';
import { MapProvider } from 'app/providers/MapProvider';
import { useAuth } from 'hooks/useAuth';
import AreaModal from './AreaModal';
import { renderWithProviders } from 'test-utils';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

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

jest.mock('hooks/useAuth', () => ({
    useAuth: jest.fn().mockReturnValue({ token: 'dummy_token' }),
}));


const performanceMock = () => {
    performance.mark = jest.fn();
    performance.measure = jest.fn();
};

global.performance = performanceMock() as any;

describe('AreaModal', () => {
    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({ token: 'dummy_token' });
    });

    it('renders the component correctly when Cancel button is present', () => {
        renderWithProviders(
            <MapProvider>
                <AreaModal setShowModal={jest.fn()} />
            </MapProvider>
        );

        const cancelButton = screen.getByText('Cancel');
        expect(cancelButton).toBeInTheDocument();
    });

    it('renders the Edit Area button when area_uuid is provided', async () => { // Mark the function as async
        renderWithProviders(
          <MapProvider>
            <AreaModal setShowModal={jest.fn()} area_uuid="mock-uuid" />
          </MapProvider>
        );
      
        await waitFor(() => {
          const editButton = screen.getByRole('button', { name: 'Edit area' });
          expect(editButton).toBeInTheDocument();
        });
      });

    it('renders the Add Area button when area_uuid is not provided', () => {
        renderWithProviders(
            <MapProvider>
                <AreaModal setShowModal={jest.fn()} />
            </MapProvider>
        );

        const addButtons = screen.getAllByRole('button', { name: 'Add area' });
        expect(addButtons.length).toBe(1);
    });

    it('closes the modal and resets state when the Cancel button is clicked', () => {
        const setShowModal = jest.fn();
        renderWithProviders(
            <MapProvider>
                <AreaModal setShowModal={setShowModal} />
            </MapProvider>
        );
    
        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        act(() => {
          userEvent.click(cancelButton);
        });
    
        expect(setShowModal).toHaveBeenCalledWith(false);
    });
});

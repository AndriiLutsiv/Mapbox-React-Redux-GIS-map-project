import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import ShareMapView from './ShareMapView';
import { getLastPosition } from 'components/Map/utils/getLastPosition';

jest.mock('components/Map/utils/getLastPosition');

describe('<ShareMapView />', () => {
    beforeEach(() => {
        (window.navigator as any).clipboard = {
            writeText: jest.fn().mockResolvedValue(void 0)
        };
    });

    it('renders the Share view button', () => {
        const { getByText } = render(<ShareMapView />);
        expect(getByText('Share view')).toBeInTheDocument();
    });

    it('copies the last position URL to clipboard when clicked', async () => {
        (getLastPosition as jest.Mock).mockReturnValue({ url: 'https://example.com/position' });

        const { getByText } = render(<ShareMapView />);
        await act(async () => {
            fireEvent.click(getByText('Share view'));
        });

        expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com/position');
    });

    it('shows "Copied" when the URL is successfully copied', async () => {
        (getLastPosition as jest.Mock).mockReturnValue({ url: 'https://example.com/position' });

        const { getByText } = render(<ShareMapView />);
        await act(async () => {
            fireEvent.click(getByText('Share view'));
        });

        expect(getByText('Copied')).toBeInTheDocument();
    });

    it('hides "Copied" after a timeout', async () => {
        jest.useFakeTimers();

        (getLastPosition as jest.Mock).mockReturnValue({ url: 'https://example.com/position' });

        const { getByText, queryByText } = render(<ShareMapView />);

        await act(async () => {
            fireEvent.click(getByText('Share view'));
        });
        expect(getByText('Copied')).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(1500);
        });
        
        expect(queryByText('Copied')).not.toBeInTheDocument();
    });
});

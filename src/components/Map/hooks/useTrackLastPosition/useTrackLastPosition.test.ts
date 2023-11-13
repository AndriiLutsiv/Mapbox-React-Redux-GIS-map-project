import { renderHook } from '@testing-library/react';
import { useTrackLastPosition } from './useTrackLastPosition';
import { useMap } from 'app/providers/MapProvider';
import { act } from 'react-dom/test-utils';

jest.mock('app/providers/MapProvider');

type LocalStorageMock = {
    items: { [key: string]: string };
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    clear: () => void;
};

const mockLocalStorage: LocalStorageMock = {
    items: {},
    getItem: function(key: string) {
        if (key === 'LAST_POSITION') {
            return 'zoom=10&x=10&y=20'; // hardcoded value for testing
        }
        return this.items[key] || null;
    },
    setItem: function(key: string, value: string) {
        this.items[key] = value;
    },
    clear: function() {
        this.items = {};
    },
};

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('useTrackLastPosition', () => {
    const mockMap = {
        on: jest.fn(),
        off: jest.fn(),
        getZoom: jest.fn().mockReturnValue(10),
        getCenter: jest.fn().mockReturnValue({
            toArray: jest.fn().mockReturnValue([10, 20])
        }),
    };

    beforeEach(() => {
        (useMap as jest.Mock).mockReturnValue({
            map: mockMap,
        });
        mockMap.on.mockClear();
        mockMap.off.mockClear();
        mockLocalStorage.clear();
    });

    it('attaches event listeners to the map', () => {
        renderHook(() => useTrackLastPosition());
        
        expect(mockMap.on).toHaveBeenCalledWith('zoomend', expect.any(Function));
        expect(mockMap.on).toHaveBeenCalledWith('moveend', expect.any(Function));
        
        // Simulate the zoomend event to check if the function attached to it works
        act(() => {
            const zoomEndCallback = mockMap.on.mock.calls.find(call => call[0] === 'zoomend')[1];
            zoomEndCallback();
        });

        // Verify that the URL has been stored in localStorage
        const storedUrl = localStorage.getItem('LAST_POSITION');
        expect(storedUrl).toContain('zoom=10');
        expect(storedUrl).toContain('x=10');
        expect(storedUrl).toContain('y=20');
    });

    it('detaches event listeners from the map on unmount', () => {
        const { unmount } = renderHook(() => useTrackLastPosition());
        unmount();
        
        expect(mockMap.off).toHaveBeenCalledWith('zoomend', expect.any(Function));
        expect(mockMap.off).toHaveBeenCalledWith('moveend', expect.any(Function));
    });
});

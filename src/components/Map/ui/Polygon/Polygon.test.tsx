import { render, cleanup } from '@testing-library/react';
import Polygon from './Polygon';
import { useMap } from 'app/providers/MapProvider';

jest.mock('app/providers/MapProvider');

const mockMap = {
    addControl: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    removeControl: jest.fn(),
};

const mockDraw = {
    getAll: jest.fn().mockReturnValue({ features: [] }),
    deleteAll: jest.fn(),
    add: jest.fn()
};

jest.mock("@mapbox/mapbox-gl-draw", () => {
    return jest.fn().mockImplementation(() => mockDraw);
});

describe('Polygon', () => {
    afterEach(cleanup);

    it('adds the MapboxDraw control to the map', () => {
        (useMap as jest.Mock).mockReturnValue({
            map: mockMap,
            setDraw: jest.fn(),
            setAreas: jest.fn(),
        });

        render(<Polygon />);
        expect(mockMap.addControl).toHaveBeenCalledWith(expect.anything());
    });

    it('sets up the event listeners', () => {
        (useMap as jest.Mock).mockReturnValue({
            map: mockMap,
            setDraw: jest.fn(),
            setAreas: jest.fn(),
        });

        render(<Polygon />);
        expect(mockMap.on).toHaveBeenCalledWith('draw.create', expect.anything());
        expect(mockMap.on).toHaveBeenCalledWith('draw.delete', expect.anything());
        expect(mockMap.on).toHaveBeenCalledWith('draw.update', expect.anything());
    });

    it('cleans up on unmount', () => {
        (useMap as jest.Mock).mockReturnValue({
            map: mockMap,
            setDraw: jest.fn(),
            setAreas: jest.fn(),
        });

        const { unmount } = render(<Polygon />);
        unmount();
        expect(mockMap.off).toHaveBeenCalledWith('draw.create', expect.anything());
        expect(mockMap.off).toHaveBeenCalledWith('draw.delete', expect.anything());
        expect(mockMap.off).toHaveBeenCalledWith('draw.update', expect.anything());
        expect(mockMap.removeControl).toHaveBeenCalledWith(expect.anything());
    });
});

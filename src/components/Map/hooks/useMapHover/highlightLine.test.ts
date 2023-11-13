import { highlightLine } from './highlightLine';
import { dimLine } from './dimLine';

jest.mock('mapbox-gl', () => ({
    Map: jest.fn().mockImplementation(() => ({
        addSource: jest.fn(),
        addLayer: jest.fn()
    }))
}));

jest.mock('./dimLine', () => ({
    dimLine: jest.fn()
}));

describe('highlightLine', () => {
    let mockMap: any;
    let lineFeatures: any[];

    beforeEach(() => {
        mockMap = {
            getSource: jest.fn(),
            addSource: jest.fn(),
            addLayer: jest.fn(),
            fitBounds: jest.fn(),
        };
        lineFeatures = [
            { type: 'Feature', geometry: { type: 'LineString', coordinates: [[0, 0], [1, 1]] } }
        ];
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('dims the line, adds a source and layer to the map for highlighting', () => {
        highlightLine(mockMap, lineFeatures);

        expect(dimLine).toHaveBeenCalledWith(mockMap);

        expect(mockMap.addSource).toHaveBeenCalledWith('hoveredLine', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': lineFeatures
            }
        });

        expect(mockMap.addLayer).toHaveBeenCalledWith({
            'id': 'higlightedLineLayer',
            'type': 'line',
            'source': 'hoveredLine',
            'layout': {},
            'paint': {
                'line-width': 3,
                'line-color': 'yellow'
            }
        });
    });
});

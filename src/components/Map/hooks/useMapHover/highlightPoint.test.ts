import { highlightPoint } from './highlightPoint';
import { dimPoint } from './dimPoint';

jest.mock('./dimPoint', () => ({
    dimPoint: jest.fn()
}));

describe('highlightPoint', () => {
    let mockMap: any;
    let pointFeatures: any[];

    beforeEach(() => {
        mockMap = {
            getSource: jest.fn(),
            addSource: jest.fn(),
            addLayer: jest.fn(),
            fitBounds: jest.fn(),
        };
        pointFeatures = [
            { type: 'Feature', geometry: { type: 'Point', coordinates: [0, 0] } }
        ];
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('dims the point, adds a source and layer to the map for highlighting', () => {
        highlightPoint(mockMap, pointFeatures);

        expect(dimPoint).toHaveBeenCalledWith(mockMap);

        expect(mockMap.addSource).toHaveBeenCalledWith('hoveredPoint', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': pointFeatures
            }
        });

        expect(mockMap.addLayer).toHaveBeenCalledWith({
            'id': 'higlightedPointLayer',
            'type': 'circle',
            'source': 'hoveredPoint',
            'paint': {
                'circle-radius': 20,
                'circle-opacity': 0,
                "circle-stroke-width": 3,
                "circle-stroke-color": 'yellow'
            }
        });
    });
});

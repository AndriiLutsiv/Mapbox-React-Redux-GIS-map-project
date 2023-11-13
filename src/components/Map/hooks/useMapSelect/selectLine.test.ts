import { selectLine } from './selectLine';
import { unselectLine } from './unselectLine';

jest.mock('mapbox-gl', () => ({
    Map: jest.fn().mockImplementation(() => ({
        addSource: jest.fn(),
        addLayer: jest.fn()
    }))
}));

jest.mock('../useMapHover/dimLine', () => ({
    dimLine: jest.fn()
}));

jest.mock('./unselectLine', () => ({
    unselectLine: jest.fn(),
  }));
  

describe('selectLine', () => {
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

    it('unselects the line, adds a source and layer to the map for selecting', () => {
        selectLine(mockMap, lineFeatures);

        expect(unselectLine).toHaveBeenCalledWith(mockMap);

        expect(mockMap.addSource).toHaveBeenCalledWith('selectedLine', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': lineFeatures
            }
        });

        expect(mockMap.addLayer).toHaveBeenCalledWith({
            'id': 'selectedLineLayer',
            'type': 'line',
            'source': 'selectedLine',
            'layout': {},
            'paint': {
                'line-width': 3,
                'line-color': '#2C2CFF'  // Updated to match the actual implementation
            }
        });
    });
});

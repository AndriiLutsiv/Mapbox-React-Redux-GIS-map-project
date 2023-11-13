import { selectPoint } from './selectPoint';
import { unselectPoint } from './unselectPoint';

jest.mock('../useMapHover/dimPoint', () => ({
    dimPoint: jest.fn()
}));

jest.mock('./unselectPoint', () => ({
    unselectPoint: jest.fn(),
  }));

describe('selectPoint', () => {
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

    it('dims the point, adds a source and layer to the map for selecting', () => {
        selectPoint(mockMap, pointFeatures);

        expect(unselectPoint).toHaveBeenCalledWith(mockMap);

        expect(mockMap.addSource).toHaveBeenCalledWith('selectedPoint', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': pointFeatures
            }
        });

        expect(mockMap.addLayer).toHaveBeenCalledWith({
            'id': 'selectedPointLayer',
            'type': 'circle',
            'source': 'selectedPoint',
            'paint': {
                'circle-radius': 20,
                'circle-opacity': 0,
                "circle-stroke-width": 3,
                "circle-stroke-color": '#2C2CFF'  
            }
        });
    });
});

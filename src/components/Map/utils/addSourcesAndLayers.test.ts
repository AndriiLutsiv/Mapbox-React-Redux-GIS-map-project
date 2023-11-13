import mapboxGl from 'mapbox-gl';
import '@testing-library/jest-dom';
import { addSourcesAndLayers } from './addSourcesAndLayers';
import { getGeojsonSourceId, getVectorSourceId } from "../resources/getId";
import { geojsonPointLayer, vectorPointLayer } from "../resources/layers";
import { sortLayers } from "./sortLayers";
import { Layer } from "models/Map";
import { geojsonSource, vectorSource } from '../resources/sources';

jest.mock('mapbox-gl', () => {
    class MockMap {
        addSource = jest.fn();
        addLayer = jest.fn();
    }

    return {
        Map: jest.fn(() => new MockMap()),
    };
});


jest.mock('../resources/getId', () => ({
    __esModule: true,
    getGeojsonSourceId: jest.fn(),
    getVectorSourceId: jest.fn(),
}));

jest.mock('../resources/layers', () => ({
    __esModule: true,
    geojsonPointLayer: jest.fn(),
    vectorPointLayer: jest.fn(),
}));

jest.mock('./sortLayers', () => ({
    __esModule: true,
    sortLayers: jest.fn(),
}));

jest.mock('../resources/sources', () => ({
    __esModule: true,
    geojsonSource: jest.fn(),
    vectorSource: jest.fn(),
}));

const mockMap = {
    addSource: jest.fn(),
    addLayer: jest.fn(),
};

describe('addSourcesAndLayers', () => {
    it('should add sources and layers correctly', async () => {
        // Mocks
        const layers = [
            { layer_type: 'nodes', geom_type: 'Point' } as Layer
        ];
        const map = mockMap;
        const projectId = '123123123';

        // Mock implementation 
        (sortLayers as jest.Mock).mockReturnValue(layers);
        (getGeojsonSourceId as jest.Mock).mockReturnValue('geojson-source-nodes');
        (getVectorSourceId as jest.Mock).mockReturnValue('vector-source-nodes');
        (geojsonSource as jest.Mock).mockReturnValue({ type: 'geojson' });
        (vectorSource as jest.Mock).mockReturnValue({ type: 'vector' });
        (geojsonPointLayer as jest.Mock).mockReturnValue({ id: 'geojson-point-layer', type: 'circle' });
        (vectorPointLayer as jest.Mock).mockReturnValue({ id: 'vector-point-layer', type: 'circle' });


        await addSourcesAndLayers(layers, map as any, projectId);

        // Assertions
        expect(sortLayers).toHaveBeenCalledWith(layers);
        expect(map.addSource).toHaveBeenCalledWith('geojson-source-nodes', { type: 'geojson' });
        expect(map.addLayer).toHaveBeenCalledWith({ id: 'geojson-point-layer', type: 'circle' });
        expect(map.addSource).toHaveBeenCalledWith('vector-source-nodes', { type: 'vector' });
        expect(map.addLayer).toHaveBeenCalledWith({ id: 'vector-point-layer', type: 'circle' });
    });
});

















// import { addSourcesAndLayers } from './addSourcesAndLayers';

// jest.mock("mapbox-gl");

// describe('addSourcesAndLayers', () => {
//     let mockMap: any;
//     const mockProjectUuid = 'flksajdfkjlsdf';

//     beforeEach(() => {
//         mockMap = {
//             getSource: jest.fn(),
//             addSource: jest.fn(),
//             addLayer: jest.fn(),
//             fitBounds: jest.fn(),
//         };
//     });

//     afterEach(() => {
//         jest.clearAllMocks();
//     });

//     it('adds geojson sources and layers to the map without project_uuid', async () => {
//         const layers = [
//             { layer_type: 'cable', geom_type: 'LineString', project_uuid: '123' },
//             { layer_type: 'infra_point', geom_type: 'Point', project_uuid: '456' },
//         ] as any;

//         await  addSourcesAndLayers(layers, mockMap, mockProjectUuid);

//         expect(mockMap.addSource).toHaveBeenCalledTimes(layers.length * 2);
//         expect(mockMap.addLayer).toHaveBeenCalledTimes(layers.length * 2);
//     });

//     it('adds both geojson and tile sources and layers to the map with project_uuid', async () => {
//         const layers = [
//             { layer_type: 'cable', geom_type: 'LineString', project_uuid: '123' },
//             { layer_type: 'infra_point', geom_type: 'Point', project_uuid: '456' },
//         ] as any;

//         await  addSourcesAndLayers(layers, mockMap, mockProjectUuid);

//         expect(mockMap.addSource).toHaveBeenCalledTimes(layers.length * 2); // Because both geojson and tile sources are added
//         expect(mockMap.addLayer).toHaveBeenCalledTimes(layers.length * 2); // Because both geojson and tile layers are added
//     });
// });

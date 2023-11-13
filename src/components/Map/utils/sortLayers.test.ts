import { sortLayers } from './sortLayers';  // Replace 'yourFileName' with the actual name of your file.
import { GetLayersResponse, Layer } from "models/Map";

describe('sortLayers', () => {

    it('should sort layers by geom_type correctly', () => {
        const layers: GetLayersResponse = [
            { geom_type: 'LineString' } as Layer,
            { geom_type: 'Point' } as Layer,
            { geom_type: 'LineString' } as Layer
        ];

        const sorted = sortLayers(layers);
        
        expect(sorted[0].geom_type).toBe('LineString');
        expect(sorted[1].geom_type).toBe('LineString');
        expect(sorted[2].geom_type).toBe('Point');
    });

    it('should handle an empty array', () => {
        const layers: GetLayersResponse = [];

        const sorted = sortLayers(layers);

        expect(sorted).toEqual([]);
    });
});

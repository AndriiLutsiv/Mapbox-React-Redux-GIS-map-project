import { getParent } from './getParent';

describe('getParent', () => {
    it('should parse a JSON string into an object', () => {
        const feature = {
            properties: {
                infra_parent: JSON.stringify({ key: 'value' })
            }
        } as unknown as mapboxgl.MapboxGeoJSONFeature;

        const result = getParent(feature, 'infra_parent');
        expect(result).toEqual({ key: 'value' });
    });

    it('should return the object if the property is already an object', () => {
        const feature = {
            properties: {
                infra_parent: { key: 'objectValue' }
            }
        } as unknown as mapboxgl.MapboxGeoJSONFeature;

        const result = getParent(feature, 'infra_parent');
        expect(result).toEqual({ key: 'objectValue' });
    });

    it('should return undefined if the property does not exist', () => {
        const feature = {
            properties: {}
        } as unknown as mapboxgl.MapboxGeoJSONFeature;

        const result = getParent(feature, 'infra_parent');
        expect(result).toBeUndefined();
    });

    it('should return undefined if there is an error during the JSON parsing', () => {
        const feature = {
            properties: {
                infra_parent: "{ key: 'value' }" // this is invalid JSON string
            }
        } as unknown as mapboxgl.MapboxGeoJSONFeature;

        const result = getParent(feature, 'infra_parent');
        expect(result).toBeUndefined();
    });
});

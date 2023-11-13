export const getParent = (
    feature: mapboxgl.MapboxGeoJSONFeature,
    parent: 'infra_parent' | 'cable_parent' | 'subduct_parent' | 'tube_parent'
) => {
    let infraParent: any | undefined;

    try {
        infraParent = typeof feature.properties![parent] === 'string'
            ? JSON.parse(feature.properties![parent])
            : feature.properties![parent];
    } catch (error) {
        infraParent = undefined;
    }
    return infraParent;
}
import { GetLayersResponse, Layer } from "models/Map";

export const sortLayers = (layers: GetLayersResponse) => {
    const layersCopy = [...layers];

    layersCopy.sort((a: Layer, b: Layer) => {
        const sortingOrder: { [key: string]: number } = { 'Point': 0, 'LineString': 1 };

        const aValue = sortingOrder[a.geom_type];
        const bValue = sortingOrder[b.geom_type];

        return bValue - aValue;
    })
    return layersCopy;
}

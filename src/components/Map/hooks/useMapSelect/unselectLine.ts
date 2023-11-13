import mapboxgl from "mapbox-gl";

export const unselectLine = (map: mapboxgl.Map) => {
    if (map.getSource('selectedLine')) {
        map.removeLayer('selectedLineLayer');
        map.removeSource('selectedLine');
    }
}
import mapboxgl from "mapbox-gl";

export const unselectPoint = (map: mapboxgl.Map) => {
    if (map.getSource('selectedPoint')) {
        map.removeLayer('selectedPointLayer');
        map.removeSource('selectedPoint');
    }
}
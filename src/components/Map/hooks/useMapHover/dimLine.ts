import mapboxgl from "mapbox-gl";

export const dimLine = (map: mapboxgl.Map) => {
    if (map.getSource('hoveredLine')) {
        map.removeLayer('higlightedLineLayer');
        map.removeSource('hoveredLine');
    }
}
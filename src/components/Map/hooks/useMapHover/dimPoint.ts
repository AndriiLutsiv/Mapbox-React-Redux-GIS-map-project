import mapboxgl from "mapbox-gl";

export const dimPoint = (map: mapboxgl.Map) => {
    if (map.getSource('hoveredPoint')) {
        map.removeLayer('higlightedPointLayer');
        map.removeSource('hoveredPoint');
    }
}
import mapboxgl from "mapbox-gl";
import { dimLine } from "./dimLine";

export const highlightLine = (map: mapboxgl.Map, lineFeatures: any[]) => {
    dimLine(map);
    map.addSource('hoveredLine', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': lineFeatures
        }
    });

    map.addLayer({
        'id': 'higlightedLineLayer',
        'type': 'line', 
        'source': 'hoveredLine',
        'layout': {},
        'paint': {
            'line-width': 3,
            'line-color': 'yellow'
        }
    });
}

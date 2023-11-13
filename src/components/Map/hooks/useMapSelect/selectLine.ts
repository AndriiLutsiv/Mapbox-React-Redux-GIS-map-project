import mapboxgl from "mapbox-gl";
import { unselectLine } from "./unselectLine";

export const selectLine = (map: mapboxgl.Map, lineFeatures: any[]) => {
    unselectLine(map);
    map.addSource('selectedLine', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': lineFeatures
        }
    });

    map.addLayer({
        'id': 'selectedLineLayer',
        'type': 'line', 
        'source': 'selectedLine',
        'layout': {},
        'paint': {
            'line-width': 3,
            'line-color': '#2C2CFF'
        }
    });
}
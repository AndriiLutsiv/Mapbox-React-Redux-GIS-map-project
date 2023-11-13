import mapboxgl from "mapbox-gl";
import { dimPoint } from "./dimPoint";

export const highlightPoint = (map: mapboxgl.Map, pointFeatures: mapboxgl.MapboxGeoJSONFeature[]) => {
    dimPoint(map);

    map.addSource('hoveredPoint', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': pointFeatures
        }
    });

    map.addLayer(
        {
            'id': 'higlightedPointLayer',
            'type': 'circle',
            'source': 'hoveredPoint',
            'paint': {
                'circle-radius': 20,
                'circle-opacity': 0,
                "circle-stroke-width": 3,
                "circle-stroke-color": 'yellow'
            }
        },
    );
}
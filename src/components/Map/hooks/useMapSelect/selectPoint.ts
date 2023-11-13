import mapboxgl from "mapbox-gl";
import { unselectPoint } from "./unselectPoint";

export const selectPoint = (map: mapboxgl.Map, pointFeatures: mapboxgl.MapboxGeoJSONFeature[]) => {
    unselectPoint(map);

    map.addSource('selectedPoint', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': pointFeatures
        }
    });

    map.addLayer(
        {
            'id': 'selectedPointLayer',
            'type': 'circle',
            'source': 'selectedPoint',
            'paint': {
                'circle-radius': 20,
                'circle-opacity': 0,
                "circle-stroke-width": 3,
                "circle-stroke-color": '#2C2CFF'
            }
        },
    );
}
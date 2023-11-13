import { getGeojsonLayerId, getVectorLayerId } from "components/Map/resources/getId";
import { LineLayerStyle, PointLayerStyle } from "components/Map/styles/defaultStyles";
import { GEOJSON_ZOOM_THRESHOLD } from "components/Map/utils/constants";
import mapboxgl from "mapbox-gl";
import { Layer } from "models/Map";
import { GetStylesResponse } from "models/Styles";

export const hideVectorLayer = (map: mapboxgl.Map, layer: Layer) => {
    const vectorLayerId = getVectorLayerId(layer.layer_type);
    map.getLayer(vectorLayerId) && map.setLayoutProperty(vectorLayerId, 'visibility', 'none');
}

export const showVectorLayer = (map: mapboxgl.Map, layer: Layer, stylesData: GetStylesResponse) => {
    const vectorLayerId = getVectorLayerId(layer.layer_type);
    const geojsonLayerId = getGeojsonLayerId(layer.layer_type);

    //check if the specific layer is styled
    const styledLayer = stylesData?.find(item => {
        return getGeojsonLayerId(item.layer) === geojsonLayerId; // we delibaratelly compare to geojsonLayerId because only geojson layers styles are stored on the server, and vector layers just copy their styles 
    });

    map.getLayer(vectorLayerId) && map.setLayoutProperty(vectorLayerId, 'visibility', styledLayer?.style.isVisible ? 'visible' : 'none');
}

export const hideGeoJsonLayer = (map: mapboxgl.Map, layer: Layer) => {
    const geojsonLayerId = getGeojsonLayerId(layer.layer_type);
    map.getLayer(geojsonLayerId) && map.setLayoutProperty(geojsonLayerId, 'visibility', 'none');
}

export const showGeoJsonLayer = (map: mapboxgl.Map, layer: Layer, stylesData: GetStylesResponse) => {
    const geojsonLayerId = getGeojsonLayerId(layer.layer_type);

    //check if the specific layer is styled
    const styledLayer = stylesData?.find(item => {
        return getGeojsonLayerId(item.layer)  === geojsonLayerId;
    });

    map.getLayer(geojsonLayerId) && map.setLayoutProperty(geojsonLayerId, 'visibility', styledLayer?.style.isVisible ? 'visible' : 'none');
}

export const setZoomLayersVisibility = (
    map: mapboxgl.Map,
    layers: Layer[],
    stylesData: GetStylesResponse
) => {
    const zoom = map.getZoom();
    const zoomThresholdReached = zoom >= GEOJSON_ZOOM_THRESHOLD;

    if (zoomThresholdReached) {
        //manageZoomIN
        layers.forEach(layer => {
            hideVectorLayer(map, layer)
            showGeoJsonLayer(map, layer, stylesData);
        });
    } else {
        //manageZoomOut
        layers.forEach(layer => {
            hideGeoJsonLayer(map, layer);
            showVectorLayer(map, layer, stylesData);
        });
    }
}
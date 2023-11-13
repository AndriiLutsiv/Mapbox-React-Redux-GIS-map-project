import { GetLayersResponse, Layer } from "models/Map";
import { geojsonSource, vectorSource } from "../resources/sources";
import { getGeojsonLayerId, getGeojsonLayerLabelId, getGeojsonSourceId, getVectorLayerId, getVectorSourceId } from "../resources/getId";
import { geojsonLineTextLayer, geojsonLineLayer, geojsonPointLayer, vectorLineLayer, vectorPointLayer } from "../resources/layers";

import mapboxGl from 'mapbox-gl';
import { sortLayers } from "./sortLayers";

// Once the map style has loaded, this event handler processes and adds relevant geojson and tile sources to the map. 
// It also adds layers based on the geometry type of each layer and conditionally uses additional parameters  when available.
export const addSourcesAndLayers = (
    layers: GetLayersResponse,
    map: mapboxGl.Map,
    project_uuid: string,
) => {
    sortLayers(layers).forEach(async layer => {
        //if statement is necessary for development (if need to temporarely turn on/off some layers just comment them)
        if (
            layer.layer_type.includes('nodes')
            ||
            layer.layer_type.includes('properties')
            ||
            layer.layer_type.includes('infra_point')
            ||
            layer.layer_type.includes('infra_line')
            ||
            layer.layer_type.includes('subduct')
            ||
            layer.layer_type.includes('tube')
            ||
            layer.layer_type.includes('fibre')
            ||
            layer.layer_type.includes('cable')
        ) {
            //add geojson sources
            map.addSource(
                getGeojsonSourceId(layer.layer_type),
                geojsonSource()
            );
            //add geojson layers
            map.addLayer(
                layer.geom_type === 'Point'
                    ? geojsonPointLayer(layer.layer_type)
                    : geojsonLineLayer(layer.layer_type)
            );
            //add vector sources
            project_uuid && map.addSource(
                getVectorSourceId(layer.layer_type),
                vectorSource(layer.layer_type, project_uuid)
            );
            //add vector layers
            project_uuid && map.addLayer(
                layer.geom_type === 'Point'
                    ? vectorPointLayer(layer.layer_type)
                    : vectorLineLayer(layer.layer_type)
            );

            // add label layers
            const propName = layer.layer_type === 'infra_line' ? 'edge_category' : `${layer.layer_type}_type`;
            layer.geom_type !== 'Point' && map.addLayer(geojsonLineTextLayer(layer.layer_type, propName));
        };
    });
}

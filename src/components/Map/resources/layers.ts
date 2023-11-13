/*
 * This code defines various layers, including base raster layers and GeoJSON/Tile layers, 
 * with specific styling and visibility settings, using the Mapbox GL library and custom constants.
 */
import mapboxGl from "mapbox-gl";
import { getGeojsonLayerId, getGeojsonLayerLabelId, getVectorLayerId, getVectorSourceId } from "./getId";

export const baseLayers: mapboxGl.AnyLayer[] = [
  {
    id: 'base-default',
    type: 'raster',
    source: 'base-default',
  },
  {
    id: 'base-osm',
    type: 'raster',
    source: 'base-osm',
    layout: { visibility: 'none' }
  },
  {
    id: 'base-satellite',
    type: 'raster',
    source: 'base-satellite',
    layout: { visibility: 'none' }
  },
];

//for geojson styles (above zoom threshold)
export const geojsonPointLayer = (layerId: string): mapboxGl.AnyLayer => ({
  id: getGeojsonLayerId(layerId),
  source: `data-${layerId}`,
  type: 'symbol',
  layout: {
    //___start___ text is going to get clustered, however points do not get clustered
    'icon-allow-overlap': true,
    'icon-ignore-placement': true,
    'text-ignore-placement': false,
    'text-allow-overlap': false,
    'text-optional': true,
    //___end___
    'icon-size': ['interpolate', ['linear'], ['zoom'], 15, 0.3, 20, 0.5],
    'visibility': 'none',
    'text-justify': 'left',
    'text-size': 14
  },
  paint: {
    'text-color': '#202',
    'text-halo-color': '#fff',
    'text-halo-width': 1,
    "text-translate": [0, 20],
  }
});

//for geojson styles (above zoom threshold)
export const geojsonLineLayer = (layerId: string): mapboxGl.AnyLayer => ({
  id: getGeojsonLayerId(layerId),
  source: `data-${layerId}`,
  type: 'line',
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
    'visibility': 'none',
  }
});

//for geojson lables (above zoom threshold)
export const geojsonLineTextLayer = (layerId: string, propName: string): mapboxGl.AnyLayer => ({
  id: getGeojsonLayerLabelId(layerId),
  source: `data-${layerId}`,
  "type": "symbol",
  "layout": {
    "symbol-placement": "line",
    "text-font": ["Open Sans Regular"],
    "text-field": ['get', propName], // part 2 of this is how to do it
    "text-size": 12,
    'text-offset': [0.5, 0.5],
    //___start___ text is going to get clustered
    'text-ignore-placement': false,
    'text-allow-overlap': false,
    'text-optional': true,
    //___end___
  }
});

//for vector styles (below zoom threshold)
export const vectorPointLayer = (layerId: string): mapboxGl.AnyLayer => ({
  id: getVectorLayerId(layerId),
  source: getVectorSourceId(layerId),
  "source-layer": layerId,
  type: 'symbol',
  layout: {
    'icon-size': ['interpolate', ['linear'], ['zoom'], 15, 0.3, 20, 0.5],
    'icon-allow-overlap': true,
    'icon-ignore-placement': true,
    'visibility': 'none',
  },
});

//for vector styles (below zoom threshold)
export const vectorLineLayer = (layerId: string): mapboxGl.AnyLayer => ({
  id: getVectorLayerId(layerId),
  source: getVectorSourceId(layerId),
  "source-layer": layerId,
  type: 'line',
  layout: {
    'visibility': 'none',
  },
});


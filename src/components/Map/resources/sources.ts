/*
  This code sets up various sources for Mapbox GL layers, including base raster sources 
  and GeoJSON/Tile sources, with specific configuration parameters and URLs, using 
  the Mapbox GL library and custom constants.
 */
import mapboxGl from "mapbox-gl";

export const baseSources: mapboxGl.Sources = {
  'base-default': {
    type: 'raster',
    tiles: [`https://os.fibreplanner.io/z-{z}_x-{x}_y-{y}`],
    maxzoom: 20,
    tileSize: 256,
  },
  'base-osm': {
    type: 'raster',
    tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
    maxzoom: 19,
    tileSize: 256,
  },
  'base-satellite': {
    type: 'raster',
    url: 'mapbox://mapbox.satellite',
    tileSize: 256,
  },
};

export const geojsonSource = () => ({
  type: 'geojson',
  data: { type: 'FeatureCollection', features: [] },
  generateId: false,
}) as mapboxGl.AnySourceData;

export const vectorSource = (layerId: string, project_uuid: string) => ({
  type: 'vector',
  url: `https://tiler-staging.fibreplanner.io/services/${layerId}_${project_uuid.replace(/-/g, '')}`,
}) as mapboxGl.AnySourceData;

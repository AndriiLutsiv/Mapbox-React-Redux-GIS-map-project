import { MutableRefObject, createContext } from "react";
import mapboxGl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { LineLayerStyle, PointLayerStyle } from "components/Map/styles/defaultStyles";

interface MapContextProps {
    map: mapboxGl.Map | null,
    setMap: React.Dispatch<React.SetStateAction<mapboxGl.Map | null>>;
    draw: MapboxDraw | null;
    setDraw: React.Dispatch<React.SetStateAction<MapboxDraw | null>>;
    areas: turf.AllGeoJSON[];
    setAreas: React.Dispatch<React.SetStateAction<turf.AllGeoJSON[]>>;
    mode: Map.GeometryMode;
    setMode: React.Dispatch<React.SetStateAction<Map.GeometryMode>>;
    zoom: number;
    setZoom: React.Dispatch<React.SetStateAction<number>>;
    selectedFeature: mapboxGl.MapboxGeoJSONFeature | undefined;
    setSelectedFeature: React.Dispatch<React.SetStateAction<mapboxGl.MapboxGeoJSONFeature | undefined>>;
    propertyFeature: mapboxGl.MapboxGeoJSONFeature | undefined;
    setPropertyFeature: React.Dispatch<React.SetStateAction<mapboxGl.MapboxGeoJSONFeature | undefined>>;
    geojsonData: Record<string, Map.Layer>;
    setGeojsonData: React.Dispatch<React.SetStateAction<Record<string, Map.Layer>>>;
    clusteredGeojsonData: { points:  Map.LayerFeature[], lines:  Map.LayerFeature[] };
    setClusteredGeojsonData: React.Dispatch<React.SetStateAction<{ points:  Map.LayerFeature[]; lines:  Map.LayerFeature[] }>>;
    featureKeyMap: Record<string, string>;
    setFeatureKeyMap: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    mapLoading: boolean;
    startLoading: () => void;
    endLoading: () => void;
}

export const MapContext = createContext<MapContextProps | undefined>(undefined);

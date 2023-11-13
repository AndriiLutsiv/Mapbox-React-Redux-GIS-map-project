import { MapContext } from '../lib/MapContext';
import { FC, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import mapboxGl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { LineLayerStyle, PointLayerStyle } from 'components/Map/styles/defaultStyles';

interface MapProviderProps {
    children: ReactNode
}

const MapProvider: FC<MapProviderProps> = (props) => {
    const [map, setMap] = useState<mapboxGl.Map | null>(null);
    const [layers, setLayers] = useState<string[] | null>(null)
    const [draw, setDraw] = useState<MapboxDraw | null>(null);
    const [areas, setAreas] = useState<turf.AllGeoJSON[]>([]);
    const [mode, setMode] = useState<Map.GeometryMode>('NORMAL');
    const [zoom, setZoom] = useState(0);
    const [selectedFeature, setSelectedFeature] = useState<mapboxGl.MapboxGeoJSONFeature | undefined>(undefined);
    const [propertyFeature, setPropertyFeature] = useState<mapboxGl.MapboxGeoJSONFeature | undefined>(undefined);
    const [geojsonData, setGeojsonData] = useState<Record<string, Map.Layer>>({});
    const [clusteredGeojsonData, setClusteredGeojsonData] = useState<{ points: Map.LayerFeature[], lines: Map.LayerFeature[] }>({ points: [], lines: [] });
    const [featureKeyMap, setFeatureKeyMap] = useState<Record<string, string>>({});  // Maps feature ID to its key
    
    const [loadingCounter, setLoadingCounter] = useState(0);
    const mapLoading = useMemo(() => loadingCounter > 0, [loadingCounter]);
    const startLoading = () => setLoadingCounter(prevCount => prevCount + 1);
    const endLoading = () => setLoadingCounter(prevCount => prevCount > 0 ? prevCount - 1 : 0);

    const contextValue = {
        map, setMap,
        layers, setLayers,
        draw, setDraw,
        areas, setAreas,
        mode, setMode,
        zoom, setZoom,
        selectedFeature, setSelectedFeature,
        propertyFeature, setPropertyFeature,
        geojsonData, setGeojsonData,
        clusteredGeojsonData, setClusteredGeojsonData,
        featureKeyMap, setFeatureKeyMap,
        mapLoading,
        startLoading,
        endLoading
    };

    return (
        <MapContext.Provider value={contextValue}>
            {props.children}
        </MapContext.Provider>
    );
};

export default MapProvider;

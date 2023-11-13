/*
 This code defines a custom React hook named useRefreshDataLayers that interacts with the Mapbox GL library 
 and other dependencies to fetch and refresh GeoJSON data for specific layers based on the user's map viewport, 
 zoom level, and project details, handling events like zoom and movement. 
 */
import { useAuth } from 'hooks/useAuth';
import { useMap } from 'app/providers/MapProvider';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { mapAPI } from 'services/MapService';
import { fetchMapData } from './fetchMapData';
import { setZoomLayersVisibility } from './setZoomLayersVisibility';
import { stylesAPI } from 'services/StylesService';
import { Layer } from 'models/Map';
import { TOGGLE_LAYER_EVENT } from 'components/Map/utils/constants';
import { useAppDispatch } from 'hooks/redux';

export function useRefreshDataLayers() {
  const { param3: project_uuid } = useParams();
  const { map, setZoom, geojsonData, clusteredGeojsonData, setGeojsonData, setClusteredGeojsonData, featureKeyMap, setFeatureKeyMap, startLoading, endLoading } = useMap();
  const { token } = useAuth();
  const dispatch = useAppDispatch();

  const { data: layers, error: getLayersError, isLoading: getLayersIsLoading } = mapAPI.useGetLayersQuery(
    { project_uuid: project_uuid || '' },
    { skip: !project_uuid }
  );

  const { data: stylesData = [], error: getStylesError, isLoading: getStylesIsLoading } = stylesAPI.useGetStylesQuery();

  useEffect(() => {
    getLayersIsLoading ? startLoading() : endLoading();
  }, [getLayersIsLoading]);

  useEffect(() => {
    if (!project_uuid || !map || !layers) return;

    const updateZoomLevel = () => setZoom(map.getZoom());

    const fetchData = async () => await fetchMapData({ map, stylesData, layers, token, project_uuid, geojsonData, clusteredGeojsonData, setGeojsonData, setClusteredGeojsonData, featureKeyMap, setFeatureKeyMap, startLoading, endLoading, dispatch });
    const fetchOneLayerData = async (layers: Layer[] | []) => await fetchMapData({ map, stylesData, layers, token, project_uuid, geojsonData, clusteredGeojsonData, setGeojsonData, setClusteredGeojsonData, featureKeyMap, setFeatureKeyMap, startLoading, endLoading, fetchOne: true, dispatch });

    const onZoomEnd = async () => {
      updateZoomLevel();
      await fetchData();
      stylesData && setZoomLayersVisibility(map, layers, stylesData);
    }

    const handleToggleLayerEvent = (event: CustomEvent) => fetchOneLayerData([event.detail.layer]);

    map.on('zoomend', onZoomEnd);
    map.on('moveend', fetchData);
    map.on('load', fetchData);
    document.addEventListener(TOGGLE_LAYER_EVENT, handleToggleLayerEvent as any);

    return () => {
      map.off('zoomend', onZoomEnd);
      map.off('moveend', fetchData);
      map.off('load', fetchData);
      document.removeEventListener(TOGGLE_LAYER_EVENT, handleToggleLayerEvent as any);
    }

  }, [map, project_uuid, stylesData]);
}
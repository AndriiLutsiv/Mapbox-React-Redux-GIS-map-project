import { bboxPolygon, BBox, getCoords } from '@turf/turf';
import { Layer } from '../../../../models/Map';
import mapboxGl from "mapbox-gl";
import { GEOJSON_ZOOM_THRESHOLD } from 'components/Map/utils/constants';
import { getGeojsonSourceId } from 'components/Map/resources/getId';
import { GetStylesResponse } from 'models/Styles';
import { clearToken } from 'store/reducers/tokenSlice';
import { AppDispatch } from 'store/store';

const abortControllers: Record<string, AbortController> = {};

interface ZoomInArgs {
    map: mapboxGl.Map,
    layers: Layer[] | [],
    token: string,
    project_uuid: string,
    geojsonData: Record<string, Map.Layer>,
    clusteredGeojsonData: { points: Map.LayerFeature[]; lines: Map.LayerFeature[] },
    setGeojsonData: React.Dispatch<React.SetStateAction<Record<string, Map.Layer>>>,
    setClusteredGeojsonData: React.Dispatch<React.SetStateAction<{ points: Map.LayerFeature[]; lines: Map.LayerFeature[]; }>>,
    featureKeyMap: Record<string, string>,
    setFeatureKeyMap: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    stylesData: GetStylesResponse,
    startLoading: () => void,
    endLoading: () => void,
    fetchOne?: boolean,
    dispatch: AppDispatch,
}

export const fetchMapData = async (zoomInArgs: ZoomInArgs) => {
    const {
        map, layers, token, project_uuid, geojsonData, clusteredGeojsonData,
        setGeojsonData, setClusteredGeojsonData, featureKeyMap, setFeatureKeyMap,
        startLoading, endLoading, stylesData, fetchOne, dispatch
    } = zoomInArgs;

    const bounds = map.getBounds().toArray().flat() as BBox;
    const boundsPolygon = bboxPolygon(bounds);
    const zoom = map.getZoom();

    Object.keys(abortControllers).forEach(key => {
        abortControllers[key].abort();
        delete abortControllers[key];
    });

    const localGeojsonDataUpdates: Record<string, Map.Layer> = {};
    const localClusteredGeojsonDataUpdates = {
        points: [...clusteredGeojsonData.points],
        lines: [...clusteredGeojsonData.lines]
    };
    let updatedFeatureKeyMap = { ...featureKeyMap };

    startLoading()

    const fetchLayerData = async (layer: Layer) => {
        const controller = new AbortController();
        abortControllers[layer.layer_type] = controller;

        const geojsonLayersZoom = zoom >= GEOJSON_ZOOM_THRESHOLD;

        if (geojsonLayersZoom) {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/layer`, {
                signal: controller.signal,
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    project_uuid: project_uuid!,
                    layer_type: layer.layer_type,
                    polygon: {
                        type: 'Polygon',
                        coordinates: getCoords(boundsPolygon),
                    },
                }),
            });
            delete abortControllers[layer.layer_type];

            if (response.status === 401) {
                // If a 401 Unauthorized response is received, dispatch the clearToken action
                dispatch(clearToken());
            }

            if (response.ok) {
                const responseData = await response.json() as Map.Layer;
                const sourceId = getGeojsonSourceId(layer.layer_type);
                const data = (geojsonData[sourceId] ?? { type: 'FeatureCollection', features: [] }) as Map.Layer;

                responseData.features.forEach(feature => {
                    data.features.push(feature);
                    if (feature.properties?.uuid) {
                        updatedFeatureKeyMap[feature.properties.uuid] = layer.layer_type;
                    }
                    if (layer.geom_type === 'Point') localClusteredGeojsonDataUpdates.points.push(feature);
                    if (layer.geom_type === 'LineString') localClusteredGeojsonDataUpdates.lines.push(feature);
                });

                localGeojsonDataUpdates[sourceId] = { ...data, features: data.features.map((feature, i) => ({ ...feature, id: i })) };

                // Set the map source data here after processing each layer
                (map?.getSource(sourceId) as mapboxgl.GeoJSONSource)?.setData(localGeojsonDataUpdates[sourceId] as any);
            }
        }
    };

    // Determine which layers to fetch based on the `fetchOne` flag
    let layersToFetch: Layer[] = [];
    if (fetchOne) {
        // Fetch only one layer 
        layersToFetch.push(layers[0]);
    } else {
        // Fetch only visible layers
        layersToFetch = layers.filter(layer =>
            stylesData.some(styleItem =>
                styleItem.layer === layer.layer_type && styleItem.style.isVisible
            )
        );
    }

    const fetchPromises = layersToFetch.map(layer => fetchLayerData(layer));

    try {
        await Promise.all(fetchPromises);
    } catch (error: any) {
        if (error.name !== 'AbortError') console.error(error);
    }

    // Apply all the updates at once
    setGeojsonData(localGeojsonDataUpdates);
    setClusteredGeojsonData({ points: localClusteredGeojsonDataUpdates.points, lines: localClusteredGeojsonDataUpdates.lines });
    setFeatureKeyMap(updatedFeatureKeyMap);
    endLoading();
}

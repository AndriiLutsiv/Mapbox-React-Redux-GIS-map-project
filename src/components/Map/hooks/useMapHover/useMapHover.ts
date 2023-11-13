/*
 * This code defines a custom React hook named useMapHover that uses the Mapbox GL library 
 * and various other dependencies to handle hovering over map features, updating their 
 * appearance and displaying information in a popup when the mouse moves over them on the map.
 */
import { useEffect } from 'react';
import mapboxGl from 'mapbox-gl';
import { useMap } from 'app/providers/MapProvider';
import { mapAPI } from 'services/MapService';
import { useParams } from 'react-router-dom';
import { highlightPoint } from './highlightPoint';
import { dimPoint } from './dimPoint';
import { highlightLine } from './highlightLine';
import { dimLine } from './dimLine';
import { geojsonSource } from 'components/Map/resources/sources';
import { getGeojsonSourceId, getGeojsonLayerId } from 'components/Map/resources/getId';
import { useAuth } from 'hooks/useAuth';

export function useMapHover() {
    const params = useParams();
    const { token } = useAuth();
    const { map, setSelectedFeature, clusteredGeojsonData, geojsonData, startLoading, endLoading } = useMap();

    const { data: layers, error: getLayersError, isLoading: getLayersIsLoading } = mapAPI.useGetLayersQuery(
        { project_uuid: params.param3 || '' },
        { skip: !params.param3 }
    );

    useEffect(() => {
        getLayersIsLoading ? startLoading() : endLoading();
    }, [getLayersIsLoading]);

    useEffect(() => {
        if (!map || !layers) return;

        type Nodes = { uuid: string, layer_type: string, project_uuid: string }[] | undefined;

        let pointHovered = false;
        let lineHovered = false;

        const onMove = layers.map(layer => ({
            id: getGeojsonLayerId(layer.layer_type),
            handler: async (e: mapboxGl.MapMouseEvent & { features?: mapboxGl.MapboxGeoJSONFeature[] }) => {
                const isPoint = layer.geom_type === 'Point';
                const isLine = layer.geom_type === 'LineString';
                const feature = e.features?.[0];

                // handle points
                if (feature && isPoint && !pointHovered) {
                    const connectedFrom: Nodes = feature.properties?.connected_from ? JSON.parse(feature.properties?.connected_from) : undefined;
                    const connectedTo: Nodes = feature.properties?.connected_to ? JSON.parse(feature.properties?.connected_to) : undefined;
                    const toHighlightPoints = [feature] as any;
                    const toHighLightLines = [] as any;

                    // find parent point
                    connectedFrom?.forEach((_, i: number) => {
                        const sourceKey = getGeojsonSourceId(connectedFrom[i]?.layer_type);
                        const parentNode = geojsonData[sourceKey]?.features.find(f => f.properties.uuid === connectedFrom[0].uuid);
                        parentNode && toHighlightPoints.push(parentNode);
                    });

                    //find child point
                    connectedTo?.forEach((_, i: number) => {
                        const childNode = clusteredGeojsonData.points.find(f => f.properties.uuid === connectedTo[i].uuid);
                        childNode && toHighlightPoints.push(childNode);
                    });

                    //find lines in between the points
                    const fromLines = clusteredGeojsonData.lines.filter(line => line.properties.from_?.uuid === feature.properties?.uuid);
                    const toLines = clusteredGeojsonData.lines.filter(line => line.properties.to?.uuid === feature.properties?.uuid);
                    toHighLightLines.push(...fromLines, ...toLines);

                    //highlight Points and lines
                    highlightPoint(map, toHighlightPoints);
                    highlightLine(map, toHighLightLines);
                    pointHovered = true;
                    (toHighLightLines.length > 0) && (lineHovered = true);
                    map.getCanvas().style.cursor = 'pointer';
                }

                // handle lines
                if (feature && isLine && !lineHovered) {
                    let lineFrom = feature.properties?.from_ ? JSON.parse(feature.properties?.from_) : undefined;
                    let lineTo = feature.properties?.to ? JSON.parse(feature.properties?.to) : undefined;

                    // find lines
                    if (lineFrom && lineTo) {
                        const sourceData = geojsonData[feature.source];
                        const linesMatch = sourceData?.features.filter(f => (f.properties.from_.uuid === lineFrom.uuid) && f.properties.to.uuid === lineTo.uuid) || [];
                        highlightLine(map, [feature, ...linesMatch]);
                    }
                    lineHovered = true;
                    map.getCanvas().style.cursor = 'pointer';
                }
            }
        }));

        const onLeave = layers.map(layer => ({
            id: getGeojsonLayerId(layer.layer_type),
            handler: () => {
                if (pointHovered) {
                    dimPoint(map);
                    pointHovered = false;
                    map.getCanvas().style.cursor = '';
                }

                if (lineHovered) {
                    dimLine(map);
                    lineHovered = false;
                    map.getCanvas().style.cursor = '';
                }
            }
        }));

        onMove.forEach(i => map.on('mousemove', i.id, i.handler));
        onLeave.forEach(i => map.on('mouseleave', i.id, i.handler));

        return () => {
            onMove.forEach(i => map.off('mousemove', i.id, i.handler));
            onLeave.forEach(i => map.off('mouseleave', i.id, i.handler));
        };
    }, [map, layers, clusteredGeojsonData, geojsonData]);
}

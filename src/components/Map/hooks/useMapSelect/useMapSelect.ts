/*
 * This code defines a custom React hook named useMapSelect that leverages the Mapbox GL library 
 * and other dependencies to handle selecting map features upon clicking, updating their selection 
 * status, and managing state for the selected objects based on the mode of interaction.
 */
import React, { useEffect, useRef, useState } from 'react';
import mapboxGl from 'mapbox-gl';
import { useMap } from 'app/providers/MapProvider';
import { useParams } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import { mapAPI } from 'services/MapService';
import { selectPoint } from './selectPoint';
import { geojsonSource } from 'components/Map/resources/sources';
import { selectLine } from './selectLine';
import { unselectPoint } from './unselectPoint';
import { unselectLine } from './unselectLine';
import { getGeojsonLayerId, getGeojsonSourceId } from 'components/Map/resources/getId';
import s from './useMapSelect.styles.module.scss';
import { handlePopup } from './handlePopup';

export function useMapSelect(setUuidPoint: React.Dispatch<React.SetStateAction<string>>, setShowHierarchPopup: React.Dispatch<React.SetStateAction<boolean>>) {
    const params = useParams();
    const { token } = useAuth();
    const { map, setSelectedFeature, clusteredGeojsonData, geojsonData, setPropertyFeature, startLoading, endLoading } = useMap();

    const { data: layers, error: getLayersError, isLoading: getLayersIsLoading } = mapAPI.useGetLayersQuery(
        { project_uuid: params.param3 || '' },
        { skip: !params.param3 }
    );

    const lineSelected = useRef(false);
    const pointSelected = useRef(false);
    const wasLayerClicked = useRef(false);

    useEffect(() => {
        getLayersIsLoading ? startLoading() : endLoading();
    }, [getLayersIsLoading]);

   

    useEffect(() => {
        if (!map || !layers) return;

        type Nodes = { uuid: string, layer_type: string, project_uuid: string }[] | undefined;

        const onClick = layers.map(layer => ({
            id: getGeojsonLayerId(layer.layer_type),
            handler: async (e: mapboxGl.MapMouseEvent & { features?: mapboxGl.MapboxGeoJSONFeature[] }) => {
                const isPoint = layer.geom_type === 'Point';
                const isLine = layer.geom_type === 'LineString';
                const feature = e.features?.[0];

                if (feature) {
                    setSelectedFeature(feature);
                    setPropertyFeature(feature);
                };

                // handle points
                if (feature && isPoint) {
                    handlePopup(e, map, setUuidPoint, setShowHierarchPopup);

                    wasLayerClicked.current = true;
                    const connectedFrom: Nodes = feature.properties?.connected_from ? JSON.parse(feature.properties?.connected_from) : undefined;
                    const connectedTo: Nodes = feature.properties?.connected_to ? JSON.parse(feature.properties?.connected_to) : undefined;
                    const toSelectPoints = [feature] as any;
                    const toSelectLines = [] as any;

                    // find parent point
                    connectedFrom?.forEach((_, i: number) => {
                        const sourceKey = getGeojsonSourceId(connectedFrom[i]?.layer_type);
                        const parentNode = geojsonData[sourceKey]?.features.find(f => f.properties.uuid === connectedFrom[0].uuid);
                        parentNode && toSelectPoints.push(parentNode);
                    });

                    //find child point
                    connectedTo?.forEach((_, i: number) => {
                        const childNode = clusteredGeojsonData.points.find(f => f.properties.uuid === connectedTo[i].uuid);
                        childNode && toSelectPoints.push(childNode);
                    });

                    //find lines in between the points
                    const fromLines = clusteredGeojsonData.lines.filter(line => line.properties.from_?.uuid === feature.properties?.uuid);
                    const toLines = clusteredGeojsonData.lines.filter(line => line.properties.to?.uuid === feature.properties?.uuid);
                    toSelectLines.push(...fromLines, ...toLines)

                    selectPoint(map, toSelectPoints);
                    selectLine(map, toSelectLines);

                    pointSelected.current = true;
                    (toSelectLines.length > 0) && (lineSelected.current = true);
                    map.getCanvas().style.cursor = 'pointer';
                }

                // handle lines
                if (feature && isLine) {
                    wasLayerClicked.current = true;
                    let lineFrom = feature.properties?.from_ ? JSON.parse(feature.properties?.from_) : undefined;
                    let lineTo = feature.properties?.to ? JSON.parse(feature.properties?.to) : undefined;

                    // find lines
                    if (lineFrom && lineTo) {
                        const sourceData = geojsonData[feature.source];
                        const linesMatch = sourceData?.features.filter(f => (f.properties.from_.uuid === lineFrom.uuid) && f.properties.to.uuid === lineTo.uuid) || [];
                        selectLine(map, [feature, ...linesMatch]);

                        unselectPoint(map);
                        pointSelected.current = false;
                    }

                    lineSelected.current = true;
                    map.getCanvas().style.cursor = 'pointer';
                }
            }
        }));

        const handleMapClick = () => {
            if (wasLayerClicked.current) {
                wasLayerClicked.current = false;
                return;
            }

            if (pointSelected) {
                unselectPoint(map);
                pointSelected.current = false;
                setSelectedFeature(undefined);
                setPropertyFeature(undefined);
            }

            if (lineSelected) {
                unselectLine(map);
                pointSelected.current = false;
                setSelectedFeature(undefined);
                setPropertyFeature(undefined);
            }

            map.getCanvas().style.cursor = '';
        }

        onClick.forEach(i => map.on('click', i.id, i.handler));
        map.on('click', handleMapClick)

        return () => {
            onClick.forEach(i => map.off('click', i.id, i.handler));
            map.off('click', handleMapClick)
        };
    }, [map, layers, clusteredGeojsonData, geojsonData]);
}

export default useMapSelect;

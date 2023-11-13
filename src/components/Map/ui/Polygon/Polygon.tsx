/*
 This code defines a React component named Polygon that utilizes Mapbox GL and the Mapbox Draw library 
 to create a toolbar allowing users to draw, edit, and delete polygons on the map, updating the drawn 
 polygon data and interacting with the map's controls and events while utilizing custom polygon styling. 
 */
import React, { useEffect } from 'react';
import * as turf from '@turf/turf';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import './Polygon.module.scss';
import { customPolygonStyles } from './customPolygonStyles';
import { useMap } from 'app/providers/MapProvider';

interface Props {
}

const Polygon: React.FC<Props> = ({ }) => {
    const { map, setDraw, setAreas } = useMap();
    useEffect(() => {
        if (!map) return;

        const draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                polygon: true,
                trash: true
            },
            defaultMode: 'simple_select',
            styles: [...customPolygonStyles]
        });

        map.addControl(draw);

        setDraw(draw);

        const updateArea = (e: any) => {
            console.log('fsdfdsf');
            if (e.type === 'draw.create') {
                const allFeatures = draw.getAll();
                if (allFeatures.features.length > 1) {
                    // Delete all features and then add the most recent one
                    draw.deleteAll();
                    draw.add(e.features[0]);
                }
            }

            const data = draw.getAll();
            const polygonData = data.features.map(feature => feature.geometry as turf.AllGeoJSON);
            console.log('polygonData', polygonData);
            setAreas(polygonData);
        };

        map.on('draw.create', updateArea);
        map.on('draw.delete', updateArea);
        map.on('draw.update', updateArea);

        return () => {
            if (map && draw) {
                map.off('draw.create', updateArea);
                map.off('draw.delete', updateArea);
                map.off('draw.update', updateArea);
                map.removeControl(draw);
            }

            setDraw(null);
        };
    }, [map, setDraw, setAreas]);

    return <></>
}

export default Polygon;

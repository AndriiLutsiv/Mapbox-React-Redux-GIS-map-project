import mapboxGl from 'mapbox-gl';
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import { Tab } from "components/Tab";
import React, { useEffect, useRef, useState } from "react";
import Heatmap from './Block';

(mapboxGl as any).workerClass = MapboxWorker;

mapboxGl.accessToken = process.env.REACT_APP_MAP_TOKEN!;

interface Props {
    areaId: number;
    scenarioIds?: number[];
    projectIds?: number[];
}
export const MapPlot: React.FC<Props> = ({ areaId, scenarioIds = [], projectIds = [] }) => {
    const tabConfig = [
        // {
        //     label: 'HLD View',
        //     key: 'HLD View',
        //     children:
        //         <>
        //             <p>Here can be your first map</p>
        //         </>
        // },
        {
            label: 'CPPP View',
            key: 'CPPP View',
            children: <>
                <Heatmap />
            </>
        },
    ];
    return <div style={{ color: 'white' }}>
        <Tab isScrolled config={tabConfig} defaultValue={'CPPP View'} />

    </div>
}
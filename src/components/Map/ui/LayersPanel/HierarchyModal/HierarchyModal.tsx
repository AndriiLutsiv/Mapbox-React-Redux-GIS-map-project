import { useMap } from 'app/providers/MapProvider';
import styles from './HierarchyModal.module.scss';
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { GeoJsonProperties } from 'geojson';
import HierarchyGraph from './HierarchyGraph';
import { Table } from 'components/Table';
import { Legend } from './Legend';
import { TableData } from './TableData';
interface Props {
    pointUuid: string;
    setShowHierarchPopup: any
}
let i = 0;

const HierarchyModal: React.FC<Props> = ({ pointUuid, setShowHierarchPopup }) => {
    const { clusteredGeojsonData } = useMap();

    const nodeSequenceArray: any = [];

    // temporary solution !!!
    // work depends on zoom
    const getNodeSequence: any = (startNodeId: string) => {
        const startNodeData = clusteredGeojsonData.points.find(
            (el) => el.id === startNodeId
        );

        const line = clusteredGeojsonData.lines.find((el) => {
            return el.properties?.from_?.uuid === startNodeId;
        });

        if (line) {
            nodeSequenceArray.push(
                { type: "point", props: startNodeData?.properties },
                { type: "line", props: line?.properties }
            );
        } else {
            nodeSequenceArray.push({ type: "point", props: startNodeData?.properties });
        }

        if (startNodeData?.properties?.connected_from?.length) {
            return getNodeSequence(startNodeData.properties.connected_from[0].uuid);
        } else {
            return;
        }
    };

    if (pointUuid) {
        getNodeSequence(pointUuid)
    }

    return <div className={styles.hierarchyModal} >
        <div className={styles.close} onClick={() => setShowHierarchPopup(false)}></div>
        <HierarchyGraph
            nodeSequence={nodeSequenceArray}
        />

    </div>
}

export default HierarchyModal;

// to do
// fix styling
// this functional doesn't work if have small zoom

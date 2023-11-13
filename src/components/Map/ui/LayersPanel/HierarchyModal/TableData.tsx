import React, { useState } from 'react';
import { Panel, useReactFlow, getRectOfNodes, getTransformForBounds } from 'reactflow';
import { toPng, toJpeg, toSvg } from 'html-to-image';
import styles from './HierarchyModal.module.scss';


export const TableData = ({ data }: any) => {
    
    const getDataObj = (data: any) => {
        const typeKey = Object.keys(data?.props).find((el: any) => el.includes('type'));
        const obj: any = {
            uuid: data?.props?.uuid,
            infraParent: data.props?.infra_parent?.layer_type,
            type: typeKey || '',
            typeValue: data?.props[typeKey || ''],
        }

        if (data.type === 'line') {
            obj.distance = data.props.distance;
        }

        if (data.type !== 'line') {
            obj.connected_from = JSON.stringify(data.props?.connected_from);
            obj.connected_to = JSON.stringify(data.props?.connected_to);
        }

        return obj;
    }

    const dataObj = data && getDataObj(data);
    const arr = [];
    for (let key in dataObj) {
        arr.push(
            <div key={key} className={styles.tableRow}>
                <p>{key}</p>
                <p>{dataObj[key]}</p>
            </div>
        )
    }

    return (
        <Panel position="bottom-center">
            <div style={{ color: 'white' }}>
                {arr}
            </div>
        </Panel>
    );
}

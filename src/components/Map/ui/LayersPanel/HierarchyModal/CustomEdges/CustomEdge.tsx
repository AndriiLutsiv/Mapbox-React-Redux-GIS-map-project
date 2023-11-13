import React from 'react';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath } from 'reactflow';
import styles from './CustomEdge.module.scss';

export const CustomEdge = ({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data
}: EdgeProps) => {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        fontSize: 12,
                        pointerEvents: 'all',
                    }}
                >
                    <p className={styles.text}>{`${(data.distance * 1000).toFixed(2)}M`}
                        <br />
                        {`${data.distance.toFixed(2)}KM`}
                        <br />
                        {[data.type.split('_')[0]].map((el: any) => el[0].toUpperCase() + el.slice(1)).join(' ')}
                    </p>
                </div>
            </EdgeLabelRenderer>
        </>
    );
}

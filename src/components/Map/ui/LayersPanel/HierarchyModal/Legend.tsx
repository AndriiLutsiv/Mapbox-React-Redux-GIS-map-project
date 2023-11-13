import React, { useState } from 'react';
import styles from './HierarchyModal.module.scss';
import { styleLine, styleNode } from './utils/nodeStyling';
import { Panel } from 'reactflow';
import classNames from 'classnames';



export const Legend = () => {
    const [isShown, setLabelShow] = useState(false);

    const arrOfNodesBlocks = [];
    const arrOfLinesBlocks = [];

    for (let key in styleNode) {
        arrOfNodesBlocks.push(
            <div className={styles.legendItem}>
                <div className={styles.legendIcon}>
                    <div style={{ ...styleNode[key], display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'scale(0.7)' }}>
                        {key}
                    </div>
                </div>
                <div className={styles.legendText}>
                    {key}
                </div>
            </div>
        )
    }
    for (let key in styleLine) {
        arrOfLinesBlocks.push(
            <div className={styles.legendItem}>
                <div className={styles.legendIcon}>
                    <div style={{ ...styleNode[key], display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'scale(0.7)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="70" height="10" viewBox="0 0 70 10" fill="none">
                            <path d="M0 1H70" stroke="black"
                                {...styleLine[key]} />
                        </svg>
                    </div>
                </div>
                <div className={styles.legendText}>
                    {key}
                </div>
            </div>
        )
    }

    const jsxNodes = arrOfNodesBlocks.map((el, i) => {
        return <React.Fragment key={i}>{el}</React.Fragment>
    })
    const jsxLines = arrOfLinesBlocks.map((el, i) => {
        return <React.Fragment key={i}>{el}</React.Fragment>
    })

    return <Panel position="bottom-right">
       {isShown && <div className={styles.legendBlock}>
            <div className={styles.legendSectionBlock}>
                <p className={styles.subtitle}>Nodes</p>
                {jsxNodes}

            </div>
            <div className={styles.legendSectionBlock}>
                <p className={styles.subtitle}>Line</p>
                {jsxLines}

            </div>
        </div>}
        <button className={styles.legendButton} onClick={() => setLabelShow(!isShown)}>Show Legend</button>

    </Panel>
}
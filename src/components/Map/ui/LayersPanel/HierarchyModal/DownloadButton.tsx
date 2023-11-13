import React, { useState } from 'react';
import { Panel, useReactFlow, getRectOfNodes, getTransformForBounds } from 'reactflow';
import { toPng, toJpeg, toSvg } from 'html-to-image';
import styles from './HierarchyModal.module.scss';



const imageWidth = 1440;
const imageHeight = 768;

export const DownloadButton = () => {
    const { getNodes } = useReactFlow();
    const [selectedValue, setSelectedValue] = useState('SVG'); // Set a default value

    const downloadImage = (dataUrl: any) => {
        const a = document.createElement('a');

        a.setAttribute('download', `data.${selectedValue.toLowerCase()}`);
        a.setAttribute('href', dataUrl);
        a.click();
    }
    const onClick = (selectedValue: string) => {
        // we calculate a transform for the nodes so that all nodes are visible
        // we then overwrite the transform of the `.react-flow__viewport` element
        // with the style option of the html-to-image library
        const nodesBounds = getRectOfNodes(getNodes());
        const transform = getTransformForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2);

        if (selectedValue === "PNG") {
            // @ts-ignore
            toPng(document.querySelector('.react-flow__viewport'), {
                // backgroundColor: '#D9D9D9',
                width: imageWidth,
                height: imageHeight,
                style: {
                    transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
                },
            }).then(downloadImage);
        }
        if (selectedValue === "SVG") {
            // @ts-ignore
            toSvg(document.querySelector('.react-flow__viewport'), {
                // backgroundColor: '#D9D9D9',
                width: imageWidth,
                height: imageHeight,
                style: {
                    transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
                },
            }).then(downloadImage);
        }
        if (selectedValue === "JPEG") {
            // @ts-ignore
            toJpeg(document.querySelector('.react-flow__viewport'), {
                // backgroundColor: '#D9D9D9',
                width: imageWidth,
                height: imageHeight,
                style: {
                    transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
                },
            }).then(downloadImage);
        }
    };

    const handleChange = (event: any) => {
        setSelectedValue(event.target.value);
    };
    
    return (
        <Panel position="top-right">
            <div className={styles.downloadButton}>
                <button onClick={() => onClick(selectedValue)}>
                    Download data
                </button>
                <select value={selectedValue} onChange={handleChange}>
                    <option value="SVG">.svg</option>
                    <option value="PNG">.png</option>
                    <option value="JPEG">.jpeg</option>
                </select>
            </div>
        </Panel>
    );
}

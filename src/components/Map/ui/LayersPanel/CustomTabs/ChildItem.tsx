import { LineLayerStyle, PointLayerStyle } from 'components/Map/styles/defaultStyles';
import styles from './CustomTabs.module.scss';
import { LineIndicator, PointIndicator } from '../Indicator';
import React, { useState } from 'react';
import { CustomCheckbox } from '../CustomInputs';
import { Layer } from 'models/Map';
import classNames from 'classnames';

interface Props {
    layer: Layer,
    layerItem: PointLayerStyle | LineLayerStyle,
    label: string,
    childLayer: string,
    setChildClick: React.Dispatch<React.SetStateAction<string>>,
    setSelectedLayer: React.Dispatch<React.SetStateAction<Layer | null>>,
    toggleLayerVisibility: (layer: Layer, child?: string) => Promise<void>,

}
export const ChildItem: React.FC<Props> = ({ layer, label, layerItem, childLayer, setChildClick, setSelectedLayer, toggleLayerVisibility }) => {
    
    const foundedLineItem = (layerItem as LineLayerStyle).props.find((el: any) => el.name === childLayer);
    const foundedPointItem = (layerItem as PointLayerStyle).props.find((el: any) => el.name === childLayer);
    const colorPoint = foundedPointItem?.color || (layerItem as PointLayerStyle).color;
    const type = foundedPointItem?.shapeName || (layerItem as PointLayerStyle).shapeName;
    const shape = foundedPointItem?.shapeForm || (layerItem as PointLayerStyle).shapeForm;

    const colorLine = foundedPointItem?.color || (layerItem as LineLayerStyle).color;
    const opacity = foundedLineItem?.opacity || (layerItem as LineLayerStyle).opacity;
    const height = foundedLineItem?.thickness || (layerItem as LineLayerStyle).thickness;
    const lineType = foundedLineItem?.lineType || (layerItem as LineLayerStyle).lineType;

    const isCheckedLine = !!foundedLineItem?.isVisible;
    const isCheckedPoint = !!foundedPointItem?.isVisible;
    
    return (<>
        {layerItem.type !== 'Point' && <div className={classNames(styles.childItem, {
            [styles.opacity]: layerItem.isVisible === false
        })}>
            <CustomCheckbox
                label={label}
                value={label}
                isChecked={isCheckedLine}
                onChange={() => {
                    toggleLayerVisibility(layer, childLayer);
                }}
            />
            {
               !foundedLineItem!.isLabelVisible && <p className={styles.labelInd}>label</p>
            }
            <LineIndicator
                currentColor={colorLine}
                opacity={opacity}
                height={height}
                lineType={lineType}
                onClick={() => {
                    setChildClick(childLayer);
                    setSelectedLayer(layer);
                }}
            /></div>
        }

        {layerItem.type === 'Point' && <div className={classNames(styles.childItem, {
            [styles.opacity]: layerItem.isVisible === false
        })}>
            <CustomCheckbox
                label={label}
                value={label}
                isChecked={isCheckedPoint}
                onChange={() => {
                    toggleLayerVisibility(layer, childLayer);
                }}
            />
            {
               !foundedPointItem!.isLabelVisible && <p className={styles.labelInd}>label</p>
            }
            <PointIndicator
                type={type}
                shapeForm={shape}
                currentColor={colorPoint}
                onClick={() => {
                    setChildClick(childLayer);
                    setSelectedLayer(layer)
                }}
            />
        </div>
        }
    </>

    )
}
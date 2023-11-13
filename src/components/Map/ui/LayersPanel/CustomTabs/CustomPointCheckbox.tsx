import { LineLayerStyle, PointLayerStyle } from 'components/Map/styles/defaultStyles';
import { CustomCheckbox } from '../CustomInputs';
import { PointIndicator } from '../Indicator';
import styles from './CustomTabs.module.scss';
import { Layer } from 'models/Map';
import { useState } from 'react';
import classNames from 'classnames';
import { ChildItem } from './ChildItem';

interface Props {
    layer: Layer,
    layerItem: PointLayerStyle | LineLayerStyle,
    toggleLayerVisibility: (layer: Layer, child?: string) => Promise<void>,
    setSelectedLayer: React.Dispatch<React.SetStateAction<Layer | null>>,
    layerChildren: {
        name: string;
        type: "Point";
        layerId: string;
        color?: string | undefined;
        shapeName?: string | undefined;
        isVisible?: boolean | undefined;
        shapeForm?: string | undefined;
    }[],
    setChildClick:React.Dispatch<React.SetStateAction<string>>
}
export const CustomPointCheckbox: React.FC<Props> = ({ layer, layerItem, toggleLayerVisibility, setSelectedLayer, layerChildren, setChildClick }) => {
    const [isShow, setIsShow] = useState(false);
    const childrenJSX = layerChildren?.map((el: { name: string; }) => {
      
        return <ChildItem key={layer.layer_type + el.name}
            childLayer={el.name}
            layerItem={(layerItem as PointLayerStyle)}
            layer={layer}
            label={el.name}
            setChildClick={setChildClick}
            setSelectedLayer={setSelectedLayer}
            toggleLayerVisibility={toggleLayerVisibility} />
    });
    return <div className="parent">
        <div className={styles.inputLayout} onClick={() => setIsShow(!isShow)}>

            {!!childrenJSX?.length && <svg className={classNames(styles.nestingIcon, {
                [styles.rotate]: isShow
            })} xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M3 6L5 4L3 2" stroke="#D6D6D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>}
            <CustomCheckbox
                label={layer.layer_type.split('_').map((item) => item[0].toUpperCase() + item.slice(1)).join(' ')}
                value={layer.layer_type}
                isChecked={layerItem.isVisible}
                onChange={() => {
                    toggleLayerVisibility(layer);
                }}
            />
            {
               !layerItem!.isLabelVisible && <p className={styles.labelInd}>label</p>
            }
            <PointIndicator
                type={(layerItem as PointLayerStyle).shapeName}
                shapeForm={(layerItem as PointLayerStyle).shapeForm}
                currentColor={layerItem.color}
                onClick={() => {
                    setSelectedLayer(layer);
                    setChildClick('');
                }}
            />
        </div>
        {!!childrenJSX.length && isShow && <div>
            {childrenJSX}
        </div>}
    </div>
}
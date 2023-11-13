import { useEffect, useState } from 'react';
import styles from './StyleLinePopup.module.scss';
import { useMap } from 'app/providers/MapProvider';
import LineColours from './LineColours';
import LineThickness from './LineThickness';
import LineType from './LineType';
import LineOpacity from './LineOpacity';
import { applyLinesStyles } from 'components/Map/styles/applyStyles';
import { Layer, LayerType } from 'models/Map';
import { stylesAPI } from 'services/StylesService';
import { useAuth } from 'hooks/useAuth';
import { ErrorPopUp } from 'components/Error';
import { LabelText } from './LabelText';
import { getGeojsonLayerId } from 'components/Map/resources/getId';

interface Props {
  selectedLayer: Layer | null;
  onClose: () => void;
  childType?: string;
}

const StyleLinePopup: React.FC<Props> = ({ selectedLayer, onClose, childType }) => {
  const { token } = useAuth();
  const { map, startLoading, endLoading } = useMap();
  const { data: stylesData, error: getStylesError, isLoading: getStylesIsLoading } = stylesAPI.useGetStylesQuery();
  const [updateStyle, { error: updateStyleError, isLoading: updateStyleIsLoading, reset: updateStyleReset }] = stylesAPI.useUpdateStyleMutation();
  const [createStyle, { error: createStyleError, isLoading: createStyleIsLoading, reset: createStyleReset }] = stylesAPI.useCreateStyleMutation();

  const defaultLayerItem = stylesData?.find(item => getGeojsonLayerId(selectedLayer?.layer_type || '') === item.style.layerId);

  const [color, setColor] = useState(defaultLayerItem?.style?.color || '#ffffff');
  const [thickness, setThickness] = useState(defaultLayerItem?.style?.thickness || 3);
  const [opacity, setOpacity] = useState(defaultLayerItem?.style?.opacity || 1);
  const [lineType, setLineType] = useState(defaultLayerItem?.style?.lineType || 'solid');
  const [isLabelVisible, setLabelVisibility] = useState(defaultLayerItem?.style?.isLabelVisible);

  useEffect(() => {
    if (getStylesIsLoading || updateStyleIsLoading || createStyleIsLoading) {
      startLoading();
    } else {
      endLoading();
    };
  }, [getStylesIsLoading, updateStyleIsLoading, createStyleIsLoading]);

  useEffect(() => {
    if (childType) {
      const item = defaultLayerItem?.style.props.find((el: any) => el.name === childType)!;
      setColor(item?.color || defaultLayerItem?.style?.color);
      setThickness(item?.thickness || defaultLayerItem?.style?.thickness);
      setOpacity(item?.opacity || defaultLayerItem?.style?.opacity);
      setLineType(item?.lineType || defaultLayerItem?.style?.lineType);
      setLabelVisibility(!!item.isLabelVisible);
    } else {
      setColor(defaultLayerItem?.style?.color || '#ffffff');
      setThickness(defaultLayerItem?.style?.thickness || 3);
      setOpacity(defaultLayerItem?.style?.opacity || 1);
      setLabelVisibility(defaultLayerItem?.style?.isLabelVisible);
      setLineType(defaultLayerItem?.style?.lineType || 'solid');
    }

  }, [selectedLayer?.layer_type, childType]);

  const updateLineLayerStyle = async () => {
    if (!map || !stylesData) return;

    const nextStyles = [...stylesData];
    const layerItemIndex = nextStyles.findIndex(item => getGeojsonLayerId(selectedLayer?.layer_type || '') === item.style.layerId);

    if (childType) {
      const obj = nextStyles[layerItemIndex].style.props.find((item: { name: string; }) => item.name === childType)!;
      const indexInPropsArr = nextStyles[layerItemIndex].style.props.findIndex((item: { name: string; }) => item.name === childType);
      const newStyles = { ...obj, color, lineType, thickness, opacity, isLabelVisible: isLabelVisible }!;

      const newPropsArray = nextStyles[layerItemIndex].style.props.map((el: any, i: number) => {
        if (i === indexInPropsArr) {
          return {
            ...el,
            ...newStyles
          }
        } else return el
      });

      nextStyles[layerItemIndex] = {
        ...nextStyles[layerItemIndex],
        style: {
          ...nextStyles[layerItemIndex].style,
          props: newPropsArray
        },
      };

    } else {
      nextStyles[layerItemIndex] = {
        ...nextStyles[layerItemIndex],
        style: {
          ...nextStyles[layerItemIndex]?.style,
          color, lineType, thickness, opacity, isLabelVisible: isLabelVisible
        }
      };
    }

    // Applying the updated styles to the map
    await applyLinesStyles(nextStyles, selectedLayer!.layer_type, map, layerItemIndex);

    const stylesDataForSelectedLayer = stylesData?.find((el) => el.layer === selectedLayer?.layer_type);

    if (stylesDataForSelectedLayer) {
      const newStylesDataForSelectedLayer = {
        uuid: stylesDataForSelectedLayer?.uuid || '',
        layer: selectedLayer?.layer_type,
        style: nextStyles[layerItemIndex].style
      };
      try {
        await updateStyle(newStylesDataForSelectedLayer).unwrap()
          .catch((error) => {
            throw new Error(error.data.detail[0].msg)
          });
      } catch (error) {
        console.error('Error updating styles', error);
      }
    } else {
      const newStylesDataForSelectedLayer = {
        layer: selectedLayer?.layer_type as LayerType,
        style: nextStyles[layerItemIndex].style
      };
      try {
        await createStyle(newStylesDataForSelectedLayer).unwrap()
          .catch((error) => {
            throw new Error(error.data.detail[0].msg)
          });
      } catch (error) {
        console.error('Error creating styles', error);
      }
    }

    // !! Do not delete this code! 
    // !! This code can help test layout styling if server doesn't work correctly
    // localStorage.setItem('TEST_SAVE_LAYERS', JSON.stringify(nextStyles));
  }

  useEffect(() => {
    updateLineLayerStyle();
  }, [color, lineType, thickness, opacity, isLabelVisible]);

  return (<>
    <div className={styles.styleLinePopup} data-testid="style-line-popup">
      <div className={styles.titleBox}>
        <h1 className={styles.subheading}>{selectedLayer?.layer_type.split('_').map((el) => el[0].toUpperCase() + el.slice(1)).join(' ')} {childType && '> ' + childType}</h1>
      </div>
      <div className={styles.styleLinePopupWrapper}>
        <LineColours color={color} setColor={setColor} />
        <LineType lineType={lineType} setLineType={setLineType} />
        <LineThickness thickness={thickness} setThickness={setThickness} />
        <LineOpacity opacity={opacity} setOpacity={setOpacity} />
        <LabelText labelVisibility={isLabelVisible} setLabelVisibility={setLabelVisibility} />
        <div className={styles.close} onClick={() => onClose()} data-testid="style-line-popup-close">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5L15 15" stroke="#D6D6D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
    {createStyleError && <ErrorPopUp createStyleError={createStyleError} />}
    {updateStyleError && <ErrorPopUp createStyleError={updateStyleError} />}
  </>
  );
}

export default StyleLinePopup;

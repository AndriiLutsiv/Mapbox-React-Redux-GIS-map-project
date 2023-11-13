import { useEffect, useState } from 'react';
import styles from './StylePointPopup.module.scss';
import { useMap } from 'app/providers/MapProvider';
import { Shape, shapes } from 'components/Map/styles/shapes';
import PointColours from './PointColours';
import Shapes from './Shapes';
import { LineLayerStyle, PointLayerStyle } from 'components/Map/styles/defaultStyles';
import { applyPointsStyles } from 'components/Map/styles/applyStyles';
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

const StylePointPopup: React.FC<Props> = ({ selectedLayer, onClose, childType }) => {
  const { token } = useAuth();
  const { map, startLoading, endLoading } = useMap();
  const { data: stylesData = [], error: getStylesError, isLoading: getStylesIsLoading } = stylesAPI.useGetStylesQuery();
  const [updateStyle, { error: updateStyleError, isLoading: updateStyleIsLoading, reset: updateStyleReset }] = stylesAPI.useUpdateStyleMutation();
  const [createStyle, { error: createStyleError, isLoading: createStyleIsLoading, reset: createStyleReset }] = stylesAPI.useCreateStyleMutation();

  const defaultLayerItem = stylesData?.find(item => getGeojsonLayerId(selectedLayer?.layer_type || '') === item.style.layerId);
  const [color, setColor] = useState(defaultLayerItem?.style?.color);
  const [selectedShape, setSelectedShape] = useState({ name: defaultLayerItem?.style?.shapeName, svg: defaultLayerItem?.style?.shapeForm } || shapes.find(shape => shape.name === defaultLayerItem?.style?.shapeName) || shapes[0]);
  const [isLabelVisible, setLabelVisibility] = useState(defaultLayerItem?.style?.isLabelVisible);

  useEffect(() => {
    if (getStylesIsLoading || updateStyleIsLoading || createStyleIsLoading) {
      startLoading();
    } else {
      endLoading();
    }
  }, [getStylesIsLoading, updateStyleIsLoading, createStyleIsLoading]);

  useEffect(() => {
    if (childType) {
      const item = defaultLayerItem?.style.props.find((el: any) => el.name === childType)!;
      setColor(item.color || defaultLayerItem?.style?.color);
      setLabelVisibility(!!item.isLabelVisible);
      setSelectedShape(
        { name: item?.shapeName, svg: item?.shapeForm }
        || shapes.find(shape => shape.name === defaultLayerItem?.style?.shapeName)
        || shapes.find(shape => shape.name === item?.shapeName)
        || shapes[0]);
    } else {
      setColor(defaultLayerItem?.style?.color);
      setLabelVisibility(defaultLayerItem?.style?.isLabelVisible);
      setSelectedShape(
        { name: defaultLayerItem?.style?.shapeName, svg: defaultLayerItem?.style?.shapeForm }
        || shapes.find(shape => shape.name === defaultLayerItem?.style?.shapeName)
        || shapes[0]);
    }

  }, [selectedLayer?.layer_type, childType]);


  const updatePointLayerStyle = async (chosenColor: string = color, chosenShape: Shape = selectedShape) => {
    if (!map || !stylesData) return;

    const nextStyles = [...stylesData];

    const layerItemIndex = nextStyles.findIndex(item => getGeojsonLayerId(selectedLayer?.layer_type || '') === item.style.layerId);

    if (childType) {
      const obj = nextStyles[layerItemIndex].style.props.find((item: { name: string; }) => item.name === childType)!;
      const indexInPropsArr = nextStyles[layerItemIndex].style.props.findIndex((item: { name: string; }) => item.name === childType);
      const newStyles = {
        ...obj,
        color: chosenColor,
        shapeName: chosenShape.name,
        shapeForm: chosenShape.svg,
        isLabelVisible: isLabelVisible
      }!;

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
          color: chosenColor, shapeName: chosenShape.name, shapeForm: chosenShape.svg, isLabelVisible: isLabelVisible
        }
      };
    }


    const stylesDataForSelectedLayer = stylesData.find((el) => el.layer === selectedLayer?.layer_type);
    // Applying the updated styles to the map
    await applyPointsStyles(nextStyles, selectedLayer!.layer_type, map, layerItemIndex);

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
  };

  useEffect(() => {
    // Whenever the color or selectedShape changes, we update the map style
    updatePointLayerStyle(color, selectedShape);
  }, [color, selectedShape, isLabelVisible]);

  return (<>
    <div className={styles.stylePointPopup} data-testid="style-point-popup">
      <div className={styles.titleBox}>
        <h1 className={styles.subheading}>{selectedLayer?.layer_type.split('_').map((el) => el[0].toUpperCase() + el.slice(1)).join(' ')} {childType && '> ' + childType}</h1>
      </div>
      <div className={styles.stylePointPopupWrapper}>
        <PointColours color={color} setColor={setColor} />
        <Shapes color={color} shape={selectedShape} setSelectedShape={setSelectedShape} />
        <LabelText labelVisibility={isLabelVisible} setLabelVisibility={setLabelVisibility} />
        <div className={styles.close} onClick={() => onClose()} data-testid="style-point-popup-close">
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

export default StylePointPopup;

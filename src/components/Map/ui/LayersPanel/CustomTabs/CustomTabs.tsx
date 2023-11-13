import React, { useEffect, useState } from "react";
import styles from './CustomTabs.module.scss';
import classNames from "classnames";
import { LayersTree } from "../LayersTree";
import { StyleLinePopup } from "../StyleLinePopup";
import { StylePointPopup } from "../StylePointPopup";
import { mapAPI } from "services/MapService";
import { useParams } from "react-router";
import { useAuth } from "hooks/useAuth";
import { CustomCheckbox } from "../CustomInputs";
import { LineIndicator, PointIndicator } from "../Indicator";
import { Layer, LayerType } from "models/Map";
import { Basemap } from "../Basemap";
import { useMap } from "app/providers/MapProvider";
import { applyLinesStyles, applyPointsStyles } from "components/Map/styles/applyStyles";
import { LineLayerStyle, PointLayerStyle, defaultStyles } from "components/Map/styles/defaultStyles";
import { stylesAPI } from "services/StylesService";
import { CustomPointCheckbox } from "./CustomPointCheckbox";
import { getArrayOfUniqueValues } from "utils/arrayOfUniqueValues";
import { CustomLineCheckbox } from "./CustomLineCheckbox";
import { hideVectorLayer, showVectorLayer } from "components/Map/hooks/useRefreshDataLayers/setZoomLayersVisibility";
import { getGeojsonLayerId, getGeojsonSourceId } from "components/Map/resources/getId";
import { TOGGLE_LAYER_EVENT } from "components/Map/utils/constants";

enum ActiveTab {
    LAYERS = 'LAYERS',
    POINTS = 'POINTS',
    BASEMAP = 'BASEMAP'
};

interface Props {
    selectedLayer: Layer | null;
    setSelectedLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
}

const CustomTabs: React.FC<Props> = ({ selectedLayer, setSelectedLayer }) => {
    const params = useParams();
    const { token } = useAuth();
    const { map, startLoading, endLoading, geojsonData } = useMap();
    const { data: stylesData, error: getStylesError, isLoading: getStylesIsLoading } = stylesAPI.useGetStylesQuery();
    const [updateStyle, { error: updateStyleError, isLoading: updateStyleIsLoading, reset: updateStyleReset }] = stylesAPI.useUpdateStyleMutation();
    const [createStyle, { error: createStyleError, isLoading: createStyleIsLoading, reset: createStyleReset }] = stylesAPI.useCreateStyleMutation();

    const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.POINTS);
    const [childClick, setChildClick] = useState<string>('');

    const { data: layers, error: getLayersError, isLoading: getLayersIsLoading } = mapAPI.useGetLayersQuery(
        { project_uuid: params.param3 || '' },
        { skip: !params.param3 }
    );

    useEffect(() => {
        if (getStylesIsLoading || updateStyleIsLoading || createStyleIsLoading || getLayersIsLoading) {
            startLoading();
        } else {
            endLoading();
        }
    }, [getStylesIsLoading, updateStyleIsLoading, createStyleIsLoading, getLayersIsLoading]);

    const toggleLayerVisibility = async (layer: Layer, child: string | undefined) => {
        if (!map || !stylesData) return;
        const nextStyles = [...stylesData];

        const layerItemIndex = nextStyles.findIndex(item => getGeojsonLayerId(layer.layer_type) === item.style.layerId);
        if (child) {
            let foundedChildStyleObj;
            if (nextStyles[layerItemIndex].style.type === 'LineString') {
                foundedChildStyleObj = nextStyles[layerItemIndex].style.props.find((el: any) => el.name === child)
            } else {
                foundedChildStyleObj = nextStyles[layerItemIndex].style.props.find((el: any) => el.name === child)

            }
            const indexInPropsArr = nextStyles[layerItemIndex].style.props.findIndex((item: { name: string; }) => item.name === child);

            const newStyles = { ...foundedChildStyleObj, isVisible: !foundedChildStyleObj!.isVisible }!;
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
                    ...nextStyles[layerItemIndex].style,
                    isVisible: !nextStyles[layerItemIndex].style.isVisible
                },
            };

            const layerIsHidden = !stylesData[layerItemIndex].style.isVisible;
            const layerDoesntExist = !(getGeojsonSourceId(layer.layer_type) in geojsonData);

            if (layerIsHidden && layerDoesntExist) {
                document.dispatchEvent(new CustomEvent(TOGGLE_LAYER_EVENT, { detail: { layer } }));
            }
        }

        const isPoint = nextStyles[layerItemIndex].style.type === 'Point';
        const isLine = nextStyles[layerItemIndex].style.type === 'LineString';

        isPoint && await applyPointsStyles(nextStyles, layer.layer_type, map, layerItemIndex);
        isLine && await applyLinesStyles(nextStyles, layer.layer_type, map, layerItemIndex);

        const stylesDataForSelectedLayer = stylesData.find((el) => el.layer === layer?.layer_type);

        // localStorage.setItem('TEST_SAVE_LAYERS', JSON.stringify(nextStyles));

        if (stylesDataForSelectedLayer) {
            const newStylesDataForSelectedLayer = {
                uuid: stylesDataForSelectedLayer?.uuid || '',
                layer: layer?.layer_type,
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
                layer: layer?.layer_type as LayerType,
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
    }

    const pointLayers = layers?.filter((layer) => layer.geom_type === 'Point')
        .map((layer) => {
            const layerItem = (stylesData?.map(item => item.style) || defaultStyles).find(item => getGeojsonLayerId(layer.layer_type) === item.layerId)!;

            return <CustomPointCheckbox key={layer.layer_type}
                layer={layer}
                layerItem={layerItem}
                toggleLayerVisibility={toggleLayerVisibility}
                setSelectedLayer={setSelectedLayer}
                layerChildren={(layerItem as PointLayerStyle)?.props || []}
                setChildClick={setChildClick}
            />
        });

    const lineLayers = layers?.filter((layer) => layer.geom_type === 'LineString')
        .map((layer) => {
            const layerItem = (stylesData?.map(item => item.style) || defaultStyles).find(item => getGeojsonLayerId(layer.layer_type) === item.layerId)!;

            return <CustomLineCheckbox key={layer.layer_type}
                layer={layer}
                layerItem={layerItem}
                toggleLayerVisibility={toggleLayerVisibility}
                setSelectedLayer={setSelectedLayer}
                layerChildren={(layerItem as LineLayerStyle)?.props || []}
                setChildClick={setChildClick}
            />
        });

    const items = [
        {
            key: ActiveTab.LAYERS,
            label: 'Layers',
            children: <>
                <LayersTree />
            </>,
        },
        {
            key: ActiveTab.POINTS,
            label: 'Points',
            children: <>
                <div className={styles.drawerSection}>
                    <h3 className={styles.title}>Point</h3>
                    <div>
                        {pointLayers}
                    </div>
                    <hr className={styles.drawerSeparator} />
                    <h3 className={styles.title}>Lines</h3>
                    <div>
                        {lineLayers}
                    </div>
                </div>
                {
                    (selectedLayer && selectedLayer.geom_type === 'Point') &&
                    <StylePointPopup
                        selectedLayer={selectedLayer}
                        onClose={() => setSelectedLayer(null)}
                        childType={childClick}
                    />
                }
                {
                    (selectedLayer && selectedLayer.geom_type === 'LineString') &&
                    <StyleLinePopup selectedLayer={selectedLayer}
                        onClose={() => setSelectedLayer(null)}
                        childType={childClick} />
                }
            </>,
        },
        {
            key: ActiveTab.BASEMAP,
            label: 'Basemap',
            children: <>
                <div className={styles.drawerSection}>
                    <h3 className={styles.title}>Point</h3>
                    <div>
                        <Basemap />
                    </div>
                </div>
            </>,
        },
    ];

    const tabsButton = items.map((el) => {
        return <button
            key={el.key}
            onClick={() => setActiveTab(el.key)}
            className={classNames(styles.tabButton, {
                [styles.tabButtonActive]: activeTab === el.key
            })}
            data-testid="Custom-tab-button"
        >{el.label}</button>
    });

    const tabsChildren = items.map((el) => {
        return activeTab === el.key && <React.Fragment key={el.key}>
            <div data-testid="Custom-tab-children-container">
                {el.children}
            </div>
        </React.Fragment>
    });

    return <div data-testid="Custom-tab-container" className={styles.tabContainer}>
        <div className={styles.tabButtonContainer}>
            {tabsButton}
        </div>
        <div className={styles.tabChildrenContainer}>
            {tabsChildren}
        </div>
    </div>
}

export default CustomTabs;

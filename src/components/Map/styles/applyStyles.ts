import { Layer, LayerType } from "models/Map";
import { getLayerColor } from "./colours";
import { generateImages } from "./generateImages";
import { shapes } from "./shapes";
import mapboxgl from "mapbox-gl";
import { LineLayerStyle, LineType, PointLayerStyle } from "./defaultStyles";
import { GEOJSON_ZOOM_THRESHOLD } from "../utils/constants";
import { getGeojsonLayerId, getGeojsonLayerLabelId, getVectorLayerId } from "../resources/getId";
import { Style, Styles } from "models/Styles";

// each layer has a lot of properties, we just choose one to iterate over
const styleByProp = {
    infra_point: 'name',
    infra_line: 'edge_category',// 'dig_type'
    nodes: 'node_type',
    cable: 'cable_type',
    tube: 'tube_type',
    subduct: 'subduct_type',
    properties: '',
    fibre: ''
}

export const applyPointsStyles = async (styles: Styles[], layer_type: LayerType, map: mapboxgl.Map, i: number) => {
    const zoom = map.getZoom();
    const zoomThresholdReached = zoom >= GEOJSON_ZOOM_THRESHOLD;
    // const existedLayerStyle = styles.find(item => (item.style?.layerId === getGeojsonLayerId(layer_type)));
    const existedLayerStyle = styles.find(item => item.style?.layerId === getGeojsonLayerId(layer_type));

    if (existedLayerStyle) {
        const svg = existedLayerStyle.style.shapeForm.replace('%COLOR%', existedLayerStyle.style.color);
        const imageId = await generateImages(map, svg, layer_type);

        if (existedLayerStyle.style.props && existedLayerStyle.style.props.length) {

            const arrayOfvisibility = existedLayerStyle.style.props.map((el: any) => {
                let visibility = el.isVisible;
                return [el.name, visibility]
            }).flat(1);
            // existedLayerStyle.style.props.length && map.setFilter(getGeojsonLayerId(layer_type), [
            //     'match',
            //     ['get', styleByProp[layer_type]],
            //     ...arrayOfvisibility,
            //     false]);
            if (existedLayerStyle.style.props.length) {
                //apply to geojson prop
                map.setFilter(getGeojsonLayerId(layer_type), [
                    'match',
                    ['get', styleByProp[layer_type]],
                    ...arrayOfvisibility,
                    false]);
                //apply to vector prop
                map.setFilter(getVectorLayerId(layer_type), [
                    'match',
                    ['get', styleByProp[layer_type]],
                    ...arrayOfvisibility,
                    false]);
            };

            const arrayWIthIcons = await Promise.all(
                existedLayerStyle.style.props.map(async (el: any) => {
                    let svg = el.shapeForm?.replace('%COLOR%',el.color || existedLayerStyle.style.color);

                    if (!svg) {
                        svg = existedLayerStyle.style.shapeForm.replace('%COLOR%', existedLayerStyle.style.color);
                    }
                    // const svg = existedLayerStyle.style.shapeForm.replace('%COLOR%', existedLayerStyle.style.color)

                    // const svgIcon = svg!.svg(el.color || existedLayerStyle.style.color);
                    const imageId = await generateImages(map, svg, el.name);

                    return imageId;
                })
            );
            const iconsMatchArr = existedLayerStyle.style.props.map((el: any, i: number) => {
                return [el.name, ['literal', arrayWIthIcons[i]]]
            }).flat(1);


            //geojson
            map.setLayoutProperty(getGeojsonLayerId(layer_type), 'icon-image', [
                'match',
                ['get', styleByProp[layer_type]],
                ...iconsMatchArr,
                ['literal', imageId]
            ]);
            //vector
            map.setLayoutProperty(getVectorLayerId(layer_type), 'icon-image', [
                'match',
                ['get', styleByProp[layer_type]],
                ...iconsMatchArr,
                ['literal', imageId]
            ]);

            const arrayOfText = existedLayerStyle.style.props.map((el: any) => {
                let value = el.isLabelVisible ? el.name : '';
                return [el.name, value]
            }).flat(1);

            const getLabelSetUp = () => {
                if (existedLayerStyle.style.isLabelVisible) {
                    return [
                        'match',
                        ['get', styleByProp[layer_type]],
                        ...arrayOfText,
                        // 'DN', 'SN', 
                        // 'ZN', '', // way how i hide label text
                        existedLayerStyle.style.isLabelVisible ? `${layer_type}` : ''
                    ]
                } else {
                    return ''
                }
            }

            // map.setLayoutProperty(getGeojsonLayerId(layer_type), 'text-field', [
            //     'match',
            //     ['get', obj[layer_type]],
            //     ...arrayOfText,
            //     // 'DN', 'SN', 
            //     // 'ZN', '', // way how i hide label text
            //     existedLayerStyle.isLabelVisible ? `${layer_type}` : ''
            // ]);

            map.setLayoutProperty(getGeojsonLayerId(layer_type), 'text-field', getLabelSetUp());
        } else {
            //geojson
            map.setLayoutProperty(getGeojsonLayerId(layer_type), 'icon-image', imageId);
            map.setLayoutProperty(getGeojsonLayerId(layer_type), 'text-field', existedLayerStyle.style.isLabelVisible ? `${layer_type}` : '');
            //vector
            map.setLayoutProperty(getVectorLayerId(layer_type), 'icon-image', imageId);
        }

        const geojsonVisibility = (existedLayerStyle.style.isVisible && zoomThresholdReached) ? 'visible' : 'none';
        const vectorVisibility = (existedLayerStyle.style.isVisible && !zoomThresholdReached) ? 'visible' : 'none';
        map.setLayoutProperty(getGeojsonLayerId(layer_type), 'visibility', geojsonVisibility);
        map.setLayoutProperty(getVectorLayerId(layer_type), 'visibility', vectorVisibility);
    } else {
        // Default styling if none exist
        const svg = shapes[0].svg.replace('%COLOR%', getLayerColor(i));
        const imageId = await generateImages(map, svg, layer_type);
        const geojsonVisibility = zoomThresholdReached ? 'visible' : 'none';
        const vectorVisibility = !zoomThresholdReached ? 'visible' : 'none';
        // geojson
        map.setLayoutProperty(getGeojsonLayerId(layer_type), 'icon-image', imageId);
        map.setLayoutProperty(getGeojsonLayerId(layer_type), 'visibility', geojsonVisibility);
        // vector
        map.setLayoutProperty(getVectorLayerId(layer_type), 'icon-image', imageId);
        map.setLayoutProperty(getVectorLayerId(layer_type), 'visibility', vectorVisibility);
    }
}

export const applyLinesStyles = (styles: Styles[], layer_type: LayerType, map: mapboxgl.Map, i: number) => {

    const zoom = map.getZoom();
    const zoomThresholdReached = zoom >= GEOJSON_ZOOM_THRESHOLD;
    const existedLayerStyle = styles.find(item => item.style?.layerId === getGeojsonLayerId(layer_type));

    if (existedLayerStyle) {
        //set lines properties
        const lineType = (item: {
            name?: string;
            type: "LineString";
            layerId: string;
            color?: string | undefined;
            opacity?: number | undefined;
            thickness?: number | undefined;
            lineType?: LineType | undefined;
            isVisible?: boolean | undefined;
        }) => item.lineType === 'dashed' ? [2, 2] : item.lineType === 'dotted' ? [1, 1] : [];

        // if layer has sublayers, we should style them using match syntax
        // if layer did not have sublayers, style them simple way
        if (existedLayerStyle.style.props && existedLayerStyle.style.props?.length) {
            const arrayOfColors = existedLayerStyle.style.props.map((el: any) => {
                let color = el.color;

                if (!color) {
                    color = existedLayerStyle.style.color;
                }
                return [el.name, color]
            }).flat(1);
            //apply to geojson prop
            map.setPaintProperty(getGeojsonLayerId(layer_type), 'line-color', [
                'match',
                ['get', styleByProp[layer_type]],
                ...arrayOfColors,
                existedLayerStyle.style.color,
            ]);
            //apply to vector prop
            map.setPaintProperty(getVectorLayerId(layer_type), 'line-color', [
                'match',
                ['get', styleByProp[layer_type]],
                ...arrayOfColors,
                existedLayerStyle.style.color,
            ]);
            const arrayOfOpacity = existedLayerStyle.style.props.map((el: any) => {
                let opacity = el.opacity;

                if (!opacity) {
                    opacity = existedLayerStyle.style.opacity;
                }
                return [el.name, opacity]
            }).flat(1);
            //apply to geojson prop
            map.setPaintProperty(getGeojsonLayerId(layer_type), 'line-opacity', [
                'match',
                ['get', styleByProp[layer_type]],
                ...arrayOfOpacity,
                existedLayerStyle.style.opacity,
            ]);
            //apply to vector prop
            map.setPaintProperty(getVectorLayerId(layer_type), 'line-opacity', [
                'match',
                ['get', styleByProp[layer_type]],
                ...arrayOfOpacity,
                existedLayerStyle.style.opacity,
            ]);

            const arrayOfThickness = existedLayerStyle.style.props.map((el: any) => {
                let thickness = el.thickness;

                if (!thickness) {
                    thickness = existedLayerStyle.style.thickness;
                }
                return [el.name, thickness]
            }).flat(1);
            //apply to geojson prop
            map.setPaintProperty(getGeojsonLayerId(layer_type), 'line-width', [
                'match',
                ['get', styleByProp[layer_type]],
                ...arrayOfThickness,
                existedLayerStyle.style.thickness,
            ]);
            //apply to vector prop
            map.setPaintProperty(getVectorLayerId(layer_type), 'line-width', [
                'match',
                ['get', styleByProp[layer_type]],
                ...arrayOfThickness,
                existedLayerStyle.style.thickness,
            ]);

            const arrayOfDasharray = existedLayerStyle.style.props.map((el: any) => {
                let lineTypeVar = lineType(el);

                if (!el.lineType) {
                    lineTypeVar = lineType(existedLayerStyle.style)
                }

                return [el.name, ['literal', lineTypeVar]];
            }).flat(1);
            //apply to geojson prop
            map.setPaintProperty(getGeojsonLayerId(layer_type), 'line-dasharray',
                [
                    'match',
                    ['get', styleByProp[layer_type]],
                    ...arrayOfDasharray,
                    ['literal', lineType(existedLayerStyle.style)]
                ]
            );
            //apply to vector prop
            map.setPaintProperty(getGeojsonLayerId(layer_type), 'line-dasharray',
                [
                    'match',
                    ['get', styleByProp[layer_type]],
                    ...arrayOfDasharray,
                    ['literal', lineType(existedLayerStyle.style)]
                ]
            );
            const arrayOfvisibility = existedLayerStyle.style.props.map((el: any) => {
                let visibility = el.isVisible;
                return [el.name, visibility]
            }).flat(1);

            if (existedLayerStyle.style.props.length) {
                //apply to geojson prop
                map.setFilter(getGeojsonLayerId(layer_type), [
                    'match',
                    ['get', styleByProp[layer_type]],
                    ...arrayOfvisibility,
                    false]);
                //apply to vector prop
                map.setFilter(getVectorLayerId(layer_type), [
                    'match',
                    ['get', styleByProp[layer_type]],
                    ...arrayOfvisibility,
                    false]);
            }

        } else {
            //geojson
            map.setPaintProperty(getGeojsonLayerId(layer_type), 'line-color', existedLayerStyle.style.color);
            map.setPaintProperty(getGeojsonLayerId(layer_type), 'line-opacity', existedLayerStyle.style.opacity);
            map.setPaintProperty(getGeojsonLayerId(layer_type), 'line-width', existedLayerStyle.style.thickness);
            map.setPaintProperty(getGeojsonLayerId(layer_type), 'line-dasharray', lineType(existedLayerStyle.style));

            //vector
            map.setPaintProperty(getVectorLayerId(layer_type), 'line-color', existedLayerStyle.style.color);
            map.setPaintProperty(getVectorLayerId(layer_type), 'line-opacity', existedLayerStyle.style.opacity);
            map.setPaintProperty(getVectorLayerId(layer_type), 'line-width', existedLayerStyle.style.thickness);
            map.setPaintProperty(getVectorLayerId(layer_type), 'line-dasharray', lineType(existedLayerStyle.style));
        }
        const geojsonVisibility = (existedLayerStyle.style.isVisible && zoomThresholdReached) ? 'visible' : 'none';
        const vectorVisibility = (existedLayerStyle.style.isVisible && !zoomThresholdReached) ? 'visible' : 'none';
        //geojson
        map.setLayoutProperty(getGeojsonLayerId(layer_type), 'visibility', geojsonVisibility);
        //vector
        map.setLayoutProperty(getVectorLayerId(layer_type), 'visibility', vectorVisibility);

        let labelsVisibility = 'none';

        if (existedLayerStyle.style.isVisible && zoomThresholdReached) {
            if (existedLayerStyle.style.isLabelVisible) {
                labelsVisibility = 'visible'
            }
        }
        map.setLayoutProperty(getGeojsonLayerLabelId(layer_type), 'visibility', labelsVisibility);
    } else {
        // Default styling if none exist
        const defaultColor = getLayerColor(i);
        const geojsonVisibility = zoomThresholdReached ? 'visible' : 'none';
        const vectorVisibility = !zoomThresholdReached ? 'visible' : 'none';
        //geojson
        map.setPaintProperty(getGeojsonLayerId(layer_type), 'line-color', defaultColor);
        map.setPaintProperty(getGeojsonLayerId(layer_type), 'line-opacity', 1);
        map.setPaintProperty(getGeojsonLayerId(layer_type), 'line-width', 3);
        map.setLayoutProperty(getGeojsonLayerId(layer_type), 'visibility', geojsonVisibility);
        //vector
        map.setPaintProperty(getVectorLayerId(layer_type), 'line-color', defaultColor);
        map.setPaintProperty(getVectorLayerId(layer_type), 'line-opacity', 1);
        map.setPaintProperty(getVectorLayerId(layer_type), 'line-width', 3);
        map.setLayoutProperty(getVectorLayerId(layer_type), 'visibility', vectorVisibility);
    }
}

export const applyStyles = async (map: mapboxgl.Map, layers: Layer[], styles: any) => {
    for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];

        if (layer.geom_type === 'Point') {
            applyPointsStyles(styles, layer.layer_type, map, i);
        } else if (layer.geom_type === 'LineString') {
            applyLinesStyles(styles, layer.layer_type, map, i);
        }
    }
    return styles;
};

import { mapAPI } from "services/MapService";
import { colours } from "./colours";
import { useParams } from "react-router-dom";
import { useAuth } from "hooks/useAuth";
import { LayerType } from "models/Map";
import { getGeojsonLayerId } from "../resources/getId";
export type LineType = 'solid' | 'dashed' | 'dotted';
export interface PointLayerStyle {
    type: 'Point',
    layerId: string,
    color: string,
    shapeName: string,
    shapeForm: string,
    isVisible: boolean,
    isLabelVisible: boolean
    props: {
        name: string,
        type: 'Point',
        layerId: string,
        color?: string,
        shapeForm?: string,
        shapeName?: string,
        isVisible?: boolean,
        isLabelVisible?: boolean
    }[]
};
export interface LineLayerStyle {
    type: 'LineString',
    layerId: string,
    color: string,
    opacity: number,
    thickness: number,
    lineType: LineType,
    isVisible: boolean,
    isLabelVisible: boolean
    props: {
        name: string,
        type: 'LineString',
        layerId: string,
        color?: string,
        opacity?: number,
        thickness?: number,
        lineType?: LineType,
        isVisible?: boolean,
        isLabelVisible?: boolean
    }[]
};

// export const defaultStyles: (PointLayerStyle | LineLayerStyle)[] = [
//     //point layers styles
//     { type: 'Point', layerId: getGeojsonLayerId('infra_point'), color: colours[0].value, shapeName: 'Circle', isVisible: true },
//     { type: 'Point', layerId: getGeojsonLayerId('nodes'), color: colours[1].value, shapeName: 'Circle', isVisible: true },
//     { type: 'Point', layerId: getGeojsonLayerId('properties'), color: colours[2].value, shapeName: 'Circle', isVisible: true },
//     //line layers styles
//     { type: 'LineString', layerId: getGeojsonLayerId('infra_line'), color: colours[0].value, opacity: 1, thickness: 10, lineType: 'dashed', isVisible: true },
//     { type: 'LineString', layerId: getGeojsonLayerId('subduct'), color: colours[1].value, opacity: 1, thickness: 3, lineType: 'solid', isVisible: true },
//     { type: 'LineString', layerId: getGeojsonLayerId('tube'), color: colours[2].value, opacity: 1, thickness: 3, lineType: 'solid', isVisible: true },
//     { type: 'LineString', layerId: getGeojsonLayerId('fibre'), color: colours[3].value, opacity: 1, thickness: 3, lineType: 'solid', isVisible: true },
//     { type: 'LineString', layerId: getGeojsonLayerId('cable'), color: colours[4].value, opacity: 1, thickness: 3, lineType: 'solid', isVisible: true },
// ];

export const defaultStyles: (PointLayerStyle | LineLayerStyle)[] = [
    //point layers styles
    {
        type: 'Point', layerId: getGeojsonLayerId('infra_point'),
        color: colours[0].value,
        shapeName: 'Circle',
        shapeForm: `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="24" fill="%COLOR%" stroke="#FFF" strokeWidth="8%" strokeLinejoin="round" /></svg>`,
        isVisible: true,
        isLabelVisible: true,
        props: [
            { name: 'POLE', type: 'Point', layerId: getGeojsonLayerId('infra_point'), isVisible: true, isLabelVisible: true },
            { name: 'new_building_vertex', type: 'Point', layerId: getGeojsonLayerId('infra_point'), isVisible: true, isLabelVisible: true },
            { name: 'built_chamber', type: 'Point', layerId: getGeojsonLayerId('infra_point'), isVisible: true, isLabelVisible: true },
            { name: 'new_vertex', type: 'Point', layerId: getGeojsonLayerId('infra_point'), isVisible: true, isLabelVisible: true },
            { name: 'BURIED', type: 'Point', layerId: getGeojsonLayerId('infra_point'), isVisible: true, isLabelVisible: true },
            { name: 'JOINTING CHAMBER', type: 'Point', layerId: getGeojsonLayerId('infra_point'), isVisible: true, isLabelVisible: true },
            { name: 'OSP', type: 'Point', layerId: getGeojsonLayerId('infra_point'), isVisible: true, isLabelVisible: true },
            { name: 'CABINET', type: 'Point', layerId: getGeojsonLayerId('infra_point'), isVisible: true, isLabelVisible: true },
            { name: 'te', type: 'Point', layerId: getGeojsonLayerId('infra_point'), isVisible: true, isLabelVisible: true },
        ]
    },
    {
        type: 'Point',
        layerId: getGeojsonLayerId('nodes'),
        color: colours[1].value,
        shapeName: 'Circle',
        shapeForm: `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="24" fill="%COLOR%" stroke="#FFF" strokeWidth="8%" strokeLinejoin="round" /></svg>`,
        isVisible: true,
        isLabelVisible: true,
        props: [
            { name: 'DN', type: 'Point', layerId: getGeojsonLayerId('nodes'), isVisible: true, isLabelVisible: true },
            { name: 'AN', type: 'Point', layerId: getGeojsonLayerId('nodes'), isVisible: true, isLabelVisible: true },
            { name: 'ZN', type: 'Point', layerId: getGeojsonLayerId('nodes'), isVisible: true, isLabelVisible: true },
            { name: 'ZAN', type: 'Point', layerId: getGeojsonLayerId('nodes'), isVisible: true, isLabelVisible: true },
            { name: 'DYN', type: 'Point', layerId: getGeojsonLayerId('nodes'), isVisible: true, isLabelVisible: true },
            { name: 'DAN', type: 'Point', layerId: getGeojsonLayerId('nodes'), isVisible: true, isLabelVisible: true },
            { name: 'ZYN', type: 'Point', layerId: getGeojsonLayerId('nodes'), isVisible: true, isLabelVisible: true },
            { name: 'TE', type: 'Point', layerId: getGeojsonLayerId('nodes'), isVisible: true, isLabelVisible: true },
        ]
    },
    {
        type: 'Point',
        layerId: getGeojsonLayerId('properties'),
        color: colours[2].value,
        shapeName: 'Circle',
        shapeForm: `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="24" fill="%COLOR%" stroke="#FFF" strokeWidth="8%" strokeLinejoin="round" /></svg>`,
        isVisible: true,
        isLabelVisible: true,
        props: []

    },
    //line layers styles
    {
        type: 'LineString', layerId: getGeojsonLayerId('infra_line'), color: colours[0].value, opacity: 1, thickness: 10, lineType: 'dashed', isVisible: true, isLabelVisible: true,
        props: [
            { name: 'aerial', type: 'LineString', layerId: getGeojsonLayerId('infra_line'), isVisible: true, isLabelVisible: true, },
            { name: 'other', type: 'LineString', layerId: getGeojsonLayerId('infra_line'), isVisible: true, isLabelVisible: true, },
            { name: 'built_duct', type: 'LineString', layerId: getGeojsonLayerId('infra_line'), isVisible: true, isLabelVisible: true, },
            { name: 'duct', type: 'LineString', layerId: getGeojsonLayerId('infra_line'), isVisible: true, isLabelVisible: true, },
        ]
    },
    {
        type: 'LineString', layerId: getGeojsonLayerId('subduct'), color: colours[1].value, opacity: 1, thickness: 3, lineType: 'solid', isVisible: true, isLabelVisible: true,
        props: [
            { name: "bundle_3x3", type: 'LineString', layerId: getGeojsonLayerId('subduct'), isVisible: true, isLabelVisible: true, },]
    },
    {
        type: 'LineString', layerId: getGeojsonLayerId('tube'), color: colours[2].value, opacity: 1, thickness: 3, lineType: 'solid', isVisible: true, isLabelVisible: true,
        props: [
            { name: "mm11", type: 'LineString', layerId: getGeojsonLayerId('tube'), isVisible: true, isLabelVisible: true, },
            { name: "mm16", type: 'LineString', layerId: getGeojsonLayerId('tube'), isVisible: true, isLabelVisible: true, },
            { name: "mm6", type: 'LineString', layerId: getGeojsonLayerId('tube'), isVisible: true, isLabelVisible: true, },]
    },
    {
        type: 'LineString', layerId: getGeojsonLayerId('fibre'), color: colours[3].value, opacity: 1, thickness: 3, lineType: 'solid', isVisible: true, isLabelVisible: true,
        props: []
    },
    {
        type: 'LineString', layerId: getGeojsonLayerId('cable'), color: colours[4].value, opacity: 1, thickness: 3, lineType: 'solid', isVisible: true, isLabelVisible: true,
        props: [
            { name: "drop", type: 'LineString', layerId: getGeojsonLayerId('cable'), isVisible: true, isLabelVisible: true, },
            { name: "aerial", type: 'LineString', layerId: getGeojsonLayerId('cable'), isVisible: true, isLabelVisible: true, },
            { name: "f48", type: 'LineString', layerId: getGeojsonLayerId('cable'), isVisible: true, isLabelVisible: true, },
            { name: "f96", type: 'LineString', layerId: getGeojsonLayerId('cable'), isVisible: true, isLabelVisible: true, },
            { name: "f24", type: 'LineString', layerId: getGeojsonLayerId('cable'), isVisible: true, isLabelVisible: true, },
        ]
    },
];
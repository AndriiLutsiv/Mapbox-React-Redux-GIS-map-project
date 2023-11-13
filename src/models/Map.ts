import * as turf from '@turf/turf';

export type Geometry = turf.AllGeoJSON

export type LayerType = 'cable' | 'infra_point' | 'nodes' | 'properties' | 'fibre' | 'infra_line' | 'subduct' | 'tube';
//get Layers
export interface Layer {
    layer_type: LayerType,
    geom_type: 'Point' | 'LineString',
    project_uuid: string
}

export interface GetLayers {
    project_uuid: string
}

export type GetLayersResponse = Layer[]

//get Layer
export interface GetLayer {
    project_uuid: string,
    layer_type: LayerType,
    polygon?: {
        type: string,
        coordinates: any[]
    }
}

export interface GetLayerResponse {
    type: string,
    features: [
        {
            type: turf.Feature,
            geometry: {
                type: any,
                coordinates: [number, number]
            },
            _key: string,
            _rev: string,
            properties: any
        }
    ]
}
import * as turf from '@turf/turf';

export type Geometry = turf.AllGeoJSON

export interface Area {
  uuid: string
  name: string
  description: string
  geometry: Geometry
}

// get areas
export type GetAreasResponse = Area[];

//get area
export type GetAreaResponse = Area;

//create area
export interface CreateAreaErrorResponse {
  data: {
    detail: string;
  };
}

export type CreateAreaResponse = Area;

export interface CreateArea {
    name: string,
    description: string,
    geometry: Geometry
}

//delete area
export type DeleteAreaResponse = Area;

// update area 
export type UpdateAreaResponse = Area;

export interface UpdateAreaErrorResponse {
  data: {
    detail: string;
  };
}

export interface UpdateArea {
    uuid: string,
    name: string,
    description: string,
    geometry: Geometry
  
}

export interface UpdateAreaErrorResponse {
  data: {
    detail: string;
  };
}
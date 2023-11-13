export type LayerType = "infra_line" | "infra_point" | "properties" | "nodes" | "fibre" | "subduct" | "tube" | "cable";

export interface Styles {
  uuid: string,
  layer: LayerType,
  style: any
}

// get styles
export type GetStylesResponse = Styles[];

//get style
export interface Style {
  layer: LayerType
}
export type GetStyleResponse = Styles;

//create style
export interface CreateAreaErrorResponse {
  data: {
    detail: string;
  };
}

export type CreateStyleResponse = Styles;

export interface CreateStyle {
  layer: LayerType,
  style: any,
}

// update style 
export type UpdateStyleResponse = Styles;

export interface UpdateStyleErrorResponse {
  data: {
    detail: string;
  };
}

export interface UpdateStyle {
  uuid: string,
  layer?: LayerType,
  style?: any,
}

export interface UpdateStyleErrorResponse {
  data: {
    detail: string;
  };
}
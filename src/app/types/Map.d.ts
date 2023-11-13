declare module Map {

  type Layers = string[];

  interface LayerFeature {
    id: number | string;
    type: 'Feature',
    _key: string;
    _rev?: string;
    _from?: {
      layer_type: string;
      project_uuid: string;
      uuid: string;
    },
    _to?: {
      layer_type: string;
      project_uuid: string;
      uuid: string;
    },
    geometry: {
      type: 'LineString' | 'Point' | 'Polygon',
      coordinates: number[][],
    },
    properties: Record<string, any>
  }

  interface Layer {
    type: 'FeatureCollection',
    features: LayerFeature[],
  }

  interface EditedProperties {
    id: string | number;
    properties: {
      key: string;
      value: string;
    }[];
  }

  interface Stylesheet {
    LINE: Record<StylesheetLineKey, StylesheetLine>;
    POINT: Record<StylesheetPointKey, StylesheetPoint>;
  }

  interface StylesheetLine {
    visible: boolean;
    color: string;
    opacity: number;
    thickness: number;
    type: StyleSheetLineType;
  }
 
  interface StylesheetPoint {
    visible: boolean;
    color: string;
    outline: string;
    opacity: number;
    icons: Partial<Record<StylesheetShapeKey, string>>;
    customIcon?: string;
    icon: StylesheetShapeKey;
  }

  type StyleSheetLineType = 'SOLID' | 'DOTTED' | 'DASHED';

  type StylesheetLineKey = 'DS' | 'ND' | 'NAN';
  
  type StylesheetPointKey = 'BURIED_OTHER' | 'BURIED_RED' | 'BURIED_TEE' | 'CABINET' | 'JOINTING_CHAMBER_JB' | 'JOINTING_CHAMBER_MH' | 'OSP' | 'POLE' | 'BUILT_CHAMBER' | 'NEW_BUILDING_VERTEX' | 'NEW_VERTEX' | 'UPRN'; 

  type StylesheetShapeKey = 'CIRCLE' | 'SQUARE' | 'TRIANGLE' | 'PENTAGON' | 'HEXAGON' | 'STAR' | 'CUSTOM';

  type StylesheetShapes = Partial<Record<StylesheetShapeKey, string>>;

  interface SelectedObjects {
    feature: Map.LayerFeature,
    points: Map.LayerFeature[],
    lines: Map.LayerFeature[],
  }

  type GeometryMode = 'NORMAL' | 'EDIT' | 'ADD';

}

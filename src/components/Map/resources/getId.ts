// get source id
export const getGeojsonSourceId = (layerId: string): string => `data-${layerId}`;
export const getVectorSourceId = (layerId: string): string => `data-${layerId}-vector`;
export const getVectorPlotSource = (layerId: string): string => `data-${layerId}-vector-plot`;

// get layer id
export const getGeojsonLayerId = (layerId: string): string => `layer-${layerId}`;
export const getGeojsonLayerLabelId = (layerId: string): string => `layer-${layerId}-label`;
export const getVectorLayerId = (layerId: string): string =>  `layer-${layerId}-vector`;
export const getVectorPlotLayerId = (layerId: string): string =>  `layer-${layerId}-vector-plot`;
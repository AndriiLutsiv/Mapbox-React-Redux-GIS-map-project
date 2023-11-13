import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GeojsonState {
    geojsonData: Record<string, Map.Layer>;
    clusteredGeojsonData: {
        points: Map.Layer[];
        lines: Map.Layer[];
    };
}

const initialState: GeojsonState = {
    geojsonData: {},
    clusteredGeojsonData: {
        points: [],
        lines: [],
    },
};

const geojsonSlice = createSlice({
    name: 'geojson',
    initialState,
    reducers: {
        setGeojsonData: (state, action: PayloadAction<Record<string, Map.Layer>>) => {
            state.geojsonData = action.payload;
        },
        setClusteredGeojsonData: (state, action: PayloadAction<{ points: Map.Layer[]; lines: Map.Layer[] }>) => {
            state.clusteredGeojsonData = action.payload;
        },
    },
});

export const { setGeojsonData, setClusteredGeojsonData } = geojsonSlice.actions;

export default geojsonSlice.reducer;

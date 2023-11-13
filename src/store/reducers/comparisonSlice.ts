import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

interface ComparisonDataArray {
    id: string;
    area: { value: number; label: string; };
    scenario: { value: number; label: string; };
    projects: { value: number; label: string; }[]
}
const initialState: {
    comparisonData: ComparisonDataArray[],
    comparisonAreaId: null,
    comparisonScenarioId: null,
    comparisonProjectsId: [],
} = {
    comparisonData: [],
    comparisonAreaId: null,
    comparisonScenarioId: null,
    comparisonProjectsId: [],
};

const comparisonSlice = createSlice({
    name: 'comparison',
    initialState,
    reducers: {
        addComparisonData: (state, action) => {
            state.comparisonData.push({
                id: nanoid(),
                area: action.payload.area,
                scenario: action.payload.scenario,
                projects: action.payload.projects,
            });
        },
        deleteItemInComparisonData: (state, action) => {
            const updated = state.comparisonData.filter((el: { id: string; }) => el.id !== action.payload);

            state.comparisonData = updated;
        },
        editComparisonData: (state, action) => {
            const editObj = state.comparisonData.find((el: { id: string; }) => el.id === action.payload.id);
            const index = state.comparisonData.findIndex((el: { id: string; }) => el.id === action.payload.id);

            const newStateArray = [...state.comparisonData];
            editObj!.area = action.payload.area;
            editObj!.projects = action.payload.projects;
            editObj!.scenario = action.payload.scenario;

            newStateArray.splice(index, 1, editObj!);
            state.comparisonData = newStateArray;
        },

        removeComparisonData: (state) => {
            state.comparisonData = [];
        },


        addComparisonAreaId: (state, action) => {
            state.comparisonAreaId = action.payload;
            state.comparisonScenarioId = null;
            state.comparisonProjectsId = [];
        },
        addComparisonScenarioId: (state, action) => {
            state.comparisonScenarioId = action.payload;
            state.comparisonProjectsId = [];
        },
        addComparisonProjectsId: (state, action) => {
            state.comparisonProjectsId = action.payload;
        },
    }
});

export const selectComparisonData = (state: any) => state.comparison.comparisonData;
export const selectComparisonID = (state: any) => state.comparison.comparisonAreaId;

export const { addComparisonData,
    removeComparisonData,
    deleteItemInComparisonData,
    editComparisonData,
    addComparisonAreaId,
    addComparisonScenarioId,
    addComparisonProjectsId } = comparisonSlice.actions;

export default comparisonSlice.reducer;

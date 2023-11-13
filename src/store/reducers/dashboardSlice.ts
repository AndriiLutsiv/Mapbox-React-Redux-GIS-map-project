import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState:{
        areaId: null,
        scenarioId: null,
        projectsId: [],
    },
    reducers: {
        addAreaId: (state, action) => {
            state.areaId = action.payload;
            state.scenarioId = null;
            state.projectsId = [];
        },
        addScenarioId: (state, action) => {
            state.scenarioId = action.payload;
            state.projectsId = [];
        },
        addProjectsId: (state, action) => {
            state.projectsId = action.payload;
        },
    }
});

export const selectDashboard = (state: any) => state.dashboard;

export const { addAreaId, addScenarioId,addProjectsId } = dashboardSlice.actions;

export default dashboardSlice.reducer;

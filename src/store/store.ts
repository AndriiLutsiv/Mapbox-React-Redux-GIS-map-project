import { tokenAPI } from './../services/TokenService';
import { userAPI } from 'services/UserService';
import { combineReducers, configureStore, PreloadedState } from "@reduxjs/toolkit";
import geojsonSlice from './reducers/geojsonSlice';
import { areaAPI } from 'services/AreaService';
import { scenarioAPI } from 'services/ScenarioService';
import { projectAPI } from 'services/ProjectService';
import { mapAPI } from 'services/MapService';
import { scenarioReportAPI } from 'services/ScenarioReportService';
import { projectReportAPI } from 'services/ProjectReportService';
import { projectSummaryReportAPI } from 'services/ProjectSummaryReportService';
import { cashflowAPI } from 'services/CashflowService';
import { workforceAPI } from 'services/WorkforceService';
import { materialsAPI } from 'services/MaterialsService';
import { tasksAPI } from 'services/TaskService';
import { plotCMPAPI } from 'services/PlotCMPAPIService';
import { stylesAPI } from 'services/StylesService';
import { cmpPlotAPI } from 'services/cmpPlotService';
import { pruningAPI } from 'services/ProjectPruningService';
import { broadbandAPI } from 'services/BroadbandService';
import { propertiesAPI } from 'services/PropertiesService';
import { nodeCompletionAPI } from 'services/NodeCompletionService';
import shapesSlice from './reducers/shapesSlice';
import tokenSlice from './reducers/tokenSlice';
import dashboardSlice from './reducers/dashboardSlice';
import comparisonSlice from './reducers/comparisonSlice';

const rootReducer = combineReducers({
    [tokenAPI.reducerPath]: tokenAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [areaAPI.reducerPath]: areaAPI.reducer,
    [scenarioAPI.reducerPath]: scenarioAPI.reducer,
    [projectAPI.reducerPath]: projectAPI.reducer,
    [mapAPI.reducerPath]: mapAPI.reducer,
    [scenarioReportAPI.reducerPath]: scenarioReportAPI.reducer,
    [projectReportAPI.reducerPath]: projectReportAPI.reducer,
    [projectSummaryReportAPI.reducerPath]: projectSummaryReportAPI.reducer,
    [cashflowAPI.reducerPath]: cashflowAPI.reducer,
    [workforceAPI.reducerPath]: workforceAPI.reducer,
    [materialsAPI.reducerPath]: materialsAPI.reducer,
    [tasksAPI.reducerPath]: tasksAPI.reducer,
    [plotCMPAPI.reducerPath]: plotCMPAPI.reducer,
    [stylesAPI.reducerPath]: stylesAPI.reducer,
    [cmpPlotAPI.reducerPath]: cmpPlotAPI.reducer,
    [pruningAPI.reducerPath]: pruningAPI.reducer,
    [broadbandAPI.reducerPath]: broadbandAPI.reducer,
    [propertiesAPI.reducerPath]: propertiesAPI.reducer,
    [nodeCompletionAPI.reducerPath]: nodeCompletionAPI.reducer,
    shapes: shapesSlice,
    geojson: geojsonSlice,
    token: tokenSlice,
    dashboard: dashboardSlice,
    comparison: comparisonSlice
})

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
    return configureStore({
        reducer: rootReducer,
        preloadedState,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware()
                .concat(tokenAPI.middleware,
                    userAPI.middleware,
                    areaAPI.middleware,
                    scenarioAPI.middleware,
                    projectAPI.middleware,
                    mapAPI.middleware,
                    scenarioReportAPI.middleware,
                    projectReportAPI.middleware,
                    projectSummaryReportAPI.middleware,
                    cashflowAPI.middleware,
                    workforceAPI.middleware,
                    materialsAPI.middleware,
                    tasksAPI.middleware,
                    plotCMPAPI.middleware,
                    stylesAPI.middleware,
                    cmpPlotAPI.middleware,
                    pruningAPI.middleware,
                    broadbandAPI.middleware,
                    propertiesAPI.middleware,
                    nodeCompletionAPI.middleware,
                )
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']



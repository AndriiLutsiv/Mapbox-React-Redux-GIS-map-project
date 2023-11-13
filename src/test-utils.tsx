import React, { PropsWithChildren } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import type { PreloadedState } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { tokenAPI } from 'services/TokenService'
import { userAPI } from 'services/UserService'
import { areaAPI } from 'services/AreaService'
import { scenarioAPI } from 'services/ScenarioService'
import { projectAPI } from 'services/ProjectService'
import { MemoryRouter } from 'react-router-dom'
import { scenarioReportAPI } from 'services/ScenarioReportService'
import { projectReportAPI } from 'services/ProjectReportService'
import { projectSummaryReportAPI } from 'services/ProjectSummaryReportService'
import { cashflowAPI } from 'services/CashflowService'
import { workforceAPI } from 'services/WorkforceService'
import { materialsAPI } from 'services/MaterialsService'
import { tasksAPI } from 'services/TaskService'
import { plotCMPAPI } from 'services/PlotCMPAPIService'
import { stylesAPI } from 'services/StylesService'
import { cmpPlotAPI } from 'services/cmpPlotService'
import { pruningAPI } from 'services/ProjectPruningService'
import { propertiesAPI } from 'services/PropertiesService'
import { nodeCompletionAPI } from 'services/NodeCompletionService'
import { mapAPI } from 'services/MapService'
import { broadbandAPI } from 'services/BroadbandService'
import geojsonSlice from 'store/reducers/geojsonSlice'
import shapesSlice from 'store/reducers/shapesSlice'
import tokenSlice from 'store/reducers/tokenSlice'


// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<any>
  store?: any
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = configureStore({
      reducer: {
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
        'geojson': geojsonSlice,
        'shapes': shapesSlice,
        token: tokenSlice,
      },
      preloadedState,
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(
          tokenAPI.middleware,
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
          nodeCompletionAPI.middleware

        ),
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}
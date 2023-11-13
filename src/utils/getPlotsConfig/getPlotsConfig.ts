export const getPlotsConfig = (tableData: any, foundedData: any, property: string) => {
    const scenarioConfig = tableData.map((el: { scenario_order: any; [x: string]: any; }) => {
        return {
            id: el.scenario_order,
            scenario_name: el?.scenario_name,
            [property]: el[property]
        }
    });
    const projectConfig = foundedData.map((el: { project_id: number; [key: string]: any; }) => {
        return {
            ...el,
            id: el.project_id,
            [property]: el[property]
        }
    });

    const scenarioPlotConfig = scenarioConfig.map((el: { [x: string]: any; }, i: number) => {
        return {
            x: [el.scenario_name],
            y: [el[property]],
            type: 'bar',
            name: el.scenario_name
        }
    });
    const projectPlotConfig = projectConfig.map((el: { [x: string]: any; }, i: number) => {
        return {
            x: [el?.project_name],
            y: [el[property]],
            type: 'bar',
            name: el?.project
        }
    });

    return {
        scenarioPlotConfig, 
        projectPlotConfig
    }
}
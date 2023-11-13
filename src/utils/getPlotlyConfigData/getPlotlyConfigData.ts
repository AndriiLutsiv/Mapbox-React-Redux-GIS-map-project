import { CashflowResponse } from "models/Cashflow";

export const mapPropertyValues = (arr: any, property: string) => arr.map((el: { [x: string]: any; }) => el[property]);
export const processProperties = (arr: any, properties: string[]) =>
    properties.map((prop: string) => ({
        data: mapPropertyValues(arr, prop),
        name: arr[0] ? `${arr[0].project} _ ${prop}` : prop
    }));

export const getPlotlyConfigData = (data1: CashflowResponse, arrOfProps: string[] = ["uprn_total", "live_uprns"],  projectId: any) => {

    const arr = [data1];

    const customersChartData = [];

    for (const subArr of arr) {
        const result = processProperties(subArr, arrOfProps);
        customersChartData.push(...result);
    }

    const customersDataConfig = customersChartData.map((data) => ({
        y: data.data,
        type: "scatter",
        name: data.name,
        mode: "lines",
    }));

    return customersDataConfig;
}
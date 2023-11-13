import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
interface Props {
    plotData: any;
    title?: string;
    x?: string;
    y?: string;
    legend?: any;
    barmode?: "group" | "stack" | "overlay" | "relative" | undefined;
    shapes?: {
        type: "path" | "line" | "rect" | "circle" | undefined;
        x0?: number,
        y0?: number,
        x1?: number,
        y1?: number,
        xref?: any,
        yref?: any,
        line: {
            color: string,
            width?: number
        }
    }[];
    layout?: any;
    style?: any
}
// }
// shapes: [

//     //line vertical

//     {
//       type: 'line',
//       x0: 100,
//       y0: 0,
//       x1: 1002,
//       y1: 2000,
//       line: {
//         color: 'rgb(255, 128, 191)',
//         width: 3
//       }
//     }],
const Chart: React.FC<Props> = ({ plotData, title, y, x, legend, barmode = 'group', shapes, layout, style }) => {
    const tickfont = {
        family: 'Inter, sans-serif',
        size: 12,
        color: '#E5E5E5',
    };

    return <Plot
        data={plotData as any}

        data-testid='Chart'
        useResizeHandler={true}
        layout={{
            colorway: ['#0099FF', '#eeca86', '#e9ab0f', '#d47e30', '#9966FF', '#FF6699', '#FF9966', '#FF66CC', '#FF3399', '#FF3300', '#247bc7', '#daebfc', '#66CCFF', '#182844', '#042C5B',],
            title: {
                text: title,
                font: {
                    family: 'Inter, sans-serif',
                    size: 20,
                    color: '#E5E5E5',
                },
            },
            responsive: true,
            barmode: barmode,
            yaxis: {
                title: {
                    text: y,
                    standoff: 20
                },
                showline: false,
                linecolor: '#424242',
                linewidth: 1,
                showgrid: true,
                gridcolor: '#424242',
                gridwidth: 1,
                tickfont,
                titlefont: tickfont,
            },
            xaxis: {
                title: {
                    text: x,
                    standoff: 20
                },
                showline: false,
                linecolor: '#424242',
                linewidth: 1,
                zeroline: false,
                tickfont,
                titlefont: tickfont,
            },
            showlegend: true,
            legend: {
                orientation: "h",
                x: 0,
                font: tickfont,
                ...legend
            },
            plot_bgcolor: "#000",
            paper_bgcolor: "transparent",
            shapes: shapes,
            ...layout
        }}

        config={{ displayModeBar: false, responsive: true, showTips: false }}
        style={{
            width: '100%',
            minHeight: '600px',
            ...style
        }}
    />

}

export default Chart;
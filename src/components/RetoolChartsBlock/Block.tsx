import React from 'react';
import Plot from 'react-plotly.js';
import jsonData from './ex2.json';

const HeatmapComponent = () => {
    return (
        <Plot
            data={jsonData.data as any}
            layout={jsonData.layout as any}
            style={{ width: "100%", height: "600px" }}
        />
    );
}

export default HeatmapComponent;

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import Plot from 'react-plotly.js';

(mapboxgl as any).workerClass = MapboxWorker;

mapboxgl.accessToken = process.env.REACT_APP_MAP_TOKEN!;

export const MapboxPlotlyComponent = () => {

    const data = [
        {
            type: 'scattermapbox',
            lon: [10, 20, 30],  // replace with your longitude data
            lat: [15, 25, 35], // replace with your latitude data
            mode: 'markers',
            marker: {
                size: 10, // adjust as needed
                color: [200, 1500, 3000],  // replace with your data variable
                colorscale: 'Viridis', // or another colorscale you prefer
                cmin: 0,
                cmax: 4000,
                colorbar: {
                    title: 'CPPP', // title of your colorbar
                    thickness: 20
                }
            }
        },
        {
            type: 'densitymapbox',
            lon: [-10, -20, -30],  // replace with your longitude data
            lat: [15, 25, 35],    // replace with your latitude data
            z: [1, 3, 2],         // replace with your density data
            radius: 20,           // adjust as needed
            colorscale: 'Viridis',
            showscale: false
        }
    ];
    const layout = {
        mapbox: {
            style: {
                version: 8,
                sources: {
                    mySource: {
                        type: 'vector',
                        url: 'https://tiler-staging.fibreplanner.io/services/properties_62_62',
                    },
                },
                layers: [
                    {
                        id: 'myLayer',
                        type: 'circle',
                        source: 'mySource',
                        'source-layer': 'properties', // Replace with the actual layer ID
                        paint: {
                            'circle-color': 'red',
                        },
                    },
                ],
            },
        },
    };
    




    const config = {
        mapboxAccessToken: process.env.REACT_APP_MAP_TOKEN
    };
    // console.log("Mapbox Token:", process.env.REACT_APP_MAP_TOKEN);
    return (
        <Plot
            data={data as any}
            layout={layout as any}
            config={config}
            style={{ width: '100%', height: '100%' }}
        />
    );
}


export function Heatmap() {
    const [data, setData] = useState([]);
    const [layout, setLayout] = useState({});

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('https://tiler-staging.fibreplanner.io/services/properties_62_62');
          const result = await response.json();
          const attributes = result.tilestats.layers[0].attributes;

          // Find the cppp attribute
          const cpppAttribute = attributes.find((attr: any) => attr.attribute === 'cppp');

          const customColorscale = [
            [0, 'rgb(255, 255, 255)'], 
            [0.0625, 'rgb(255, 255, 255)'], 
            [0.1875, 'rgb(230, 230, 0)'], 
            [0.3125, 'rgb(184, 207, 0)'], 
            [0.5, 'rgb(138, 184, 0)'], 
            [0.75, 'rgb(92, 161, 0)'], 
            [1, 'rgb(46, 138, 0)']
          ];

          const densityData = {
            type: 'heatmap',
            y: cpppAttribute.values,
            z: [cpppAttribute.values],
            colorscale: customColorscale,
            showscale: true,
            colorbar: {
              tickvals: [0, 250, 750, 1250, 2000, 3000, 4000],
              ticktext: ['0', '250', '750', '1250', '2000', '3000', '4000'],
              x: 0.5,
              y: 0.5,
              thicknessmode: 'pixels',
              thickness: 30,
              len: 1
            },
            x: [0], // Single X value for all data points
          };
        //@ts-ignore
          setData([densityData]);

          const densityLayout = {
            title: '',
            xaxis: {
              showgrid: false,
              zeroline: false,
              showline: false,
              showticklabels: false
            },
            yaxis: {
              showgrid: false,
              zeroline: false,
              showline: false,
              showticklabels: false
            },
            margin: { t: 0, b: 0, l: 0, r: 0 }, // Remove all margins
            showlegend: false
          };

          setLayout(densityLayout);
        } catch (error) {
          console.error('Error fetching heatmap data:', error);
        }
      };

      fetchData();
    }, []);

    return <Plot data={data} layout={layout} />;
}



// export function Heatmap() {
//     const [data, setData] = useState([]);
//     const [layout, setLayout] = useState({});

//     useEffect(() => {
//       const fetchData = async () => {
//         try {
//           const response = await fetch('https://tiler-staging.fibreplanner.io/services/properties_62_62');
//           const result = await response.json();
//           const attributes = result.tilestats.layers[0].attributes;

//           // Find the cppp attribute
//           const cpppAttribute = attributes.find((attr: any) => attr.attribute === 'cppp');

//           const customColorscale = [
//             [0, 'rgb(255, 255, 255)'], 
//             [0.0625, 'rgb(255, 255, 255)'], 
//             [0.1875, 'rgb(230, 230, 0)'], 
//             [0.3125, 'rgb(184, 207, 0)'], 
//             [0.5, 'rgb(138, 184, 0)'], 
//             [0.75, 'rgb(92, 161, 0)'], 
//             [1, 'rgb(46, 138, 0)']
//           ];

//           const densityData = {
//             type: 'heatmap',
//             y: cpppAttribute.values,
//             z: [cpppAttribute.values],
//             colorscale: customColorscale,
//             showscale: true,
//             colorbar: {
//               tickvals: [0, 250, 750, 1250, 2000, 3000, 4000],
//               ticktext: ['0', '250', '750', '1250', '2000', '3000', '4000']
//             },
//             x: [0], // Single X value for all data points
//           };
//           //@ts-ignore
//           setData([densityData]);

//           const densityLayout = {
//             title: 'Your Density Indicator Title',
//             xaxis: {
//               showgrid: false,
//               zeroline: false,
//               showline: false,
//               showticklabels: false
//             },
//             yaxis: {
//               showgrid: false,
//               zeroline: false,
//               showline: false,
//               showticklabels: false
//             },
//             margin: { t: 50, b: 50, l: 0, r: 50 } // Removed left margin
//           };

//           setLayout(densityLayout);
//         } catch (error) {
//           console.error('Error fetching heatmap data:', error);
//         }
//       };

//       fetchData();
//     }, []);

//     return <Plot data={data} layout={layout} />;
// }


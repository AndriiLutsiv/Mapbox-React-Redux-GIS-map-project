export const colours = [
    { name: 'Red', value: '#F04438' },
    { name: 'Blue', value: '#44A5FF' },
    { name: 'Green', value: '#32D583' },
    { name: 'Yellow', value: '#FEDF89' },
    { name: 'Orange', value: '#FDB022' },
    { name: 'Pink', value: '#FDA29B' },
    { name: 'Purple', value: '#B432D5' },
  ];
  
  // Loop through colors if there are more layers than colors
export const getLayerColor = (layerIndex: number) => {
    return colours[layerIndex % colours.length].value;  
  }
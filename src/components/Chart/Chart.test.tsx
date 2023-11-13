import { render } from '@testing-library/react';
import Chart from './Chart';


describe('Chart component', () => {
  const samplePlotData = [
    {
      data: [10, 20, 30],
      name: 'Data 1',
    },
    {
      data: [5, 15, 25],
      name: 'Data 2',
    },
  ];

  it('renders without errors', () => {
    render(<Chart plotData={samplePlotData} />);
  });
});

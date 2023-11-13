import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For expect assertions
import { LayerItem } from './LayerItem';

describe('LayerItem', () => {
  it('renders the component with initial data', () => {
    const layerData = {
      layerName: 'Layer Name 1',
      indicator: {
        color: '#f00',
        shape: 'line',
      },
    };

    render(<LayerItem {...layerData} />);

    // Ensure that the component renders with the provided data
    expect(screen.getByText('Layer Name 1')).toBeInTheDocument();
    expect(screen.getByTestId('indicator')).toHaveStyle('background-color: #f00');
  });

  it('toggles children visibility when clicked', () => {
    const layerDataWithChildren = {
      layerName: 'Layer Name 1',
      indicator: {
        color: '#f00',
        shape: 'line',
      },
      children: [
        {
          layerName: 'Child Layer 1',
          indicator: {
            color: '#00f',
            shape: 'circle',
          },
        },
      ],
    };

    render(<LayerItem {...layerDataWithChildren} />);

    expect(screen.queryByText('Child Layer 1')).toBeNull();

    fireEvent.click(screen.getByText('Layer Name 1'));
    expect(screen.getByText('Child Layer 1')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Layer Name 1'));
    expect(screen.queryByText('Child Layer 1')).toBeNull();
  });
});

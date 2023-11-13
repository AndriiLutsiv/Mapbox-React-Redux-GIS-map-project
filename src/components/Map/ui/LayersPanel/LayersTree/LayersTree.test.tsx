import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For expect assertions
import { LayersTree } from './LayersTree';

describe('LayersTree', () => {
  it('renders the component', () => {
    render(<LayersTree />);

    // Ensure that the component renders with the provided data
    expect(screen.getByTestId('LayerTree')).toBeInTheDocument();
  });
});

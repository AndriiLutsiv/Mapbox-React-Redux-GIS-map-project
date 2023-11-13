import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import LayersPanel from './LayersPanel';
import { MapProvider } from 'app/providers/MapProvider';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { setupStore } from 'store/store';
import { renderWithProviders } from 'test-utils';

const store = setupStore();
describe('LayersPanel', () => {
  it('renders correctly', () => {
    renderWithProviders(
      <MemoryRouter>
        <MapProvider>
          <LayersPanel />
        </MapProvider>
      </MemoryRouter>
    );

    const layerPanel = screen.getByTestId('LayerPanel');
    const layerPanelButton = screen.getByTestId('Button');

    expect(layerPanel).toBeInTheDocument();
    expect(layerPanelButton).toBeInTheDocument();
  });

  it('opens and closes the drawer', () => {
    renderWithProviders(
      <MemoryRouter>
        <MapProvider>
          <LayersPanel />
        </MapProvider>
      </MemoryRouter>
    );

    const layerPanelButton = screen.getByTestId('Button');

    expect(layerPanelButton).toBeInTheDocument();

    fireEvent.click(layerPanelButton);
    expect(screen.getByTestId('LayerPanel-Drawer')).toBeInTheDocument();
  });

});

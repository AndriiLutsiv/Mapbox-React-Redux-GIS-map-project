import { render, fireEvent, screen } from '@testing-library/react';
import Basemap from './Basemap'; // Import your Basemap component here
import { MapProvider } from 'app/providers/MapProvider';


describe('Basemap Component', () => {
  it('renders the component', () => {
    render(
      <MapProvider>
        <Basemap />
      </MapProvider>
    );

    expect(screen.getByTestId('Basemap')).toBeInTheDocument();
  });

  it('displays radio buttons for basemap options', () => {
    render(
      <MapProvider>
        <Basemap />
      </MapProvider>
    );
    const defaultRadio = screen.getByLabelText('Default');
    const osmRadio = screen.getByLabelText('OSM');
    const satelliteRadio = screen.getByLabelText('Satellite');

    expect(defaultRadio).toBeInTheDocument();
    expect(osmRadio).toBeInTheDocument();
    expect(satelliteRadio).toBeInTheDocument();
  });

  it('selects the default basemap initially', () => {

    render(
      <MapProvider>
        <Basemap />
      </MapProvider>
    );

    const defaultRadio = screen.getByLabelText('Default');
    const osmRadio = screen.getByLabelText('OSM');
    const satelliteRadio = screen.getByLabelText('Satellite');

    expect(defaultRadio).toBeChecked();
    expect(osmRadio).not.toBeChecked();
    expect(satelliteRadio).not.toBeChecked();
  });
});

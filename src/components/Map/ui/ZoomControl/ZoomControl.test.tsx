import { JSDOM } from 'jsdom';
import mapboxgl, { Map } from 'mapbox-gl';
import { Zoom } from './ZoomControl';

jest.mock('mapbox-gl', () => {
  function MapMock(this: { zoomIn: jest.Mock, zoomOut: jest.Mock }) {
    this.zoomIn = jest.fn();
    this.zoomOut = jest.fn();
  }
  return { Map: MapMock };
});

describe('ZoomControl', () => {
  it('creates a container with two buttons for zooming in and out', () => {
    const { window } = new JSDOM();
    global.document = window.document;

    const mockMap = new mapboxgl.Map();
    const zoomControl = new Zoom(mockMap);

    const container = zoomControl.onAdd();

    expect(container).toBeTruthy();
    expect(container.children.length).toBe(2);

    const [zoomInButton, zoomOutButton] = Array.from(
      container.children
    ) as HTMLElement[];

    // Test zoomIn button
    zoomInButton.onclick = () => mockMap.zoomIn();
    zoomInButton.click();
    expect(mockMap.zoomIn).toBeCalled();

    // Test zoomOut button
    zoomOutButton.onclick = () => mockMap.zoomOut();
    zoomOutButton.click();
    expect(mockMap.zoomOut).toBeCalled();
  });
});

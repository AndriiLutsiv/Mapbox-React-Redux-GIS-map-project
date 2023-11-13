import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For additional matchers like toBeInTheDocument
import CustomTabs from './CustomTabs'; // Import your component
import { MapProvider } from 'app/providers/MapProvider';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { setupStore } from 'store/store';

jest.mock('hooks/useAuth', () => ({
  useAuth: () => ({
    token: 'dummy_token',
  }),
}));
const store = setupStore();

describe('CustomTabs Component', () => {
  const defaultProps = {
    selectedLayer: null,
    setSelectedLayer: jest.fn(),
  };

  it('renders tab buttons and default content', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <MapProvider>
            <CustomTabs {...defaultProps} />
          </MapProvider>
        </MemoryRouter>
      </Provider>
    );
    const tabContainer = screen.getByTestId('Custom-tab-container');

    expect(tabContainer).toBeInTheDocument();
  });
  it('renders the tab buttons correctly', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <MapProvider>
            <CustomTabs {...defaultProps} />
          </MapProvider>
        </MemoryRouter>
      </Provider>
    );

    const tabButtons = screen.getAllByTestId('Custom-tab-button');

    expect(tabButtons).toHaveLength(3);
    expect(tabButtons[0]).toHaveTextContent('Layers');
    expect(tabButtons[1]).toHaveTextContent('Points');
    expect(tabButtons[2]).toHaveTextContent('Basemap');
  });

  it('changes the active tab when a tab button is clicked', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <MapProvider>
            <CustomTabs {...defaultProps} />
          </MapProvider>
        </MemoryRouter>
      </Provider>
    );

    const tabButtons = screen.getAllByTestId('Custom-tab-button');
    const tabChildrenContainers = screen.getAllByTestId('Custom-tab-children-container');
    expect(tabChildrenContainers).toHaveLength(1);

    fireEvent.click(tabButtons[1]);
    expect(tabChildrenContainers[0]).toBeVisible();
  });
});


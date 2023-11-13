import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import StyleLinePopup from "./StyleLinePopup";
import { MapProvider } from 'app/providers/MapProvider';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { setupStore } from 'store/store';

const store = setupStore();
describe("StyleLinePopup Component", () => {
  const defaultProps = {
    selectedLayer: null,
    onClose: jest.fn(),
  };

  it('renders without crashing popup', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <MapProvider>
            <StyleLinePopup {...defaultProps} />
          </MapProvider>
        </MemoryRouter>
      </Provider>
    );
    const styleLinePopup = screen.getByTestId('style-line-popup');

    expect(styleLinePopup).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onCloseMock = jest.fn(); render(
      <Provider store={store}>
        <MemoryRouter>
          <MapProvider>
            <StyleLinePopup {...defaultProps} onClose={onCloseMock} />
          </MapProvider>
        </MemoryRouter>
      </Provider>
    );
    const styleLinePopupClose = screen.getByTestId('style-line-popup-close');

    fireEvent.click(styleLinePopupClose);

    expect(onCloseMock).toHaveBeenCalled();
  });
});

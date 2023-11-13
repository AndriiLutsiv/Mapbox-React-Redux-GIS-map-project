import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Shapes from "./Shapes";
import { setupStore } from 'store/store';
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { MapProvider } from "app/providers/MapProvider";

const store = setupStore();
describe("Shapes Component", () => {
  const defaultProps = {
    color: "#FF0000",
    shape: {
      name: 'Circle',
      svg: `<svg>Circle SVG %COLOR%</svg>`
    },
    setSelectedShape: jest.fn()
  }

  it("renders without crashing", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <MapProvider>
            <Shapes {...defaultProps} />
          </MapProvider>
        </MemoryRouter>
      </Provider>
    );

    const shapeComponent = screen.getByTestId('shape-component');

    expect(shapeComponent).toBeInTheDocument()
  });

  it("calls setSelectedShape when a shape is clicked", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <MapProvider>
            <Shapes {...defaultProps} />
          </MapProvider>
        </MemoryRouter>
      </Provider>
    );

    const squareShape = screen.getByText("Square");
    fireEvent.click(squareShape);

    expect(defaultProps.setSelectedShape).toHaveBeenCalled()
  });
});

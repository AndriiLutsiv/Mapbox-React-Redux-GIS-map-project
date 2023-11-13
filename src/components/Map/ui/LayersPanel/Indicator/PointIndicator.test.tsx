import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import PointIndicator from "./PointIndicator";

// Mock the shapes module
jest.mock("components/Map/styles/shapes", () => ({
  shapes: [
    {
      name: "circle",
      svg: (color: any) => `<svg>Circle SVG ${color}</svg>`,
    },
    {
      name: "triangle",
      svg: (color: any) => `<svg>Triangle SVG ${color}</svg>`,
    },
  ],
}));

describe("PointIndicator Component", () => {
  it("renders without crashing", () => {
    render(
      <PointIndicator
      shapeForm={''}
        type="circle"
        currentColor="blue"
        onClick={() => {}}
      />
    );
    const pointIndicator = screen.getByTestId("point-indicator");

    expect(pointIndicator).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClickMock = jest.fn();
    render(
      <PointIndicator
        type="circle"
        shapeForm={''}
        currentColor="blue"
        onClick={onClickMock}
      />
    );

    const pointIndicator = screen.getByTestId("point-indicator");
    fireEvent.click(pointIndicator);

    expect(onClickMock).toHaveBeenCalled();
  });

  it("renders SVG content based on type and color", () => {
    render(
      <PointIndicator
        type="triangle"
        currentColor="red"
        shapeForm={''}
        onClick={() => {}}
      />
    );

    const pointIndicator = screen.getByTestId("point-indicator");
    
    expect(pointIndicator).toHaveTextContent("Triangle SVG red");
  });
});

import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import LineColours from "./LineColours";

jest.useFakeTimers();

// Mock the colours array
jest.mock("components/Map/styles/colours", () => ({
  colours: [
    { name: "Red", value: "#ff0000" },
    { name: "Green", value: "#00ff00" },
    { name: "Blue", value: "#0000ff" },
  ],
}));

describe("LineColours Component", () => {
  it("renders without crashing", () => {
    const setColorMock = jest.fn();
    render(<LineColours color="#ff0000" setColor={setColorMock} />);

    const lineIndicator = screen.getByTestId('line-colors');

    expect(lineIndicator).toBeInTheDocument();
  });

  it("calls setColor when a colour is clicked", () => {
    const setColorMock = jest.fn();
    render(<LineColours color="#ff0000" setColor={setColorMock} />);

    fireEvent.click(screen.getByText("Green"));

    expect(setColorMock).toHaveBeenCalledWith("#00ff00");
  });

  it("changes color when the custom input is used", () => {
    const setColorMock = jest.fn();
    render(<LineColours color="#ff0000" setColor={setColorMock} />);

    const customColorInput = screen.getByTestId('custom-color-input');
    fireEvent.change(customColorInput, { target: { value: "#ffff00" } });

    jest.runAllTimers();
    expect(setColorMock).toHaveBeenCalledWith("#ffff00");
  });
});

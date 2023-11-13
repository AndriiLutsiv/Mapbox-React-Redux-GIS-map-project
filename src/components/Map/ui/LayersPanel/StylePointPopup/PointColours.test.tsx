import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Colours from "./PointColours";

jest.useFakeTimers();

// Mock the colours array
jest.mock("components/Map/styles/colours", () => ({
    colours: [
      { name: "Red", value: "#ff0000" },
      { name: "Green", value: "#00ff00" },
      { name: "Blue", value: "#0000ff" },
    ],
  }));

  
describe("Colours Component", () => {
  it("renders without crashing", () => {
    const setColorMock = jest.fn();
    render(<Colours color="#FF0000" setColor={setColorMock} />);

    const pointColours = screen.getByTestId('point-colours');

    expect(pointColours).toBeInTheDocument()
  });

  it("calls setColor when a colour is clicked", () => {
    const setColorMock = jest.fn();
    render(<Colours color="#FF0000" setColor={setColorMock} />);

    const greenColour = screen.getByText("Green");
    fireEvent.click(greenColour);

    expect(setColorMock).toHaveBeenCalledWith('#00ff00');
  });
  
  it("changes color when the custom input is used", () => {
    const setColorMock = jest.fn();
    render(<Colours color="#FF0000" setColor={setColorMock} />);

    const customColorInput = screen.getByTestId('point-colours-custom');
    fireEvent.change(customColorInput, { target: { value: "#ffff00" } });

    jest.runAllTimers();
    expect(setColorMock).toHaveBeenCalledWith("#ffff00");
  });
});

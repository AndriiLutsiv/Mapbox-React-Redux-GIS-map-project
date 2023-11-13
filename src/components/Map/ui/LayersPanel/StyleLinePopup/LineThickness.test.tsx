import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import LineThickness from "./LineThickness";

describe("LineThickness Component", () => {
  it("renders without crashing", () => {
    const setThicknessMock = jest.fn();
    render(<LineThickness thickness={5} setThickness={setThicknessMock} />);

    const lineThickness = screen.getByTestId('line-thickness');
    expect(lineThickness).toBeInTheDocument();
  });

  it("calls setThickness when input changes within valid range", () => {
    const setThicknessMock = jest.fn();
    render(<LineThickness thickness={5} setThickness={setThicknessMock} />);

    const lineThicknessInput = screen.getByTestId('line-thickness-input');
    

    fireEvent.change(lineThicknessInput, { target: { value: "7" } });

    expect(setThicknessMock).toHaveBeenCalledWith(7);
  });

  it("calls setThickness when input changes within invalid range", () => {
    const setThicknessMock = jest.fn();
    render(<LineThickness thickness={5} setThickness={setThicknessMock} />);

    const lineThicknessInput = screen.getByTestId('line-thickness-input');
    

    fireEvent.change(lineThicknessInput, { target: { value: "17" } });

    expect(setThicknessMock).not.toHaveBeenCalledWith(17);
  });

  it("prevents default paste behavior and sets thickness on paste", () => {
    const setThicknessMock = jest.fn();
    render(<LineThickness thickness={5} setThickness={setThicknessMock} />);

    const lineThicknessInput = screen.getByTestId('line-thickness-input');

    const pasteEvent = {
      clipboardData: { getData: () => "8" },
      preventDefault: jest.fn(),
    };

    fireEvent.paste(lineThicknessInput, pasteEvent);

    expect(setThicknessMock).toHaveBeenCalledWith(8);
  });

});

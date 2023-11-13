import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import LineType from "./LineType";

describe("LineType Component", () => {
  it("renders without crashing", () => {
    const setLineTypeMock = jest.fn();
    render(<LineType lineType="dotted" setLineType={setLineTypeMock} />);

    const lineType = screen.getByTestId('line-type');
    expect(lineType).toBeInTheDocument();
  });

  // Test case 2: Calls setLineType when an option is clicked
  it("calls setLineType when an option is clicked", () => {
    const setLineTypeMock = jest.fn();
    render(<LineType lineType="dotted" setLineType={setLineTypeMock} />);

    const solidOption = screen.getByText("Solid");
    fireEvent.click(solidOption);

    expect(setLineTypeMock).toHaveBeenCalledWith("solid");
  });

});

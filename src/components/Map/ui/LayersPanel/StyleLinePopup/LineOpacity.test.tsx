import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import LineOpacity from "./LineOpacity";

describe("LineOpacity Component", () => {
    it("renders without crashing", () => {
        const setOpacityMock = jest.fn();
        render(<LineOpacity opacity={0.5} setOpacity={setOpacityMock} />);

        const lineOpacity = screen.getByTestId('line-opacity');
        expect(lineOpacity).toBeInTheDocument();
    });

    it("calls setOpacity when input changes within valid range", () => {
        const setOpacityMock = jest.fn();
        render(<LineOpacity opacity={0.5} setOpacity={setOpacityMock} />);

        const lineOpacityInput = screen.getByTestId('line-opacity-input');

        fireEvent.change(lineOpacityInput, { target: { value: "0.7" } });

        expect(setOpacityMock).toHaveBeenCalledWith(0.7);
    });

    it("rounds the input value to one decimal place", () => {
        const setOpacityMock = jest.fn();
        render(<LineOpacity opacity={0.5} setOpacity={setOpacityMock} />);

        const lineOpacityInput = screen.getByTestId('line-opacity-input');

        fireEvent.change(lineOpacityInput, { target: { value: "0.745" } });

        expect(setOpacityMock).toHaveBeenCalledWith(0.7);
    });

    it("prevents default paste behavior and sets opacity on paste", () => {
        const setOpacityMock = jest.fn();
        render(<LineOpacity opacity={0.5} setOpacity={setOpacityMock} />);

        const lineOpacityInput = screen.getByTestId('line-opacity-input');


        const pasteEvent = {
            clipboardData: { getData: () => "0.6" },
            preventDefault: jest.fn(),
        };

        fireEvent.paste(lineOpacityInput, pasteEvent);
        expect(setOpacityMock).toHaveBeenCalledWith(0.6);
    });

});

import { render, fireEvent, screen } from "@testing-library/react";
import LineIndicator from "./LineIndicator";

describe("LineIndicator Component", () => {
  it("renders without crashing", () => {
    render(
      <LineIndicator
        currentColor="blue"
        opacity={0.5}
        height={20}
        lineType="solid"
        onClick={() => {}}
      />
    );
    const lineIndicator = screen.getByTestId('line-indicator');

    expect(lineIndicator).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClickMock = jest.fn();
    render(
      <LineIndicator
        currentColor="blue"
        opacity={0.5}
        height={20}
        lineType="solid"
        onClick={onClickMock}
      />
    );

    const lineIndicator = screen.getByTestId('line-indicator');

    fireEvent.click(lineIndicator);

    expect(lineIndicator).toBeInTheDocument();
    expect(onClickMock).toHaveBeenCalled();
  });

  it("indicator have style", () => {
    render(
      <LineIndicator
        currentColor="blue"
        opacity={0.5}
        height={20}
        lineType="solid"
        onClick={() => {}}
      />
    );

    const lineIndicatorIcon = screen.getByTestId('line-indicator-icon');

    expect(lineIndicatorIcon).toBeInTheDocument();
    expect(lineIndicatorIcon).toHaveStyle({
      borderBottom: '20px solid blue',
      opacity: 0.5
    });
  });
});

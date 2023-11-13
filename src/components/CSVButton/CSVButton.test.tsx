import { render, screen } from "@testing-library/react";
import CSVButton from "./CSVButton"; 

describe("CSVButton component", () => {
  const sampleData = [
    { id: 1, name: "John" },
    { id: 2, name: "Jane" },
  ];

  it("renders button", () => {
    render(<CSVButton data={sampleData} filename="data" />);
    const downloadButton = screen.getByText("Download");
    expect(downloadButton).toBeInTheDocument();
  });

});

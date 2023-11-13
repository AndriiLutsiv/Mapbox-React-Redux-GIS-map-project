import mapboxgl from "mapbox-gl";
import { dimLine } from "./dimLine";

jest.mock("mapbox-gl");

interface MockedMapboxGLMap {
  getSource: jest.Mock;
  removeLayer: jest.Mock;
  removeSource: jest.Mock;
}

describe("dimLine", () => {
  it("should remove layer and source from the map if they exist", () => {
    const mockMap = new mapboxgl.Map() as unknown as MockedMapboxGLMap;

    mockMap.getSource.mockImplementation((sourceId: string) => {
      if (sourceId === "hoveredLine") return {};
      return null;
    });

    dimLine(mockMap as any);

    expect(mockMap.removeLayer).toHaveBeenCalledWith("higlightedLineLayer");
    expect(mockMap.removeSource).toHaveBeenCalledWith("hoveredLine");
  });
});

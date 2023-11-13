import mapboxgl from "mapbox-gl";
import { dimPoint } from "./dimPoint";

jest.mock("mapbox-gl");

interface MockedMapboxGLMap {
  getSource: jest.Mock;
  removeLayer: jest.Mock;
  removeSource: jest.Mock;
}

describe("dimPoint", () => {
  it("should remove layer and source from the map if they exist", () => {
    const mockMap = new mapboxgl.Map() as unknown as MockedMapboxGLMap;

    mockMap.getSource.mockImplementation((sourceId: string) => {
      if (sourceId === "hoveredPoint") return {};
      return null;
    });

    dimPoint(mockMap as any);

    expect(mockMap.removeLayer).toHaveBeenCalledWith("higlightedPointLayer");
    expect(mockMap.removeSource).toHaveBeenCalledWith("hoveredPoint");
  });
});

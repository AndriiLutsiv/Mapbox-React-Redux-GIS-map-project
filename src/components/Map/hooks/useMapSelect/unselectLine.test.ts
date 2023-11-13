import mapboxgl from "mapbox-gl";
import { unselectLine } from "./unselectLine";

jest.mock("mapbox-gl");

interface MockedMapboxGLMap {
  getSource: jest.Mock;
  removeLayer: jest.Mock;
  removeSource: jest.Mock;
}

describe("unselectLine", () => {
  it("should remove layer and source from the map if they exist", () => {
    const mockMap = new mapboxgl.Map() as unknown as MockedMapboxGLMap;

    mockMap.getSource.mockImplementation((sourceId: string) => {
      if (sourceId === "selectedLine") return {};
      return null;
    });

    unselectLine(mockMap as any);

    expect(mockMap.removeLayer).toHaveBeenCalledWith("selectedLineLayer");
    expect(mockMap.removeSource).toHaveBeenCalledWith("selectedLine");
  });
});

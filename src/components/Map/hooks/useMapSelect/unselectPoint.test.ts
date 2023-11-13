import mapboxgl from "mapbox-gl";
import { unselectPoint } from "./unselectPoint";

jest.mock("mapbox-gl");

interface MockedMapboxGLMap {
  getSource: jest.Mock;
  removeLayer: jest.Mock;
  removeSource: jest.Mock;
}

describe("unselectPoint", () => {
  it("should remove layer and source from the map if they exist", () => {
    const mockMap = new mapboxgl.Map() as unknown as MockedMapboxGLMap;

    mockMap.getSource.mockImplementation((sourceId: string) => {
      if (sourceId === "selectedPoint") return {};
      return null;
    });

    unselectPoint(mockMap as any);

    expect(mockMap.removeLayer).toHaveBeenCalledWith("selectedPointLayer");
    expect(mockMap.removeSource).toHaveBeenCalledWith("selectedPoint");
  });
});

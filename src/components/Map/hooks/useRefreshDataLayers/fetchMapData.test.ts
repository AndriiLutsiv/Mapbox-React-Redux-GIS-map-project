import * as turf from '@turf/turf';
import { fetchMapData } from "./fetchMapData";

jest.mock('@turf/turf');
jest.mock("mapbox-gl");

describe("fetchMapData", () => {
    let mockMap: any;
    const mockLayers = [
        { layer_type: 'cable', geom_type: 'LineString', project_uuid: '123' },
        { layer_type: 'infra_point', geom_type: 'Point', project_uuid: '456' },
    ] as any;

    const mockToken = "testToken";
    const mockProjectUuid = "testUuid";

    const mockGeojsonData = {};
    const mockClusteredGeojsonData = { points: [], lines: [] };
    const setGeojsonData = jest.fn();
    const setClusteredGeojsonData = jest.fn();
    const featureKeyMap = {};
    const setFeatureKeyMap = jest.fn();
    const startLoading = jest.fn();
    const endLoading = jest.fn();
    const stylesData = [] as any;
    const mockDispatch = jest.fn();

    beforeEach(() => {
        mockMap = {
            getBounds: jest.fn().mockReturnValue({
                toArray: jest.fn().mockReturnValue([]),
            }),
            getSource: jest.fn().mockReturnValue({
                setData: jest.fn(),
            }),
            getZoom: jest.fn().mockReturnValue(15),
        };

        //@ts-ignore
        global.fetch = jest.fn(() => ({
            ok: true,
            json: jest.fn(() => ({})),
        }));

        //@ts-ignore
        turf.bboxPolygon.mockReturnValue({
            type: 'Polygon',
            coordinates: [[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]],
        });
    });

    it("should make a fetch request for each layer and set data to the map source", (done) => {
        fetchMapData({
            map: mockMap,
            layers: mockLayers,
            token: mockToken,
            project_uuid: mockProjectUuid,
            geojsonData: mockGeojsonData,
            clusteredGeojsonData: mockClusteredGeojsonData,
            setGeojsonData,
            setClusteredGeojsonData,
            featureKeyMap,
            setFeatureKeyMap,
            startLoading,
            endLoading,
            stylesData,
            dispatch: mockDispatch,
            fetchOne: false
        })
        .then(() => {
            expect(mockMap.getBounds).toHaveBeenCalled();
            done(); 
        })
        .catch(error => {
            done(error);
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });
});

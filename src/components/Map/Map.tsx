import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import mapboxGl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import styles from './Map.module.scss';
import { Polygon } from './ui/Polygon';
import { ZoomControl } from './ui/ZoomControl';
import { useMap } from 'app/providers/MapProvider';
import { mapAPI } from 'services/MapService';
import { Spinner } from "components/Spinner";
import { baseSources } from './resources/sources';
import { useRefreshDataLayers } from './hooks/useRefreshDataLayers/useRefreshDataLayers';
import { addSourcesAndLayers } from './utils/addSourcesAndLayers';
import { baseLayers } from './resources/layers';
import { useMapHover } from './hooks/useMapHover/useMapHover';
import useMapSelect from './hooks/useMapSelect/useMapSelect';
import { useTrackLastPosition } from './hooks/useTrackLastPosition/useTrackLastPosition';
import { getLastPosition } from './utils/getLastPosition';
import s from './hooks/useMapSelect/useMapSelect.styles.module.scss';
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import LayersPanel from './ui/LayersPanel/LayersPanel';
import { applyStyles } from './styles/applyStyles';
import { defaultStyles } from './styles/defaultStyles';
import { stylesAPI } from 'services/StylesService';
import { Geometry as GeoType } from 'models/Map';
import { PropertiesModal } from './ui/PropertiesModal';
import { HierarchyModal } from './ui/LayersPanel/HierarchyModal';

import classNames from 'classnames';
import { getVectorSourceId } from './resources/getId';
import { fitBounds } from './utils/fitBounds';
import { useSelector } from 'react-redux';
import { addArrayOfShapes, selectShapes } from 'store/reducers/shapesSlice';
import { useDispatch } from 'react-redux';
import { Shape } from './styles/shapes';
import { useAuth } from 'hooks/useAuth';
import { useAppDispatch } from 'hooks/redux';
(mapboxGl as any).workerClass = MapboxWorker;


mapboxGl.accessToken = process.env.REACT_APP_MAP_TOKEN!;

interface Props {
  polygon?: boolean;
  isMapPage?: boolean;
  properties?: boolean;
  layersPanel?: boolean;
}

const Map: React.FC<Props> = ({ polygon, properties, layersPanel, isMapPage }) => {
  const { setDraw, setMap, mapLoading, startLoading, endLoading, selectedFeature } = useMap();
  const dispatch = useAppDispatch();
  const params = useParams();
  const { token } = useAuth();
  const mapRef = useRef<HTMLDivElement>(null);

  const [uuidPoint, setUuidPoint] = useState('');
  const [showHierarchPopup, setShowHierarchPopup] = useState<boolean>(false);

  //Additional Map features (update, hover, select) described as custom hooks
  useRefreshDataLayers();
  useMapHover();
  useMapSelect(setUuidPoint, setShowHierarchPopup);
  useTrackLastPosition(polygon);

  const { data: layers, error: getLayersError, isLoading: getLayersIsLoading } = mapAPI.useGetLayersQuery(
    { project_uuid: params.param3 || '' },
    { skip: !params.param3 }
  );

  const { data: stylesData = [], error: getStylesError, isLoading: getStylesIsLoading } = stylesAPI.useGetStylesQuery();

  useEffect(() => {
    localStorage.removeItem('basemap');
  }, []);

  useEffect(() => {
    getStylesIsLoading ? startLoading() : endLoading();

    const store: Shape[] = [];
    stylesData.forEach((item) => {
      const { style } = item;

      if (style.type === "Point") {
        if (!store.some((el) => el.name === style.shapeName)) {
          store.push({
            name: style.shapeName,
            svg: style.shapeForm,
          });
        }

        style.props.forEach((el: any) => {
          if (
            !store.some((elem) => elem.name === el.shapeName) &&
            el.shapeName &&
            el.shapeForm
          ) {
            store.push({
              name: el.shapeName,
              svg: el.shapeForm,
            });
          }
        });
      }
    });

    dispatch(addArrayOfShapes(store))
  }, [getStylesIsLoading]);


  useEffect(() => {
    if (!mapRef.current) return;

    const lastPosition = getLastPosition(params.param3!);

    const map = new mapboxGl.Map({
      container: mapRef.current,
      style: {
        version: 8,
        sources: baseSources,
        layers: baseLayers,
        glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
      },
      center: [
        lastPosition?.x ?? -2.1797787555771606,
        lastPosition?.y ?? 52.06050352500296
      ],

      maxBounds: [-10.731977871337193, 49.59411301175666, 1.9010451201391163, 61.32814923895637],
      zoom: lastPosition?.zoom ?? 10,
      minZoom: 5.5 // zoom < 5.5 caused 404s. 
    });

    if (!map) return;

    map.on('style.load', () => {
      layers && addSourcesAndLayers(layers, map, params.param3!);

      let styledObj = [] as any;
      if (stylesData.length < 8) {
        for (let i = 0; i < defaultStyles.length; i++) {
          if (!stylesData.find((el) => defaultStyles[i].layerId.includes(el.style.layerId))) {
            styledObj.push(defaultStyles[i])
          }
        }
        styledObj.push(...stylesData.map((el) => el));
      } else {
        styledObj.push(...stylesData.map((el) => el));
      }

      setMap(map);

      (layers && !lastPosition) && fitBounds(layers, params.param3!, token, map, dispatch);
      layers && applyStyles(map, layers, styledObj || defaultStyles);

      // !! Do not delete this code! 
      // !! This code can help test layout styling if server doesn't work correctly
      // const serverResponse = localStorage.getItem('TEST_SAVE_LAYERS') ? JSON.parse(localStorage.getItem('TEST_SAVE_LAYERS')!) : null;
      // layers && applyStyles(map, layers, serverResponse || defaultStyles);
      // layers && applyStyles(map, layers,  styledObj);
    });

    return () => {
      setDraw(null);
      setMap(null);
    }
  }, [layers]);

  return (
    <div className={styles.mapContainer} data-testid="Map">
      <div className={styles.map} id="map" ref={mapRef} />
      <>{
        polygon && <Polygon />}
        {(properties && selectedFeature) && <PropertiesModal />}
        {layersPanel && <LayersPanel shareView />}
        {showHierarchPopup && <HierarchyModal pointUuid={uuidPoint} setShowHierarchPopup={setShowHierarchPopup} />}

        <ZoomControl />
      </>
      {(mapLoading && isMapPage) && <Spinner className={styles.customSpinner} />}
    </div>
  );
}

export default Map;


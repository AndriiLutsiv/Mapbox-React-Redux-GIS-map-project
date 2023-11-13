import { useEffect, useState } from 'react';
import styles from './AreaModal.module.scss';
import { SectionDescribe } from './SectionDescribe';
import { SectionDraw } from './SectionDraw';
import { Modal } from 'components/Modal';
import { useMap } from 'app/providers/MapProvider';
import { areaAPI } from 'services/AreaService';
import { CreateAreaErrorResponse, UpdateAreaErrorResponse } from 'models/Area';
import mapboxgl from 'mapbox-gl';
import { Spinner } from 'components/Spinner';
import { useAuth } from 'hooks/useAuth';

function isErrorWithDetail(error: any): error is CreateAreaErrorResponse | UpdateAreaErrorResponse {
  return error && 'data' in error && 'detail' in error.data;
}

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  area_uuid?: string;
}

const centerMap = (map: mapboxgl.Map, coordinates: [number, number][]) => {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  coordinates.forEach(coord => {
    minX = Math.min(minX, coord[0]);
    minY = Math.min(minY, coord[1]);
    maxX = Math.max(maxX, coord[0]);
    maxY = Math.max(maxY, coord[1]);
  });

  const bounds = [[minX, minY], [maxX, maxY]] as any;
  map.fitBounds(bounds, { padding: 100, animate: false });
}

const AreaModal: React.FC<Props> = ({ setShowModal, area_uuid }) => {
  const { token } = useAuth();
  const { draw, areas, map } = useMap();

  const [createArea, { error: createAreaError, isLoading: createAreaIsLoading, reset }] = areaAPI.useCreateAreaMutation();
  const [updateArea, { error: updateAreaError, isLoading: updateAreaIsLoading }] = areaAPI.useUpdateAreaMutation();
  const { data: area, error: getAreaError, isLoading: getAreaIsLoading } = areaAPI.useGetAreaQuery(
    area_uuid || '', { skip: !area_uuid }
  );

  const [areaName, setAreaName] = useState('');
  const [description, setDescription] = useState('');
  const [validationErrors, setValidationErrors] = useState({ name: '', polygon: '' });

  useEffect(() => {
    if (!area || !map || !draw || !area_uuid) return;

    setAreaName(area.name);
    setDescription(area.description);

    const geojsonData: GeoJSON.Feature<GeoJSON.Geometry> = {
      type: "Feature",
      properties: {}, //@ts-ignore
      geometry: area.geometry,
    };

    //@ts-ignore
    const featureIdsAtGeoCoords = draw.getFeatureIdsAt(area.geometry.coordinates);

    // Only add the geojsonData to the draw if it isn't already added.
    if (featureIdsAtGeoCoords.length === 0) {
      draw.add(geojsonData); //@ts-ignore
      centerMap(map, area.geometry.coordinates[0]);
    }
  }, [area, map, draw]);

  const onClose = () => {
    setAreaName('');
    setDescription('');
    setValidationErrors({ name: '', polygon: '' });
    reset();
    setShowModal(false);
  }

  const validate = () => {
    let isValid = true;

    if (areaName.trim().length === 0) {
      setValidationErrors((prevState) => ({ ...prevState, name: 'Field is required' }));
      isValid = false;
    }

    const polygon = areas[0] || area?.geometry;

    if (!polygon) {
      setValidationErrors((prevState) => ({ ...prevState, polygon: 'Please draw a polygon' }));
      isValid = false;
    }

    return isValid;
  }

  const handleSubmitAdd = async () => {
    const isValid = validate();
    if (!isValid) return;

    try {
      await createArea({
          name: areaName,
          description: description,
          geometry: areas[0]
      }).unwrap().then(result => {
        result && onClose();
      });
    } catch (error) {
      console.error('Error creating area', error);
    }
  }

  const handleSubmitEdit = async () => {
    const isValid = validate();
    if (!isValid) return;
    try {
      await updateArea({
          uuid: area_uuid || '',
          name: areaName,
          description: description,
          geometry: areas[0]
      }).unwrap().then(result => {
        result && onClose();
      });
    } catch (error) {
      console.error('Error updating area', error);
    }
  }

  return <Modal onClose={onClose}>
    {
      (createAreaIsLoading || updateAreaIsLoading || getAreaIsLoading)
        ? <Spinner className={styles.customSpinner} />
        :
        <>
          <div className={styles.close} onClick={onClose}></div>
          <SectionDescribe
            description={description}
            setDescription={setDescription}
            areaName={areaName}
            setAreaName={setAreaName}
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
            area_uuid={area_uuid}
          />
          <SectionDraw validationErrors={validationErrors} setValidationErrors={setValidationErrors} />
          {
            area_uuid ?
              <button className={styles.buttonAdd} onClick={handleSubmitEdit}>Edit area</button>
              :
              <button className={styles.buttonAdd} onClick={handleSubmitAdd}>Add area</button>
          }
          <button className={styles.buttonCancel} onClick={onClose}>Cancel</button>
        </>
    }

    {isErrorWithDetail(createAreaError) && <div className={styles.error}>{createAreaError.data.detail}</div>}
    {isErrorWithDetail(updateAreaError) && <div className={styles.error}>{updateAreaError.data.detail}</div>}
  </Modal>
}

export default AreaModal;
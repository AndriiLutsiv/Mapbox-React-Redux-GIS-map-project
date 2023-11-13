// Tracks last user`s zoom and map coordinates. Is disabled if polygon feature is active
import { useEffect } from 'react';
import { useMap } from 'app/providers/MapProvider';
import { LAST_POSITION } from '../../utils/constants';

export function useTrackLastPosition(withPolygon: boolean = false) {
  const { map } = useMap();

  useEffect(() => {
    if (!map || withPolygon) return;
    const saveViewportPosition = () => {
      const url = new URL(window.location.toString());
      const center = map.getCenter();
      if (center) {
        const [x, y] = center.toArray();
        const zoom = map.getZoom();
        url.searchParams.set('zoom', String(zoom));
        url.searchParams.set('x', String(x));
        url.searchParams.set('y', String(y));
        localStorage.setItem(LAST_POSITION, url.toString());
      }
    };

    map.on('zoomend', saveViewportPosition);
    map.on('moveend', saveViewportPosition);

    return () => {
      map.off('zoomend', saveViewportPosition);
      map.off('moveend', saveViewportPosition);
    }
  }, [map]);

  return null;
}
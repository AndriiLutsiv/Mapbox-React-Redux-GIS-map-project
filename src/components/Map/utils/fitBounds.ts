import mapboxGl from 'mapbox-gl';
import { GetLayersResponse } from 'models/Map';
import { sortLayers } from './sortLayers';
import { AppDispatch } from 'store/store';
import { clearToken } from 'store/reducers/tokenSlice';

export const fitBounds = async (layers: GetLayersResponse, project_uuid: string, token: string, map: mapboxGl.Map, dispatch: AppDispatch,) => {
    const sortedLayers = sortLayers(layers);

    const lastLayer = sortedLayers[sortLayers.length - 1].layer_type;
    try {
        const response = await fetch(`${process.env.REACT_APP_TILE_API_URL}/services/${lastLayer}_${project_uuid!.replace(/-/g, '')}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        
        if (response.status === 401) {
            // If a 401 Unauthorized response is received, dispatch the clearToken action
            dispatch(clearToken());
        }

        const data = await response.json();

        data.bounds && map.fitBounds(data.bounds, { padding: 20, duration: 0 });
    } catch (error) {
        console.error("Failed to fetch bounds:", error);
    }
} 

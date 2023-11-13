/*
    This code creates a custom zoom control component for a Mapbox map, including zoom-in and zoom-out 
    buttons styled with SVG icons, which are added to the map's bottom-right corner, alongside the default scale control.
 */
import { useEffect } from 'react';
import styles from './ZoomControl.module.scss';
import { useMap } from 'app/providers/MapProvider';
import mapboxGl from 'mapbox-gl';

export class Zoom {
    map: mapboxGl.Map;

    constructor(map: mapboxGl.Map) {
        this.map = map;
    }

    onAdd() {
        // Container div for your custom zoom controls
        const container = document.createElement('div');
        container.className = styles.zoomControl;

        // ZoomIn button
        const zoomInButton = document.createElement('button');
        zoomInButton.className = styles.zoomIn;
        zoomInButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M9.99996 4.16602V15.8327M4.16663 9.99935H15.8333" stroke="#F5F5F5" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        zoomInButton.addEventListener('click', () => this.map.zoomIn());

        // ZoomOutbutton
        const zoomOutButton = document.createElement('button');
        zoomOutButton.className = styles.zoomOut;
        zoomOutButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4.16663 10H15.8333" stroke="#F5F5F5" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        zoomOutButton.addEventListener('click', () => this.map.zoomOut());

        //Add buttons to container
        container.appendChild(zoomInButton);
        container.appendChild(zoomOutButton);

        return container;
    }

    onRemove() { }
}

interface Props {
}

const ZoomControl: React.FC<Props> = () => {
    const { map } = useMap();
  
    useEffect(() => {
      if (map) {//@ts-ignore
        const scaleControlExists = map._controls.find(control => control instanceof mapboxGl.ScaleControl);
        //@ts-ignore
        console.log('map._controls', map._controls);
        if (!scaleControlExists) {
          map.addControl(new mapboxGl.ScaleControl(), 'bottom-right');
        }
        //@ts-ignore
        const zoomControlExists = map._controls.find(control => control instanceof Zoom);
        if (!zoomControlExists) {
          const customZoomControl = new Zoom(map);
          map.addControl(customZoomControl, 'bottom-right');
        }
      }
    }, [map]);
    
    return <></>;
  };

// const ZoomControl: React.FC<Props> = () => {
//     const { map } = useMap();

//     useEffect(() => {
//         if (map) {
//             console.log('fff');
//             map.addControl(new mapboxGl.ScaleControl(), 'bottom-right');
//             const customZoomControl = new Zoom(map);
//             map.addControl(customZoomControl, 'bottom-right');
//         }
//     }, [map]);
//     return <></>
// }

export default ZoomControl;
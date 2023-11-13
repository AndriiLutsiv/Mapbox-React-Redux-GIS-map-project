import mapboxGl from 'mapbox-gl';
import styles from './useMapSelect.styles.module.scss';


export const handlePopup = (
    e: mapboxGl.MapMouseEvent & { features?: mapboxGl.MapboxGeoJSONFeature[] },
    map: mapboxGl.Map,
    setUuidPoint: React.Dispatch<React.SetStateAction<string>>,
    setShowHierarchPopup: React.Dispatch<React.SetStateAction<boolean>>) => {

    const popup = new mapboxGl.Popup({
        closeButton: false,
        closeOnClick: true
    });

    const uuid = e.features![0].properties!.uuid;

    const popupContent = document.createElement('div');
    popupContent.className = styles.popupContent;

    popupContent.innerHTML = `
                <div class="${styles.closeButton}">&times;</div>
                <p class="${styles.text}">Show node sequence for this node?</p>
                <button id="customButton" class="${styles.showButton}">Show</button>
              `;

    popup.setLngLat(e.lngLat)
        .setDOMContent(popupContent)
        .addTo(map);

    // Add click event listener to the button
    document.getElementById('customButton')!.addEventListener('click', () => {
        setUuidPoint(uuid);
        setShowHierarchPopup(true);
        popup.remove();
    });

    // Add click event listener to the close button
    popupContent.querySelector(`.${styles.closeButton}`)!.addEventListener('click', () => {
        popup.remove();
    });
    return popup;
}
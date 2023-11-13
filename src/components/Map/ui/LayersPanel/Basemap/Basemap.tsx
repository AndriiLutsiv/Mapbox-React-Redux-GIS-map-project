/*
 This code defines a React component for selecting and changing the basemap style of a Mapbox map, 
 offering three options (Default, OpenStreetMap, Satellite), with radio buttons 
 */
import React, { useState } from 'react';
import { useMap } from 'app/providers/MapProvider';
import { CustomRadio } from '../CustomInputs';
import styles from '../CustomTabs/CustomTabs.module.scss'

enum BasemapValues {
    DEFAULT = 'default',
    OSM = 'osm',
    SATELLITE = 'satellite'
}
interface Props {
}

const Basemap: React.FC<Props> = () => {
    const { map } = useMap();

    const datafromLS: BasemapValues = localStorage.getItem('basemap') as BasemapValues;

    const [basemap, setBasemap] = useState<'default' | 'osm' | 'satellite'>(datafromLS || BasemapValues.DEFAULT);

    const basemapArr = [
        {
            id: BasemapValues.DEFAULT,
            label: 'Default',
            value: BasemapValues.DEFAULT
        },
        {
            id: BasemapValues.OSM,
            label: 'OSM',
            value: BasemapValues.OSM
        },
        {
            id: BasemapValues.SATELLITE,
            label: 'Satellite',
            value: BasemapValues.SATELLITE
        }
    ];

    const changeBasemap = (id: typeof basemap) => {
        if (!map?.isStyleLoaded()) return;
        map.setLayoutProperty('base-default', 'visibility', id === 'default' ? 'visible' : 'none');
        map.setLayoutProperty('base-osm', 'visibility', id === 'osm' ? 'visible' : 'none');
        map.setLayoutProperty('base-satellite', 'visibility', id === 'satellite' ? 'visible' : 'none');
        setBasemap(id);

        localStorage.setItem('basemap', id)
    }

    const basemapJSX = basemapArr.map((el) => {
        return <div className={styles.inputLayout} key={el.id}>
            <CustomRadio
                label={el.label}
                name={'basement'}
                value={el.value}
                isChecked={el.value === basemap}
                handleRadioChange={() => changeBasemap(el.value)} />
        </div>
    });

    return (<div data-testid="Basemap">
        {basemapJSX}
    </div>);
}

export default Basemap;

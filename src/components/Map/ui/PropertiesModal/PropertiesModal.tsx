import { useEffect, useState } from 'react';
import styles from './PropertiesModal.module.scss';
import classNames from 'classnames';
import { ButtonBack } from './ButtonBack';
import { ButtonForward } from './ButtonForward';
import { useMap } from 'app/providers/MapProvider';
import { PropertiesContent } from './PropertiesContent';
import { getParent } from './helpers/getParent';

interface Props {
}

const PropertiesModal: React.FC<Props> = (props) => {
    const { propertyFeature, clusteredGeojsonData, featureKeyMap } = useMap();
    const [expanded, setExpanded] = useState(false);

    const [parentLayers, setParentLayers] = useState<Map.LayerFeature[] | []>([]);
    const [subParentLayers, setSubParentLayers] = useState<Map.LayerFeature[] | []>([]);
    const [childrenLayers, setChildrenLayers] = useState<Map.LayerFeature[] | []>([]);
    const [subChildren, setSubChildren] = useState<Map.LayerFeature[] | []>([]);

    const getKeyByFeatureId = (id: string) => featureKeyMap[id];

    const processPoints = (propertyFeature: mapboxgl.MapboxGeoJSONFeature) => {
        const parents: Map.LayerFeature[] = [];
        const children: Map.LayerFeature[] = [];

        clusteredGeojsonData.points.forEach(point => {
            //look for parents and children
            const parentsMatch = getParent(propertyFeature, 'infra_parent')?.uuid === point.properties.uuid;
            // console.log('infraperent', point.properties.infra_parent?.uuid, point.properties );
            const childrenMatch = propertyFeature.properties?.uuid === point.properties.infra_parent?.uuid;

            parentsMatch && parents.push(point);
            childrenMatch && children.push(point);

            setParentLayers(parents);
            setChildrenLayers(children);
        });
    } 

    const processLines = (propertyFeature: mapboxgl.MapboxGeoJSONFeature) => {
        const parents: Map.LayerFeature[] = [];
        const subParents: Map.LayerFeature[] = [];
        const children: Map.LayerFeature[] = [];
        const subChildren: Map.LayerFeature[] = [];
        clusteredGeojsonData.lines.forEach(line => {
            const featureUuid = propertyFeature.properties?.uuid;
            const featureLayer = getKeyByFeatureId(featureUuid);
            const featureSubductParent = getParent(propertyFeature, 'subduct_parent')?.uuid;
            const featureTubeParent = getParent(propertyFeature, 'tube_parent')?.uuid;
            const featureCableParent = getParent(propertyFeature, 'cable_parent')?.uuid;
            const lineUuid = line.properties.uuid;

            //look for parents and children
            const parentsMatch = getParent(propertyFeature, 'infra_parent')?.uuid === lineUuid;
            const childrenMatch = featureUuid === line.properties.infra_parent?.uuid;
            parentsMatch && parents.push(line);
            childrenMatch && children.push(line);

            //look for subparent of tube, cable, fibre
            const tubeParensMatch = (featureLayer === 'tube') && (featureSubductParent === lineUuid);
            const cableParentMatch = (featureLayer === 'cable') && (featureSubductParent === lineUuid || featureTubeParent === lineUuid);
            const fibreParentMatch = (featureLayer === 'fibre') && (featureSubductParent === lineUuid || featureTubeParent === lineUuid || featureCableParent === lineUuid);
            tubeParensMatch && subParents.push(line);
            cableParentMatch && subParents.push(line);
            fibreParentMatch && subParents.push(line);

            //look for subchildren of cable, tube, subduct
            const cableChildrenMatch = (featureLayer === 'cable') && (featureUuid === line.properties.cable_parent?.uuid);
            const tubeChildrenMatch = featureLayer === 'tube' && (featureUuid === line.properties.tube_parent?.uuid);
            const subductChildrenMatch = featureLayer === 'subduct' && (featureUuid === line.properties.subduct_parent?.uuid);
            cableChildrenMatch && subChildren.push(line);
            tubeChildrenMatch && subChildren.push(line);
            subductChildrenMatch && subChildren.push(line);
        });

        setParentLayers(parents);
        setSubParentLayers(subParents);
        setChildrenLayers(children);
        setSubChildren(subChildren);
    };

    useEffect(() => {
        if (!propertyFeature?.properties) return;

        const isPoint = propertyFeature?.geometry.type === 'Point';
        const isLine = propertyFeature?.geometry.type === 'LineString'

        isPoint && processPoints(propertyFeature);
        isLine && processLines(propertyFeature);
    }, [propertyFeature]);

    return <div data-testid='PropertiesModal' className={classNames(styles.propertiesModal, { [styles.expanded]: expanded })}>
        <div className={styles.buttons}>
            <ButtonBack expanded={expanded} listItems={[...parentLayers, ...subParentLayers]} />
            <button className={styles.expandButton} onClick={() => setExpanded(!expanded)}>{expanded ? 'Fold' : 'Expand'}</button>
            <ButtonForward expanded={expanded} listItems={[...childrenLayers, ...subChildren]} />
        </div>
        <h1 className={styles.heading}>{getKeyByFeatureId(propertyFeature?.properties!.uuid)}</h1>
        <h2 className={styles.heading} style={{ fontSize: '12px' }}>{propertyFeature?.properties?.uuid}</h2>
        <PropertiesContent />
    </div>
}

export default PropertiesModal;
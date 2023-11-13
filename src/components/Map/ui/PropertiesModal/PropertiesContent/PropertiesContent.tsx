import styles from './PropertiesContent.module.scss';
import { useMap } from 'app/providers/MapProvider';

interface Props {

}

const PropertiesContent: React.FC<Props> = ({ }) => {
    const { propertyFeature } = useMap();

    if (!propertyFeature?.properties) return null;
    return <div className={styles.pointProperties}>
        <div className={styles.columnKey}>
            {Object.entries(propertyFeature.properties)
                .filter(([key, value]) => typeof value !== 'object' && !Array.isArray(value))
                .map(([key]) => <div key={key} className={styles.key}>{key}</div>)}
        </div>
        <div className={styles.columnValue}>
            {
                Object.entries(propertyFeature.properties)
                    .filter(([key, value]) => typeof value !== 'object' && !Array.isArray(value))
                    .map(([key, value]) => <div key={key} className={styles.value}>{value}</div>)
            }
        </div>
    </div>
}

export default PropertiesContent;
import styles from './PropertiesList.module.scss';
import classNames from 'classnames';
import { useMap } from 'app/providers/MapProvider';

interface Props {
    showList: boolean;
    className?: string;
    listItems: [] | Map.LayerFeature[];
    closeList: () => void;
}

const PropertiesList: React.FC<Props> = ({ showList, className, listItems, closeList }) => {
    const { setPropertyFeature, featureKeyMap } = useMap();

    function getKeyByFeatureId(id: string) {
        return featureKeyMap[id];
    }

    const handleClick = (feature: any) => {
        setPropertyFeature(feature);
        closeList();
    };

    if (listItems.length === 0) return null;
    return <div data-testid='PropertiesList' className={classNames(styles.list, className,
        { [styles.visible]: showList },
        { [styles.scrollable]: listItems.length >= 10 }
    )}>
        {
            listItems.map((feature: any, i: number) => <div
                key={i}
                className={styles.listItem}
                onClick={() => handleClick(feature)}
            >{feature.layer_type || getKeyByFeatureId(feature?.properties!.uuid)}
                &nbsp;{feature?.properties!.uuid}
            </div>)
        }
    </div>
}

export default PropertiesList;

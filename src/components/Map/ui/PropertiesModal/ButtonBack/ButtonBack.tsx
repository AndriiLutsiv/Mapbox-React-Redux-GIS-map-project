import { useState } from 'react';
import styles from './ButtonBack.module.scss';
import classNames from 'classnames';
import { PropertiesList } from '../PropertiesList';

interface Props {
    expanded: boolean;
    listItems: [] | Map.LayerFeature[];
}

const ButtonBack: React.FC<Props> = ({ expanded, listItems }) => {
    const [showList, setShowList] = useState(false);

    const closeList = () => setShowList(false);

    return <button data-testid='ButtonForward' className={classNames(styles.buttonBack,
        { [styles.visible]: expanded },
        { [styles.disabled]: listItems.length === 0 })}
        onMouseEnter={() => setShowList(listItems.length === 0 ? false : true)}
        onMouseLeave={() => setShowList(false)}
    >
        <span className={styles.buttonName}>back</span>
        <PropertiesList
            showList={showList}
            className={styles.list}
            listItems={listItems}
            closeList={closeList}
        />
    </button>
}

export default ButtonBack;

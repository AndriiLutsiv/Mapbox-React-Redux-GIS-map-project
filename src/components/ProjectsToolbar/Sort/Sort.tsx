import styles from './Sort.module.scss';
import classNames from 'classnames';
import { useParams } from 'react-router-dom';
import { Select } from '../Select';
import { Favourite } from '../Favourite';
import { useState } from 'react';
import { AreaModal } from 'components/AreaModal';

interface Props {
}

const Sort: React.FC<Props> = () => {
    const params = useParams();

    const [showModal, setShowModal] = useState(false);

    const areaPage = Object.keys(params).length === 0;
    const scenariosPage = Object.keys(params).length === 1;
    const projectsPage = Object.keys(params).length === 2;

    return <div data-testid="Sort" className={classNames(styles.sort,
        { [styles.width420]: projectsPage },
        { [styles.width482]: scenariosPage }
    )}>
        {(scenariosPage || projectsPage) && <Select />}
        {scenariosPage && <Favourite />}
        {
            areaPage ?
                <button className={styles.button} onClick={() => setShowModal(true)}>
                    <span className={styles.plus} />Add Area
                </button>
                : scenariosPage ?
                    <button className={styles.button}>
                        <span className={styles.plus} />Add Scenario
                    </button>
                    :
                    <button className={styles.button}>
                        <span className={styles.plus} />Add Project
                    </button>
        }
        {showModal && <AreaModal setShowModal={setShowModal} />}
    </div>
}

export default Sort;
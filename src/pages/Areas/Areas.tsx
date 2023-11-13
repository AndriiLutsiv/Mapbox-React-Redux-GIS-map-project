import { AreaCard } from 'components/AreaCard';
import styles from './Areas.module.scss';
import { useLocation } from 'react-router-dom';
import { areaAPI } from 'services/AreaService';
import { useAuth } from 'hooks/useAuth';
import { Spinner } from 'components/Spinner';
import { useState } from 'react';
import { AreaModal } from 'components/AreaModal';

interface Props {
}

const Areas: React.FC<Props> = () => {
    const { pathname } = useLocation();
    const { token } = useAuth();

    const { data: areas, error: getAreasError, isLoading: getAreasIsLoading } = areaAPI.useGetAreasQuery();

    const [showModal, setShowModal] = useState(false);
    const [areaUuid, setAreaUuid] = useState('');

    if (getAreasIsLoading) {
        return <Spinner className={styles.customSpinner} />
    }

    return <div data-testid='Areas' className={styles.areas}>
        <div className={styles.cardsContainer}>
            {
                areas?.map(area => {
                    return <AreaCard
                        key={area.uuid}
                        uuid={area.uuid}
                        name={area.name}
                        description={area.description}
                        geometry={area.geometry}
                        link={`${pathname}/${area.uuid}`}
                        setAreaUuid={setAreaUuid}
                        setShowModal={setShowModal}
                    />
                })
            }
        </div>
        {showModal && <AreaModal area_uuid={areaUuid} setShowModal={setShowModal} />}
    </div>
}

export default Areas;
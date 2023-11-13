import { CardSettings } from 'components/CardSettings';
import styles from './AreaCard.module.scss';
import { useNavigate } from 'react-router-dom';
import { areaAPI } from 'services/AreaService';
import { useAuth } from 'hooks/useAuth';

interface Props {
    uuid: string;
    name: string;
    description: string;
    geometry: unknown;
    link: string;
    setAreaUuid: React.Dispatch<React.SetStateAction<string>>;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}

const AreaCard: React.FC<Props> = ({ uuid, name, description, link, setAreaUuid, setShowModal }) => {
    const navigate = useNavigate();
    const [deleteArea, { error: deleteAreaError, isLoading: deleteAreaIsLoading }] = areaAPI.useDeleteAreaMutation();

    const handleEdit = () => {
        setAreaUuid(uuid);
        setShowModal(true);
    }

    const handleDelete = async () => {
        try {
            await deleteArea(uuid || '');
        } catch (error) {
            console.error('Error deleting area:', error);
        }
    }

    return <div className={styles.areaCard} onClick={() => navigate(link)}>
        <h1 className={styles.title}>{name}</h1>
        <p className={styles.description}>{description}</p>
        <CardSettings editText='Edit' editHandler={handleEdit} deleteHandler={handleDelete} />
    </div>
}

export default AreaCard;
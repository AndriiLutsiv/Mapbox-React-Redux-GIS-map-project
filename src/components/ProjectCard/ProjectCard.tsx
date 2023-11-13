import { CardSettings } from 'components/CardSettings';
import styles from './ProjectCard.module.scss';
import { useNavigate, useLocation } from 'react-router-dom';

interface Props {
    uuid: string;
    name: string;
    num_of_properties: number;
    head_end: string;
    link: string;
}

const ProjectCard: React.FC<Props> = ({ uuid, name, num_of_properties, head_end }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return <div data-testid="ProjectCard" className={styles.projectCard} onClick={() => navigate(`${pathname}/${uuid}`)}>
        <h1 className={styles.title}>{name}</h1>
        <p className={styles.text}>Property count: {num_of_properties}</p>
        <p className={styles.text}>Telephone Exchange: {head_end}</p>
        <CardSettings editText='Rename' editHandler={() => { }} deleteHandler={() => {}}/>
    </div>
}

export default ProjectCard;

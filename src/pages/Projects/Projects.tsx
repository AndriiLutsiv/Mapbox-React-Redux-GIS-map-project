import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styles from './Projects.module.scss';
import { ProjectCard } from 'components/ProjectCard';
import { useAuth } from 'hooks/useAuth';
import { projectAPI } from 'services/ProjectService';
import { Spinner } from 'components/Spinner';
import { sortCards } from 'utils/sort';
import { SORT_DIRECTION, SORT_KEY, SORT_OPTION, SortDetails } from 'constants/sorting';

interface Props {
}

const Projects: React.FC<Props> = () => {
    const { pathname } = useLocation();
    const { param2 } = useParams();

    const { token } = useAuth();
    const { data: projects, error: getProjectsError, isLoading: getProjectsIsLoading } = projectAPI.useGetProjectsQuery({scenario_uuid: param2 || '' });

    const [sortBy, setSortBy] = useState<SortDetails>({
        option: SORT_OPTION.PROPERTY,
        direction: SORT_DIRECTION.DESC,
        text: 'Property Count'
    });

    useEffect(() => {
        const sortListener = (event: CustomEvent<SortDetails>) => {
            setSortBy(event.detail)
        }

        window.addEventListener(SORT_KEY, sortListener as EventListener);

        return () => {
            window.removeEventListener(SORT_KEY, sortListener as EventListener);
        };
    }, []);

    if (getProjectsIsLoading) {
        return <Spinner className={styles.customSpinner} />
    }

    return <div data-testid="Projects" className={styles.projects}>
        <div className={styles.cardsContainer}>
            {
                projects && sortCards(projects, sortBy.option, sortBy.direction)
                    .map((project) => (
                        <ProjectCard
                            key={project.uuid}
                            uuid={project.uuid}
                            link={`${pathname}/${project.uuid}`}
                            name={project.name!}
                            num_of_properties={project.num_of_properties!}
                            head_end={project.head_end!}
                        />
                    ))
            }
        </div>
    </div>
}

export default Projects;
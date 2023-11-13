
import { BreadCrumbs } from './BreadCrumbs';
import styles from './ProjectsToolbar.module.scss';
import { Outlet } from 'react-router-dom';
import { Sort } from './Sort';

interface Props {
}

const ProjectsToolbar: React.FC<Props> = () => {

  return <div data-testid="ProjectsToolbar" className={styles.projectsToolbar}>
    <div className={styles.content}>
      <BreadCrumbs />
        <Sort />
    </div>
    <Outlet />
  </div>
}

export default ProjectsToolbar;
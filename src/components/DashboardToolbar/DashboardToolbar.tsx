
import { BreadCrumbs } from './BreadCrumbs';
import styles from './DashboardToolbar.module.scss';
import { Outlet } from 'react-router-dom';
import { Select } from './Select';

interface Props {
}

const DashboardToolbar: React.FC<Props> = () => {

  return <div data-testid="DashboardToolbar" className={styles.projectsToolbar}>
    <div className={styles.content}>
      <BreadCrumbs />
      <Select />
    </div>

    <Outlet />
  </div>
}

export default DashboardToolbar;
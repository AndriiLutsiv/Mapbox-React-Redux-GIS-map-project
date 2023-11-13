
import classNames from 'classnames';
import styles from './BreadCrumbs.module.scss';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCrumbName } from '../utils/getCrumbName';

interface Props {
}

const BreadCrumbs: React.FC<Props> = () => {
  const location = useLocation();

  const breadcrumbs = location.pathname.split('/').filter(segment => segment !== '');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(breadcrumbs.length - 1);
  }, [breadcrumbs]);

  return <div data-testid='breadCrumbs' className={styles.breadCrumbs}>
    <div className={styles.crumbsContainer}>
      {
        breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const path = `/${breadcrumbs.slice(0, index + 1).join('/')}`;

          return isLast ?
            <span data-testid='crumb' key={index} className={classNames(styles.crumb, { [styles.active]: isLast })}>
              {getCrumbName(index)}
            </span>
            :
            <Link
            data-testid='crumb'
              key={index}
              to={path}
              className={classNames(styles.crumb, { [styles.active]: isLast })}
            >
              {getCrumbName(index)}
            </Link>
        })
      }
    </div>
  </div>
}

export default BreadCrumbs;
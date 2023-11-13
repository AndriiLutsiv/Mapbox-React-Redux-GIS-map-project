import { ReactNode, useState } from "react";
import styles from './NavItem.module.scss';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';

interface Props {
    link: string;
    children: ReactNode;
    pointerText: string;
}

const NavItem: React.FC<Props> = ({ link, children, pointerText }) => {
    const { pathname } = useLocation();

    const [showPointer, setShowPointer] = useState(false);

    return <Link
        to={link}
        className={classNames(styles.navItem, { [styles.active]: pathname === link })}
        onMouseOver={() => setShowPointer(true)}
        onMouseOut={() => setShowPointer(false)}
    >
        <div className={styles.iconContainer}>
            {children}
        </div>
        {showPointer && <div className={styles.pointer}>{pointerText}</div>}
    </Link>
}

export default NavItem;
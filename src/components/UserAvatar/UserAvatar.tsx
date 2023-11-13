import styles from './UserAvatar.module.scss';
import defaultIcon from './images/Avatar.png';
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from 'constants/routes';
import classNames from "classnames";
import { useState } from "react";
import { useAuth } from "hooks/useAuth";

interface Props {
}

const UserAvatar: React.FC<Props> = () => {
    const { pathname } = useLocation();
    const { setToken } = useAuth();
    const [button, setButton] = useState(false);

    return <>
        {
            button && <button className={styles.button} onClick={() => setToken!('')}>log out</button>
        }
        <Link
            to='#'
            className={classNames(styles.userAvatar, { [styles.active]: pathname === ROUTES.PROJECTS })}
            onClick={() => setButton(prev => !prev)}
        >
            <img src={defaultIcon} alt="user-avatar" />
        </Link>

    </>
}

export default UserAvatar;
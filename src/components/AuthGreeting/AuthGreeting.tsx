import styles from './AuthGreeting.module.scss';
import Logomark from './images/Logomark.svg';
import { Switcher } from 'components/Switcher';

interface Props {
    title: string;
    subtitle?: string;
}

const AuthGreeting: React.FC<Props> = ({ title, subtitle }) => {
    return <div className={styles.authGreeting}>
        <div className={styles.logo}><img src={Logomark} alt="logo" /></div>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <h2 className={styles.subtitle}>{subtitle}</h2>}
        <div className={styles.themeRow}>
            <div className={styles.themeText}>Change Theme</div>
            <Switcher/>
        </div>
    </div>
}

export default AuthGreeting;
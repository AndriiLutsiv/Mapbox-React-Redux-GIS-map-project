import { useTheme, Theme } from "app/providers/ThemeProvider";
import styles from './Switcher.module.scss';

interface Props {
}

const Switcher: React.FC<Props> = () => {
    const {theme, toggleTheme} = useTheme()

    return <label className={styles.switcher}>
    <input checked={theme === Theme.DARK} type="checkbox" onChange={toggleTheme}/>
    <span className={styles.slider}/>
  </label>
}

export default Switcher;
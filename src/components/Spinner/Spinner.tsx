import classNames from 'classnames';
import styles from './Spinner.module.scss';

interface Props {
    className?: string;
}

const Spinner: React.FC<Props> = ({ className }) => {
    return <div data-testid='Spinner' className={classNames(styles.spinner, className)}><div>
    </div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
    </div>
}

export default Spinner;
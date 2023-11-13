import styles from './NotFound.module.scss';

interface Props {
}

const NotFound: React.FC<Props> = (props) => {
    return <div data-testid="NotFound" className={styles.notFound}>        
        404
    </div>
}

export default NotFound;
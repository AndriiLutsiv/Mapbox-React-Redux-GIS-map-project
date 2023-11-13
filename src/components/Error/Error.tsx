import React from 'react';
import styles from './Error.module.scss';

interface Props {
    
}

const Error:React.FC<Props> = () => {
    return <h2 className={styles.error}>Something went wrong. Please try again later</h2>
}

export default Error;
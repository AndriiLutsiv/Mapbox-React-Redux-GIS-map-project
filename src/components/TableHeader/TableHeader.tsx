import React from 'react';
import styles from './TableHeader.module.scss';

interface Props {
    title?: string;
    subtitle?: string;
    children: any;
}

const TableHeader: React.FC<Props> = ({title, subtitle, children}) => {
    return (<>
        <div className={styles.tableHeader}>
            {(title || subtitle) && <div className={styles.tableTop}>
                <h1 className={styles.tableHeaderTitle}>{title}</h1>
                <p className={styles.tableHeaderSubtitle}>{subtitle}</p>
            </div>}
            <div className={styles.tableBottom}>
                {children}
            </div>

        </div>
    </>)
};

export default TableHeader;
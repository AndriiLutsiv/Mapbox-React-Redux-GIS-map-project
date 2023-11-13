import React from 'react';
import styles from './Pagination.module.scss';
import { Button } from 'components/Button';

interface Props {
    data: any,
    pageSize: number,
    currentPage: number,
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

const Pagination: React.FC<Props> = ({ data, pageSize, currentPage, setCurrentPage }) => {
    const countOfPages = Math.ceil(data.length / pageSize);

    return (<div className={styles.pagination}>
        <p className={styles.paginationText}>{currentPage} of {countOfPages}</p>
        <div className={styles.buttons}>
            {currentPage !== 1 && <Button onClick={() => setCurrentPage(currentPage - 1)}>Prev</Button>}
            {currentPage !== countOfPages && countOfPages !== 0 && <Button onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>}
        </div>
    </div>);
}

export default Pagination;
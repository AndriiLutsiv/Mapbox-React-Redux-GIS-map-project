import classNames from 'classnames';
import styles from './Delta.module.scss';
import React from 'react';

interface Props {
    delta: number;
    units: '%' | 'x'
}

export const Delta:React.FC<Props> = ({ delta, units }) => {

    const dataWithUnits = (data: number, units:  '%' | 'x') => {
        if(units === '%') {
            return `${(Math.round(data * 100))}%` 
        }

        return `${data}x`
    }
    return <div>
        <span className={styles.arrowBanner}>
            <svg
                className={classNames(styles.arr,
                    {
                        [styles.yellow]: delta * 100 <= 20 && delta * 100 >= -20 && units === '%',
                        [styles.rotate]: delta > 0,
                    })}
                xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M7.99998 3.33301V12.6663M7.99998 12.6663L12.6666 7.99967M7.99998 12.6663L3.33331 7.99967" stroke="#E5E5E5" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {dataWithUnits(delta, units)}
        </span>
    </div>
}
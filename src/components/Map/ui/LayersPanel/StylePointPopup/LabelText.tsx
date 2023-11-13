import React from 'react';
import styles from './StylePointPopup.module.scss';
import { CustomCheckbox } from '../CustomInputs';

interface Props {
    labelVisibility: boolean,
    setLabelVisibility: React.Dispatch<React.SetStateAction<boolean>>
}

export const LabelText: React.FC<Props> = ({ labelVisibility, setLabelVisibility }) => {
    return <section className={styles.column} data-testid="label-text">
        <div className={styles.titleBox}>
            <h1 className={styles.heading}>Label</h1>
        </div>
        <div className={styles.colours}>

            <CustomCheckbox
                label={'Show labels'}
                value={'name'}
                isChecked={labelVisibility}
                onChange={() => {
                    setLabelVisibility(!labelVisibility);
                }}
            />
        </div>
    </section>
}
import React from 'react';
import styles from './CustomCheckbox.module.scss';

interface Props {
    label: string;
    value: string;
    isChecked: boolean;
    onChange: () => void;
    isDisabled?: boolean;
}
const CustomCheckbox: React.FC<Props> = ({ label, value, isChecked, onChange, isDisabled }) => {
    return <label className={styles.input} data-testid="Custom-checkbox-label">

        <input
            data-testid="Custom-checkbox-input"
            type="checkbox"
            value={value}
            disabled= {isDisabled}
            checked={isDisabled ? false : isChecked}
            onChange={onChange}
        />
        <span className={styles.inputCheckmark}>
            <svg className={styles.checkmarkIcon} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M11.6668 3.5L5.25016 9.91667L2.3335 7" stroke="#BB2A65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </span>

        <span className={styles.labelText} title={label}>{label}</span>
    </label>
}

export default CustomCheckbox;
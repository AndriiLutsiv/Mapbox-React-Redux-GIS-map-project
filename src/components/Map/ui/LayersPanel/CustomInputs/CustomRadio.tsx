import React from 'react';
import styles from './CustomCheckbox.module.scss';

interface Props {
    label: string;
    name: string;
    value: string;
    isChecked: boolean;
    handleRadioChange: () => void;
}
const CustomRadio: React.FC<Props> = ({ label, name, value, isChecked, handleRadioChange }) => {
    return <label className={styles.input} data-testid="Custom-radio-label">
        <input type="radio"  data-testid="Custom-radio-input"
            name={name}
            value={value}
            checked={isChecked}
            onChange={handleRadioChange} />
        <span className={styles.inputRadioCheckmark}>
            <div className={styles.checkmarkRadioIcon}></div>
        </span>

        <span className={styles.labelText} title={label}>{label}</span>
    </label>
}

export default CustomRadio;
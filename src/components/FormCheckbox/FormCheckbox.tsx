import styles from './FormCheckbox.module.scss';

interface Props {
    text?: string;
    checked: boolean;
}

const FormCheckbox: React.FC<Props> = ({ text, checked }) => {
    return <>
        <label className={styles.formCheckboxContainer}>
            <input type="checkbox" checked={checked} onChange={() => null} />
            <div className={styles.checkmark}></div>
        </label>
        <div className={styles.text}>{text}</div>
    </>
}

export default FormCheckbox;
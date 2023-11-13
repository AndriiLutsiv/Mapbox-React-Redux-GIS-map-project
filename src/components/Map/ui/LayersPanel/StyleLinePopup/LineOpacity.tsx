import styles from './StyleLinePopup.module.scss';

interface Props {
    opacity: number;
    setOpacity: React.Dispatch<React.SetStateAction<number>>;
};

const LineOpacity: React.FC<Props> = ({ opacity, setOpacity }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = parseFloat(e.target.value);

        if (inputValue >= 0.1 && inputValue <= 1) {
            const roundedValue = Math.round(inputValue * 10) / 10; // Round to one decimal place
            setOpacity(roundedValue);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pastedValue = parseFloat(e.clipboardData.getData('text'));

        if (pastedValue >= 0.1 && pastedValue <= 1) {
            const roundedValue = Math.round(pastedValue * 10) / 10; // Round to one decimal place
            setOpacity(roundedValue);
        }
        e.preventDefault(); // Prevent the default paste behavior
    };

    return <section className={styles.column}
         data-testid="line-opacity">
        <div className={styles.titleBox}>
            <h1 className={styles.heading}>Opacity</h1>
        </div>
        <div className={styles.numberInput}>
            <input
                type="number"
                data-testid="line-opacity-input"
                min={0.1}
                max={1}
                step={0.1}
                value={opacity}
                onChange={handleInputChange}
                onPaste={handlePaste}
            />
        </div>
    </section>
}

export default LineOpacity;

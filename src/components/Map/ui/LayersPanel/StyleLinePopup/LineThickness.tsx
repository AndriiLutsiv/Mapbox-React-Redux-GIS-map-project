import styles from './StyleLinePopup.module.scss';

interface Props {
    thickness: number;
    setThickness: React.Dispatch<React.SetStateAction<number>>;
}

const LineThickness: React.FC<Props> = ({ thickness, setThickness }) => {

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = parseInt(e.target.value, 10);

        if (inputValue >= 1 && inputValue <= 10) {
            setThickness(inputValue);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pastedValue = e.clipboardData.getData('text');
        const parsedValue = parseInt(pastedValue, 10);

        if (parsedValue >= 1 && parsedValue <= 10) {
            setThickness(parsedValue);
        }
        e.preventDefault(); // Prevent the default paste behavior
    };

    return (
        <section className={styles.column} data-testid="line-thickness">
            <div className={styles.titleBox}>
                <h1 className={styles.heading}>Thickness</h1>
            </div>
            <div className={styles.numberInput}>
                <input
                    className={styles.thicknessInput}
                    type="number"
                    data-testid="line-thickness-input"
                    min={1}
                    max={10}
                    step={1}
                    value={thickness}
                    onChange={handleInputChange}
                    onPaste={handlePaste}
                />
            </div>
        </section>
    );
};

export default LineThickness;

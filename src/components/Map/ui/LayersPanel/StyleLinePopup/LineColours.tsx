import classNames from 'classnames';
import styles from './StyleLinePopup.module.scss';
import { colours } from 'components/Map/styles/colours';
import { ChangeEvent, useRef } from 'react';
import debounce from 'lodash/debounce';

interface Props {
    color: string;
    setColor: React.Dispatch<React.SetStateAction<string>>;
};

const LineColours: React.FC<Props> = ({ color, setColor }) => {
    const colorInputRef = useRef<HTMLInputElement>(null);

    const handleClick = (colour: { name: string, value: string }) => {
        setColor(colour.value);
    }

    // keep debounce in ref to access it in between renders
    const debouncedSetColor = useRef(debounce((newColor: string) => {
        setColor(newColor);
    }, 1000)).current;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        //This ensures that if there's any pending execution from a previous interaction, it gets canceled.
        debouncedSetColor.cancel();
        debouncedSetColor(e.target.value);
    }

    return (
        <section data-testid="line-colors" className={styles.column}>
            <div className={styles.titleBox}>
                <h1 className={styles.heading}>Colour</h1>
            </div>
            <div className={styles.colours}>
                {colours.map((colour, i) => (
                    <div key={i} className={classNames(styles.colourPair, { [styles.active]: color === colour.value })}
                        onClick={() => handleClick(colour)}>
                        <div className={styles.colourValue} style={{ background: colour.value }} />
                        <div className={styles.colourName}>{colour.name}</div>
                    </div>
                ))}
                <div className={styles.colourPair} onClick={() => colorInputRef.current?.click()}>
                    <label htmlFor="customColorInput" className={styles.customValue} style={{ backgroundColor: color }}>
                        <input
                            data-testid="custom-color-input"
                            ref={colorInputRef}
                            id="customColorInput"
                            type="color"
                            value={color}
                            onChange={handleChange}
                            className={styles.fullOverlayInput}
                        />
                    </label>
                    <div className={styles.colourName}>Custom</div>
                </div>
            </div>
        </section>
    );
}

export default LineColours;

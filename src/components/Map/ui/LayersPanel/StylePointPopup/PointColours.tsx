import classNames from 'classnames';
import styles from './StylePointPopup.module.scss';
import { colours } from 'components/Map/styles/colours';
import { ChangeEvent, useRef } from 'react';
import { debounce } from 'lodash';

interface Props {
    color: string;
    setColor: React.Dispatch<React.SetStateAction<string>>;
};

const Colours: React.FC<Props> = (props) => {
    const { color, setColor } = props;

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

    return <section className={styles.column}
        data-testid="point-colours">
        <div className={styles.titleBox}>
            <h1 className={styles.heading}>Colour</h1>
        </div>
        <div className={styles.colours}>
            {
                colours.map((colourItem, i) => {
                    return <div key={i} className={classNames(styles.colourPair, {
                        [styles.active]: color === colourItem.value
                    })} onClick={() => handleClick(colourItem)}>
                        <div className={styles.colourValue} style={{ background: colourItem.value }} />
                        <div className={styles.colourName}>{colourItem.name}</div>
                    </div>
                })
            }
            <div className={styles.colourPair} onClick={() => document.getElementById('customColorInput')!.click()}>
                <label htmlFor="customColorInput" className={styles.customValue} style={{ backgroundColor: color }}>
                    <input
                        id="customColorInput"
                        data-testid="point-colours-custom"
                        type="color"
                        value={color}
                        onChange={handleChange}
                        onClick={(e) => e.stopPropagation()}
                        className={styles.fullOverlayInput}
                    />
                </label>
                <div className={styles.colourName}>Custom</div>
            </div>
        </div>
    </section>
}

export default Colours;
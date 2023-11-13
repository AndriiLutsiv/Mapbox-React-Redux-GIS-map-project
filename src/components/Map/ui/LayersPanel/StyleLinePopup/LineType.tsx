import { LineType as LT } from 'components/Map/styles/defaultStyles';
import styles from './StyleLinePopup.module.scss';
import classNames from 'classnames';

interface Props {
    lineType: LT;
    setLineType: React.Dispatch<React.SetStateAction<LT>>;
};

const LineType: React.FC<Props> = ({ lineType, setLineType}) => {

    const handleClick = (lineType: LT) => {
        setLineType(lineType);
    }
    return <section className={styles.column}
        data-testid="line-type">
        <div className={styles.titleBox}>
            <h1 className={styles.heading}>Type</h1>
        </div>
        <div className={styles.options}>
            <div
                className={classNames(styles.typeName, { [styles.active]: lineType === 'dotted' })}
                onClick={() => handleClick('dotted')}
            >
                Dotted
            </div>
            <div
                className={classNames(styles.typeName, { [styles.active]: lineType === 'solid' })}
                onClick={() => handleClick('solid')}
            >
                Solid
            </div>
            <div
                className={classNames(styles.typeName, { [styles.active]: lineType === 'dashed' })}
                onClick={() => handleClick('dashed')}
            >
                Dashed
            </div>
        </div>
    </section>
}

export default LineType;

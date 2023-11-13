import classNames from "classnames";
import React from "react";
import styles from './Indicator.module.scss';

interface Props {
    currentColor: string;
    onClick: () => void;
    opacity: number;
    height: number;
    lineType: string;
}

const LineIndicator: React.FC<Props> = ({ currentColor, opacity, height, lineType, onClick }) => {
    const handleClick = () => {
        onClick()
    }
    return <div data-testid="line-indicator" className={classNames(styles.lineIndicatorWrapper)}
    onClick={handleClick}
    >
        <div className={classNames(styles.lineIndicator)}
            style={{
                borderBottom: `${height}px ${lineType} ${currentColor}`,
                opacity: opacity ?? 1,
            }}
            data-testid="line-indicator-icon"
        ></div>
    </div>
}

export default LineIndicator;
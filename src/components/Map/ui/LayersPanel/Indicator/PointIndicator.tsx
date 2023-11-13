import classNames from "classnames";
import React from "react";
import styles from './Indicator.module.scss';
import {shapes} from 'components/Map/styles/shapes';

interface Props {
    type: string;
    currentColor: string;
    onClick: () => void;
    shapeForm: any
}

const PointIndicator: React.FC<Props> = ({ type, currentColor, onClick, shapeForm }) => {
    const shape = shapes.find((el) => el.name === type);

    const handleClick = () => {
        onClick()
    }
    return <div className={classNames(styles.colorIndicator)}
        onClick={handleClick}
        data-testid="point-indicator" 
        dangerouslySetInnerHTML={shape ? { __html: shape.svg.replace('%COLOR%',currentColor)} : { __html: shapeForm.replace('%COLOR%', currentColor) }}
        // dangerouslySetInnerHTML={shapeForm && { __html: shape.svg(currentColor) }}
    ></div>
}

export default PointIndicator;
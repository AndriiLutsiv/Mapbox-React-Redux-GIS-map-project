import React from 'react';
import styles from './Button.module.scss';
import classNames from 'classnames';

interface Props {
    children?: any;
    onClick?: () => void;
    icon?: any;
    active?: boolean;
    disabled?: boolean;
}

const Button: React.FC<Props> = ({ children, onClick = () => { }, icon, active, disabled }) => {
    const clickHandler = () => {
        onClick();
    }

    return (<button
        data-testid="Button"
        className={classNames(styles.button, { [styles.active]: active })}
        onClick={clickHandler}
        disabled={disabled}
    >

        {icon}
        {children}
    </button>)
}

export default Button;
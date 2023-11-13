import Button from "components/Button/Button";
import styles from './styles.module.scss';
import React, { useState } from "react";
import classNames from "classnames";

interface Props {
    buttons: {
        label: {
            icon: JSX.Element;
            text: string;
        } | string;
        id: string;
        onClick: () => void;
    }[]
    defaultValue?: string;
    smallerTabs?: boolean;
}

const ButtonGroup: React.FC<Props> = ({ buttons,  defaultValue, smallerTabs}) => {
    const [activeTab, setActiveTab] = useState(defaultValue  || buttons[0].id);

    const buttonsJSX = buttons.map((el) => {
        return <Button 
            key={el.id}
            icon={typeof el.label === 'object' ? el.label.icon : null}
            onClick={() => {
                setActiveTab(el.id);
                el.onClick();
            }}

            active={activeTab === el.id}
            >
            {typeof el.label === 'object' ? el.label.text : el.label}
        </Button>
    });


    return <div className={classNames(styles.buttonGroup, {[styles.smallFont]: smallerTabs})}>
        {buttonsJSX}
    </div>
}

export default ButtonGroup;
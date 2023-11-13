import React, { useState } from "react";
import styles from './Tabs.module.scss';
import { ButtonGroup } from "components/ButtonGroup";
import classNames from "classnames";

interface Props {
    config: {
        label:
        {
            icon: JSX.Element;
            text: string;
        } | string;
        key: string;
        children: JSX.Element;
        onClick?: any
    }[];
    defaultValue?: string;
    controlsLeft?: boolean;
    smallerTabs?:boolean;
    isScrolled?:boolean;
}

const Tab: React.FC<Props> = ({ config, defaultValue, controlsLeft, smallerTabs, isScrolled }) => {
    const [activeTab, getActiveTab] = useState(defaultValue + "" || config[0].key);
    
    const buttonGroupConfig = config.map((el) => {
        return {
            label: el.label,
            id: el.key,
            onClick: () => {
                if(el.onClick) {
                    el.onClick();
                }
                getActiveTab(el.key);
            }
        }
    });

    const children = config.map((element) => {
        return activeTab === element.key && <React.Fragment key={element.key}>
            {element.children}
        </React.Fragment>
    });

    return <div className={styles.tabs}>
        <div className={classNames(styles.tabsHeader, {
            [styles.tabsHeaderLeft]: controlsLeft, 
            [styles.tabsHeaderScrolled]: isScrolled})} >
                
            <ButtonGroup
                buttons={buttonGroupConfig}
                defaultValue={defaultValue}
                smallerTabs = {smallerTabs} />
        </div>
        <div className={classNames({[styles.bodyScrolled]: isScrolled})}>
            {children}
        </div>
    </div>
};

export default Tab;
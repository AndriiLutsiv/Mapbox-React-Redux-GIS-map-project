import { ConfigProvider, Select } from "antd";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import styles from './Select.module.scss';
import { selectToken } from "./utils/designToken";
import { tagRender } from "./utils/TagRender";

interface Props {
    data: { value: number; label: string; }[];
    label?: string;
    // value: string | string[] | number | number[];
    value?: any;
    isTags?: boolean;
    onChange?: (param: number | string | any) => void;
    // onChange?: (value, option: Option | Array<Option>) => {};
    isBlock?: boolean,
    width?:string;
    gapBottom?: boolean
}

export const SelectTemplate: React.FC<Props> = ({ gapBottom, data, value, label, isTags, onChange, isBlock, width }) => {
    const [selectValue, setSelectValue ] = useState(value);

    useEffect(() => {
        setSelectValue(value)
    }, [value])

    const handleClick = (value: number) => {
        if(onChange){
            onChange(value);
        }
        setSelectValue(value);
    }

    return <div data-testid="SelectAreas" className={classNames(styles.select)}><ConfigProvider theme={{
        token: selectToken,
    }}>
        <div className={classNames(styles.select, {[styles.block]: isBlock, [styles.mb16]: gapBottom})}>
            {label && <label className={styles.selectLabel}>{label}</label>}
            <Select
                showSearch
                className={styles.select}
                mode={isTags ? "tags" : void 0}
                style={{ minWidth: '300px', width: width || '300px' }}
                placeholder="All"
                onChange={handleClick}
                options={data}
                tagRender={tagRender}
                value={selectValue ?? []}
            />
        </div>

    </ConfigProvider>
    </div>
}
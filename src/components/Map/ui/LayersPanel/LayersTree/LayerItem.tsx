import React, { useState } from "react";
import { Icon } from "./Icon";
import styles from './LayerItem.module.scss';
import classNames from "classnames";

interface Layer {
    layerName: string;
    indicator?: {
        color: string;
        shape: string;
    };
    children?: Layer[];
}


export const LayerItem: React.FC<Layer> = ({ layerName, indicator, children }) => {
    const [isShow, setIsShow] = useState(false);
    const handleClickCopy = () => console.log('Copy');
    const handleClickDelete = () => console.log('Delete');
    const handleClickEdit = () => console.log('Edit');

    return <div className={styles.parent}>
        <div className={styles.layerItem} onClick={() => setIsShow(!isShow)}>
            {children?.length && <svg className={classNames(styles.nestingIcon, {
                [styles.rotate]: isShow
            })} xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M3 6L5 4L3 2" stroke="#D6D6D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>}

            <Icon className={styles.itemIcon} />
            {indicator && <div
                className={classNames(styles.indicator, {
                    [styles.line]: indicator.shape === 'line',
                    [styles.square]: indicator.shape === 'square',
                    [styles.circle]: indicator.shape === 'circle',
                })}
                style={{ backgroundColor: indicator.color }}
                data-testid="indicator"
                ></div>
            }
            <p className={styles.layerName}>{layerName}</p>

            <div className={styles.itemControls}>
                <button data-testid="copy-button" className={styles.controlBtn} onClick={handleClickCopy}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M6.25 2.5H12.1667C14.0335 2.5 14.9669 2.5 15.68 2.86331C16.3072 3.18289 16.8171 3.69282 17.1367 4.32003C17.5 5.03307 17.5 5.96649 17.5 7.83333V13.75M5.16667 17.5H11.9167C12.8501 17.5 13.3168 17.5 13.6733 17.3183C13.9869 17.1586 14.2419 16.9036 14.4017 16.59C14.5833 16.2335 14.5833 15.7668 14.5833 14.8333V8.08333C14.5833 7.14991 14.5833 6.6832 14.4017 6.32668C14.2419 6.01308 13.9869 5.75811 13.6733 5.59832C13.3168 5.41667 12.8501 5.41667 11.9167 5.41667H5.16667C4.23325 5.41667 3.76654 5.41667 3.41002 5.59832C3.09641 5.75811 2.84144 6.01308 2.68166 6.32668C2.5 6.6832 2.5 7.14991 2.5 8.08333V14.8333C2.5 15.7668 2.5 16.2335 2.68166 16.59C2.84144 16.9036 3.09641 17.1586 3.41002 17.3183C3.76654 17.5 4.23325 17.5 5.16667 17.5Z" stroke="#D6D6D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <button data-testid="delete-button" className={styles.controlBtn} onClick={handleClickDelete}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M13.3333 5.00033V4.33366C13.3333 3.40024 13.3333 2.93353 13.1517 2.57701C12.9919 2.2634 12.7369 2.00844 12.4233 1.84865C12.0668 1.66699 11.6001 1.66699 10.6667 1.66699H9.33333C8.39991 1.66699 7.9332 1.66699 7.57668 1.84865C7.26308 2.00844 7.00811 2.2634 6.84832 2.57701C6.66667 2.93353 6.66667 3.40024 6.66667 4.33366V5.00033M2.5 5.00033H17.5M15.8333 5.00033V14.3337C15.8333 15.7338 15.8333 16.4339 15.5608 16.9686C15.3212 17.439 14.9387 17.8215 14.4683 18.0612C13.9335 18.3337 13.2335 18.3337 11.8333 18.3337H8.16667C6.76654 18.3337 6.06647 18.3337 5.53169 18.0612C5.06129 17.8215 4.67883 17.439 4.43915 16.9686C4.16667 16.4339 4.16667 15.7338 4.16667 14.3337V5.00033" stroke="#D6D6D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <button data-testid="edit-button" className={styles.controlBtn} onClick={handleClickEdit}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M7.82924 16.1429L8.31628 17.2383C8.46106 17.5644 8.69734 17.8414 8.99647 18.0358C9.29559 18.2303 9.6447 18.3337 10.0015 18.3337C10.3582 18.3337 10.7073 18.2303 11.0065 18.0358C11.3056 17.8414 11.5419 17.5644 11.6866 17.2383L12.1737 16.1429C12.3471 15.7542 12.6387 15.4302 13.007 15.217C13.3777 15.0032 13.8065 14.9121 14.232 14.9568L15.4237 15.0837C15.7784 15.1212 16.1364 15.055 16.4543 14.8931C16.7721 14.7312 17.0362 14.4806 17.2144 14.1716C17.3929 13.8628 17.4779 13.5089 17.4592 13.1527C17.4405 12.7966 17.3188 12.4535 17.1089 12.1651L16.4033 11.1957C16.1521 10.8479 16.0178 10.4293 16.02 10.0003C16.0199 9.57248 16.1554 9.15562 16.407 8.80959L17.1126 7.84014C17.3225 7.55179 17.4442 7.20872 17.4629 6.85255C17.4816 6.49639 17.3966 6.14244 17.2181 5.83366C17.0399 5.52469 16.7758 5.27407 16.458 5.11218C16.1401 4.9503 15.7821 4.8841 15.4274 4.92162L14.2357 5.04847C13.8102 5.09317 13.3814 5.00209 13.0107 4.78829C12.6417 4.57387 12.35 4.24812 12.1774 3.85773L11.6866 2.76236C11.5419 2.4363 11.3056 2.15925 11.0065 1.96482C10.7073 1.77039 10.3582 1.66693 10.0015 1.66699C9.6447 1.66693 9.29559 1.77039 8.99647 1.96482C8.69734 2.15925 8.46106 2.4363 8.31628 2.76236L7.82924 3.85773C7.65668 4.24812 7.36497 4.57387 6.99591 4.78829C6.62525 5.00209 6.19647 5.09317 5.77091 5.04847L4.57554 4.92162C4.22081 4.8841 3.86282 4.9503 3.54497 5.11218C3.22711 5.27407 2.96305 5.52469 2.7848 5.83366C2.60632 6.14244 2.52128 6.49639 2.54002 6.85255C2.55876 7.20872 2.68046 7.55179 2.89035 7.84014L3.59591 8.80959C3.84753 9.15562 3.98302 9.57248 3.98295 10.0003C3.98302 10.4282 3.84753 10.845 3.59591 11.1911L2.89035 12.1605C2.68046 12.4489 2.55876 12.7919 2.54002 13.1481C2.52128 13.5043 2.60632 13.8582 2.7848 14.167C2.96323 14.4758 3.22732 14.7263 3.54513 14.8882C3.86294 15.05 4.22084 15.1163 4.57554 15.079L5.76721 14.9522C6.19276 14.9075 6.62155 14.9986 6.99221 15.2124C7.36265 15.4262 7.65571 15.752 7.82924 16.1429Z" stroke="#D6D6D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9.99997 12.5003C11.3807 12.5003 12.5 11.381 12.5 10.0003C12.5 8.61961 11.3807 7.50033 9.99997 7.50033C8.61926 7.50033 7.49998 8.61961 7.49998 10.0003C7.49998 11.381 8.61926 12.5003 9.99997 12.5003Z" stroke="#D6D6D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
        {isShow && children?.length && <div className={styles.children}>
            {isShow && children?.map((el: any) => {
                return <LayerItem
                    key={el.id}
                    layerName={el.layerName}
                    children={el?.children} />
            })}
        </div>}

    </div>
}
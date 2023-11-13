import styles from './CardSettings.module.scss';
import OutsideClickHandler from 'react-outside-click-handler';
import { useState, MouseEvent } from 'react';

interface Props {
    editHandler: () => void;
    editText: string;
    deleteHandler: () => void;
}

const CardSettings: React.FC<Props> = ({ editHandler, editText, deleteHandler }) => {
    const [open, setOpen] = useState(false);

    const toggleOpen = (e: MouseEvent) => {
        e.stopPropagation();
        setOpen((prev) => !prev);
    }

    const handleEdit = (e: MouseEvent) => {
        e.stopPropagation();
        editHandler();
        setOpen(false);
    }

    const handleDelete = (e: MouseEvent) => {
        e.stopPropagation();
        deleteHandler();
        setOpen(false);
    }

    return <div data-testid='CardSettings' className={styles.settings} onClick={toggleOpen}>
        <div data-testid='CardSettings_options' className={styles.dot} />
        {open ?
            <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
                <div data-testid='context-menu' className={styles.contextMenu}>
                    <div className={styles.menuItem} onClick={handleDelete}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 2.5H12.5M2.5 5H17.5M15.8333 5L15.2489 13.7661C15.1612 15.0813 15.1174 15.7389 14.8333 16.2375C14.5833 16.6765 14.206 17.0294 13.7514 17.2497C13.235 17.5 12.5759 17.5 11.2578 17.5H8.74221C7.42409 17.5 6.76503 17.5 6.24861 17.2497C5.79396 17.0294 5.41674 16.6765 5.16665 16.2375C4.88259 15.7389 4.83875 15.0813 4.75107 13.7661L4.16667 5M8.33333 8.75V12.9167M11.6667 8.75V12.9167" stroke="#E5E5E5" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className={styles.menuText}>Delete</div>
                    </div>
                    <div className={styles.menuItem} onClick={handleEdit}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_5857_189525)"><path d="M9.16675 3.33417H5.66675C4.26662 3.33417 3.56655 3.33417 3.03177 3.60666C2.56137 3.84634 2.17892 4.22879 1.93923 4.6992C1.66675 5.23398 1.66675 5.93404 1.66675 7.33417V14.3342C1.66675 15.7343 1.66675 16.4344 1.93923 16.9691C2.17892 17.4396 2.56137 17.822 3.03177 18.0617C3.56655 18.3342 4.26662 18.3342 5.66675 18.3342H12.6667C14.0669 18.3342 14.7669 18.3342 15.3017 18.0617C15.7721 17.822 16.1546 17.4396 16.3943 16.9691C16.6667 16.4344 16.6667 15.7343 16.6667 14.3342V10.8342M6.66673 13.3342H8.06218C8.46983 13.3342 8.67366 13.3342 8.86547 13.2881C9.03553 13.2473 9.1981 13.18 9.34722 13.0886C9.51542 12.9855 9.65954 12.8414 9.9478 12.5531L17.9167 4.58417C18.6071 3.89382 18.6071 2.77453 17.9167 2.08417C17.2264 1.39382 16.1071 1.39382 15.4167 2.08417L7.44778 10.0531C7.15952 10.3414 7.0154 10.4855 6.91233 10.6537C6.82094 10.8028 6.7536 10.9654 6.71278 11.1355C6.66673 11.3273 6.66673 11.5311 6.66673 11.9387V13.3342Z" stroke="#E5E5E5" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" /></g><defs><clipPath id="clip0_5857_189525"><rect width="20" height="20" fill="white" /></clipPath></defs>
                        </svg>
                        <div data-testid='card-settings-edit-text' className={styles.menuText}>{editText}</div>
                    </div>
                </div>
            </OutsideClickHandler>
            : null
        }
    </div>
}

export default CardSettings;
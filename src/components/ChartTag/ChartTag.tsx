import styles from './styles.module.scss';


const ChartTag = ({onEdit, onDelete, data}: any) => {
    
    const handlerEdit = () => {
        onEdit();

    };
    
    const handlerDelete = () => {
        onDelete();
    };

    return <>
        <div className={styles.tag}>
            <span className={styles.colorIndicator}></span>
            <span className={styles.name}>{data.areaName}, {data.projectName}</span>

            <button onClick={handlerEdit}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <g clip-path="url(#clip0_5976_200431)">
                        <path d="M9.1665 3.3332H5.6665C4.26637 3.3332 3.56631 3.3332 3.03153 3.60568C2.56112 3.84536 2.17867 4.22782 1.93899 4.69822C1.6665 5.233 1.6665 5.93307 1.6665 7.3332V14.3332C1.6665 15.7333 1.6665 16.4334 1.93899 16.9682C2.17867 17.4386 2.56112 17.821 3.03153 18.0607C3.56631 18.3332 4.26637 18.3332 5.6665 18.3332H12.6665C14.0666 18.3332 14.7667 18.3332 15.3015 18.0607C15.7719 17.821 16.1543 17.4386 16.394 16.9682C16.6665 16.4334 16.6665 15.7333 16.6665 14.3332V10.8332M6.66648 13.3332H8.06193C8.46959 13.3332 8.67341 13.3332 8.86522 13.2871C9.03528 13.2463 9.19786 13.179 9.34698 13.0876C9.51517 12.9845 9.6593 12.8404 9.94755 12.5521L17.9165 4.5832C18.6069 3.89284 18.6069 2.77355 17.9165 2.0832C17.2261 1.39284 16.1069 1.39284 15.4165 2.0832L7.44753 10.0521C7.15928 10.3404 7.01515 10.4845 6.91208 10.6527C6.8207 10.8018 6.75336 10.9644 6.71253 11.1345C6.66648 11.3263 6.66648 11.5301 6.66648 11.9378V13.3332Z" stroke="#F5F5F5" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    <defs>
                        <clipPath id="clip0_5976_200431">
                            <rect width="20" height="20" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            </button>

            <button onClick={handlerDelete}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 2.5H12.5M2.5 5H17.5M15.8333 5L15.2489 13.7661C15.1612 15.0813 15.1174 15.7389 14.8333 16.2375C14.5833 16.6765 14.206 17.0294 13.7514 17.2497C13.235 17.5 12.5759 17.5 11.2578 17.5H8.74221C7.42409 17.5 6.76503 17.5 6.24861 17.2497C5.79396 17.0294 5.41674 16.6765 5.16665 16.2375C4.88259 15.7389 4.83875 15.0813 4.75107 13.7661L4.16667 5M8.33333 8.75V12.9167M11.6667 8.75V12.9167" stroke="#F5F5F5" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    </>
}

export default ChartTag;
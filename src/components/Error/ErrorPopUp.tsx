import { useEffect, useState } from "react";
import styles from './Error.module.scss';
import classNames from "classnames";

const ErrorPopUp = ({ createStyleError }: any) => {
    const [timer, setTimer] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setTimer(false)
        }, 3000);
    }, [])

    if (createStyleError && 'status' in createStyleError) {
        const errMsg = Array.isArray(createStyleError.data.detail) ? createStyleError.data.detail[0].msg : createStyleError.data.detail;
        return (
            <>
                {timer && <div
                    className={classNames(styles.error, styles.errorPopUp)}
                >
                    <div>{errMsg}</div>
                </div>}
            </>
        )
    } else return <></>;
};

export default ErrorPopUp;
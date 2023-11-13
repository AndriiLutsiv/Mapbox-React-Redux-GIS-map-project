import React, { useState, useEffect } from 'react';
import styles from './ShareMapView.module.scss';
import classNames from 'classnames';
import { getLastPosition } from 'components/Map/utils/getLastPosition';

interface Props {
    className?: string;
}

const ShareMapView: React.FC<Props> = () => {
    const [copied, setCopied] = useState(false);
    const [showCopiedText, setShowCopiedText] = useState(false);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        if (copied) {
            setShowCopiedText(true);
            timeoutId = setTimeout(() => {
                setShowCopiedText(false);
                setCopied(false);
            }, 1500);
        }

        return () => clearTimeout(timeoutId);
    }, [copied]);

    const handleCopyClick = () => {
        const lastPosition = getLastPosition();
        const textToCopy = lastPosition?.url ?? '';

        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                setCopied(true);
            }).catch(err => {
                console.error('Could not copy text: ', err);
            });
        }
    };

    return (
        <button className={classNames(styles.shareMapView, styles.className)} onClick={handleCopyClick}>
            Share view
            {showCopiedText && <div className={styles.clipBoardText}>Copied</div>}
        </button>
    );
}

export default ShareMapView;

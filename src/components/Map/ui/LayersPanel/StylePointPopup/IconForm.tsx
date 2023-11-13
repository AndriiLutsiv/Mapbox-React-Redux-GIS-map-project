import React from 'react';
import styles from './StylePointPopup.module.scss';

interface Props {
    onChange: (event: any) => Promise<void>
}

export const IconForm: React.FC<Props> = ({ onChange }) => {
    return <div className={styles.maki} style={{ color: 'white' }}>
        <form>
            <label>
                <div className={styles.iconBtn}>
                    Upload custom shape
                    <input type="file" accept=".svg" onChange={onChange} />
                </div>
            </label>
        </form>
    </div>
}
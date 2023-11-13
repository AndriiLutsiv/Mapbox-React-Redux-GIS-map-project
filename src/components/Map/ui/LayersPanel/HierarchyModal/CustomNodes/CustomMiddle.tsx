import { Handle, Position } from 'reactflow';
import styles from './CustomNodes.module.scss';

interface Props {
    data: any
}

export const CustomMiddle: React.FC<Props> = ({ data }) => {
    return (
        <>
            <div className={styles.label}>{data.uuid}</div>
            <Handle type="target" position={Position.Left} className={styles.handle} />

            <div>
                {data.label}
            </div>
            <Handle type="source" position={Position.Right} className={styles.handle} />
        </>
    );
}
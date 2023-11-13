import { Handle, Position } from 'reactflow';
import styles from './CustomNodes.module.scss';

interface Props {
    data: any
}

export const CustomTarget: React.FC<Props> = ({ data }) => {
    return (<>
        <div className={styles.label}>{data.uuid}</div>
        <div>
            {data.label}
        </div>
        <Handle type="target" position={Position.Left} className={styles.handle} />
    </>);
}
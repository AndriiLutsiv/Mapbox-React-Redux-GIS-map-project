
const nodeStyle = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
};

const lineStyle = {
    strokeWidth: '2px',
    stroke: 'var(--field-border)'
}

export const styleNode: { [key: string]: any } = {
    UPRN: {   
        borderRadius: '6px',
        backgroundColor: 'var(--text-regular)',
        padding: '10px',
    },
    DN: {
        ...nodeStyle,
        backgroundColor: 'var(--bg-propertis)',
        border: '2px solid var(--bg-propertis)',
        color: 'var(--text-regular)',
    },
    AN: {
        ...nodeStyle,
        backgroundColor: 'var(--field-border)',
        border: '2px solid var(--bg-propertis)',
        color: 'var(--text-regular)',
    },
    ZN: {
        ...nodeStyle,
        backgroundColor: 'var(--text-regular)',
        border: '2px solid var(--field-border)',
        color: 'var(--field-border)',
    },
    ZAN_DAN: {
        ...nodeStyle,
        width: '50px',
        height: '50px',
        backgroundColor: 'var(--text-regular)',
        border: '2px solid var(--gray25)',
        color: 'var(--gray25)',
    },
    DYN: {
        ...nodeStyle,
        borderRadius: 0,
        backgroundColor: 'var(--field-border)',
        border: '2px dashed var(--text-regular)',
        color: 'var(--text-regular)',
    },
    ZYN: {
        ...nodeStyle,
        borderRadius: 0,
        backgroundColor: 'var(--field-thumb)',
        border: '2px dashed var(--text-regular)',
        color: 'var(--text-regular)',
    },
    TE: {
        ...nodeStyle,
        borderRadius: 0,
        backgroundColor: 'var(--text-regular)',
        border: '2px solid var(--bg-propertis)',
        color: 'var(--bg-propertis)',
        padding: '20px',
        position: 'relative',
    },
}

export const styleLine: { [key: string]: any } = {
    tube: {
        ...lineStyle,
        strokeDasharray: 5,
    },
    subduct: {
        ...lineStyle,
        strokeWidth: '6px',
        stroke: 'var(--text-regular)'
    },
    fibre: {
        ...lineStyle,
        stroke: 'var(--text-placeholder)'
    }
}
export const getStyle = (type: string) => {
    if (type === 'ZAN' || type === 'DAN') {
        return styleNode.ZAN_DAN;

    }
    return styleNode[type];

}
export const getLineStyle = (type: string) => {
    return styleLine[type];

}
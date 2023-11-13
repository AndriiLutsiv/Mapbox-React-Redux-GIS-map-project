import { Tag } from "antd";

export const tagRender = (props: { label: any; value: any; closable: any; onClose: any; }) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <Tag
            data-testid="TagRender"
            color={value}
            onMouseDown={onPreventMouseDown}
            closable={closable}
            onClose={onClose}
            style={{
                marginRight: 3,
                border: '1px solid #737373',
                height: '24px', width: '100%',
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                whiteSpace: 'nowrap'
            }}
        >
            {label}
        </Tag>
    );
};
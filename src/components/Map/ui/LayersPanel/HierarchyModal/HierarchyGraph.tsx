import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Position,
} from 'reactflow';
import { CustomTarget, CustomInput, CustomMiddle } from './CustomNodes/index';


import { data } from './data';

import 'reactflow/dist/style.css';
import { getLineStyle, getStyle } from './utils/nodeStyling';
import { DownloadButton } from './DownloadButton';
import { Legend } from './Legend';
import { CustomEdge } from './CustomEdges/CustomEdge';
import { TableData } from './TableData';

const nodeTypes = {
    customNodeMiddle: CustomMiddle,
    customNodeInput: CustomInput,
    customNodeTarget: CustomTarget,
};

const edgeTypes = {
    customEdge: CustomEdge,
};

const HierarchyGraph = ({ nodeSequence }: any) => {
    const [dataFromNode, setDataFromNode] = useState<any>();

    const nodesGenerator = (data: any) => {

        const nodes = data.filter((el: any) => el.type === 'point').map((el: any, i: number, arr: any) => {
            const indentX = 250;
            const indentY = 100;

            if (i === 0) {
                const labelData = el.props?.uprn ? `UPRN: ${el.props.uprn}` : el.props.node_type;
                const styleData = el.props?.uprn ? { ...getStyle('UPRN') } : { ...getStyle(el.props.node_type) };

                return {
                    id: el?.props?.uuid,
                    position: { x: i * indentX, y: indentY },
                    type: 'customNodeInput',
                    style: styleData,
                    data: { label: labelData, uuid: 'FRO-FAC-12' },
                    sourcePosition: 'right' as Position,
                }
            }


            if (i === arr.length - 1) {
                return {
                    id: el.props.uuid,
                    position: { x: (arr.length - 1) * indentX + 50, y: indentY },
                    type: 'customNodeTarget',
                    data: { label: el.props.node_type, uuid: 'FRO-FAC-1' },
                    style: { ...getStyle(el.props.node_type) },
                    targetPosition: 'left' as Position
                }
            }

            return {
                id: el.props.uuid,
                position: { x: i * indentX + 50, y: indentY },
                type: 'customNodeMiddle',
                data: { label: el.props.node_type, uuid: 'FRO-FAC-12' },
                style: { ...getStyle(el.props.node_type) },
                targetPosition: 'left' as Position,
                sourcePosition: 'right' as Position,
            }
        });

        // const lines = data.filter((el: any) => el.type === 'point');
        const connectorsLine: any = [];

        for (let i = 1; i < data.length; i = i + 2) {
            const keys = Object.keys(data[i].props).filter((el) => el.includes('type'));
            const type = keys[0].toLowerCase().split('_')[0];

            if (data[i + 1]) {
                const obj = {
                    id: data[i].props.uuid,
                    source: data[i - 1].props.uuid,
                    target: data[i + 1].props.uuid,
                    type: 'customEdge',
                    style: { ...getLineStyle(type) },
                    data: {
                        uuid: data[i].props.uuid,
                        distance: data[i].props.distance,
                        type: keys[0]
                    }
                }
                connectorsLine.push(obj)
            }
        }

        return {
            initialNodes: nodes,
            initialEdges: connectorsLine
        };
    }

    const [nodes, setNodes, onNodesChange] = useNodesState([]); ///initialNodes
    const [edges, setEdges, onEdgesChange] = useEdgesState([]); /// initialEdges

    useEffect(() => {
        setNodes(nodesGenerator(data).initialNodes);
        setEdges(nodesGenerator(data).initialEdges)
    }, [data]);


    const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    const handleClick = (e: any, nodeData: any) => {
        setDataFromNode(data.find((el: any) => el.props.uuid === nodeData.id.split('_')[0]));
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodesConnectable={false}
                onNodeClick={handleClick}
                onEdgeClick={handleClick}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
            >
                {/* <Controls /> */}
                {/* <MiniMap /> */}
                {/* <Background variant={"dots" as BackgroundVariant} gap={12} size={1} /> */}
                <DownloadButton />
                <Legend />
                <TableData data={dataFromNode} />

            </ReactFlow>
        </div>
    );
}

export default HierarchyGraph;

// Blocked
// this functional doesn't work if have small zoom

import React, { ReactElement, useContext } from 'react';
import EditorContext from './EditorContext';
import { StructureBaseNode, StructureContainerNode, StructureNodeType } from './types';
export default function Sidebar() {
    const { nodes, setActiveNodeId, activeNodeId } = useContext(EditorContext);

    const getNodeElement = (node: StructureBaseNode, indent: number = 0): ReactElement => {
        const basicProps = {
            key: node.id,
            className: 'sidebar_item',
            onClick: () => {
                setActiveNodeId(node.id);
            },
            style: {
                marginLeft: indent * 5,
            },
        }

        if (activeNodeId === node.id) {
            basicProps.className += " active";
        }

        switch (node.type) {
            case StructureNodeType.Container:
                return <div>
                    <div {...basicProps}>{node.id} (Container Node)</div>
                    {(node as StructureContainerNode).children.map((child) => {
                        return getNodeElement(child, indent + 1);
                    })}
                </div>;
            case StructureNodeType.Text:
                return <div {...basicProps}>{node.id} (Text Node)</div>;
            default:
                return <div {...basicProps}>{node.id} (Unknown - {node.type})</div>;
        }
    }

    return <div style={{
        padding: '10px',
        border: '1px solid black',
        borderLeft: 'none',
        height: 'calc(100% - 20px)',
    }}>
        <div onClick={() => {
            setActiveNodeId(null);
        }}>Main</div>
        {nodes.map((node) => {
            return getNodeElement(node);
        })}
    </div>
}
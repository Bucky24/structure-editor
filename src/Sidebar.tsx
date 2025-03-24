import React, { ReactElement, useContext } from 'react';
import EditorContext from './EditorContext';
import { NodeNames, StructureBaseNode, StructureContainerNode, StructureFillableNode, StructureNodeType } from './types';
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
            case StructureNodeType.Table:
            case StructureNodeType.TableRow:
            case StructureNodeType.TableCell:
                return <div key={node.id}>
                    <div {...basicProps}>{node.id} ({NodeNames[node.type]})</div>
                    {(node as StructureFillableNode).children.map((child) => {
                        return getNodeElement(child, indent + 1);
                    })}
                </div>;
            case StructureNodeType.Text:
            case StructureNodeType.Image:
                return <div {...basicProps}>{node.id} ({NodeNames[node.type]})</div>;
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
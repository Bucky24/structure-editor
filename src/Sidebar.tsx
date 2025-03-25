import React, { ReactElement, useContext } from 'react';
import EditorContext from './EditorContext';
import { NodeNames, StructureBaseNode, StructureContainerNode, StructureFillableNode, StructureNodeType } from './types';
export default function Sidebar() {
    const { nodes, setActiveNodeId, activeNodeId, deleteNode } = useContext(EditorContext);

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

        const deleteButton = <button onClick={() => {
            if (confirm("Are you sure you want to delete this?")) {
                deleteNode(node.id);
            }
        }}>X</button>;

        switch (node.type) {
            case StructureNodeType.Container:
            case StructureNodeType.Table:
            case StructureNodeType.TableRow:
            case StructureNodeType.TableCell:
                return <div key={node.id}>
                    <div {...basicProps}>{node.name} ({NodeNames[node.type]}) {deleteButton}</div>
                    {(node as StructureFillableNode).children.map((child) => {
                        return getNodeElement(child, indent + 1);
                    })}
                </div>;
            case StructureNodeType.Text:
            case StructureNodeType.Image:
                return <div {...basicProps}>{node.name} ({NodeNames[node.type]}) {deleteButton}</div>;
            default:
                return <div {...basicProps}>{node.name} (Unknown - {node.type}) {deleteButton}</div>;
        }
    }

    return <div style={{
        padding: '10px',
        border: '1px solid black',
        borderLeft: 'none',
        height: 'calc(100% - 20px)',
        maxHeight: 'calc(100% - 20px)',
        overflowY: 'auto',
    }}>
        <div onClick={() => {
            setActiveNodeId(null);
        }}>Main</div>
        {nodes.map((node) => {
            return getNodeElement(node);
        })}
    </div>
}
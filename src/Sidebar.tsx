import React, { ReactElement, useContext } from 'react';
import EditorContext from './EditorContext';
import { ContainerNodes, NodeNames, StructureBaseNode, StructureContainerNode, StructureFillableNode, StructureNodeType } from './types';
import Dropdown from './Dropdown';
import { v4 } from 'uuid';
export default function Sidebar() {
    const { nodes, setActiveNodeId, activeNodeId, deleteNode, applyToNode } = useContext(EditorContext);

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

        const actions = <>
            {deleteButton}
            <Dropdown items={['Duplicate','Cancel']} onClick={(item) => {
                if (item === "Duplicate") {
                    applyToNode(node.id, (node: StructureBaseNode, parent?: StructureBaseNode) => {
                        if (!parent) {
                            return;
                        }

                        if (!ContainerNodes.includes(parent.type)) {
                            return;
                        }

                        const fullCopy = (item: any): any => {
                            const newItem = {
                                ...item,
                                id: v4(),
                            };
                            if (newItem.children) {
                                newItem.children = newItem.children.map(fullCopy);
                            }

                            return newItem;
                        }

                        const newItem = fullCopy(node);
                        newItem.name = `${node.name} Copy`;

                        (parent as StructureFillableNode).children.push(newItem);
                    });
                }
            }} />
        </>

        switch (node.type) {
            case StructureNodeType.Container:
            case StructureNodeType.Table:
            case StructureNodeType.TableRow:
            case StructureNodeType.TableCell:
                return <div key={node.id}>
                    <div {...basicProps}>{node.name} ({NodeNames[node.type]}) {actions}</div>
                    {(node as StructureFillableNode).children.map((child) => {
                        return getNodeElement(child, indent + 1);
                    })}
                </div>;
            case StructureNodeType.Text:
            case StructureNodeType.Image:
                return <div {...basicProps}>{node.name} ({NodeNames[node.type]}) {actions}</div>;
            default:
                return <div {...basicProps}>{node.name} (Unknown - {node.type}) {actions}</div>;
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
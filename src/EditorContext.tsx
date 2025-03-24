import React, { PropsWithChildren, useState } from 'react';
import { StructureBaseNode, StructureNodeType, StructureContainerNode, StructureTextNode, StructureUpdatableKeys, StructureDirection } from './types';
import { getRandomString } from './utils';

const EditorContext = React.createContext<{
    nodes: StructureBaseNode[],
    activeNodeId: string | null,
    createNode: (type: StructureNodeType) => void,
    setActiveNodeId: (nodeId: string | null) => void,
    applyToNode: (id: string, cb: (node: StructureBaseNode) => void) => void,
    updateNode: (id: string, key: StructureUpdatableKeys, value: any) => void,
}>({
    nodes: [],
    activeNodeId: null,
    createNode: () => {},
    setActiveNodeId: () => {},
    applyToNode: () => {},
    updateNode: () => {},
});
export default EditorContext;

export function EditorProvider({ children }: PropsWithChildren) {
    const [nodes, setNodes] = useState<StructureBaseNode[]>([]);
    const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

    const applyToNode = (nodes: StructureBaseNode[], id: string, cb: (node: StructureBaseNode) => void) => {
        for (const node of nodes) {
            if (node.id === id) {
                cb(node);
                return;
            }

            if (node.type === StructureNodeType.Container) {
                applyToNode((node as StructureContainerNode).children, id, cb);
            }
        }
    }

    const value = {
        nodes,
        activeNodeId,
        setActiveNodeId,
        createNode: (type: StructureNodeType) => {
            let newNode: StructureBaseNode = {
                type,
                id: getRandomString(12),
            };
            if (type === StructureNodeType.Container) {
                newNode = { ...newNode, children: [], direction: StructureDirection.Row } as StructureContainerNode;
            } else if (type === StructureNodeType.Text) {
                newNode = { ...newNode, textContent: '' } as StructureTextNode;
            }

            if (activeNodeId) {
                applyToNode(nodes, activeNodeId, (node: StructureBaseNode) => {
                    if (node.type !== StructureNodeType.Container) {
                        return;
                    }

                    const containerNode = node as StructureContainerNode;
                    containerNode.children.push(newNode);
                    setNodes([...nodes]);
                });
            } else {
                setNodes((prevNodes) => [...prevNodes, newNode]);
            }
        },
        applyToNode: (id: string, cb: (node: StructureBaseNode) => void) => {
            return applyToNode(nodes, id, cb);
        },
        updateNode: (id: string, key: StructureUpdatableKeys, value: any) => {
            applyToNode(nodes, id, (node: StructureBaseNode) => {
                if (key === StructureUpdatableKeys.Id) {
                    node.id = value as string;
                }
                
                if (node.type === StructureNodeType.Container) {
                    if (key === StructureUpdatableKeys.Direction) {
                        (node as StructureContainerNode).direction = value as StructureDirection;
                    }
                }

                setNodes([...nodes]);
            });
        }
    };

    return (
        <EditorContext.Provider value={value}>
            {children}
        </EditorContext.Provider>
    );
}
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { StructureBaseNode, StructureNodeType, StructureContainerNode, StructureTextNode, StructureUpdatableKeys, StructureDirection, StructureImageNode, ContainerNodes, StructureFillableNode } from './types';
import { getRandomString } from './utils';

const EditorContext = React.createContext<{
    nodes: StructureBaseNode[],
    activeNodeId: string | null,
    createNode: (type: StructureNodeType) => void,
    setActiveNodeId: (nodeId: string | null) => void,
    applyToNode: (id: string, cb: (node: StructureBaseNode) => void) => void,
    updateNode: (id: string, key: StructureUpdatableKeys, value: any) => void,
    loadJson: (json: any[]) => void,
    deleteNode: (nodeId: string) => void,
}>({
    nodes: [],
    activeNodeId: null,
    createNode: () => {},
    setActiveNodeId: () => {},
    applyToNode: () => {},
    updateNode: () => {},
    loadJson: () => {},
    deleteNode: () => {},
});
export default EditorContext;

export function EditorProvider({ children }: PropsWithChildren) {
    const [nodes, setNodes] = useState<StructureBaseNode[]>([]);
    const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
    const [loaded, setLoaded] = useState(false);
    
    useEffect(() => {
        if (loaded) {
            const fullObj = {
                nodes,
                activeNodeId,
            };

            localStorage.setItem('editorState', JSON.stringify(fullObj));
        }
    }, [nodes, activeNodeId, loaded]);

    useEffect(() => {
        const item = localStorage.getItem('editorState');
        if (item) {
            const parsed = JSON.parse(item);
            setNodes(parsed.nodes);
            setActiveNodeId(parsed.activeNodeId);
        }
        setLoaded(true);
    }, []);

    const applyToNode = (nodes: StructureBaseNode[], id: string, cb: (node: StructureBaseNode, parentNode?: StructureBaseNode | null) => void, parentNode: StructureBaseNode | null = null) => {
        for (const node of nodes) {
            if (node.id === id) {
                cb(node, parentNode);
                return;
            }

            if (ContainerNodes.includes(node.type)) {
                applyToNode((node as StructureFillableNode).children, id, cb, node);
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
            } else if (type === StructureNodeType.Image) {
                newNode = { ...newNode, src: '' } as StructureImageNode;
            } else if ([StructureNodeType.Table, StructureNodeType.TableRow, StructureNodeType.TableCell].includes(type)) {
                newNode = { ...newNode, children: [] } as StructureFillableNode;
            }

            if (activeNodeId) {
                applyToNode(nodes, activeNodeId, (node: StructureBaseNode) => {
                    if (!ContainerNodes.includes(node.type)) {
                        return;
                    }

                    const fillableNode = node as StructureFillableNode;
                    fillableNode.children.push(newNode);
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
                } else if (key === StructureUpdatableKeys.Classes) {
                    node.extraClasses = value as string;
                } else if (key === StructureUpdatableKeys.Styles) {
                    node.extraStyles = value as string;
                } else if (key === StructureUpdatableKeys.ParentClasses) {
                    node.parentClasses = value as string;
                } else if (key === StructureUpdatableKeys.ParentStyles) {
                    node.parentStyles = value as string;
                } else if (key === StructureUpdatableKeys.Attributes) {
                    node.extraAttributes = value as Record<string, string>;
                } else if (key === StructureUpdatableKeys.ParentAttributes) {
                    node.parentAttributes = value as Record<string, string>;
                }
                
                if (node.type === StructureNodeType.Container) {
                    if (key === StructureUpdatableKeys.Direction) {
                        (node as StructureContainerNode).direction = value as StructureDirection;
                    }
                }

                if (node.type === StructureNodeType.Text) {
                    if (key === StructureUpdatableKeys.TextContent) {
                        (node as StructureTextNode).textContent = value as string;
                    }
                }

                if (node.type === StructureNodeType.Image) {
                    if (key === StructureUpdatableKeys.Width) {
                        (node as StructureImageNode).width = value as number;
                    } else if (key === StructureUpdatableKeys.Height) {
                        (node as StructureImageNode).height = value as number;
                    } else if (key === StructureUpdatableKeys.Src) {
                        (node as StructureImageNode).src = value as string;
                    }
                }

                setNodes([...nodes]);
            });
        },
        loadJson: (json: any[]) => {
            // unsafe, probably need to fix this at some point
            setNodes(json);
        },
        deleteNode: (nodeId: string) => {
            let newNodes = [...nodes];
            applyToNode(newNodes, nodeId, (node: StructureBaseNode, parent?: StructureBaseNode | null) => {
                if (!parent) {
                    // it's probably top level
                    newNodes = nodes.filter((n) => n.id!== nodeId);
                } else {
                    if (!ContainerNodes.includes(parent.type)) {
                        return;
                    }
                    const fillableNode = parent as StructureFillableNode;
                    fillableNode.children = fillableNode.children.filter((n) => n.id !== nodeId);
                }
            });
            setNodes(newNodes);
        },
    };

    return (
        <EditorContext.Provider value={value}>
            {children}
        </EditorContext.Provider>
    );
}
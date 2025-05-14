import React, { PropsWithChildren, useEffect, useState } from 'react';
import { StructureBaseNode, StructureNodeType, StructureContainerNode, StructureTextNode, StructureUpdatableKeys, StructureDirection, StructureImageNode, ContainerNodes, StructureFillableNode, CustomClass, ElementStyle } from './types';
import { v4 } from 'uuid';

const EditorContext = React.createContext<{
    nodes: StructureBaseNode[],
    activeNodeId: string | null,
    createNode: (type: StructureNodeType) => void,
    setActiveNodeId: (nodeId: string | null) => void,
    applyToNode: (id: string, cb: (node: StructureBaseNode) => void) => void,
    updateNode: (id: string, key: StructureUpdatableKeys, value: any) => void,
    loadJson: (json: any[]) => void,
    deleteNode: (nodeId: string) => void,
    classes: CustomClass[],
    setClasses: (classes: CustomClass[]) => void,
    elementStyles: ElementStyle[],
    setElementStyles: (styles: ElementStyle[]) => void,
    elementStylesByElement: { [element: string]: ElementStyle };
}>({
    nodes: [],
    activeNodeId: null,
    createNode: () => {},
    setActiveNodeId: () => {},
    applyToNode: () => {},
    updateNode: () => {},
    loadJson: () => {},
    deleteNode: () => {},
    classes: [],
    setClasses: () => {},
    elementStyles: [],
    setElementStyles: () => {},
    elementStylesByElement: {},
});
export default EditorContext;

export function EditorProvider({ children }: PropsWithChildren) {
    const [nodes, setNodes] = useState<StructureBaseNode[]>([]);
    const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [classes, setClasses] = useState<CustomClass[]>([]);
    const [elementStyles, setElementStyles] = useState<ElementStyle[]>([]);
    const [elementStylesByElement, setElementStylesByElement] = useState<{ [element: string]: ElementStyle}>({});
    
    useEffect(() => {
        if (loaded) {
            const fullObj = {
                nodes,
                activeNodeId,
                classes,
                elementStyles,
            };

            localStorage.setItem('editorState', JSON.stringify(fullObj));
        }
    }, [nodes, activeNodeId, loaded, classes, elementStyles]);

    useEffect(() => {
        setElementStylesByElement(elementStyles.reduce((obj, style) => {
            return {
                ...obj,
                [style.element]: style,
            }
        }, {}));
    }, [elementStyles]);

    useEffect(() => {
        const item = localStorage.getItem('editorState');
        if (item) {
            const parsed = JSON.parse(item);
            setNodes(parsed.nodes);
            setActiveNodeId(parsed.activeNodeId);
            setClasses(parsed.classes || []);
            setElementStyles(parsed.elementStyles || []);
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
        classes,
        setClasses,
        elementStyles,
        setElementStyles,
        elementStylesByElement,
        createNode: (type: StructureNodeType) => {
            let newNode: StructureBaseNode = {
                type,
                id: v4(),
                name: "Unnamed",
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
                console.log(nodes);
                setNodes((prevNodes) => [...prevNodes, newNode]);
            }
        },
        applyToNode: (id: string, cb: (node: StructureBaseNode, parent?: StructureBaseNode | null) => void) => {
            setNodes((nodes: StructureBaseNode[]) => {
                applyToNode(nodes, id, cb);

                return [...nodes];
            });
        },
        updateNode: (id: string, key: StructureUpdatableKeys, value: any) => {
            applyToNode(nodes, id, (node: StructureBaseNode) => {
                if (key === StructureUpdatableKeys.Name) {
                    node.name = value as string;
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
import React, { PropsWithChildren, useState } from 'react';
import { StructureBaseNode, StructureNodeType, StructureContainerNode, StructureTextNode } from './types';
import { getRandomString } from './utils';

const EditorContext = React.createContext<{
    nodes: StructureBaseNode[],
    createNode: (type: StructureNodeType) => void,
}>({
    nodes: [],
    createNode: () => {},
});
export default EditorContext;

export function EditorProvider({ children }: PropsWithChildren) {
    const [nodes, setNodes] = useState<StructureBaseNode[]>([]);
    const value = {
        nodes,
        createNode: (type: StructureNodeType) => {
            let newNode: StructureBaseNode = {
                type,
                id: getRandomString(12),
            };
            if (type === StructureNodeType.Container) {
                newNode = { ...newNode, children: [] } as StructureContainerNode;
            } else if (type === StructureNodeType.Text) {
                newNode = { ...newNode, textContent: '' } as StructureTextNode;
            }

            setNodes((prevNodes) => [...prevNodes, newNode]);
        }
    };

    return (
        <EditorContext.Provider value={value}>
            {children}
        </EditorContext.Provider>
    );
}
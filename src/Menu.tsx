import React, { useContext } from 'react';
import EditorContext from './EditorContext';
import { StructureNodeType } from './types';

export default function Menu() {
    const { createNode } = useContext(EditorContext);

    return <div>
        <button onClick={() => {
            createNode(StructureNodeType.Container);
        }}>
            Create Container Node
        </button>
        <button onClick={() => {
            createNode(StructureNodeType.Text);
        }}>
            Create Text Node
        </button>
    </div>
}
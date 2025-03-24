import React, { useContext } from 'react';
import EditorContext from './EditorContext';
import { StructureNodeType } from './types';

export default function Menu({ onSave }: { onSave: () => void }) {
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
        <button onClick={() => {
            createNode(StructureNodeType.Image);
        }}>
            Create Image Node
        </button>
        <button onClick={onSave}>
            Save
        </button>
    </div>
}
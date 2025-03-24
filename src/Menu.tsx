import React, { useContext } from 'react';
import EditorContext from './EditorContext';
import { StructureNodeType, StructureSaveType } from './types';

export default function Menu({ onSave }: { onSave: (type: StructureSaveType) => void }) {
    const { createNode, loadJson } = useContext(EditorContext);

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
        <button onClick={() => { onSave(StructureSaveType.HTML)}}>
            Save HTML
        </button>
        <button onClick={() => { onSave(StructureSaveType.JSON)}}>
            Save JSON
        </button>
        <button onClick={() => {
            const json = prompt("Paste here");
            if (!json) {
                return;
            }
            try {
                const obj = JSON.parse(json);

                loadJson(obj);
            } catch (e) {
                alert("Bad json");
            }
        }}>
            Load JSON
        </button>
    </div>
}
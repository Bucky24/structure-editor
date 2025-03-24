import React, { useContext } from 'react';
import EditorContext from './EditorContext';
import { NodeNames, StructureNodeType, StructureSaveType } from './types';

export default function Menu({ onSave }: { onSave: (type: StructureSaveType) => void }) {
    const { createNode, loadJson } = useContext(EditorContext);

    return <div>
        {Object.keys(NodeNames).map((type: string) => {
            return <button key={type} onClick={() => {
                createNode(type as StructureNodeType);
            }}>
                Create {NodeNames[type]}
            </button>;
    
        })}
        <br/>
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
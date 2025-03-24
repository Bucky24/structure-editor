import React, { useContext } from 'react';
import EditorContext from './EditorContext';
import Node from './Node';

export default function Editor() {
    const { nodes } = useContext(EditorContext);

    return <div style={{
        height: 'calc(100% - 20px)',
        border: '1px solid black',
        padding: '10px',
    }}>
        {nodes.map((node) => {
            return <Node key={node.id} node={node} />
        })}
    </div>
}
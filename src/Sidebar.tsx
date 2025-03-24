import React, { ReactElement, useContext } from 'react';
import EditorContext from './EditorContext';
import { StructureBaseNode, StructureNodeType } from './types';

export default function Sidebar() {
    const { nodes } = useContext(EditorContext);

    const getNodeElement = (node: StructureBaseNode): ReactElement => {
        switch (node.type) {
            case StructureNodeType.Container:
                return <div key={node.id}>{node.id} (Container Node)</div>;
            case StructureNodeType.Text:
                return <div key={node.id}>{node.id} (Text Node)</div>;
            default:
                return <div key={node.id}>{node.id} (Unknown - {node.type})</div>;
        }
    }

    return <div style={{
        padding: '10px',
        border: '1px solid black',
        borderLeft: 'none',
        height: 'calc(100% - 20px)',
    }}>
        {nodes.map((node) => {
            return getNodeElement(node);
        })}
    </div>
}
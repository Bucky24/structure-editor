import React, { useContext } from 'react';
import { StructureBaseNode, StructureContainerNode, StructureDirection, StructureNodeType, StructureTextNode, StructureUpdatableKeys } from "./types";
import EditorContext from './EditorContext';
import classnames from 'classnames';

export default function Node({ node }: { node: StructureBaseNode }) {
    const { activeNodeId, updateNode } = useContext(EditorContext);

    let content = null;
    let styles: { [key: string]: string | number } = {
        flexGrow: 1,
    };

    if (node.type === StructureNodeType.Container) {
        const constainerNode = node as StructureContainerNode;
        content = constainerNode.children.map(child => <Node key={child.id} node={child} />);
        styles = {
            ...styles,
            display: 'flex',
            flexDirection: constainerNode.direction === StructureDirection.Row ? 'row' : 'column',
        };
    } else if (node.type === StructureNodeType.Text) {
        const textNode = node as StructureTextNode;
        content = <textarea
            style={{ width: '100%', height: '100%', padding: 0 }}
            onChange={(e) => {
                const content = e.target.value;
                updateNode(node.id, StructureUpdatableKeys.TextContent, content);
            }}
            value={textNode.textContent}
        ></textarea>
    }
    return <div
        style={styles}
        className={classnames(
            'node_item',
            activeNodeId === node.id && 'active',
        )}
    >
        {content}
    </div>
}
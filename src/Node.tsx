import React, { useContext } from 'react';
import { StructureBaseNode, StructureContainerNode, StructureNodeType, StructureTextNode } from "./types";
import EditorContext from './EditorContext';
import classnames from 'classnames';

export default function Node({ node }: { node: StructureBaseNode }) {
    const { activeNodeId } = useContext(EditorContext);

    let content = null;
    let styles = {};

    if (node.type === StructureNodeType.Container) {
        const constainerNode = node as StructureContainerNode;
        content = constainerNode.children.map(child => <Node key={child.id} node={child} />);
    } else if (node.type === StructureNodeType.Text) {
        const textNode = node as StructureTextNode;
        content = <div>{textNode.textContent}</div>
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
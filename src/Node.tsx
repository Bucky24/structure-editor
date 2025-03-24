import React from 'react';
import { StructureBaseNode, StructureContainerNode, StructureNodeType, StructureTextNode } from "./types";

export default function Node({ node }: { node: StructureBaseNode }) {
    let content = null;
    let styles = {};

    if (node.type === StructureNodeType.Container) {
        const constainerNode = node as StructureContainerNode;
        content = constainerNode.children.map(child => <Node key={child.id} node={child} />);
    } else if (node.type === StructureNodeType.Text) {
        const textNode = node as StructureTextNode;
        content = <div>{textNode.textContent}</div>
    }
    return <div style={styles}>
        {content}
    </div>
}
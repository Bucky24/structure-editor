import React, { useContext } from 'react';
import { ContainerNodes, StructureBaseNode, StructureContainerNode, StructureDirection, StructureFillableNode, StructureImageNode, StructureNodeType, StructureTableCellNode, StructureTextNode, StructureUpdatableKeys } from "./types";
import EditorContext from './EditorContext';
import classnames from 'classnames';

export default function Node({ node }: { node: StructureBaseNode }) {
    const { activeNodeId, updateNode } = useContext(EditorContext);

    let content = null;
    let styles: { [key: string]: string | number } = {};

    if (node.type === StructureNodeType.Container) {
        const constainerNode = node as StructureContainerNode;
        content = constainerNode.children.map(child => <Node key={child.id} node={child} />);
        styles = {
            ...styles,
            display: 'flex',
            flexDirection: constainerNode.direction === StructureDirection.Row ? 'row' : 'column',
        };

        return <div
            style={styles}
            className={classnames(
                'node_item',
                activeNodeId === node.id && 'active',
            )}
            id={node.id}
        >
            {content}
        </div>;
    } else if (node.type === StructureNodeType.Table) {
        const constainerNode = node as StructureFillableNode;
        content = constainerNode.children.map(child => <Node key={child.id} node={child} />);
        
        return <table
            style={styles}
            className={classnames(
                'node_item',
                activeNodeId === node.id && 'active',
            )}
        >
            <tbody>
                {content}
            </tbody>
        </table>
    } else if (node.type === StructureNodeType.TableRow) {
        const constainerNode = node as StructureFillableNode;
        content = constainerNode.children.map(child => {
            if (child.type === StructureNodeType.TableCell) {
                return <Node key={child.id} node={child} />
            } else {
                const newChild = {
                    type: StructureNodeType.TableCell,
                    id: `${child.id} cell`,
                    children: [child],
                } as StructureTableCellNode;
                return <Node key={newChild.id} node={newChild} />;
            }
        });
        styles = {
            ...styles,
        };

        return <tr
            style={styles}
            className={classnames(
                'node_item',
                activeNodeId === node.id && 'active',
            )}
        >{content}</tr>
    }  else if (node.type === StructureNodeType.TableCell) {
        const constainerNode = node as StructureFillableNode;
        content = constainerNode.children.map(child => <Node key={child.id} node={child} />);
        styles = {
            ...styles,
            display: 'table-cell',
        };
        return <td
            style={styles}
            className={classnames(
                'node_item',
                activeNodeId === node.id && 'active',
            )}
        >{content}</td>
    }else if (ContainerNodes.includes(node.type)) {
        const constainerNode = node as StructureFillableNode;
        content = constainerNode.children.map(child => <Node key={child.id} node={child} />);
        styles = {
            ...styles,
        };
    } else if (node.type === StructureNodeType.Text) {
        const textNode = node as StructureTextNode;
        styles = {
            ...styles,
            width: '100%',
            height: '100%',
            padding: 0,
        };
        return <span
            style={styles}
        >{textNode.textContent}</span>;
    } else if (node.type === StructureNodeType.Image) {
        const imageNode = node as StructureImageNode;

        styles = {
            ...styles,
            flexGrow: 0,
            flexShrink: 0,
            width: imageNode.width ?? `${imageNode.width}px`,
            height: imageNode.height ?? `${imageNode.height}px`,
        };

        return <img
            style={styles}
            src={imageNode.src}
        />;
    } else {
        content = <div style={{ width: '100%', height: '100%', padding: 0 }}>Unknown type</div>
    }
    return null;
}
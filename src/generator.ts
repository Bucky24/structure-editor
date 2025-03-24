import { StructureBaseNode, StructureContainerNode, StructureDirection, StructureImageNode, StructureNodeType, StructureTextNode } from "./types";

export default function generator(nodes: StructureBaseNode[]): string {
    console.log(nodes);
    return nodes.map((node) => {
        const generated = generateNode(node);
        console.log(node, generated);
        return generated;
    }).join('');
}

function indent(indents: number): string {
    let result = "";
    for (let i=0;i<indents;i++) {
        result += "\t";
    }

    return result;
}

function generateNode(node: StructureBaseNode, indents: number = 0): string {
    const inStr = indent(indents);
    const extraAttrs = `style="${node.extraStyles ?? ''}" class="${node.extraClasses ?? ''}"`;
    if (node.type === StructureNodeType.Container) {
        const containerNode = node as StructureContainerNode;
        let result = `${inStr}<table ${extraAttrs}>\n${inStr}\t<tbody>\n`;

        if (containerNode.direction === StructureDirection.Row) {
            result += `${inStr}\t\t<tr>\n`;

            for (const child of containerNode.children) {
                const parentExtras = `style="${child.parentStyles ?? ''}" class="${child.parentClasses ?? ''}"`;
                result += `${inStr}\t\t\t<td ${parentExtras}>\n${generateNode(child, indents + 4)}\n${inStr}\t\t\t</td>\n`;
            }

            result += `${inStr}\t\t</tr>\n`;
        } else if (containerNode.direction === StructureDirection.Column) {
            for (const child of containerNode.children) {
                const parentExtras = `style="${child.parentStyles ?? ''}" class="${child.parentClasses ?? ''}"`;
                result += `${inStr}\t\t<tr>\n${inStr}\t\t\t<td ${parentExtras}>\n${generateNode(child, indents + 4)}\n${inStr}\t\t\t</td>${inStr}\t\t</tr>\n`;
            }
        }

        result += `${inStr}\t</tbody>\n${inStr}</table>`;

        return result;
    } else if (node.type === StructureNodeType.Text) {
        const textNode = node as StructureTextNode;
        return `${inStr}<span ${extraAttrs}>${textNode.textContent}</span>`;
    } else if (node.type === StructureNodeType.Image) {
        const imageNode = node as StructureImageNode;
        let result = `${inStr}<img src="${imageNode.src}" ${extraAttrs} `;

        if (imageNode.width !== undefined && imageNode.width !== null) {
            result += `width="${imageNode.width}px" `;
        }
        if (imageNode.height !== undefined && imageNode.height !== null) {
            result += `height="${imageNode.height}px" `;
        }

        result += "/>";

        return result;
    } else {
        console.error(`Unknown node type ${node.type}`);
    }

    return 'Unknown';
}
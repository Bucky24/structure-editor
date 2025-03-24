import { StructureBaseNode, StructureContainerNode, StructureDirection, StructureNodeType, StructureTextNode } from "./types";

export default function generator(nodes: StructureBaseNode[]): string {
    console.log(nodes);
    return nodes.map((node) => {
        const generated = generateNode(node);
        console.log(node, generated);
        return generated;
    }).join('');   
}

function generateNode(node: StructureBaseNode): string {
    if (node.type === StructureNodeType.Container) {
        const containerNode = node as StructureContainerNode;
        let result = '<table><tbody>';

        if (containerNode.direction === StructureDirection.Row) {
            result += "<tr>";

            for (const child of containerNode.children) {
                result += "<td>" + generateNode(child) + "</td>";
            }

            result += "</tr>";
        } else if (containerNode.direction === StructureDirection.Column) {
            for (const child of containerNode.children) {
                result += "<tr><td>" + generateNode(child) + "</td></tr>";
            }
        }

        result += "</tbody></table>";

        return result;
    } else if (node.type === StructureNodeType.Text) {
        const textNode = node as StructureTextNode;
        return "<span>" + textNode.textContent + "</span>";
    } else {
        console.error(`Unknown node type ${node.type}`);
    }

    return 'Unknown';
}
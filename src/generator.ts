import { StructureBaseNode, StructureContainerNode, StructureDirection, StructureFillableNode, StructureImageNode, StructureNodeType, StructureTableCellNode, StructureTextNode } from "./types";

export default function generator(nodes: StructureBaseNode[]): string {
    //console.log(nodes);
    return nodes.map((node) => {
        const generated = generateNode(node);
        console.log(node, generated);
        return generated;
    }).join('');
}

function indent(indents: number): string {
    let result = "";
    for (let i=0;i<indents;i++) {
        result += `${ind}`;
    }

    return result;
}

const ind = "  ";

function getAttrs(attrs:{ [key: string]: string} | undefined): string {
    if (!attrs) {
        return "";
    }
    let result = "";
    for (const key in attrs) {
        result += ` ${key}="${attrs[key]}"`;
    }

    return result;
}

function generateNode(node: StructureBaseNode, indents: number = 0): string {
    const inStr = indent(indents);
    let extraAttrs = `id="${node.id}" style="${node.extraStyles ?? ''}" class="${node.extraClasses ?? ''}" ${getAttrs(node.extraAttributes)}`;
    if (node.type === StructureNodeType.Container) {
        const containerNode = node as StructureContainerNode;
        let result = `${inStr}<table ${extraAttrs}>\n${inStr}${ind}<tbody>\n`;

        if (containerNode.direction === StructureDirection.Row) {
            result += `${inStr}${ind}${ind}<tr>\n`;

            for (const child of containerNode.children) {
                const parentExtras = `style="${child.parentStyles ?? ''}" class="${child.parentClasses ?? ''} ${getAttrs(child.parentAttributes)}"`;
                const parentAttributes = 
                result += `${inStr}${ind}${ind}${ind}<td ${parentExtras}>\n${generateNode(child, indents + 4)}${inStr}${ind}${ind}${ind}</td>\n`;
            }

            result += `${inStr}${ind}${ind}</tr>\n`;
        } else if (containerNode.direction === StructureDirection.Column) {
            for (const child of containerNode.children) {
                const parentExtras = `style="${child.parentStyles ?? ''}" class="${child.parentClasses ?? ''} ${getAttrs(child.parentAttributes)}"`;
                result += `${inStr}${ind}${ind}<tr>\n${inStr}${ind}${ind}${ind}<td ${parentExtras}>\n${generateNode(child, indents + 4)}${inStr}${ind}${ind}${ind}</td>\n${inStr}${ind}${ind}</tr>\n`;
            }
        }

        result += `${inStr}${ind}</tbody>\n${inStr}</table>\n`;

        return result;
    } else if (node.type === StructureNodeType.Text) {
        const textNode = node as StructureTextNode;
        return `${inStr}<span ${extraAttrs}>${textNode.textContent}</span>\n`;
    } else if (node.type === StructureNodeType.Image) {
        const imageNode = node as StructureImageNode;
        let result = `${inStr}<img src="${imageNode.src}" ${extraAttrs} `;

        if (imageNode.width !== undefined && imageNode.width !== null) {
            result += `width="${imageNode.width}px" `;
        }
        if (imageNode.height !== undefined && imageNode.height !== null) {
            result += `height="${imageNode.height}px" `;
        }

        result += "/>\n";

        return result;
    } else if (node.type === StructureNodeType.Table) {
        const fillableNode = node as StructureFillableNode;
        let result = `${inStr}<table ${extraAttrs}>\n${inStr}${ind}<tbody>\n`;

        for (const child of fillableNode.children) {
            result += generateNode(child, indents + 2);
        }

        result += `${inStr}${ind}</tbody>\n${inStr}</table>\n`;
        return result;
    } else if (node.type === StructureNodeType.TableRow) {
        const fillableNode = node as StructureFillableNode;
        let result = `${inStr}<tr ${extraAttrs}>\n`;

        for (const child of fillableNode.children) {
            if (child.type === StructureNodeType.TableCell) {
                result += generateNode(child, indents + 1);
            } else {
                result += generateNode({
                    type: StructureNodeType.TableCell,
                    id: `${child.id} cell`,
                    children: [{
                        ...child,
                        extraClasses: undefined,
                        extraStyles: undefined,
                        extraAttributes: undefined,
                    }],
                    extraStyles: child.extraStyles,
                    extraClasses: child.extraClasses,
                    extraAttributes: child.extraAttributes,
                } as StructureTableCellNode, indents + 1);
            }
        }

        result += `${inStr}</tr>\n`;
        return result;
    } else if (node.type === StructureNodeType.TableCell) {
        const fillableNode = node as StructureFillableNode;

        if (fillableNode.children.length === 1) {
            extraAttrs += getAttrs(fillableNode.children[0].parentAttributes);
        }
        let result = `${inStr}<td ${extraAttrs}>\n`;

        console.log(extraAttrs, node);

        for (const child of fillableNode.children) {
            result += generateNode(child, indents + 1);
        }

        result += `${inStr}</td>\n`;
        return result;
    } else {
        console.error(`Unknown node type ${node.type}`);
    }

    return 'Unknown\n';
}
import { CustomClass, ElementStyle, StructureBaseNode, StructureContainerNode, StructureDirection, StructureFillableNode, StructureImageNode, StructureNodeType, StructureTableCellNode, StructureTextNode } from "../types";
import { StructureGeneratorBase } from "./StructureGeneratorBase";

const ind = "  ";

export class StructureHtmlGenerator extends StructureGeneratorBase {
    static getAttrs(attrs: { [key: string]: string } | undefined): string {
        if (!attrs) {
            return "";
        }
        let result = "";
        for (const key in attrs) {
            result += ` ${key}="${attrs[key]}"`;
        }
    
        return result;
    }

    private indent(indents: number): string {
        let result = "";
        for (let i=0;i<indents;i++) {
            result += `${ind}`;
        }

        return result;
    }

    private getAttrs(attrs:{ [key: string]: string} | undefined): string {
        if (!attrs) {
            return "";
        }
        let result = "";
        for (const key in attrs) {
            result += ` ${key}="${attrs[key]}"`;
        }

        return result;
    }

    generateNode(node: StructureBaseNode, indents: number = 0): string {
        const inStr = this.indent(indents);
        let extraAttrs = `id="${node.id}" style="${node.extraStyles ?? ''}" class="${node.extraClasses ?? ''}" ${this.getAttrs(node.extraAttributes)}`;
        if (node.type === StructureNodeType.Container) {
            const containerNode = node as StructureContainerNode;
            let result = `${inStr}<table ${extraAttrs}>\n${inStr}${ind}<tbody>\n`;
    
            if (containerNode.direction === StructureDirection.Row) {
                result += `${inStr}${ind}${ind}<tr>\n`;
    
                for (const child of containerNode.children) {
                    const parentExtras = `style="${child.parentStyles ?? ''}" class="${child.parentClasses ?? ''} ${this.getAttrs(child.parentAttributes)}"`;
                    const parentAttributes = 
                    result += `${inStr}${ind}${ind}${ind}<td ${parentExtras}>\n${this.generateNode(child, indents + 4)}${inStr}${ind}${ind}${ind}</td>\n`;
                }
    
                result += `${inStr}${ind}${ind}</tr>\n`;
            } else if (containerNode.direction === StructureDirection.Column) {
                for (const child of containerNode.children) {
                    const parentExtras = `style="${child.parentStyles ?? ''}" class="${child.parentClasses ?? ''} ${this.getAttrs(child.parentAttributes)}"`;
                    result += `${inStr}${ind}${ind}<tr>\n${inStr}${ind}${ind}${ind}<td ${parentExtras}>\n${this.generateNode(child, indents + 4)}${inStr}${ind}${ind}${ind}</td>\n${inStr}${ind}${ind}</tr>\n`;
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
                result += this.generateNode(child, indents + 2);
            }
    
            result += `${inStr}${ind}</tbody>\n${inStr}</table>\n`;
            return result;
        } else if (node.type === StructureNodeType.TableRow) {
            const fillableNode = node as StructureFillableNode;
            let result = `${inStr}<tr ${extraAttrs}>\n`;
    
            for (const child of fillableNode.children) {
                if (child.type === StructureNodeType.TableCell) {
                    result += this.generateNode(child, indents + 1);
                } else {
                    result += this.generateNode({
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
                extraAttrs += this.getAttrs(fillableNode.children[0].parentAttributes);
            }
            let result = `${inStr}<td ${extraAttrs}>\n`;
    
            for (const child of fillableNode.children) {
                result += this.generateNode(child, indents + 1);
            }
    
            result += `${inStr}</td>\n`;
            return result;
        } else {
            console.error(`Unknown node type ${node.type}`);
        }
    
        return 'Unknown\n';
    }

    generateStyles(classes: CustomClass[], elementStyles: ElementStyle[]): string {
        const classCode = classes.map((customClass) => {
            return `.${customClass.name} {\n${Object.keys(customClass.styles).map((key) => {
                return `\t${key}: ${customClass.styles[key]}\n`;
            }).join(";\n")}\n}`; 
        }).join("\n");
        const elementCode = elementStyles.map((customElement) => {
            return `${customElement.element} {\n${Object.keys(customElement.styles).map((key) => {
                return `\t${key}: ${customElement.styles[key]}\n`;
            }).join(";\n")}\n}`; 
        }).join("\n");
        return `<style>\n${classCode}\n${elementCode}</style>`
    }
}
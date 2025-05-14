import { CustomClass, ElementStyle, StructureBaseNode } from "../types";

type GenerateResult = {
    style: string,
    body: string,
};

export abstract class StructureGeneratorBase {
    static indent(indents: number): string {
        const ind = "  ";
        let result = "";
        for (let i=0;i<indents;i++) {
            result += `${ind}`;
        }
    
        return result;
    }

    generate(nodes: StructureBaseNode[], classes: CustomClass[], elementStyles: ElementStyle[]): GenerateResult {
        const styleHtml = this.generateStyles(classes, elementStyles);
        const bodyHtml = nodes.map((node) => {
            const generated = this.generateNode(node);
            return generated;
        }).join('');

        return {
            style: styleHtml,
            body: bodyHtml,
        }
    }

    abstract generateNode(node: StructureBaseNode): string;

    abstract generateStyles(classes: CustomClass[], elementStyles: ElementStyle[]): string;
}
import { CustomClass, StructureBaseNode } from "../types";

type GenerateResult = {
    classHtml: string,
    bodyHtml: string,
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

    generate(nodes: StructureBaseNode[], classes: CustomClass[]): GenerateResult {
        const classHtml = this.generateClasses(classes);
        const bodyHtml = nodes.map((node) => {
            const generated = this.generateNode(node);
            return generated;
        }).join('');

        return {
            classHtml,
            bodyHtml,
        }
    }

    abstract generateNode(node: StructureBaseNode): string;

    abstract generateClasses(classes: CustomClass[]): string;
}
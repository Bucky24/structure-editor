import { StructureBaseNode } from "../types";

export abstract class StructureGeneratorBase {
    static indent(indents: number): string {
        const ind = "  ";
        let result = "";
        for (let i=0;i<indents;i++) {
            result += `${ind}`;
        }
    
        return result;
    }

    generate(nodes: StructureBaseNode[]): string {
        return nodes.map((node) => {
            const generated = this.generateNode(node);
            return generated;
        }).join('');
    }

    abstract generateNode(node: StructureBaseNode): string;
}
import { ContainerNodes, StructureBaseNode, StructureFillableNode } from "../types";

export type StructureGeneratedData = {
    node: StructureBaseNode,
    result: string,
    parentStyles: string,
    parentAttributes: string,
    parentClasses: string,
}

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
            const generated = this.generateHelper(node);
            return generated.result;
        }).join('');
    }

    generateHelper(node: StructureBaseNode): StructureGeneratedData {
        let children: StructureGeneratedData[] = [];
        if (ContainerNodes.includes(node.type)) {
            children = (node as StructureFillableNode).children.map((child) => this.generateHelper(child));
        }

        return this.generateNode(node, children);
    }

    abstract generateNode(node: StructureBaseNode, children: StructureGeneratedData[]): StructureGeneratedData;
}
import { StructureBaseNode } from "../types";
import { StructureGeneratedData, StructureGeneratorBase } from "./StructureGeneratorBase";

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

    generateNode(node: StructureBaseNode, children: StructureGeneratedData[]): StructureGeneratedData {
        
    }
}
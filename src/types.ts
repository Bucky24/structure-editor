export enum StructureNodeType {
    Text,
    Container,
}

export interface StructureBaseNode {
    type: StructureNodeType;
    id: string;
}

export interface StructureTextNode extends StructureBaseNode {
    type: StructureNodeType.Text;
    textContent: string;
}

export interface StructureContainerNode extends StructureBaseNode {
    type: StructureNodeType.Container;
    children: StructureBaseNode[];
}
export enum StructureNodeType {
    Text,
    Container,
}

export enum StructureUpdatableKeys {
    Id,
    Direction,
    TextContent,
}

export enum StructureDirection {
    Row = 'row',
    Column = 'col',
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
    direction: StructureDirection;
}
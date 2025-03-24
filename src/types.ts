export enum StructureNodeType {
    Text,
    Container,
    Image,
}

export enum StructureUpdatableKeys {
    Id,
    Direction,
    TextContent,
    Width,
    Height,
    Src,
    Classes,
    Styles,
    ParentClasses,
    ParentStyles,
}

export enum StructureDirection {
    Row = 'row',
    Column = 'col',
}

export interface StructureBaseNode {
    type: StructureNodeType;
    id: string;
    extraClasses?: string;
    extraStyles?: string;
    parentClasses?: string;
    parentStyles?: string;
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

export interface StructureImageNode extends StructureBaseNode {
    type: StructureNodeType.Image;
    width?: number;
    height?: number;
    src: string;
}
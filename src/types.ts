export enum StructureNodeType {
    Text = "text",
    Container = "container",
    Image = "image",
    Table = "table",
    TableRow = "table-row",
    TableCell = "table-cell",
}

export enum StructureUpdatableKeys {
    Name,
    Direction,
    TextContent,
    Width,
    Height,
    Src,
    Classes,
    Styles,
    ParentClasses,
    ParentStyles,
    Rows,
    Cells,
    Attributes,
    ParentAttributes,
}

export enum StructureDirection {
    Row = 'row',
    Column = 'col',
}

export interface StructureBaseNode {
    type: StructureNodeType;
    id: string;
    name: string;
    extraClasses?: string;
    extraStyles?: string;
    extraAttributes?: { [key: string]: string };
    parentClasses?: string;
    parentStyles?: string;
    parentAttributes?: { [key: string]: string };
}

export interface StructureTextNode extends StructureBaseNode {
    type: StructureNodeType.Text;
    textContent: string;
}

export interface StructureFillableNode extends StructureBaseNode {
    children: StructureBaseNode[];
}

export interface StructureContainerNode extends StructureFillableNode {
    type: StructureNodeType.Container;
    direction: StructureDirection;
}

export interface StructureImageNode extends StructureBaseNode {
    type: StructureNodeType.Image;
    width?: number;
    height?: number;
    src: string;
}

export interface StructureTableCellNode extends StructureFillableNode {
    type: StructureNodeType.TableCell;
}

export interface StructureTableRowNode extends StructureFillableNode {
    type: StructureNodeType.TableRow;
}

export interface StructureTableNode extends StructureFillableNode {
    type: StructureNodeType.Table;
}

export enum StructureSaveType {
    HTML,
    JSON,
}

export const NodeNames: { [key: string]: string } = {
    [StructureNodeType.Container]: 'Container',
    [StructureNodeType.Text]: 'Text',
    [StructureNodeType.Image]: 'Image',
    [StructureNodeType.Table]: 'Table',
    [StructureNodeType.TableRow]: 'Table Row',
    [StructureNodeType.TableCell]: 'Table Cell',
};

export const ContainerNodes = [
    StructureNodeType.Container,
    StructureNodeType.Table,
    StructureNodeType.TableRow,
    StructureNodeType.TableCell,
];

export type CustomClass = {
    name: string,
    styles: { [style: string]: string},
    id: string,
}

export type ElementStyle = {
    element: string,
    styles: { [style: string]: string},
    id: string,
}
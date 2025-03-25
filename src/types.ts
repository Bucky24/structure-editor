export enum StructureNodeType {
    Text = "text",
    Container = "container",
    Image = "image",
    Table = "table",
    TableRow = "table-row",
    TableCell = "table-cell",
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
    [StructureNodeType.Container]: 'Container Node',
    [StructureNodeType.Text]: 'Text Node',
    [StructureNodeType.Image]: 'Image Node',
    [StructureNodeType.Table]: 'Table Node',
    [StructureNodeType.TableRow]: 'Table Row Node',
    [StructureNodeType.TableCell]: 'Table Cell Node',
};

export const ContainerNodes = [
    StructureNodeType.Container,
    StructureNodeType.Table,
    StructureNodeType.TableRow,
    StructureNodeType.TableCell,
];
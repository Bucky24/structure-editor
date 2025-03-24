import React, { useContext, useEffect, useState } from 'react';
import EditorContext from './EditorContext';
import { StructureBaseNode, StructureContainerNode, StructureDirection, StructureImageNode, StructureNodeType, StructureUpdatableKeys } from './types';
import TextField from './TextField';

export default function Properties() {
    const { activeNodeId, applyToNode, updateNode, setActiveNodeId } = useContext(EditorContext);
    const [activeNode, setActiveNode] = useState<StructureBaseNode | null>(null);

    useEffect(() => {
        setActiveNode(null);
        if (activeNodeId) {
            applyToNode(activeNodeId, (node: StructureBaseNode) => {
                setActiveNode(node);
            })
        }
    }, [activeNodeId]);

    return <div style={{
        border: '1px solid black',
        borderRight: 'none',
        height: 'calc(100% - 20px)',
        padding: '10px',
    }}>
        <h3>Properties</h3>
        {activeNode && <table>
            <tbody>
                <tr>
                    <td>
                        ID
                    </td>
                    <td>
                        <TextField value={activeNode.id || ''} onChange={(value: string) => {
                            if (value === '') {
                                value = ' ';
                            }
                            const oldId = activeNode.id;
                            updateNode(activeNode.id, StructureUpdatableKeys.Id, value);
                            if (activeNodeId === oldId) {
                                setActiveNodeId(value);
                            }
                        }} />
                    </td>
                </tr>
                {activeNode.type === StructureNodeType.Container && <>
                    <tr>
                        <td>
                            Orientation
                        </td>
                        <td>
                            <select
                                value={(activeNode as StructureContainerNode).direction}
                                onChange={(e) => {
                                    const newVal = e.target.value;
                                    updateNode(activeNode.id, StructureUpdatableKeys.Direction, newVal);
                                }}
                            >
                                <option value={StructureDirection.Row}>Row</option>
                                <option value={StructureDirection.Column}>Column</option>
                            </select>
                        </td>
                    </tr>
                </>}
                {activeNode.type === StructureNodeType.Image && <>
                    <tr>
                        <td>
                            Width
                        </td>
                        <td>
                            <TextField value={(activeNode as StructureImageNode).width || ''} onChange={(value: string) => {
                                updateNode(activeNode.id, StructureUpdatableKeys.Width, parseInt(value));
                            }} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Height
                        </td>
                        <td>
                            <TextField value={(activeNode as StructureImageNode).height || ''} onChange={(value: string) => {
                                updateNode(activeNode.id, StructureUpdatableKeys.Height, parseInt(value));
                            }} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Source
                        </td>
                        <td>
                            <TextField value={(activeNode as StructureImageNode).src} onChange={(value: string) => {
                                updateNode(activeNode.id, StructureUpdatableKeys.Src, value);
                            }} />
                        </td>
                    </tr>
                </>}
                <tr>
                    <td>
                        Classes
                    </td>
                    <td>
                        <TextField value={activeNode.extraClasses ?? ''} onChange={(value: string) => {
                            updateNode(activeNode.id, StructureUpdatableKeys.Classes, value);
                        }} />
                    </td>
                </tr>
                <tr>
                    <td>
                        Styles
                    </td>
                    <td>
                        <TextField value={activeNode.extraStyles ?? ''} onChange={(value: string) => {
                            updateNode(activeNode.id, StructureUpdatableKeys.Styles, value);
                        }} />
                    </td>
                </tr>
                <tr>
                    <td>
                        Parent Classes
                    </td>
                    <td>
                        <TextField value={activeNode.parentClasses ?? ''} onChange={(value: string) => {
                            updateNode(activeNode.id, StructureUpdatableKeys.ParentClasses, value);
                        }} />
                    </td>
                </tr>
                <tr>
                    <td>
                        Parent Styles
                    </td>
                    <td>
                        <TextField value={activeNode.parentStyles ?? ''} onChange={(value: string) => {
                            updateNode(activeNode.id, StructureUpdatableKeys.ParentStyles, value);
                        }} />
                    </td>
                </tr>
            </tbody>
        </table>}
    </div>
}
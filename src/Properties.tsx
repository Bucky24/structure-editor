import React, { useContext, useEffect, useState } from 'react';
import EditorContext from './EditorContext';
import { StructureBaseNode, StructureContainerNode, StructureDirection, StructureImageNode, StructureNodeType, StructureTextNode, StructureUpdatableKeys } from './types';
import TextField from './TextField';

export default function Properties() {
    const { activeNodeId, applyToNode, updateNode, classes  } = useContext(EditorContext);
    const [activeNode, setActiveNode] = useState<StructureBaseNode | null>(null);
    const [tempCustomClass, setTempCustomClass] = useState("");

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
                        Name
                    </td>
                    <td>
                        <TextField value={activeNode.name || ''} onChange={(value: string) => {
                            updateNode(activeNode.id, StructureUpdatableKeys.Name, value);
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
                {activeNode.type === StructureNodeType.Text && <tr>
                    <td>
                        Content
                    </td>    
                    <td>
                        <TextField value={(activeNode as StructureTextNode).textContent ?? ''} onChange={(value: string) => {
                            updateNode(activeNode.id, StructureUpdatableKeys.TextContent, value);
                        }} />
                    </td>
                </tr>}
                <tr>
                    <td>
                        Classes
                    </td>
                    <td>
                        {(activeNode.extraClasses ?? '').split(" ").map((customClass, index) => {
                            if (customClass === '') return;
                            return <div>
                                {customClass}
                                <span style={{ cursor: 'pointer', padding: 10 }} onClick={() => {
                                    const newClasses = (activeNode.extraClasses ?? '').split(" ");
                                    newClasses.splice(index, 1);
                                    updateNode(activeNode.id, StructureUpdatableKeys.Classes, newClasses.join(" "));
                                }}>X</span>
                            </div>
                        })}
                        <select value={tempCustomClass} onChange={(e) => setTempCustomClass(e.target.value)}>
                            <option value="">Choose</option>
                            {classes.map((customClass) => {
                                return <option key={`class_selector_${customClass.id}`} value={customClass.name}>{customClass.name}</option>
                            })}
                        </select>
                        <button onClick={() => {
                            if (tempCustomClass !== "") {
                                const newClasses = (activeNode.extraClasses ?? '').split(" ");
                                newClasses.push(tempCustomClass);
                                updateNode(activeNode.id, StructureUpdatableKeys.Classes, newClasses.join(" "));
                                setTempCustomClass('');
                            }
                        }}>Add New</button>
                    </td>
                </tr>
                <tr>
                    <td>
                        Styles
                    </td>
                    <td>
                        {(activeNode.extraStyles ?? '').split(";").map((style, index) => {
                            return <TextField key={`style_${index}`} value={style.trim()} onChange={(value: string) => {
                                let styleList = (activeNode.extraStyles ?? '').split(";").map((item) => item.trim());
                                if (index >= styleList.length) {
                                    styleList.push(value.trim());
                                } else {
                                    styleList[index] = value.trim();
                                }
                                styleList = styleList.filter((style) => style.length > 0);
                                let joinedStyles = styleList.join(";");
                                if (!joinedStyles.endsWith(";")) {
                                    joinedStyles += ";";
                                }
                                updateNode(activeNode.id, StructureUpdatableKeys.Styles, joinedStyles);
                            }} />
                        })}
                    </td>
                </tr>
                <tr>
                    <td>
                        Attributes
                    </td>
                    <td>
                        <TextField value={activeNode.extraAttributes ? JSON.stringify(activeNode.extraAttributes) : '{}'} onChange={(value: string) => {
                            try {
                                const jsonValue = JSON.parse(value);
                                updateNode(activeNode.id, StructureUpdatableKeys.Attributes, jsonValue);
                            } catch (error) {}
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
                <tr>
                    <td>
                        Parent Attributes
                    </td>
                    <td>
                        <TextField value={activeNode.parentAttributes ? JSON.stringify(activeNode.parentAttributes) : '{}'} onChange={(value: string) => {
                            try {
                                const jsonValue = JSON.parse(value);
                                updateNode(activeNode.id, StructureUpdatableKeys.ParentAttributes, jsonValue);
                            } catch (error) {}
                        }} />
                    </td>
                </tr>
            </tbody>
        </table>}
    </div>
}
import React, { useContext, useState } from 'react';
import EditorContext from './EditorContext';
import { CustomClass } from './types';
import { v4 } from 'uuid';
import TextField from './TextField';
import FieldedTable from './FieldedTable';

export default function StylePane() {
    const { classes, setClasses, elementStyles, setElementStyles } = useContext(EditorContext);
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

    const selectedClass = classes.find((customClass) => customClass.id === selectedClassId);
    const selectedElement = elementStyles.find((element) => element.id === selectedElementId);

    return <div>
        <h2>Styles</h2>
        <div style={{
            display: 'flex',
            flexDirection: 'row',
        }}>
            <div style={{
                flexGrow: 0,
                flexShrink: 0,
                flexBasis: 100,
                paddingRight: 10,
            }}>
                <div onClick={() => setSelectedClassId(null)}>Class List</div>
                {classes.map((customClass: CustomClass) => {
                    return <div
                        key={`header_${customClass.id}`}
                        style={{
                            outline: customClass.id === selectedClassId ? '1px solid red' : '',
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            setSelectedClassId(customClass.id);
                        }}
                    >{customClass.name.length > 0 ? customClass.name : customClass.id}</div>
                })}
                <button onClick={() => {
                    setClasses([
                        ...classes,
                        {
                            name: 'Unnamed',
                            id: v4(),
                            styles: {},
                        },
                    ]);
                }}>New Class</button>
                
                <div onClick={() => setSelectedElementId(null)}>Element Style List</div>
                {elementStyles.map((elementStyle) => {
                    return <div
                        key={`header_${elementStyle.id}`}
                        style={{
                            outline: elementStyle.id === selectedElementId ? '1px solid red' : '',
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            setSelectedElementId(elementStyle.id);
                        }}
                    >
                        {elementStyle.element.length > 0 ? elementStyle.element : elementStyle.id}
                    </div>
                })}
                <button onClick={() => {
                    setElementStyles([
                        ...elementStyles,
                        {
                            element: 'html',
                            id: v4(),
                            styles: {},
                        },
                    ]);
                }}>New Element Style</button>
            </div>
            <div style={{
                flexGrow: 1,
            }}>
                {selectedClass && <div>
                    <h2>Class {selectedClass.name} ({selectedClass.id})</h2>
                    <div>
                        <span>Name</span>
                        <TextField value={selectedClass.name} onChange={(val) => {
                            const newClasses = [...classes];
                            for (const customClass of newClasses) {
                                if (customClass.id === selectedClassId) {
                                    customClass.name = val;
                                }
                            }

                            setClasses(newClasses);
                        }} />
                    </div>
                    <h2>Styles</h2>
                    <FieldedTable
                        headers={{__key: 'Style', __value: 'Value' }}
                        data={selectedClass.styles}
                        onChange={(newData) => {
                            const newClasses = [...classes];
                            for (const customClass of newClasses) {
                                if (customClass.id === selectedClassId) {
                                    customClass.styles = newData;
                                }
                            }

                            setClasses(newClasses);
                        }}
                    />
                </div>}
                {selectedElement && <div>
                    <h2>Class {selectedElement.element} ({selectedElement.id})</h2>
                    <div>
                        <span>Element</span>
                        <TextField value={selectedElement.element} onChange={(val) => {
                            const newItems = [...elementStyles];
                            for (const customItem of newItems) {
                                if (customItem.id === selectedElementId) {
                                    customItem.element = val;
                                }
                            }

                            setElementStyles(newItems);
                        }} />
                    </div>
                    <h2>Styles</h2>
                    <FieldedTable
                        headers={{__key: 'Style', __value: 'Value' }}
                        data={selectedElement.styles}
                        onChange={(newData) => {
                            const newItems = [...elementStyles];
                            for (const customItem of newItems) {
                                if (customItem.id === selectedElementId) {
                                    customItem.styles = newData;
                                }
                            }

                            setElementStyles(newItems);
                        }}
                    />
                </div>}
            </div>
        </div>
    </div>;
}
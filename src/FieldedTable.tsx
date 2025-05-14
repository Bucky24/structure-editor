import React, { useState } from 'react';
import TextField from './TextField';

type FieldedTableProps = {
    headers: { [key: string]: string },
    data: { [key: string]: any },
    onChange: (data: { [key: string]: any }) => void, 
}

export default function FieldedTable({ headers, data, onChange }: FieldedTableProps) {
    const [newFields, setNewFields] = useState<{ [key: string]: string}>({});

    return <table border={1}>
        <thead>
            <tr>
                {Object.values(headers).map((header) => {
                    return <th key={header}>{header}</th>;
                })}
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {Object.keys(data).map((key, index) => {
                return <tr key={`row_${index}`}>
                    {Object.keys(headers).map((header) => {
                        let value = '';
                        if (header === "__key") {
                            value = key;
                        } else if (header === '__value') {
                            value = data[key];
                        } else {
                            value = data[key][header] || '';
                        }
                        return <th key={`cell_${index}_${header}`}>
                            <TextField value={value} onChange={(newValue) => {
                                const newData = {...data};
                                if (header === "__key") {
                                    newData[newValue] = newData[key];
                                    delete newData[key];
                                } else if (header === "__value") {
                                    newData[key] = newValue;
                                } else {
                                    newData[key][header] = newValue;
                                }

                                onChange(newData);
                            }} />
                        </th>
                    })}
                </tr>
            })}
            <tr>
                {Object.keys(headers).map((header) => {
                    return <td key={`new_row_${header}`}>
                        <TextField value={newFields[header] || ''} onChange={(newVal) => {
                            setNewFields({
                                ...newFields,
                                [header]: newVal,
                            });
                        }} />
                    </td>;
                })}
                <td>
                    <button onClick={() => {
                        let key = null;
                        let objValue: { [key: string]: string } = {};
                        let value: string = '';

                        for (const header in newFields) {
                            if (header === "__key") {
                                key = newFields[header];
                            } else if (header === "__value") {
                                value = newFields[header];
                            } else {
                                objValue[header] = newFields[header];
                            }
                        }

                        if (key === null) {
                            return;
                        }

                        const newData = {...data};
                        if (value !== null) {
                            newData[key] = value;
                        }

                        for (const header in objValue) {
                            newData[key][header] = objValue[header];
                        }

                        onChange(newData);

                        setNewFields({});
                    }}>Add</button>
                </td>
            </tr>
        </tbody>
    </table>
}
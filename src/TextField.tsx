import React, { useEffect, useState } from 'react';

export default function TextField({ value: initialValue, onChange}: {value: string, onChange: (newVal: string) => void}) {
    const [value, setValue] = useState<string>(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);
    return <input type="text" value={value} onChange={(e) => {
        const newVal = e.target.value;
        setValue(newVal);
        onChange(newVal);
    }}/>
}
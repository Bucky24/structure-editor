import React, { useEffect, useState } from 'react';

export default function TextField({ value: initialValue, onChange}: {value: string | number, onChange: (newVal: string) => void}) {
    const [value, setValue] = useState<string | number>(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return <input type="text" value={value} onChange={(e) => {
        const newVal = e.target.value;
        setValue(newVal);
        onChange(newVal);
    }}/>
}
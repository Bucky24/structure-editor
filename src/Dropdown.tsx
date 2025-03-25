import React, { useState } from 'react';

export default function Dropdown({ items, onClick }: { items: string[], onClick: (item: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    return <div style={{
        position: 'relative',
        display: 'inline-block',
    }}>
        <div onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
        }} style={{ padding: 5 }}>&#8595;</div>
        {isOpen && <div style={{
            position: 'absolute',
            top: '12px',
            background: 'white',
            zIndex: 100,
            width: 100,
            right: 0,
        }}>
            {items.map((item) => <div style={{ border: '1px solid black', padding: 10, }} key={item} onClick={(e) => {
                onClick(item);
                setIsOpen(false);
                e.stopPropagation();
            }}>{item}</div>)}
        </div>}
    </div>;
}
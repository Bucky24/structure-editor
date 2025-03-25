import React, { useContext, useEffect, useState } from 'react';
import EditorContext from './EditorContext';
import generator from './generator';

export default function Preview() {
    const [content, setContent] = useState('');
    const { nodes } = useContext(EditorContext);

    useEffect(() => {
        setContent(generator(nodes));
    }, [nodes]);

    return <div
        style={{
            height: 'calc(100% - 20px)',
            border: '1px solid black',
            padding: '10px',
        }}
        dangerouslySetInnerHTML={{ __html: content }}
    >
    </div>
}
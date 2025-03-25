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
            padding: '10px',
        }}
        dangerouslySetInnerHTML={{ __html: content }}
    >
    </div>
}
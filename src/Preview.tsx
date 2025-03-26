import React, { useContext, useEffect, useState } from 'react';
import EditorContext from './EditorContext';
import { StructureHtmlGenerator } from './generators/StructureHtmlGenerator';

export default function Preview() {
    const [content, setContent] = useState('');
    const { nodes } = useContext(EditorContext);

    useEffect(() => {
        setContent((new StructureHtmlGenerator).generate(nodes));
    }, [nodes]);

    return <div
        style={{
            padding: '10px',
        }}
        dangerouslySetInnerHTML={{ __html: content }}
    >
    </div>
}
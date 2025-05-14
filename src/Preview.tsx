import React, { useContext, useEffect, useState } from 'react';
import EditorContext from './EditorContext';
import { StructureHtmlGenerator } from './generators/StructureHtmlGenerator';

export default function Preview() {
    const [content, setContent] = useState('');
    const { nodes, classes, elementStyles } = useContext(EditorContext);

    useEffect(() => {
        const output = (new StructureHtmlGenerator).generate(nodes, classes, elementStyles);
        setContent(output.style + "\n" + output.body);
    }, [nodes]);

    return <div
        style={{
            padding: '10px',
        }}
        dangerouslySetInnerHTML={{ __html: content }}
    >
    </div>
}
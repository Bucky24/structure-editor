import React, { useContext, useEffect, useState } from 'react';
import EditorContext from './EditorContext';
import { StructureHtmlGenerator } from './generators/StructureHtmlGenerator';

export default function Preview() {
    const [content, setContent] = useState('');
    const { nodes, classes } = useContext(EditorContext);

    useEffect(() => {
        const output = (new StructureHtmlGenerator).generate(nodes, classes);
        setContent(output.classHtml + "\n" + output.bodyHtml);
    }, [nodes]);

    return <div
        style={{
            padding: '10px',
        }}
        dangerouslySetInnerHTML={{ __html: content }}
    >
    </div>
}
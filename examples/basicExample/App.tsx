import React, { ReactNode, useState } from 'react';
import { Editor } from '@bucky24/structure-editor';

import './styles.css';

export default function App(): ReactNode {
    const [content, setContent] = useState<string | null>(null);
    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    }}>
        <Editor onSave={(content: string) => {
            setContent(content);
        }} />
        <div style={{
            flexBasis: 200,
            flexShrink: 0,
        }}>
            <pre>{content}</pre>
        </div>
    </div>;
}
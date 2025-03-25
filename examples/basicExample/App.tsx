import React, { ReactNode, useState } from 'react';
import { Editor, StructureSaveType } from '@bucky24/structure-editor';

import './styles.css';

export default function App(): ReactNode {
    const [content, setContent] = useState<string | null>(null);
    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    }}>
        <div style={{
            flex: 1,
            height: 'calc(100% - 200px)',
        }}>
            <Editor onSave={(type: StructureSaveType, content: string) => {
                setContent(content);
            }} />
        </div>
        <div style={{
            flexBasis: 200,
            flexShrink: 0,
        }}>
            <pre>{content}</pre>
        </div>
    </div>;
}
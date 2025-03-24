import React from 'react';
import { EditorProvider } from './EditorContext';
import OuterEditor from './OuterEditor';

export default function WrappedEditor({ onSave }: { onSave: (content: string) => void | Promise<void> }) {
    return <EditorProvider>
        <OuterEditor onSave={onSave} />
    </EditorProvider>
}
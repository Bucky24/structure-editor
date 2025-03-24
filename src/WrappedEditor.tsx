import React from 'react';
import { EditorProvider } from './EditorContext';
import OuterEditor from './OuterEditor';
import { StructureSaveType } from './types';

export default function WrappedEditor({ onSave }: { onSave: (type: StructureSaveType, content: string) => void | Promise<void> }) {
    return <EditorProvider>
        <OuterEditor onSave={onSave} />
    </EditorProvider>
}
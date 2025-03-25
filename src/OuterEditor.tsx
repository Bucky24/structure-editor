import React, { useContext, useEffect, useState } from 'react';
import Editor from './Editor';
import EditorContext from './EditorContext';
import Menu from './Menu';
import Sidebar from './Sidebar';
import Properties from './Properties';

import './styles.css';
import generator from './generator';
import { StructureSaveType } from './types';
import Preview from './Preview';

export default function OuterEditor({ onSave }: { onSave: (type: StructureSaveType, content: string) => void | Promise<void> }) {
    const { nodes } = useContext(EditorContext);
    const [mode, setMode] = useState('editor');

    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    }}>
        <div style={{
            flexShrink: 0,
            flexBasis: 50,
        }}>
            <Menu onSave={(type: StructureSaveType) => {
                if (type === StructureSaveType.HTML) {
                    const html = generator(nodes);
                    onSave(StructureSaveType.HTML, html);
                } else if (type === StructureSaveType.JSON) {
                    onSave(StructureSaveType.JSON, JSON.stringify(nodes, null, 4));
                }
            }} />
        </div>
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            flexGrow: 1,
            height: 'calc(100% - 50px)',
        }}>
            <div style={{
                flexShrink: 0,
                flexGrow: 0,
                flexBasis: 200,
                height: '100%',
            }}>
                <Properties />
            </div>
            <div style={{
                flexGrow: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <div style={{
                    flexShrink: 0,
                }}>
                    <button onClick={() => setMode('editor')}>Editor</button>
                    <button onClick={() => setMode('preview')}>Preview</button>
                </div>
                <div style={{
                    flexGrow: 1,
                }}>
                    {mode === 'editor' && <Editor />}
                    {mode === 'preview' && <Preview />}
                </div>
            </div>
            <div style={{
                flexShrink: 0,
                flexGrow: 0,
                flexBasis: 300,
                height: '100%',
            }}>
                <Sidebar />
            </div>
        </div>
    </div>;
}
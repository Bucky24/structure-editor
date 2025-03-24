import React from 'react';
import Editor from './Editor';
import { EditorProvider } from './EditorContext';
import Menu from './Menu';
import Sidebar from './Sidebar';

export default function EditorWrapper() {
    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    }}>
        <EditorProvider>
            <div style={{
                flexShrink: 0,
                flexBasis: 50,
            }}>
                <Menu />
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                flexGrow: 1,
            }}>
                <div style={{
                    flexGrow: 1,
                    height: '100%',
                }}>
                    <Editor />
                </div>
                <div style={{
                    flexShrink: 0,
                    flexGrow: 0,
                    flexBasis: 200,
                    height: '100%',
                }}>
                    <Sidebar />
                </div>
            </div>
        </EditorProvider>
    </div>;
}
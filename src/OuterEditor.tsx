import React, { useContext } from 'react';
import Editor from './Editor';
import EditorContext from './EditorContext';
import Menu from './Menu';
import Sidebar from './Sidebar';
import Properties from './Properties';

import './styles.css';
import generator from './generator';

export default function OuterEditor({ onSave }: { onSave: (content: string) => void | Promise<void> }) {
    const { nodes } = useContext(EditorContext);

    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    }}>
        <div style={{
            flexShrink: 0,
            flexBasis: 50,
        }}>
            <Menu onSave={() => {
                console.log(nodes);
                // generate now
                const html = generator(nodes);
                onSave(html);
            }} />
        </div>
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            flexGrow: 1,
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
    </div>;
}
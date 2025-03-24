import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootDom = document.getElementById('root');
if (!rootDom) {
    throw new Error('Missing root DOM element');
}
const root = createRoot(rootDom);

root.render(
    <App />
);

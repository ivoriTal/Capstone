import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Ensure App.js exists in the src directory

const container = document.getElementById('root'); // Get the root element
const root = createRoot(container); // Create a root

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

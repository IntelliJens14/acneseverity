import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import process from 'node:process';

// Get root element safely
const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error(
    "%c[Error] Root element not found! Ensure your HTML file has a <div id='root'></div>.",
    "color: red; font-weight: bold;"
  );

  // Optional: Alert users in development mode
  if (process.env.NODE_ENV !== 'production') {
    alert("App failed to load. Root element missing in index.html.");
  }
}

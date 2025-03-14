import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

// ✅ Ensure `process.env` works in Vite
const isDev = import.meta.env.MODE !== 'production';

// ✅ Get root element safely
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

  // ✅ Show warning only in development
  if (isDev) {
    console.warn("⚠️ App failed to load because #root is missing in index.html.");
  }
}

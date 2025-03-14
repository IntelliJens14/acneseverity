import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

// Get root element
const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error(
    "%c[Error] Root element not found! Make sure your HTML file has a <div id='root'></div>.",
    "color: red; font-weight: bold;"
  );
  alert("App failed to load. Root element missing in the HTML file.");
}
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

// ✅ Ensure `import.meta.env` works in Vite
const isDev = import.meta.env.MODE === 'development';

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
  // ✅ Show error message in the console
  console.error(
    "%c[Error] Root element not found! Ensure your HTML file has a <div id='root'></div>.",
    "color: red; font-weight: bold;"
  );

  // ✅ Show warning only in development
  if (isDev) {
    console.warn(
      "%c⚠️ App failed to load because #root is missing in index.html.",
      "color: orange; font-weight: bold;"
    );
  }

  // ✅ Optional: Render a fallback UI in development
  if (isDev) {
    const fallbackElement = document.createElement('div');
    fallbackElement.style.textAlign = 'center';
    fallbackElement.style.marginTop = '20px';
    fallbackElement.style.color = 'red';
    fallbackElement.innerHTML = `
      <h1>Error: Root Element Not Found</h1>
      <p>Ensure your HTML file has a <code>&lt;div id="root"&gt;&lt;/div&gt;</code>.</p>
    `;
    document.body.appendChild(fallbackElement);
  }
}

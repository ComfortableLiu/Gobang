import React from 'react';
import { createRoot } from 'react-dom/client';
import App from "@/layout/App";

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}

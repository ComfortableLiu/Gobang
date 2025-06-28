import React from 'react';
import { createRoot } from 'react-dom/client';
import App from "@/layout/App";
import { StoreProvider } from "@/store/storeContext";

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <StoreProvider>
        <App />
      </StoreProvider>
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}

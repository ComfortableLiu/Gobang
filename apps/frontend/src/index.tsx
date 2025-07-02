import React from 'react';
import { createRoot } from 'react-dom/client';
import App from "../../frontend/src/layout/App";
import { StoreProvider } from "./store/storeContext";
import application from "./common/application";

// 检查DeviceId，没有的话搞个新的
application.checkDeviceId()

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

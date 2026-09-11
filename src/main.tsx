import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/layout/ErrorBoundary";
import { registerPwaServiceWorker } from "./utils/pwaManager";
import "./index.css";

// Initialize native PWA Service Worker, offline caching & WebAPK bridge
registerPwaServiceWorker();

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

// Automatically recover from stale chunks during hot reload or deployments
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    console.warn('Vite preload error detected, reloading page...', event);
    window.location.reload();
  });
}


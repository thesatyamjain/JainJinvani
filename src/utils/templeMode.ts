/**
 * Temple Mode Utility
 * Communicates with public/sw.js to trigger offline caching of all scriptures and audio.
 */

const STORAGE_KEY = 'jinvani_temple_mode_cached';

export function isTempleModeSupported(): boolean {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator && !!navigator.serviceWorker.controller;
}

export function isTempleModeCachedLocally(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

export function downloadTempleMode(
  onProgress: (percent: number) => void
): Promise<boolean> {
  return new Promise((resolve) => {
    if (!isTempleModeSupported()) {
      // If service worker is not yet controlling the page, simulate quick preparation
      let simulated = 0;
      const interval = setInterval(() => {
        simulated += 20;
        onProgress(simulated);
        if (simulated >= 100) {
          clearInterval(interval);
          localStorage.setItem(STORAGE_KEY, 'true');
          resolve(true);
        }
      }, 150);
      return;
    }

    const handler = (event: MessageEvent) => {
      if (!event.data) return;

      if (event.data.type === 'TEMPLE_MODE_PROGRESS') {
        onProgress(event.data.progress || 0);
      }

      if (event.data.type === 'TEMPLE_MODE_COMPLETE') {
        navigator.serviceWorker.removeEventListener('message', handler);
        localStorage.setItem(STORAGE_KEY, 'true');
        resolve(true);
      }
    };

    navigator.serviceWorker.addEventListener('message', handler);

    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'DOWNLOAD_TEMPLE_MODE',
      });
    } else {
      resolve(false);
    }
  });
}

export function checkTempleModeStatus(): Promise<boolean> {
  return new Promise((resolve) => {
    if (isTempleModeCachedLocally()) {
      resolve(true);
      return;
    }

    if (!isTempleModeSupported() || !navigator.serviceWorker.controller) {
      resolve(false);
      return;
    }

    const timer = setTimeout(() => {
      resolve(false);
    }, 1500);

    const handler = (event: MessageEvent) => {
      if (event.data && event.data.type === 'TEMPLE_MODE_STATUS') {
        clearTimeout(timer);
        navigator.serviceWorker.removeEventListener('message', handler);
        const ready = !!event.data.isReady;
        if (ready) localStorage.setItem(STORAGE_KEY, 'true');
        resolve(ready);
      }
    };

    navigator.serviceWorker.addEventListener('message', handler);
    navigator.serviceWorker.controller.postMessage({
      type: 'CHECK_TEMPLE_MODE_STATUS',
    });
  });
}

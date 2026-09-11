/**
 * PWA & Native Platform Manager
 * Handles Service Worker lifecycle, WebAPK install prompt capture,
 * Screen Wake Lock, tactile haptics, and network connectivity state.
 */

type InstallPromptCallback = (canInstall: boolean) => void;
type NetworkStatusCallback = (isOnline: boolean) => void;
type UpdateAvailableCallback = () => void;

let deferredPrompt: any = null;
const installListeners = new Set<InstallPromptCallback>();
const networkListeners = new Set<NetworkStatusCallback>();
const updateListeners = new Set<UpdateAvailableCallback>();
let swRegistration: ServiceWorkerRegistration | null = null;
let wakeLockSentinel: any = null;

/**
 * Check if the application is currently running in Standalone (PWA) mode
 */
export function isStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

/**
 * Check if running on iOS (iPhone / iPad / iPod)
 */
export function isIOSDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

/**
 * Register Service Worker with robust update management
 */
export function registerPwaServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      swRegistration = reg;

      // Detect waiting worker on load
      if (reg.waiting) {
        notifyUpdateListeners();
      }

      // Listen for updates
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            notifyUpdateListeners();
          }
        });
      });

      // Check for updates when page regains focus
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && reg) {
          reg.update().catch(() => {});
        }
      });
    } catch (err) {
      console.warn('Service Worker registration failed:', err);
    }
  });

  // Reload when the new service worker takes control
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });

  // Capture beforeinstallprompt for Android / Chromium WebAPK
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt = e;
    installListeners.forEach((cb) => cb(true));
  });

  // Handle app installed event
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    installListeners.forEach((cb) => cb(false));
  });

  // Network online / offline listeners
  window.addEventListener('online', () => {
    networkListeners.forEach((cb) => cb(true));
  });
  window.addEventListener('offline', () => {
    networkListeners.forEach((cb) => cb(false));
  });
}

function notifyUpdateListeners() {
  updateListeners.forEach((cb) => cb());
}

/**
 * Trigger native install prompt
 */
export async function promptPwaInstall(): Promise<boolean> {
  if (!deferredPrompt) return false;

  try {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    installListeners.forEach((cb) => cb(false));
    return outcome === 'accepted';
  } catch (e) {
    console.warn('PWA install prompt error:', e);
    return false;
  }
}

export function canInstallPwa(): boolean {
  return !!deferredPrompt && !isStandaloneMode();
}

export function subscribeToInstallPrompt(cb: InstallPromptCallback): () => void {
  installListeners.add(cb);
  cb(canInstallPwa());
  return () => installListeners.delete(cb);
}

export function subscribeToNetworkStatus(cb: NetworkStatusCallback): () => void {
  networkListeners.add(cb);
  cb(typeof navigator !== 'undefined' ? navigator.onLine : true);
  return () => networkListeners.delete(cb);
}

export function subscribeToAppUpdates(cb: UpdateAvailableCallback): () => void {
  updateListeners.add(cb);
  if (swRegistration?.waiting) {
    cb();
  }
  return () => updateListeners.delete(cb);
}

/**
 * Tell waiting Service Worker to skip waiting and activate immediately
 */
export function applyAppUpdate(): void {
  if (swRegistration?.waiting) {
    swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
  } else {
    window.location.reload();
  }
}

/**
 * Screen Wake Lock: Keeps the device screen awake during prayer & recitation
 */
export async function requestScreenWakeLock(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) {
    return false;
  }

  try {
    if (wakeLockSentinel) return true;
    wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
    wakeLockSentinel.addEventListener('release', () => {
      wakeLockSentinel = null;
    });
    return true;
  } catch (err) {
    return false;
  }
}

export function releaseScreenWakeLock(): void {
  if (wakeLockSentinel) {
    wakeLockSentinel.release().catch(() => {});
    wakeLockSentinel = null;
  }
}

/**
 * Tactile Haptic Vibration for native button feedback
 */
export function triggerHaptic(type: 'light' | 'medium' | 'success' = 'light'): void {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;

  try {
    switch (type) {
      case 'light':
        navigator.vibrate(12);
        break;
      case 'medium':
        navigator.vibrate(24);
        break;
      case 'success':
        navigator.vibrate([30, 40, 60]);
        break;
    }
  } catch (e) {
    // Ignore unsupported vibration errors
  }
}

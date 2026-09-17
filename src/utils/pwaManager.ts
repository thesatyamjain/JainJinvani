/**
 * State-of-the-Art (SOTA) PWA & Native Platform Manager
 * Handles Service Worker lifecycle, WebAPK install prompt capture,
 * Persistent Storage protection, Media Session API, App Badging API,
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
 * Register Service Worker with robust update management & persistent storage
 */
export function registerPwaServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // In development mode, unregister any active service worker to prevent stale cached bundles
  if (import.meta.env.DEV) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    }).catch(() => {});
    return;
  }

  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      swRegistration = reg;

      // Automatically request eviction-proof persistent storage
      requestPersistentStorage().catch(() => {});

      // Register periodic background sync if supported (for daily panchang)
      if ('periodicSync' in reg) {
        try {
          await (reg as any).periodicSync.register('update-panchang', {
            minInterval: 24 * 60 * 60 * 1000,
          });
        } catch (e) {
          // Periodic sync may require installed PWA status or user engagement
        }
      }

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
 * Persistent Storage API: Prevents OS eviction of cached holy scriptures & audio
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.storage || !navigator.storage.persist) {
    return false;
  }
  try {
    const isPersisted = await navigator.storage.persisted();
    if (isPersisted) return true;
    return await navigator.storage.persist();
  } catch (err) {
    return false;
  }
}

/**
 * Storage Quota Estimation: Returns MB cached and total quota
 */
export async function checkStorageEstimate(): Promise<{
  usageMB: number;
  quotaMB: number;
  percent: number;
  isPersisted: boolean;
}> {
  if (typeof navigator === 'undefined' || !navigator.storage || !navigator.storage.estimate) {
    return { usageMB: 0, quotaMB: 0, percent: 0, isPersisted: false };
  }
  try {
    const estimate = await navigator.storage.estimate();
    const isPersisted = navigator.storage.persisted ? await navigator.storage.persisted() : false;
    const usage = estimate.usage || 0;
    const quota = estimate.quota || 1;
    const usageMB = Number((usage / (1024 * 1024)).toFixed(1));
    const quotaMB = Number((quota / (1024 * 1024)).toFixed(0));
    const percent = Math.min(100, Math.round((usage / quota) * 100));

    return { usageMB, quotaMB, percent, isPersisted };
  } catch (e) {
    return { usageMB: 0, quotaMB: 0, percent: 0, isPersisted: false };
  }
}

/**
 * App Badging API: Shows a subtle dot/number badge on the installed app icon
 */
export async function setAppNotificationBadge(count?: number): Promise<void> {
  if (typeof navigator === 'undefined') return;
  try {
    if ('setAppBadge' in navigator) {
      if (typeof count === 'number' && count > 0) {
        await (navigator as any).setAppBadge(count);
      } else {
        await (navigator as any).setAppBadge();
      }
    }
  } catch (e) {
    // Unsupported or permission denied
  }
}

export async function clearAppNotificationBadge(): Promise<void> {
  if (typeof navigator === 'undefined') return;
  try {
    if ('clearAppBadge' in navigator) {
      await (navigator as any).clearAppBadge();
    }
  } catch (e) {
    // Unsupported
  }
}

/**
 * Media Session API: Displays rich devotional player on Android / iOS lock-screens and smartwatch
 */
export function setupMediaSession(options: {
  title: string;
  artist?: string;
  album?: string;
  artwork?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onSeek?: (time: number) => void;
  onSeekForward?: () => void;
  onSeekBackward?: () => void;
}): void {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) {
    return;
  }

  try {
    const defaultArtwork = [
      { src: '/icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
    ];

    navigator.mediaSession.metadata = new MediaMetadata({
      title: options.title,
      artist: options.artist || 'जैन जिनवाणी • नित्य स्वाध्याय',
      album: options.album || 'जैन धर्म भक्ति व स्तोत्र',
      artwork: options.artwork ? [{ src: options.artwork, sizes: '512x512', type: 'image/png' }] : defaultArtwork,
    });

    if (options.onPlay) {
      navigator.mediaSession.setActionHandler('play', options.onPlay);
    }
    if (options.onPause) {
      navigator.mediaSession.setActionHandler('pause', options.onPause);
    }
    if (options.onSeek) {
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined && options.onSeek) {
          options.onSeek(details.seekTime);
        }
      });
    }

    if (options.onSeekForward) {
      navigator.mediaSession.setActionHandler('seekforward', options.onSeekForward);
    }
    if (options.onSeekBackward) {
      navigator.mediaSession.setActionHandler('seekbackward', options.onSeekBackward);
    }
  } catch (e) {
    console.warn('MediaSession setup failed:', e);
  }
}

export function updateMediaPlaybackState(state: 'playing' | 'paused' | 'none'): void {
  if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
    try {
      navigator.mediaSession.playbackState = state;
    } catch (e) {}
  }
}

export function clearMediaSession(): void {
  if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
    try {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.playbackState = 'none';
    } catch (e) {}
  }
}

/**
 * Network Quality Profile (Network Information API)
 */
export function getNetworkProfile(): {
  isOnline: boolean;
  isDataSaver: boolean;
  effectiveType: string;
} {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  const connection = typeof navigator !== 'undefined' ? (navigator as any).connection : null;

  return {
    isOnline,
    isDataSaver: !!connection?.saveData,
    effectiveType: connection?.effectiveType || '4g',
  };
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

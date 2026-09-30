// Service Worker for Jain Jinvani (Temple Mode & Offline PWA)
const SHELL_CACHE = 'jinvani-shell-v5';
const DATA_CACHE = 'jinvani-data-v5';
const MEDIA_CACHE = 'jinvani-media-v5';
const FONT_CACHE = 'jinvani-fonts-v5';

const PRECACHE_SHELL = [
  '/',
  '/index.html',
  '/logo.webp',
  '/manifest.webmanifest',
  '/icons/pwa-192x192.png',
  '/icons/pwa-512x512.png',
  '/icons/pwa-maskable-192x192.png',
  '/icons/pwa-maskable-512x512.png',
  '/icons/apple-touch-icon.png'
];

const ESSENTIAL_AUDIO = [
  'https://archive.org/download/namokar-mantra/Namokaar%20Mantra%20Hai%20Nyaara%20_%20Lata%20Mangeshkar%20_%20Rajendra%20Jain%20_%20Full%20Audio%20Song_WqD-nyNdW3o.mp3'
];

// Install: Precache app shell & essential icons
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_SHELL);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up old cache versions
self.addEventListener('activate', (event) => {
  const currentCaches = [SHELL_CACHE, DATA_CACHE, MEDIA_CACHE, FONT_CACHE];
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => !currentCaches.includes(key)).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Message listener for Temple Mode and skip-waiting updates
self.addEventListener('message', async (event) => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }

  if (event.data.type === 'DOWNLOAD_TEMPLE_MODE') {
    const totalItems = PRECACHE_SHELL.length + ESSENTIAL_AUDIO.length;
    let completedItems = 0;

    const notifyProgress = () => {
      const percent = Math.round((completedItems / totalItems) * 100);
      if (event.source) {
        event.source.postMessage({
          type: 'TEMPLE_MODE_PROGRESS',
          progress: percent,
          completed: completedItems,
          total: totalItems,
        });
      }
    };

    // 1. Cache app shell
    try {
      const shellCache = await caches.open(SHELL_CACHE);
      for (const shellUrl of PRECACHE_SHELL) {
        try {
          const res = await fetch(shellUrl, { cache: 'reload' });
          if (res.ok) {
            await shellCache.put(shellUrl, res);
          }
        } catch (e) {
          console.warn('Failed to precache shell item:', shellUrl, e);
        }
        completedItems++;
        notifyProgress();
      }
    } catch (e) {
      console.error('Error opening shell cache:', e);
    }

    // 2. Cache essential audio
    try {
      const mediaCache = await caches.open(MEDIA_CACHE);
      for (const audioUrl of ESSENTIAL_AUDIO) {
        try {
          const res = await fetch(audioUrl, { mode: 'cors' });
          if (res.ok) {
            await mediaCache.put(audioUrl, res);
          }
        } catch (e) {
          try {
            const opaqueRes = await fetch(audioUrl, { mode: 'no-cors' });
            await mediaCache.put(audioUrl, opaqueRes);
          } catch (err) {
            console.warn('Failed to cache audio:', audioUrl, err);
          }
        }
        completedItems++;
        notifyProgress();
      }
    } catch (e) {
      console.error('Error opening media cache:', e);
    }

    if (event.source) {
      event.source.postMessage({
        type: 'TEMPLE_MODE_COMPLETE',
        success: true,
      });
    }
  }

  if (event.data.type === 'CHECK_TEMPLE_MODE_STATUS') {
    try {
      const shellCache = await caches.open(SHELL_CACHE);
      const match = await shellCache.match('/index.html');
      if (event.source) {
        event.source.postMessage({
          type: 'TEMPLE_MODE_STATUS',
          isReady: !!match,
        });
      }
    } catch (e) {
      if (event.source) {
        event.source.postMessage({ type: 'TEMPLE_MODE_STATUS', isReady: false });
      }
    }
  }
});

// Fetch listener: Offline-First Strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip API routes (/api/*) and analytics
  if (url.pathname.startsWith('/api/') || url.hostname.includes('google-analytics') || url.hostname.includes('googletagmanager')) {
    return;
  }

  // 1. Google Fonts Cache-First (Stylesheets & Font binaries)
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.open(FONT_CACHE).then((cache) => {
        return cache.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((networkRes) => {
            if (networkRes && networkRes.status === 200) {
              cache.put(event.request, networkRes.clone());
            }
            return networkRes;
          }).catch(() => cached || new Response('', { status: 503 }));
        });
      })
    );
    return;
  }

  // 2. Audio and media files (.mp3, .wav, or media domain)
  if (url.pathname.endsWith('.mp3') || url.pathname.endsWith('.wav') || url.hostname.includes('archive.org') || url.hostname.includes('r2.dev')) {
    // Range requests cannot be cached with cache.put in Cache API
    if (event.request.headers.has('range')) {
      return; // Let browser natively handle Range request over network
    }
    event.respondWith(
      caches.open(MEDIA_CACHE).then((cache) => {
        return cache.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((networkRes) => {
            if (networkRes && networkRes.status === 200) {
              cache.put(event.request, networkRes.clone());
            }
            return networkRes;
          }).catch(() => cached || new Response('', { status: 503 }));
        });
      })
    );
    return;
  }

  // 3. Navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.open(SHELL_CACHE).then((cache) => {
          return cache.match('/index.html') || cache.match('/');
        });
      })
    );
    return;
  }

  // 5. Static assets (/assets/*, icons, images, local bundles)
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const clone = networkRes.clone();
            caches.open(SHELL_CACHE).then((cache) => cache.put(event.request, clone));
          }
          return networkRes;
        }).catch(() => cached);
      })
    );
  }
});

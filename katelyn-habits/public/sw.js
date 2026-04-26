const CACHE = 'katelyn-habits-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg',
];

// Install: pre-cache shell assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// Activate: clear old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Fetch: network-first for JS/CSS bundles, cache-first for everything else
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Don't intercept non-GET or cross-origin
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Network-first for JS/CSS (versioned assets change often)
  if (url.pathname.startsWith('/assets/')) {
    e.respondWith(
      fetch(e.request)
        .then(res => { caches.open(CACHE).then(c => c.put(e.request, res.clone())); return res; })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Cache-first for everything else (shell, icons, manifest)
  e.respondWith(
    caches.match(e.request).then(cached => cached ?? fetch(e.request))
  );
});

// Push notifications from server (future use)
self.addEventListener('push', e => {
  const data = e.data?.json() ?? {};
  e.waitUntil(
    self.registration.showNotification(data.title ?? "Katelyn's Habits", {
      body: data.body ?? 'Time to check in on your habits!',
      icon: '/icon-192.svg',
      badge: '/icon-192.svg',
      data: { url: '/' },
    })
  );
});

// Notification click: focus or open the app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(all => {
      const existing = all.find(c => c.url.includes(self.location.origin));
      return existing ? existing.focus() : clients.openWindow('/');
    })
  );
});

// Scheduled reminder via postMessage from the app
self.addEventListener('message', e => {
  if (e.data?.type === 'NOTIFY') {
    const { title, body, icon } = e.data;
    self.registration.showNotification(title, {
      body,
      icon: icon ?? '/icon-192.svg',
      badge: '/icon-192.svg',
    });
  }
});

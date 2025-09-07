const CACHE_NAME = 'coloringbook-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/assets/logo.svg'
];

// Cache static assets on install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Remove old caches on activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// Stale-While-Revalidate strategy for static assets
self.addEventListener('fetch', event => {
  const { request } = event;

  // Only apply to GET requests
  if (request.method !== 'GET') return;

  // Apply strategy to same-origin requests only
  if (request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(request).then(cachedResponse => {
          const fetchPromise = fetch(request).then(networkResponse => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });

          return cachedResponse || fetchPromise;
        })
      )
    );
  }
});

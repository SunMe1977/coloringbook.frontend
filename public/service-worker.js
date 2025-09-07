// public/service-worker.js

const CACHE_NAME = 'coloringbook-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/assets/logo.svg'
];

// Install event: cache static assets
self.addEventListener('install', event => {
  console.log('📦 Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('✅ Service Worker: Caching app shell');
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  console.log('🔄 Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log('🧹 Service Worker: Removing old cache', name);
            return caches.delete(name);
          }
        })
      )
    )
  );
});

// Fetch event: serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

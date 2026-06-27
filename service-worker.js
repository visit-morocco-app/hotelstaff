const CACHE_NAME = 'hotelstaff-v5';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Toujours aller chercher sur le réseau, jamais depuis le cache
  event.respondWith(fetch(event.request));
});
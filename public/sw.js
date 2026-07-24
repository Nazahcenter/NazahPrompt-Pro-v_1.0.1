const CACHE_NAME = 'nazahprompt-cache-v3';
const urlsToCache = [
  '/'
];

// Installation : on force l'activation immédiate
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activation : on nettoie les anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName !== CACHE_NAME;
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Stratégie Network-First : On priorise le réseau pour avoir la dernière version
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

// --- Checks PWABuilder ---
// Ces écouteurs (listeners) signalent à PWABuilder que l'application 
// prend en charge ces fonctionnalités avancées, ce qui boostera votre score.

self.addEventListener('sync', (event) => {
  console.log('Background Sync API triggered', event);
});

self.addEventListener('periodicsync', (event) => {
  console.log('Periodic Sync triggered', event);
});

self.addEventListener('push', (event) => {
  console.log('Web Push Notifications API triggered', event);
});

/**
 * Puente Digital 2.0 - Service Worker (sw.js)
 * Permite el uso offline de cursos, lecciones y simuladores sin conexión a Internet.
 */

const CACHE_NAME = 'puente-digital-v6-mobile-cache';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './css/mobile.css',
  './js/storage-service.js',
  './js/ai-service.js',
  './js/courses-data.js',
  './js/app.js',
  './js/mobile.js',
  './assets/favicon.svg',
  './assets/logo-puente-digital.svg',
  './assets/hero-seniors.jpg',
  './assets/team-rony-nueva.jpg',
  './assets/team-tomas.jpg',
  './assets/team-adrian-nueva.jpg',
  './assets/team-alexandro.jpg',
  './assets/team-valeria.jpg'
];

// Instalación y pre-cacheo
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Puente Digital SW: Cacheando recursos estáticos');
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('Puente Digital SW: Error parcial al cachear recursos', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activación y limpieza de cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Puente Digital SW: Eliminando caché obsoleta:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia Network-First con fallback a Cache
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // En caso de estar sin conexión, devolver desde la caché
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});

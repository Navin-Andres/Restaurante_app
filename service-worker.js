const CACHE_NAME = "comida-costena-v2";
const APP_SHELL = [
    "./",
    "./index.html",
    "./styles.css",
    "./app.js",
    "./manifest.json",
    "./assets/arepa%20con%20huevo.jpg",
    "./assets/carima%C3%B1ola.jpg",
    "./assets/patacones%20con%20queso.jpg",
    "./assets/mojarra%20frita.jpg",
    "./assets/cazuela%20con%20marisco.jpg",
    "./assets/arroz%20con%20camarones.jpg",
    "./assets/cocadas.jpg",
    "./assets/enyucados.jpg",
    "./assets/limonada%20de%20coco.jpg",
    "./assets/jugo%20de%20corozo.jpg",
    "./assets/icons/icon-192.png",
    "./assets/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                    return Promise.resolve();
                })
            )
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;

            return fetch(event.request)
                .then((networkResponse) => {
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
                        return networkResponse;
                    }

                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });

                    return networkResponse;
                })
                .catch(() => caches.match("./index.html"));
        })
    );
});
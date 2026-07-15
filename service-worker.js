const CACHE_NAME = "nickel-v1";

const FILES_TO_CACHE = [
    "/nickel/",
    "/nickel/index.html",
    "/nickel/assets/icons/favicon-192x192.png",
    "/nickel/assets/icons/favicon-512x512.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
    );

    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        clients.claim()
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});
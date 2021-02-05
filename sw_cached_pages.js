const cacheName = "v1";

const cacheAssets = [
  "index.html",
  "about.html",
  "/css/style.css",
  "/js/main.js",
];

// Call install event
self.addEventListener("install", (event) => {
  console.log("Service worker installed");

  event.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        console.log("Service Worker: Caching files");
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// Call Activate Event
self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
  // Remove unwanted caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            console.log("Service Worker: clearing old cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Call Fetch Event
self.addEventListener("fetch", (event) => {
  console.log("Service worker: Fetching");
  event.respondWith(
    fetch(event.request).catch(() => {
      caches.match(event.request);
    })
  );
});

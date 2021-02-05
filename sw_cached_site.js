const cacheName = "v2";

// Call install event
self.addEventListener("install", (event) => {
  console.log("Service worker installed");
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
    fetch(event.request)
      .then((res) => {
        // make clone of response
        const resClone = res.clone();
        // open a cache
        caches.open(cacheName).then((cache) => {
          // add response to cache
          if (res.url.match("^(http|https)://")) {
            cache.put(event.request, resClone);
          } else {
            return;
          }
        });
        return res;
      })
      .catch((error) => caches.match(event.request).then((res) => res))
  );
});

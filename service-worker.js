const CACHE = "v1";
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE));
  self.skipWaiting();
});
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        try {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        } catch (e) {
          // ignore cache write errors
        }
        return res;
      });
    })
  );
});

/* Offline support for the Darcie desk screen. Pages and data: network first, cache as fallback
   (so updates arrive whenever there is a connection). Photos and fonts: cache first. */
var CACHE = "darcie-v36";
var SHELL = ["./", "index.html", "darcie-data.js", "pet.js", "souvenirs.js", "maps.js", "manifest.webmanifest", "icon-180.png",
  "fonts/fraunces-latin-300-normal.woff", "fonts/fraunces-latin-400-italic.woff", "photos/credits.json"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  var slow = /\.(jpg|woff|png)$/.test(new URL(req.url).pathname);
  var put = function (res) {
    if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
    return res;
  };
  if (slow) {
    e.respondWith(caches.match(req).then(function (hit) { return hit || fetch(req).then(put); }));
  } else {
    e.respondWith(fetch(req).then(put).catch(function () { return caches.match(req, { ignoreSearch: true }); }));
  }
});

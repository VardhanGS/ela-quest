const CACHE = "elaquest-v9";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./sound.js",
  "./voice.js",
  "./cloud.js",
  "./data/cloud-config.js",
  "./data/voice-clips.js",
  "./data/core.js",
  "./data/phonics.js",
  "./data/spellwords.js",
  "./data/spelling.js",
  "./data/grammar.js",
  "./data/reading.js",
  "./data/vocab.js",
  "./data/writing.js",
  "./data/g8-reading.js",
  "./data/g8-language.js",
  "./data/g8-vocab.js",
  "./data/vwd-words.js",
  "./data/vwd.js",
  "./data/g8-writing.js",
  "./data/lessons.js",
  "./data/videos.js",
  "./manifest.json",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k.startsWith("elaquest-") && k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first: always try the latest from the server; fall back to cache only when offline.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  // Let the browser stream videos directly (range requests); don't cache them.
  const path = new URL(e.request.url).pathname;
  if (path.includes("/videos/") && path.endsWith(".mp4")) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

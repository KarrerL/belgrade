/* Service worker : met en cache tout le site pour un usage hors ligne.
 * - Fichiers du site : pré-cachés à l'installation, servis depuis le cache puis mis à jour en arrière-plan.
 * - Tuiles OpenStreetMap : mises en cache au fil de la consultation (plafond de 400 tuiles).
 * Incrémentez CACHE_VERSION après chaque modification des données ou du code. */
const CACHE_VERSION = "v5";
const SHELL = `bg-shell-${CACHE_VERSION}`;
const TILES = "bg-tiles";
const MAX_TILES = 400;

const ASSETS = [
  "./", "index.html", "css/app.css",
  "data/trip.js", "data/photo-credits.js",
  "js/store.js", "js/ui.js", "js/pages.js", "js/app.js",
  "vendor/leaflet/leaflet.js", "vendor/leaflet/leaflet.css",
  "vendor/leaflet/images/marker-icon.png", "vendor/leaflet/images/marker-icon-2x.png",
  "vendor/leaflet/images/marker-shadow.png", "vendor/leaflet/images/layers.png", "vendor/leaflet/images/layers-2x.png",
  "manifest.webmanifest", "icons/icon.svg", "icons/icon-192.png", "icons/icon-512.png",
  "img/kalemegdan.jpg", "img/knez.jpg", "img/republika.jpg", "img/sava.jpg", "img/kalenic.jpg",
  "img/skadarlija.jpg", "img/dorcol.jpg", "img/zeleni.jpg", "img/kosancic.jpg"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("bg-shell-") && k !== SHELL).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function trimTiles() {
  const c = await caches.open(TILES);
  const keys = await c.keys();
  for (let i = 0; i < keys.length - MAX_TILES; i++) await c.delete(keys[i]);
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Tuiles de carte : cache d'abord, sinon réseau puis mise en cache
  if (url.hostname === "tile.openstreetmap.org") {
    e.respondWith(
      caches.open(TILES).then(async (c) => {
        const hit = await c.match(req);
        if (hit) return hit;
        try {
          const res = await fetch(req);
          if (res.ok || res.type === "opaque") { c.put(req, res.clone()); trimTiles(); }
          return res;
        } catch (err) {
          return new Response("", { status: 504 });
        }
      })
    );
    return;
  }

  if (url.origin !== location.origin) return; // liens externes : laissés au navigateur

  // Fichiers du site : cache d'abord (rapide et hors ligne), rafraîchi en arrière-plan
  e.respondWith(
    caches.open(SHELL).then(async (c) => {
      const hit = await c.match(req, { ignoreSearch: true });
      const net = fetch(req, { cache: "no-cache" }).then((res) => { if (res.ok) c.put(req, res.clone()); return res; }).catch(() => null);
      if (hit) { e.waitUntil(net); return hit; }
      const res = await net;
      if (res) return res;
      if (req.mode === "navigate") return c.match("index.html");
      return new Response("Hors ligne", { status: 503 });
    })
  );
});

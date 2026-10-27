/* Routeur, gestion des événements, carte Leaflet et enregistrement du service worker. */
(function () {
  const T = window.TRIP;
  const { icon, esc, toast, placeById, mapsUrl, CATS } = UI;
  const main = document.getElementById("main");

  window.NAV = [
    { id: "", label: "Accueil", icon: "home", tab: true },
    { id: "planning", label: "Planning", icon: "calendar", tab: true },
    { id: "carte", label: "Carte", icon: "map", tab: true },
    { id: "achats", label: "Achats", icon: "bag", tab: true },
    { id: "lieux", label: "Lieux", icon: "pin" },
    { id: "gastro", label: "Gastronomie", icon: "fork" },
    { id: "budget", label: "Budget", icon: "wallet" },
    { id: "transports", label: "Transports", icon: "car" },
    { id: "checklist", label: "Checklist", icon: "list" },
    { id: "urgences", label: "Plans B & urgences", icon: "life" },
    { id: "infos", label: "Hors ligne & sources", icon: "info" }
  ];

  const ROUTES = {
    "": Pages.home, planning: Pages.planning, carte: Pages.map, lieux: Pages.places, achats: Pages.shopping,
    gastro: Pages.gastro, budget: Pages.budget, transports: Pages.transports, checklist: Pages.checklist,
    urgences: Pages.urgences, infos: Pages.infos, plus: Pages.more
  };

  function parseHash() {
    const h = location.hash.replace(/^#\/?/, "");
    const [path, query] = h.split("?");
    const params = Object.fromEntries(new URLSearchParams(query || ""));
    const parts = path.split("/");
    return { route: parts[0] || "", arg: parts[1], params };
  }

  /* ---------- navigation ---------- */
  function renderNav(route) {
    const active = (id) => id === route || (route === "lieu" && id === "lieux");
    document.getElementById("sidenav-links").innerHTML = NAV.map((n) =>
      `<a href="#/${n.id}" class="${active(n.id) ? "on" : ""}" ${active(n.id) ? 'aria-current="page"' : ""}>${icon(n.icon)}<span>${n.label}</span></a>`).join("");
    const tabs = NAV.filter((n) => n.tab);
    const moreOn = !tabs.some((n) => active(n.id));
    document.getElementById("tabbar").innerHTML = tabs.map((n) =>
      `<a href="#/${n.id}" class="${active(n.id) ? "on" : ""}" ${active(n.id) ? 'aria-current="page"' : ""}>${icon(n.icon)}<span>${n.label}</span></a>`).join("") +
      `<a href="#/plus" class="${moreOn ? "on" : ""}">${icon("more")}<span>Plus</span></a>`;
  }

  /* ---------- rendu ---------- */
  let current = null;
  function render(keepScroll) {
    const { route, arg, params } = parseHash();
    const y = window.scrollY;
    const fn = route === "lieu" ? () => Pages.placeDetail(arg) : ROUTES[route] || Pages.home;
    main.innerHTML = `<div class="page page-${route || "home"}">${fn(params)}</div>`;
    renderNav(route);
    const title = route === "lieu" ? placeById(arg)?.name : NAV.find((n) => n.id === route)?.label;
    document.title = `${title && route ? title + " · " : ""}Belgrade 28–29 nov.`;
    if (keepScroll) window.scrollTo(0, y);
    else if (params.focus && route === "planning") {
      const el = document.getElementById(`act-${params.focus}`);
      if (el) { el.scrollIntoView({ block: "start" }); el.classList.add("flash"); }
    } else if (current !== location.hash) { window.scrollTo(0, 0); main.focus({ preventScroll: true }); }
    current = location.hash;
    if (route === "carte") initMap(params.focus);
    if (route === "lieux") applySearch();
    if (route === "infos") updateOfflineState();
  }
  const refresh = () => render(true);

  window.addEventListener("hashchange", () => render(false));

  /* ---------- événements (délégation) ---------- */
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-act]");
    if (!el) return;
    const act = el.dataset.act;
    const id = el.dataset.id;
    switch (act) {
      case "toggle-done":
        Store.update((s) => { s.done[id] ? delete s.done[id] : (s.done[id] = true); });
        toast(Store.get().done[id] ? "Activité terminée ✓" : "Activité rouverte");
        refresh(); break;
      case "ui":
        Store.update((s) => { s.ui[el.dataset.key] = el.dataset.v; });
        refresh(); break;
      case "sim-set": {
        const v = document.getElementById("sim-input").value;
        if (v) { Store.update((s) => { s.sim = v; }); toast("Heure simulée appliquée"); refresh(); }
        break;
      }
      case "sim-clear":
        Store.update((s) => { s.sim = null; }); toast("Heure réelle de Belgrade"); refresh(); break;
      case "reset-group":
        Store.update((s) => { Object.keys(s.checks).forEach((k) => k.startsWith(id + ":") && delete s.checks[k]); });
        refresh(); break;
      case "del-product":
        if (confirm("Supprimer ce produit ?")) {
          Store.update((s) => { s.custom = s.custom.filter((p) => p.id !== id); delete s.purchases[id]; });
          refresh();
        }
        break;
      case "scenario":
        Store.update((s) => { s.budget.scenario = el.dataset.v; s.budget.planned = {}; });
        toast("Scénario appliqué"); refresh(); break;
      case "rate-set": {
        const v = parseFloat(String(document.getElementById("rate-input").value).replace(",", "."));
        if (!(v > 50 && v < 300)) { toast("Taux invalide"); break; }
        Store.update((s) => { s.budget.rate = v; s.budget.rateDate = new Date().toISOString().slice(0, 10); });
        toast("Taux mis à jour"); refresh(); break;
      }
      case "rate-reset":
        Store.update((s) => { s.budget.rate = null; s.budget.rateDate = null; }); refresh(); break;
      case "del-exp":
        Store.update((s) => { s.expenses = s.expenses.filter((x) => x.id !== id); }); refresh(); break;
      case "export":
        copyText(Store.export()); break;
      case "import": {
        const txt = prompt("Collez ici les données exportées :");
        if (txt) { try { Store.import(txt); toast("Données importées"); refresh(); } catch (err) { toast("Format invalide"); } }
        break;
      }
      case "reset-all":
        if (confirm("Effacer toutes les cases, achats et dépenses de cet appareil ?")) { Store.reset(); refresh(); }
        break;
      case "map-cat": toggleMapCat(el); break;
      case "map-route": toggleRoute(el); break;
      case "map-locate": locate(); break;
      case "back":
        if (history.length > 1) { e.preventDefault(); history.back(); }
        break;
    }
  });

  document.addEventListener("change", (e) => {
    const el = e.target;
    const act = el.dataset.act;
    if (!act) return;
    if (act === "toggle-check") {
      Store.update((s) => { el.checked ? (s.checks[el.dataset.key] = true) : delete s.checks[el.dataset.key]; });
      refresh();
    } else if (act === "buy") {
      Store.update((s) => { const p = (s.purchases[el.dataset.id] ||= {}); p.bought = el.checked; });
      toast(el.checked ? "Acheté ✓" : "Remis dans « à acheter »"); refresh();
    } else if (act === "pfield") {
      const v = el.value === "" ? "" : Math.max(0, Number(el.value));
      Store.update((s) => { const p = (s.purchases[el.dataset.id] ||= {}); p[el.dataset.f] = v; if (el.dataset.f === "paid" && v) p.bought = true; });
      refresh();
    } else if (act === "planned") {
      Store.update((s) => { s.budget.planned[el.dataset.cat] = Math.max(0, Number(el.value) || 0); });
      refresh();
    } else if (act === "excl-costumes") {
      Store.update((s) => { s.budget.excludeCostumes = el.checked; }); refresh();
    } else if (act === "exp-amount") {
      Store.update((s) => { const x = s.expenses.find((x) => x.id === el.dataset.id); if (x) x.amount = Math.max(0, Number(el.value) || 0); });
      refresh();
    }
  });

  document.addEventListener("submit", (e) => {
    const f = e.target;
    if (f.id === "add-product") {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(f));
      if (!d.name.trim()) return;
      Store.update((s) => s.custom.push({ id: "c-" + Date.now(), name: d.name.trim(), cat: d.cat, where: d.where.trim(), price: d.price.trim() || null, priceStatus: d.price.trim() ? "estime" : null, bcat: d.bcat, custom: true, bag: "—", fragile: "—", worth: "—", note: "Ajouté par vous" }));
      toast("Produit ajouté"); refresh();
    } else if (f.id === "add-expense") {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(f));
      const amount = Number(d.amount);
      if (!d.label.trim() || !(amount >= 0)) return;
      Store.update((s) => s.expenses.push({ id: "e-" + Date.now(), label: d.label.trim(), cat: d.cat, amount, currency: d.currency, ts: Date.now() }));
      toast("Dépense enregistrée"); refresh();
    }
  });

  /* ---------- recherche (sans re-rendu, pour garder le focus) ---------- */
  function applySearch() {
    const input = document.getElementById("place-search");
    if (!input) return;
    const q = input.value.trim().toLowerCase();
    let n = 0;
    document.querySelectorAll("#place-list [data-search]").forEach((c) => {
      const show = !q || c.dataset.search.includes(q);
      c.hidden = !show; if (show) n++;
    });
    document.getElementById("search-empty").hidden = n > 0;
    const hits = q.length > 1 ? Pages.allProducts().filter((p) => (p.name + " " + p.cat).toLowerCase().includes(q)) : [];
    document.getElementById("product-hits").innerHTML = hits.length
      ? `<section class="card"><h2 class="h">Produits de la liste d'achats</h2><ul class="plain">${hits.map((p) => `<li><a href="#/achats">${esc(p.name)}</a> <small class="muted">${esc(p.cat)}</small></li>`).join("")}</ul></section>` : "";
  }
  document.addEventListener("input", (e) => {
    if (e.target.id === "place-search") {
      Store.get().ui.q = e.target.value; // mémorisé sans re-rendu
      applySearch();
    } else if (e.target.id === "shop-search") {
      const q = e.target.value.trim().toLowerCase();
      let any = false;
      document.querySelectorAll("[data-shopcat]").forEach((sec) => {
        let n = 0;
        sec.querySelectorAll(".shop").forEach((s) => { const sh = !q || s.dataset.search.includes(q); s.hidden = !sh; if (sh) n++; });
        sec.hidden = n === 0; if (n) any = true;
      });
      document.getElementById("shop-empty").hidden = any;
    }
  });

  function copyText(txt) {
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(() => toast("Données copiées"), () => prompt("Copiez ce texte :", txt));
    else prompt("Copiez ce texte :", txt);
  }

  /* ---------- carte Leaflet ---------- */
  let map, layers = {}, routeLayers = {}, locLayer;
  function initMap(focusId) {
    const el = document.getElementById("map");
    const note = document.getElementById("map-note");
    if (!window.L) {
      // Leaflet est chargé en différé : on réessaie une fois prêt
      if (!initMap.waiting) { initMap.waiting = true; window.addEventListener("load", () => { initMap.waiting = false; if (parseHash().route === "carte") initMap(focusId); }, { once: true }); }
      el.innerHTML = '<p class="map-msg">Chargement de la carte…</p>';
      return;
    }
    if (map) { map.remove(); map = null; }
    layers = {}; routeLayers = {};
    map = L.map(el, { zoomControl: true, scrollWheelZoom: true }).setView([44.812, 20.44], 12);
    let tileErrors = 0;
    const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    tiles.on("tileerror", () => {
      tileErrors++;
      if (tileErrors === 3) { note.hidden = false; note.textContent = "Fond de carte indisponible (hors ligne ?). Les points restent cliquables et la liste ci-dessous fonctionne."; }
    });
    const bounds = [];
    T.places.filter((p) => p.lat != null).forEach((p) => {
      const c = CATS[p.cat];
      const mk = L.marker([p.lat, p.lng], {
        title: p.name, alt: p.name,
        icon: L.divIcon({ className: "mk", html: `<span style="--c:${c.color}">${icon(c.icon)}</span>`, iconSize: [34, 34], iconAnchor: [17, 34], popupAnchor: [0, -30] })
      }).bindPopup(`<div class="pop"><small style="color:${c.color}">${c.label}</small><strong>${esc(p.name)}</strong><span>${esc(p.address)}</span>
        <div class="pop-a"><a href="#/lieu/${p.id}">Fiche</a><a href="${mapsUrl(p)}" target="_blank" rel="noopener">Google Maps</a></div></div>`);
      (layers[p.cat] ||= L.layerGroup().addTo(map)).addLayer(mk);
      if (p.id !== "miljakovac") bounds.push([p.lat, p.lng]);
      if (p.id === focusId) setTimeout(() => { map.setView([p.lat, p.lng], 16); mk.openPopup(); }, 50);
    });
    if (!focusId) map.fitBounds(bounds, { padding: [24, 24] });
    setTimeout(() => map && map.invalidateSize(), 100);
  }
  function toggleMapCat(btn) {
    const cat = btn.dataset.cat;
    if (!map || !layers[cat]) return;
    const on = btn.classList.toggle("on");
    on ? layers[cat].addTo(map) : map.removeLayer(layers[cat]);
  }
  function toggleRoute(btn) {
    if (!map) return;
    const d = btn.dataset.day;
    if (routeLayers[d]) { map.removeLayer(routeLayers[d]); delete routeLayers[d]; btn.classList.remove("on"); return; }
    const pts = [];
    T.legs.filter((l) => l.day === d).forEach((l) => {
      const a = placeById(l.from), b = placeById(l.to);
      if (!pts.length) pts.push([a.lat, a.lng]);
      pts.push([b.lat, b.lng]);
    });
    routeLayers[d] = L.polyline(pts, { color: d === "sat" ? "#b5562f" : "#0f4c5c", weight: 4, dashArray: "8 8", opacity: 0.85 }).addTo(map);
    map.fitBounds(routeLayers[d].getBounds(), { padding: [30, 30] });
    btn.classList.add("on");
  }
  function locate() {
    if (!map || !navigator.geolocation) { toast("Géolocalisation indisponible"); return; }
    navigator.geolocation.getCurrentPosition((pos) => {
      const ll = [pos.coords.latitude, pos.coords.longitude];
      if (locLayer) map.removeLayer(locLayer);
      locLayer = L.circleMarker(ll, { radius: 8, color: "#fff", weight: 3, fillColor: "#2b7de9", fillOpacity: 1 }).addTo(map).bindPopup("Vous êtes ici");
      map.setView(ll, 15);
    }, () => toast("Position refusée ou indisponible"), { enableHighAccuracy: true, timeout: 10000 });
  }

  /* ---------- état réseau & service worker ---------- */
  function netStatus() {
    const el = document.getElementById("net-status");
    el.innerHTML = navigator.onLine ? `<span class="dot ok"></span> En ligne` : `<span class="dot off"></span> Hors ligne : données en cache`;
    document.body.classList.toggle("offline", !navigator.onLine);
  }
  window.addEventListener("online", () => { netStatus(); toast("Connexion rétablie"); });
  window.addEventListener("offline", () => { netStatus(); toast("Hors ligne : le site reste utilisable"); });

  async function updateOfflineState() {
    const el = document.getElementById("offline-state");
    if (!el) return;
    if (!("serviceWorker" in navigator)) return;
    if (location.protocol === "file:") { el.innerHTML = "Ouvert en fichier local (file://) : le mode hors ligne nécessite un serveur (voir README)."; return; }
    const reg = await navigator.serviceWorker.getRegistration();
    const keys = "caches" in window ? await caches.keys() : [];
    el.innerHTML = reg && reg.active && keys.some((k) => k.startsWith("bg-shell"))
      ? `<strong>✓ Prêt pour le hors ligne</strong> (cache : ${esc(keys.filter((k) => k.startsWith("bg-")).join(", "))}).`
      : "Service worker en cours d'installation : rechargez la page une fois avec Internet.";
  }

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").then(() => updateOfflineState()).catch(() => {});
  }

  netStatus();
  render(false);
})();

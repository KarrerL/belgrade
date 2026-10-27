/* Composants d'interface réutilisables et utilitaires (temps, argent, liens cartes). */
(function () {
  const T = window.TRIP;

  /* ---------- échappement & icônes ---------- */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const ICONS = {
    home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
    bag: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
    plane: '<path d="M10.5 3.5l2 0 2.5 7 5 2v2l-5-1-1.5 5 2 1.5v1.5l-3.5-1-3.5 1V20l2-1.5-1.5-5-5 1v-2l5-2z"/>',
    bed: '<path d="M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="2"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
    walk: '<circle cx="13" cy="4" r="2"/><path d="M10 22l2-7 3 3v6M8 12l2-4 4 1 3 4M10 8l-2 6"/>',
    car: '<path d="M4 16V12l2-5h12l2 5v4z"/><circle cx="7.5" cy="16.5" r="1.5"/><circle cx="16.5" cy="16.5" r="1.5"/><path d="M4 12h16"/>',
    bus: '<rect x="5" y="3" width="14" height="15" rx="2"/><path d="M5 11h14M8 21v-3M16 21v-3"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    phone: '<path d="M5 3h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
    ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',
    nav: '<path d="M3 11l18-8-8 18-2-8z"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    life: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M5.6 5.6l3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    fork: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 0-3 3-3 6s1 4 3 4v8"/>',
    wallet: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M16 13h2M3 10h18"/>',
    pin: '<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    store: '<path d="M4 9l1-5h14l1 5M4 9h16v11H4zM4 9a3 3 0 0 0 6 0 3 3 0 0 0 4 0 3 3 0 0 0 6 0"/>',
    landmark: '<path d="M3 21h18M5 21V10M19 21V10M9 21V10M15 21V10M2 10l10-6 10 6z"/>',
    basket: '<path d="M3 10h18l-2 10H5zM8 10l4-6 4 6"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    bread: '<path d="M5 11a7 4 0 0 1 14 0v8H5z"/><path d="M9 11v3M12 10v4M15 11v3"/>'
  };
  const icon = (name, cls = "") =>
    `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ""}</svg>`;

  /* ---------- catégories de lieux ---------- */
  const CATS = {
    hotel: { label: "Hôtel", icon: "bed", color: "#0f4c5c" },
    transport: { label: "Transports", icon: "plane", color: "#3d5a80" },
    monument: { label: "Monuments", icon: "landmark", color: "#8a5a2b" },
    restaurant: { label: "Restaurants", icon: "fork", color: "#b5562f" },
    bakery: { label: "Boulangeries", icon: "bread", color: "#c8962e" },
    shopping: { label: "Shopping", icon: "store", color: "#6b4c9a" },
    market: { label: "Marchés", icon: "basket", color: "#2f7d4f" }
  };

  /* ---------- statuts ---------- */
  const STATUS = {
    confirme: { label: "Confirmé", cls: "ok" },
    estime: { label: "Estimé", cls: "est" },
    verifier: { label: "À vérifier", cls: "warn" }
  };
  const statusBadge = (s) => (s && STATUS[s] ? `<span class="badge ${STATUS[s].cls}">${STATUS[s].label}</span>` : "");

  const PRIORITY = {
    imperatif: { label: "Impératif", cls: "prio-imp" },
    recommande: { label: "Recommandé", cls: "prio-rec" },
    facultatif: { label: "Facultatif", cls: "prio-opt" }
  };
  const prioBadge = (p) => `<span class="badge ${PRIORITY[p].cls}">${PRIORITY[p].label}</span>`;

  /* ---------- temps ---------- */
  const DAY_DATE = { sat: "2026-11-28", sun: "2026-11-29" };
  const DAY_LABEL = { sat: "Samedi 28", sun: "Dimanche 29" };

  // Heure actuelle à Belgrade (ou heure simulée), au format "YYYY-MM-DDTHH:MM"
  function nowBelgrade() {
    const sim = Store.get().sim;
    if (sim) return sim;
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: T.meta.timezone, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    }).formatToParts(new Date());
    const g = (t) => parts.find((p) => p.type === t).value;
    return `${g("year")}-${g("month")}-${g("day")}T${g("hour")}:${g("minute")}`;
  }
  const stamp = (day, hhmm) => `${DAY_DATE[day]}T${hhmm}`;
  const minutesBetween = (a, b) => Math.round((new Date(b + ":00Z") - new Date(a + ":00Z")) / 60000);
  function fmtDuration(min) {
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60), m = min % 60;
    if (h >= 48) return `${Math.round(h / 24)} jours`;
    return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
  }
  const fmtDate = (iso) => {
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };

  /* ---------- argent ---------- */
  function rate() {
    const b = Store.get().budget;
    return b.rate && b.rate > 0 ? b.rate : T.meta.rate.rsdPerEur;
  }
  const nf = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
  const nf2 = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2, minimumFractionDigits: 0 });
  const rsd = (n) => `${nf.format(Math.round(n || 0))} RSD`;
  const eur = (n) => `${nf2.format(Math.round(((n || 0) / rate()) * 100) / 100)} €`;
  const money = (n) => `<span class="money">${rsd(n)}</span> <span class="eur">≈ ${eur(n)}</span>`;

  /* ---------- géographie & liens Google Maps ---------- */
  const placeById = (id) => T.places.find((p) => p.id === id);
  function haversine(a, b) {
    const R = 6371, r = Math.PI / 180;
    const dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function mapsUrl(p) {
    if (!p) return null;
    const q = p.mapsQuery || `${p.name.replace(/\s*\(.*?\)\s*/g, " ")}, ${p.address}, Belgrade`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
  }
  const MODE = { walk: "walking", taxi: "driving", transit: "transit" };
  function dirUrl(fromId, toId, mode = "walk") {
    const a = placeById(fromId), b = placeById(toId);
    if (!a || !b || a.lat == null || b.lat == null) return null;
    return `https://www.google.com/maps/dir/?api=1&origin=${a.lat},${a.lng}&destination=${b.lat},${b.lng}&travelmode=${MODE[mode] || "walking"}`;
  }
  const MODE_LABEL = { walk: "À pied", taxi: "Yandex Go", transit: "Transports publics" };
  const MODE_ICON = { walk: "walk", taxi: "car", transit: "bus" };

  /* ---------- sources ---------- */
  function sourceLinks(ids) {
    if (!ids || !ids.length) return "";
    return `<div class="sources"><span>Sources :</span> ${ids
      .map((id) => T.sources[id])
      .filter(Boolean)
      .map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>${s.checked ? ` <small>(consulté le ${fmtDate(s.checked)})</small>` : " <small>(non consulté)</small>"}`)
      .join(" · ")}</div>`;
  }

  /* ---------- photo avec repli ---------- */
  function photo(key, alt, cls = "") {
    if (!key) return `<div class="ph-fallback ${cls}" aria-hidden="true"><span>${esc(alt).slice(0, 1)}</span></div>`;
    return `<figure class="ph ${cls}"><img src="img/${esc(key)}.jpg" alt="${esc(alt)}" loading="lazy" decoding="async" onerror="this.parentNode.classList.add('broken');this.remove()"><span class="ph-alt">${esc(alt)}</span></figure>`;
  }

  /* ---------- toast ---------- */
  let toastTimer;
  function toast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  }

  window.UI = {
    esc, icon, CATS, STATUS, PRIORITY, statusBadge, prioBadge, DAY_DATE, DAY_LABEL,
    nowBelgrade, stamp, minutesBetween, fmtDuration, fmtDate,
    rate, rsd, eur, money, placeById, haversine, mapsUrl, dirUrl, MODE_LABEL, MODE_ICON,
    sourceLinks, photo, toast
  };
})();

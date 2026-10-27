/* État local de l'application (cases cochées, achats, dépenses, réglages).
 * Tout est stocké dans localStorage sur l'appareil — rien n'est envoyé à un serveur. */
(function () {
  const KEY = "bg-trip-v1";
  const defaults = () => ({
    done: {},          // activités terminées : { activityId: true }
    checks: {},        // cases des checklists et réservations : { "groupe:index": true }
    purchases: {},     // { productId: { qty, paid, bought } }
    custom: [],        // produits ajoutés par l'utilisateur
    expenses: [],      // { id, label, cat, amount, currency, costume, ts }
    budget: { scenario: "confort", planned: {}, excludeCostumes: true, rate: null, rateDate: null },
    sim: null,         // heure simulée "2026-11-28T15:00" ou null
    ui: {}             // préférences d'affichage (filtres)
  });

  let state = load();
  const listeners = new Set();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaults();
      const parsed = JSON.parse(raw);
      const d = defaults();
      return { ...d, ...parsed, budget: { ...d.budget, ...(parsed.budget || {}) } };
    } catch (e) {
      return defaults();
    }
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* stockage indisponible : l'app reste utilisable */ }
    listeners.forEach((fn) => fn(state));
  }

  // Synchronise plusieurs onglets ouverts
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) { state = load(); listeners.forEach((fn) => fn(state)); }
  });

  window.Store = {
    get: () => state,
    update(fn) { fn(state); save(); },
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    reset() { state = defaults(); save(); },
    export() { return JSON.stringify(state, null, 2); },
    import(json) { const p = JSON.parse(json); state = { ...defaults(), ...p }; save(); },
    available() {
      try { localStorage.setItem("__t", "1"); localStorage.removeItem("__t"); return true; } catch (e) { return false; }
    }
  };
})();

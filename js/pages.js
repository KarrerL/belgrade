/* Rendu des pages. Chaque page retourne du HTML ; les interactions passent par
 * des attributs data-act gérés dans app.js (délégation d'événements). */
(function () {
  const T = window.TRIP;
  const { esc, icon, CATS, statusBadge, prioBadge, DAY_LABEL, nowBelgrade, stamp, minutesBetween, fmtDuration,
    fmtDate, rsd, eur, money, placeById, haversine, mapsUrl, dirUrl, MODE_LABEL, MODE_ICON, sourceLinks, photo } = UI;
  const S = () => Store.get();
  const legById = (id) => T.legs.find((l) => l.id === id);

  /* ================= logique partagée ================= */
  function timeline() {
    const now = nowBelgrade();
    const acts = T.activities.map((a) => ({ ...a, s: stamp(a.day, a.start), e: stamp(a.day, a.end) }));
    const tripStart = acts[0].s, tripEnd = acts[acts.length - 1].e;
    const phase = now < tripStart ? "before" : now > tripEnd ? "after" : "during";
    const current = acts.find((a) => a.s <= now && now < a.e && !S().done[a.id]);
    const next = acts.find((a) => a.s > now && !S().done[a.id]) || null;
    const firstOpen = acts.find((a) => !S().done[a.id]);
    return { now, acts, phase, current, next, firstOpen, tripStart, tripEnd };
  }

  function legBlock(leg, compact) {
    if (!leg) return "";
    const url = dirUrl(leg.from, leg.to, leg.mode);
    return `<div class="leg ${compact ? "compact" : ""}">
      <div class="leg-head">${icon(MODE_ICON[leg.mode])}<strong>${MODE_LABEL[leg.mode]}</strong>
        <span>départ ${leg.time} · ${esc(leg.duration)}</span>${statusBadge(leg.status)}</div>
      ${compact ? "" : `<p class="muted">${esc(placeById(leg.from).name)} → ${esc(placeById(leg.to).name)} · ${esc(leg.distance)}</p>
      <p>${esc(leg.instructions)}</p><p class="muted"><strong>Prix :</strong> ${esc(leg.price)}</p>`}
      ${url ? `<a class="btn primary" href="${url}" target="_blank" rel="noopener">${icon("nav")} Itinéraire Google Maps</a>` : ""}
    </div>`;
  }

  function activityCard(a, opts = {}) {
    const p = placeById(a.place);
    const leg = a.leg ? legById(a.leg) : null;
    const done = !!S().done[a.id];
    const stay = minutesBetween(stamp(a.day, a.start), stamp(a.day, a.end));
    const bookKey = `book:${a.id}`;
    return `<article class="act ${done ? "is-done" : ""} ${a.priority}" id="act-${a.id}" data-day="${a.day}" data-prio="${a.priority}">
      <div class="act-time"><span class="t">${a.start}</span><span class="t2">${a.end}</span></div>
      <div class="act-body">
        <header class="act-head">
          <div>
            <div class="badges">${prioBadge(a.priority)}${a.dropOrder ? `<span class="badge drop">À supprimer en ${a.dropOrder === 1 ? "1er" : a.dropOrder + "e"} si retard</span>` : ""}${done ? '<span class="badge ok">Terminé</span>' : ""}</div>
            <h3>${esc(a.title)}</h3>
            <a class="place-link" href="#/lieu/${p.id}">${icon(CATS[p.cat].icon)} ${esc(p.name)}</a>
          </div>
          <button class="done-btn" data-act="toggle-done" data-id="${a.id}" aria-pressed="${done}" aria-label="${done ? "Marquer comme non terminée" : "Marquer comme terminée"}">${icon("check")}</button>
        </header>
        ${opts.noPhoto ? "" : photo(p.photo, p.name, "act-ph")}
        <p class="addr">${icon("pin")} ${esc(p.address)}</p>
        <p>${esc(a.desc)}</p>
        <dl class="facts">
          <div><dt>Sur place</dt><dd>${fmtDuration(stay)}${p.duration && p.duration !== "—" ? ` <small>(conseillé : ${esc(p.duration)})</small>` : ""}</dd></div>
          <div><dt>Trajet</dt><dd>${leg ? `${MODE_LABEL[leg.mode]} · ${esc(leg.duration)}` : "Sur place"}</dd></div>
          <div><dt>Budget</dt><dd>${esc(a.budget)}</dd></div>
          <div><dt>Horaires du lieu</dt><dd>${esc(p.hours)} ${statusBadge(p.status)}</dd></div>
        </dl>
        ${a.booking ? `<label class="booking ${S().checks[bookKey] ? "ok" : ""}"><input type="checkbox" data-act="toggle-check" data-key="${bookKey}" ${S().checks[bookKey] ? "checked" : ""}> ${icon("alert")} <span><strong>${S().checks[bookKey] ? "Réservation / confirmation faite" : "À réserver / confirmer"} :</strong> ${esc(a.booking)}</span></label>` : ""}
        ${a.tips?.length ? `<ul class="tips">${a.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
        ${leg ? legBlock(leg, opts.compactLeg) : ""}
        <div class="actions">
          ${!leg ? `<a class="btn" href="${mapsUrl(p)}" target="_blank" rel="noopener">${icon("map")} Google Maps</a>` : ""}
          <a class="btn" href="#/lieu/${p.id}">${icon("info")} Fiche du lieu</a>
          <button class="btn ${done ? "" : "ghost-ok"}" data-act="toggle-done" data-id="${a.id}">${icon("check")} ${done ? "Rouvrir" : "Terminé"}</button>
        </div>
      </div>
    </article>`;
  }

  /* ================= ACCUEIL ================= */
  function home() {
    const tl = timeline();
    const st = S();
    const total = T.activities.length, doneN = T.activities.filter((a) => st.done[a.id]).length;
    let status;
    if (tl.phase === "before") {
      const days = Math.ceil(minutesBetween(tl.now, tl.tripStart) / 1440);
      status = `Départ dans <strong>${days} jour${days > 1 ? "s" : ""}</strong>`;
    } else if (tl.phase === "after") status = "Voyage terminé : bon retour !";
    else status = `En voyage · ${DAY_LABEL[tl.now.startsWith("2026-11-28") ? "sat" : "sun"]} · ${tl.now.slice(11)}`;

    const focus = tl.current || tl.next || (tl.phase === "before" ? tl.firstOpen : null);
    const focusLeg = focus && focus.leg ? legById(focus.leg) : null;
    const focusPlace = focus ? placeById(focus.place) : null;
    let focusHtml = `<p class="muted">Toutes les activités sont terminées.</p>`;
    if (focus) {
      const label = tl.current && focus === tl.current ? "En ce moment" : "Prochaine étape";
      const inMin = minutesBetween(tl.now, stamp(focus.day, focus.start));
      focusHtml = `<div class="next">
        <div class="next-k">${label}${tl.phase === "during" && inMin > 0 ? ` · dans ${fmtDuration(inMin)}` : ""}</div>
        <h2>${esc(focus.title)}</h2>
        <p class="next-when">${DAY_LABEL[focus.day]} · <strong>${focus.start}–${focus.end}</strong> · ${prioBadge(focus.priority)}</p>
        <p><a class="place-link light" href="#/lieu/${focusPlace.id}">${icon("pin")} ${esc(focusPlace.name)}</a></p>
        ${focusLeg ? `<p class="next-go">${icon(MODE_ICON[focusLeg.mode])} Partir à <strong>${focusLeg.time}</strong> · ${MODE_LABEL[focusLeg.mode]} · ${esc(focusLeg.duration)}</p>` : ""}
        <div class="actions">
          ${focusLeg && dirUrl(focusLeg.from, focusLeg.to, focusLeg.mode) ? `<a class="btn primary" href="${dirUrl(focusLeg.from, focusLeg.to, focusLeg.mode)}" target="_blank" rel="noopener">${icon("nav")} Itinéraire</a>` : `<a class="btn primary" href="${mapsUrl(focusPlace)}" target="_blank" rel="noopener">${icon("map")} Google Maps</a>`}
          <a class="btn light" href="#/planning?focus=${focus.id}">${icon("calendar")} Détails</a>
          <button class="btn light" data-act="toggle-done" data-id="${focus.id}">${icon("check")} Terminé</button>
        </div>
      </div>`;
    }

    const crit = T.critical.map((c) => {
      const past = stamp(c.day, c.time) < tl.now;
      return `<li class="${past ? "past" : ""}"><span class="ct">${c.day === "sat" ? "Sam" : "Dim"} <strong>${c.time}</strong></span><span>${esc(c.label)}</span>${statusBadge(c.status)}</li>`;
    }).join("");

    const bookings = T.activities.filter((a) => a.booking).map((a) => {
      const k = `book:${a.id}`;
      return `<li><label class="check ${st.checks[k] ? "on" : ""}"><input type="checkbox" data-act="toggle-check" data-key="${k}" ${st.checks[k] ? "checked" : ""}><span>${esc(a.booking)}</span></label></li>`;
    }).join("");
    const bookLeft = T.activities.filter((a) => a.booking && !st.checks[`book:${a.id}`]).length;

    const mini = (day) => tl.acts.filter((a) => a.day === day).map((a) => `<li class="${st.done[a.id] ? "done" : ""} ${focus && focus.id === a.id ? "cur" : ""}">
        <a href="#/planning?focus=${a.id}"><span class="mt">${a.start}</span><span class="mn">${esc(a.title)}</span>${st.done[a.id] ? icon("check", "ok") : ""}</a></li>`).join("");

    const out = T.flights[0], ret = T.flights[1];
    return `
    <section class="hero">
      ${photo("kalemegdan", "Forteresse de Belgrade au confluent de la Save et du Danube", "hero-ph")}
      <div class="hero-in">
        <p class="eyebrow">Београд · Serbie</p>
        <h1>Belgrade</h1>
        <p class="hero-dates">${esc(T.meta.dates.label)}</p>
        <p class="hero-status">${status}</p>
        <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${doneN}"><span style="width:${(doneN / total) * 100}%"></span></div>
        <small>${doneN}/${total} étapes terminées</small>
      </div>
    </section>

    <section class="card focus">${focusHtml}</section>

    <div class="grid2">
      <section class="card">
        <h2 class="h">${icon("plane")} Vols</h2>
        ${[out, ret].map((f) => `<div class="flight">
          <div class="fl-dir">${f.dir} · ${f.day === "sat" ? "sam. 28" : "dim. 29"} nov.</div>
          <div class="fl-row"><strong>${f.dep}</strong><span class="fl-line">${esc(f.airline)} ${esc(f.number)}</span><strong>${f.arr}</strong></div>
          <div class="fl-row small"><span>${esc(f.from)}</span><span>${esc(f.to)}</span></div>
          <p class="muted small">${esc(f.note)} ${statusBadge(f.status)}</p></div>`).join("")}
      </section>
      <section class="card">
        <h2 class="h">${icon("bed")} Hôtel</h2>
        <p><a class="place-link" href="#/lieu/hotel"><strong>Nobel Design Hotel</strong></a><br><span class="muted">Balkanska 18, Belgrade</span></p>
        <p>Check-in à partir de <strong>15:00</strong> · check-out avant <strong>12:00</strong> ${statusBadge("verifier")}</p>
        <div class="actions"><a class="btn" href="${mapsUrl(placeById("hotel"))}" target="_blank" rel="noopener">${icon("map")} Google Maps</a></div>
        <h3 class="h3">${icon("sun")} Lumière du jour</h3>
        <p>Lever 06:51 · coucher <strong>16:01</strong> · nuit à 16:33 ${statusBadge("estime")}</p>
      </section>
    </div>

    <section class="card">
      <h2 class="h">${icon("clock")} Horaires critiques</h2>
      <ul class="crit">${crit}</ul>
    </section>

    <section class="card">
      <h2 class="h">${icon("alert")} Réservations à confirmer <span class="pill ${bookLeft ? "warn" : "ok"}">${bookLeft ? bookLeft + " restante" + (bookLeft > 1 ? "s" : "") : "tout est fait"}</span></h2>
      <ul class="plain">${bookings}</ul>
    </section>

    <nav class="quick" aria-label="Accès rapides">
      <a href="#/carte">${icon("map")}<span>Carte</span></a>
      <a href="#/transports">${icon("car")}<span>Transports</span></a>
      <a href="#/achats">${icon("bag")}<span>Achats</span></a>
      <a href="#/budget">${icon("wallet")}<span>Budget</span></a>
      <a href="#/gastro">${icon("fork")}<span>Gastronomie</span></a>
      <a href="#/urgences">${icon("life")}<span>Plans B</span></a>
    </nav>

    <section class="card">
      <h2 class="h">${icon("calendar")} Le voyage en un coup d'œil</h2>
      <div class="mini-tl">
        <div><h3 class="h3">Samedi 28</h3><ol>${mini("sat")}</ol></div>
        <div><h3 class="h3">Dimanche 29</h3><ol>${mini("sun")}</ol></div>
      </div>
    </section>

    <details class="card sim">
      <summary>${icon("clock")} Tester l'affichage à une autre heure</summary>
      <p class="muted small">Pour vérifier « prochaine étape » avant le départ. ${st.sim ? `<strong>Simulation active : ${esc(st.sim.replace("T", " "))}</strong>` : "Heure réelle de Belgrade utilisée."}</p>
      <div class="row"><input type="datetime-local" id="sim-input" min="2026-11-27T00:00" max="2026-11-30T23:59" value="${esc(st.sim || "2026-11-28T15:00")}" aria-label="Heure simulée">
        <button class="btn" data-act="sim-set">Appliquer</button><button class="btn" data-act="sim-clear">Heure réelle</button></div>
    </details>`;
  }

  /* ================= PLANNING ================= */
  function planning(params) {
    const st = S();
    let day = st.ui.day || "all";
    const prio = st.ui.prio || "all";
    const tl = timeline();
    let todayNote = "";
    if (day === "today") {
      if (tl.now.startsWith("2026-11-28")) day = "sat";
      else if (tl.now.startsWith("2026-11-29")) day = "sun";
      else { todayNote = `<p class="note">Nous ne sommes pas encore pendant le voyage : affichage du premier jour.</p>`; day = "sat"; }
    }
    const chip = (key, val, label) => `<button class="chip ${((key === "day" ? st.ui.day || "all" : prio) === val) ? "on" : ""}" data-act="ui" data-key="${key}" data-v="${val}">${label}</button>`;
    const list = T.activities.filter((a) => (day === "all" || a.day === day) && (prio === "all" || a.priority === prio));
    const byDay = ["sat", "sun"].filter((d) => day === "all" || d === day);
    return `
    <header class="page-h"><h1>Planning</h1><p class="muted">Heure locale de Belgrade. Les cartes cochées restent terminées sur cet appareil.</p></header>
    <div class="chips" role="group" aria-label="Jour">${chip("day", "all", "Les 2 jours")}${chip("day", "today", "Programme du jour")}${chip("day", "sat", "Samedi 28")}${chip("day", "sun", "Dimanche 29")}</div>
    <div class="chips" role="group" aria-label="Priorité">${chip("prio", "all", "Toutes")}${chip("prio", "imperatif", "Impératives")}${chip("prio", "recommande", "Recommandées")}${chip("prio", "facultatif", "Facultatives")}</div>
    ${todayNote}
    ${byDay.map((d) => {
      const items = list.filter((a) => a.day === d);
      const s = T.meta.sun[d];
      return `<section class="day"><h2 class="day-h">${DAY_LABEL[d]} novembre <small>Lever ${s.sunrise} · coucher ${s.sunset}</small></h2>
        ${items.length ? items.map((a) => activityCard(a)).join("") : '<p class="muted">Aucune activité pour ce filtre.</p>'}</section>`;
    }).join("")}`;
  }

  /* ================= CARTE ================= */
  function mapPage() {
    const groups = Object.entries(CATS).map(([k, c]) => {
      const ps = T.places.filter((p) => p.cat === k);
      if (!ps.length) return "";
      return `<div class="pt-group"><h3 class="h3"><span class="dot" style="background:${c.color}"></span>${c.label}</h3><ul class="plain pts">${ps.map((p) =>
        `<li><a href="#/lieu/${p.id}">${esc(p.name)}</a> <a class="lnk" href="${mapsUrl(p)}" target="_blank" rel="noopener">Google Maps ${icon("ext")}</a></li>`).join("")}</ul></div>`;
    }).join("");
    return `
    <header class="page-h"><h1>Carte</h1><p class="muted">Fond OpenStreetMap, sans clé d'API. Les tracés sont schématiques (lignes droites) : utilisez les liens d'itinéraire pour la navigation.</p></header>
    <div class="chips" id="map-cats">${Object.entries(CATS).map(([k, c]) => `<button class="chip on" data-act="map-cat" data-cat="${k}"><span class="dot" style="background:${c.color}"></span>${c.label}</button>`).join("")}</div>
    <div class="chips"><button class="chip" data-act="map-route" data-day="sat">Parcours samedi</button><button class="chip" data-act="map-route" data-day="sun">Parcours dimanche</button><button class="chip" data-act="map-locate">${icon("nav")} Ma position</button></div>
    <div id="map" class="map" role="region" aria-label="Carte interactive de Belgrade"></div>
    <p class="note" id="map-note" hidden></p>
    <section class="card"><h2 class="h">${icon("list")} Tous les points (fonctionne aussi hors ligne)</h2>${groups}</section>`;
  }

  /* ================= LIEUX ================= */
  function placesPage() {
    const st = S();
    const cat = st.ui.pcat || "all";
    return `
    <header class="page-h"><h1>Lieux</h1><p class="muted">Fiches détaillées : horaires, sources et statut de vérification.</p></header>
    <label class="search">${icon("search")}<input type="search" id="place-search" placeholder="Rechercher un lieu, un magasin, un produit…" autocomplete="off" value="${esc(st.ui.q || "")}"></label>
    <div class="chips"><button class="chip ${cat === "all" ? "on" : ""}" data-act="ui" data-key="pcat" data-v="all">Tous</button>${Object.entries(CATS).map(([k, c]) => `<button class="chip ${cat === k ? "on" : ""}" data-act="ui" data-key="pcat" data-v="${k}"><span class="dot" style="background:${c.color}"></span>${c.label}</button>`).join("")}</div>
    <div class="cards" id="place-list">${T.places.filter((p) => cat === "all" || p.cat === cat).map((p) => `
      <a class="pcard" href="#/lieu/${p.id}" data-search="${esc((p.name + " " + p.address + " " + p.description + " " + (p.sub || "") + " " + CATS[p.cat].label).toLowerCase())}">
        ${photo(p.photo, p.name, "pcard-ph")}
        <div class="pcard-b"><span class="cat" style="color:${CATS[p.cat].color}">${icon(CATS[p.cat].icon)} ${CATS[p.cat].label}</span>
        <h3>${esc(p.name)}</h3><p class="muted small">${esc(p.address)}</p>${statusBadge(p.status)}</div></a>`).join("")}</div>
    <p class="muted" id="search-empty" hidden>Aucun lieu ne correspond. Les produits se cherchent aussi dans <a href="#/achats">Achats</a>.</p>
    <div id="product-hits"></div>`;
  }

  function placeDetail(id) {
    const p = placeById(id);
    if (!p) return `<p>Lieu introuvable. <a href="#/lieux">Retour aux lieux</a></p>`;
    const acts = T.activities.filter((a) => a.place === id);
    const cred = window.PHOTO_CREDITS?.[p.photo];
    return `
    <a class="back" href="#/lieux" data-act="back">${icon("back")} Retour</a>
    <article class="detail">
      ${photo(p.photo, p.name, "detail-ph")}
      ${cred ? `<p class="credit">Photo : ${esc(cred.author)} · ${esc(cred.license)} · <a href="${esc(cred.source)}" target="_blank" rel="noopener">Wikimedia Commons</a></p>` : ""}
      <span class="cat" style="color:${CATS[p.cat].color}">${icon(CATS[p.cat].icon)} ${CATS[p.cat].label}</span>
      <h1>${esc(p.name)}</h1>
      <p class="addr">${icon("pin")} ${esc(p.address)}</p>
      <div class="actions">
        <a class="btn primary" href="${mapsUrl(p)}" target="_blank" rel="noopener">${icon("map")} Google Maps</a>
        ${p.lat != null ? `<a class="btn" href="#/carte?focus=${p.id}">${icon("pin")} Voir sur la carte</a>` : ""}
        ${p.phone ? `<a class="btn" href="tel:${p.phone.replace(/\s/g, "")}">${icon("phone")} ${esc(p.phone)}</a>` : ""}
        ${p.website ? `<a class="btn" href="${esc(p.website)}" target="_blank" rel="noopener">${icon("ext")} Site officiel</a>` : `<span class="muted small">Pas de site officiel trouvé</span>`}
      </div>
      <dl class="facts">
        <div><dt>Horaires</dt><dd>${esc(p.hours)} ${statusBadge(p.status)}</dd></div>
        <div><dt>Durée conseillée</dt><dd>${esc(p.duration)}</dd></div>
        <div><dt>Budget</dt><dd>${esc(p.budget)}</dd></div>
      </dl>
      <h2 class="h">Description</h2><p>${esc(p.description)}</p>
      <h2 class="h">Pourquoi y aller</h2><p>${esc(p.why)}</p>
      ${p.food ? `<h2 class="h">À table</h2><p><strong>${esc(p.food.cuisine)}</strong></p><ul class="tips">${p.food.order.map((o) => `<li>${esc(o)}</li>`).join("")}</ul><p class="diet">${esc(p.food.diet)}</p><p><strong>Réservation :</strong> ${esc(p.food.reservation)}</p>` : ""}
      ${p.tips?.length ? `<h2 class="h">Conseils</h2><ul class="tips">${p.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
      ${acts.length ? `<h2 class="h">Dans le programme</h2><ul class="plain">${acts.map((a) => `<li><a href="#/planning?focus=${a.id}">${DAY_LABEL[a.day]} · ${a.start}–${a.end} · ${esc(a.title)}</a>${S().done[a.id] ? " ✓" : ""}</li>`).join("")}</ul>` : `<p class="muted">Hors programme principal (alternative ou option).</p>`}
      ${sourceLinks(p.sources)}
    </article>`;
  }

  /* ================= ACHATS ================= */
  const BUDGET_MAP = { Maestro: "costumes", "Marché": "snacks", "Supermarché": "snacks", Souvenirs: "souvenirs" };
  function allProducts() {
    return [...T.products, ...S().custom];
  }
  function whereLabel(w) {
    if (w === "supermarche") return "Supermarché (Maxi / IDEA / Univerexport)";
    const p = placeById(w);
    return p ? p.name : w || "—";
  }
  function shopping() {
    const st = S();
    const tab = st.ui.shopTab || "list";
    const tabs = `<div class="chips seg"><button class="chip ${tab === "list" ? "on" : ""}" data-act="ui" data-key="shopTab" data-v="list">${icon("list")} Liste d'achats</button><button class="chip ${tab === "shops" ? "on" : ""}" data-act="ui" data-key="shopTab" data-v="shops">${icon("store")} Guide des magasins</button></div>`;
    return `<header class="page-h"><h1>Achats</h1></header>${tabs}${tab === "list" ? shoppingList() : shopsGuide()}`;
  }

  function shoppingList() {
    const st = S();
    const filter = st.ui.pf || "all";
    const prods = allProducts();
    const pState = (id) => st.purchases[id] || {};
    const bought = prods.filter((p) => pState(p.id).bought);
    const paid = prods.reduce((s, p) => s + (Number(pState(p.id).paid) || 0), 0);
    const cats = [...new Set(prods.map((p) => p.cat))];
    const shown = prods.filter((p) => filter === "all" || (filter === "todo" ? !pState(p.id).bought : pState(p.id).bought));
    const BAG = { cabine: "Cabine", soute: "Soute", "sur-place": "À consommer sur place", "—": "—" };
    return `
    <div class="stats">
      <div><strong>${prods.length - bought.length}</strong><span>prévus</span></div>
      <div><strong>${bought.length}</strong><span>achetés</span></div>
      <div><strong>${rsd(paid)}</strong><span>payé ≈ ${eur(paid)}</span></div>
    </div>
    <div class="chips"><button class="chip ${filter === "all" ? "on" : ""}" data-act="ui" data-key="pf" data-v="all">Tout</button><button class="chip ${filter === "todo" ? "on" : ""}" data-act="ui" data-key="pf" data-v="todo">À acheter</button><button class="chip ${filter === "done" ? "on" : ""}" data-act="ui" data-key="pf" data-v="done">Déjà achetés</button></div>
    ${cats.map((c) => {
      const items = shown.filter((p) => p.cat === c);
      if (!items.length) return "";
      return `<section class="card"><h2 class="h">${esc(c)}</h2><ul class="plist">${items.map((p) => {
        const ps = pState(p.id);
        return `<li class="prod ${ps.bought ? "bought" : ""}">
          <label class="check big"><input type="checkbox" data-act="buy" data-id="${p.id}" ${ps.bought ? "checked" : ""}><span><strong>${esc(p.name)}</strong></span></label>
          <div class="prod-meta">
            <span>${icon("pin")} ${esc(whereLabel(p.where))}</span>
            <span>Prix : ${p.price ? esc(p.price) : "non vérifié"} ${statusBadge(p.priceStatus)}</span>
            ${p.bag && p.bag !== "—" ? `<span class="bag ${p.bag}">${BAG[p.bag] || esc(p.bag)}</span>` : ""}
            ${p.fragile && p.fragile !== "—" ? `<span>${esc(p.fragile)}</span>` : ""}
            ${p.worth && p.worth !== "—" ? `<span>Intérêt : ${esc(p.worth)}</span>` : ""}
          </div>
          ${p.note ? `<p class="muted small">${esc(p.note)}</p>` : ""}
          <div class="prod-in">
            <label>Qté <input type="number" inputmode="numeric" min="0" step="1" data-act="pfield" data-id="${p.id}" data-f="qty" value="${esc(ps.qty ?? "")}"></label>
            <label>Payé (RSD) <input type="number" inputmode="decimal" min="0" step="1" data-act="pfield" data-id="${p.id}" data-f="paid" value="${esc(ps.paid ?? "")}"></label>
            ${ps.paid ? `<span class="muted small">≈ ${eur(ps.paid)}</span>` : ""}
            ${p.custom ? `<button class="icon-btn" data-act="del-product" data-id="${p.id}" aria-label="Supprimer ${esc(p.name)}">${icon("trash")}</button>` : ""}
          </div>
        </li>`;
      }).join("")}</ul></section>`;
    }).join("") || '<p class="muted">Rien dans ce filtre.</p>'}
    <form class="card form" id="add-product">
      <h2 class="h">${icon("plus")} Ajouter un produit</h2>
      <div class="form-grid">
        <label>Nom<input name="name" required maxlength="80"></label>
        <label>Catégorie<select name="cat">${[...new Set([...cats, "Autre"])].map((c) => `<option>${esc(c)}</option>`).join("")}</select></label>
        <label>Lieu d'achat<input name="where" maxlength="80" placeholder="ex. Kalenić"></label>
        <label>Prix indicatif<input name="price" maxlength="40" placeholder="ex. 350 RSD"></label>
        <label>Poste du budget<select name="bcat">${T.budget.categories.map((c) => `<option value="${c.id}" ${c.id === "souvenirs" ? "selected" : ""}>${esc(c.name)}</option>`).join("")}</select></label>
      </div>
      <button class="btn primary" type="submit">${icon("plus")} Ajouter</button>
    </form>`;
  }

  function shopsGuide() {
    return `<label class="search">${icon("search")}<input type="search" id="shop-search" placeholder="Rechercher une enseigne ou un produit…" autocomplete="off"></label>
    ${T.shopCategories.map((c) => `<section class="card shopcat" data-shopcat>
      <h2 class="h">${esc(c.name)}</h2>
      ${c.items.map((it) => {
        const p = it.place ? placeById(it.place) : null;
        const name = p ? p.name : it.name;
        const url = p ? mapsUrl(p) : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(it.mapsQuery)}`;
        return `<div class="shop" data-search="${esc((name + " " + it.products + " " + it.why + " " + c.name).toLowerCase())}">
          <h3>${p ? `<a href="#/lieu/${p.id}">${esc(name)}</a>` : esc(name)} ${statusBadge(p ? p.status : it.status)}</h3>
          <p><strong>À chercher :</strong> ${esc(it.products)}</p>
          <p><strong>Pourquoi :</strong> ${esc(it.why)}</p>
          ${p ? `<p class="muted small">${icon("pin")} ${esc(p.address)} · ${icon("clock")} ${esc(p.hours)}</p><p class="muted small">Budget : ${esc(p.budget)} · Durée : ${esc(p.duration)}</p>` : ""}
          <p class="muted small"><strong>Sur notre route :</strong> ${esc(it.proximity)}</p>
          <a class="btn" href="${url}" target="_blank" rel="noopener">${icon("map")} ${p ? "Google Maps" : "Trouver le plus proche"}</a>
        </div>`;
      }).join("")}</section>`).join("")}
    <p class="muted" id="shop-empty" hidden>Aucun résultat.</p>`;
  }

  /* ================= GASTRONOMIE ================= */
  function gastro() {
    const restos = T.places.filter((p) => p.food);
    const prevInfo = (pid) => {
      const idx = T.activities.findIndex((a) => a.place === pid);
      if (idx <= 0) return "Hors programme (alternative)";
      const a = T.activities[idx], prev = T.activities[idx - 1];
      const leg = a.leg ? legById(a.leg) : null;
      if (leg) return `Depuis ${esc(placeById(leg.from).name)} : ${MODE_LABEL[leg.mode].toLowerCase()}, ${esc(leg.duration)} (${esc(leg.distance)}, estimation)`;
      const from = placeById(prev.place), to = placeById(pid);
      const km = haversine(from, to);
      return `Depuis « ${esc(prev.title)} » : ≈ ${km.toFixed(1).replace(".", ",")} km à vol d'oiseau, ≈ ${Math.max(3, Math.round((km * 1.3 / 4.5) * 60))} min à pied (estimation)`;
    };
    const DIET = { ok: ["ok", "Compatible"], warn: ["warn", "Composition incertaine"], no: ["no", "Contient de la viande"] };
    return `
    <header class="page-h"><h1>Gastronomie</h1></header>
    <div class="note diet-banner">${icon("info")} <span><strong>Régime :</strong> ${esc(T.meta.diet)} Les compositions incertaines sont signalées par ⚠.</span></div>
    ${restos.map((p) => {
      const act = T.activities.find((a) => a.place === p.id);
      return `<article class="card resto">
        <div class="resto-top">${photo(p.photo, p.name, "resto-ph")}
          <div><span class="cat" style="color:${CATS[p.cat].color}">${icon(CATS[p.cat].icon)} ${esc(p.food.cuisine)}</span>
          <h2><a href="#/lieu/${p.id}">${esc(p.name)}</a></h2>
          <p class="muted small">${icon("pin")} ${esc(p.address)}</p>
          ${act ? `<p class="small"><strong>${DAY_LABEL[act.day]} · ${act.start}–${act.end}</strong> ${prioBadge(act.priority)}</p>` : `<p class="small"><span class="badge est">Plan B</span></p>`}</div></div>
        <dl class="facts">
          <div><dt>À commander</dt><dd>${p.food.order.map(esc).join(" · ")}</dd></div>
          <div><dt>Pour vous</dt><dd>${esc(p.food.diet)}</dd></div>
          <div><dt>Prix</dt><dd>${esc(p.budget)}</dd></div>
          <div><dt>Horaires</dt><dd>${esc(p.hours)} ${statusBadge(p.status)}</dd></div>
          <div><dt>Réservation</dt><dd>${esc(p.food.reservation)}</dd></div>
          <div><dt>Accès</dt><dd>${prevInfo(p.id)}</dd></div>
        </dl>
        <div class="actions"><a class="btn primary" href="${mapsUrl(p)}" target="_blank" rel="noopener">${icon("map")} Google Maps</a>${p.phone ? `<a class="btn" href="tel:${p.phone.replace(/\s/g, "")}">${icon("phone")} Appeler</a>` : ""}</div>
      </article>`;
    }).join("")}
    <section class="card">
      <h2 class="h">${icon("bread")} Petit-déjeuner du dimanche à Kalenić</h2>
      <p>Les boulangeries et pâtisseries qui entourent le marché (In Your Pocket) suffisent : burek sa sirom, pita, yaourt. Je ne peux confirmer le nom ni les horaires d'aucune boulangerie précise. ⚠ Saindoux possible dans la pâte.</p>
    </section>
    <section class="card">
      <h2 class="h">Spécialités : que commander ?</h2>
      <ul class="spec">${T.specialities.map((s) => `<li><span class="badge ${DIET[s.diet][0]}">${DIET[s.diet][1]}</span><div><strong>${esc(s.name)}</strong> : ${esc(s.desc)}${s.note ? ` <span class="muted">${esc(s.note)}</span>` : ""}</div></li>`).join("")}</ul>
      <p class="muted small">Phrases utiles : « Bez mesa, molim » (sans viande, s'il vous plaît) · « Da li ima masti? » (y a-t-il du saindoux ?) · « Riba » (poisson) · « Posno » (de carême, sans produits animaux).</p>
    </section>`;
  }

  /* ================= BUDGET ================= */
  function budgetCalc() {
    const st = S(), b = st.budget;
    const scen = T.budget.categories.reduce((m, c) => (m[c.id] = c.scenarios[b.scenario], m), {});
    const planned = (id) => (b.planned[id] != null && b.planned[id] !== "" ? Number(b.planned[id]) : scen[id]);
    const real = {};
    T.budget.categories.forEach((c) => (real[c.id] = 0));
    st.expenses.forEach((e) => {
      const amt = e.currency === "EUR" ? Number(e.amount) * UI.rate() : Number(e.amount);
      real[e.cat] = (real[e.cat] || 0) + (amt || 0);
    });
    allProducts().forEach((p) => {
      const paid = Number(st.purchases[p.id]?.paid) || 0;
      if (!paid) return;
      const cat = p.bcat || BUDGET_MAP[p.cat] || "souvenirs";
      real[cat] = (real[cat] || 0) + paid;
    });
    return { planned, real };
  }

  function budget() {
    const st = S(), b = st.budget;
    const { planned, real } = budgetCalc();
    const r = UI.rate();
    const custom = b.rate && b.rate > 0;
    const rows = T.budget.categories.map((c) => {
      const pl = planned(c.id), re = real[c.id] || 0, diff = pl - re, pct = pl ? (re / pl) * 100 : re ? 100 : 0;
      const excluded = c.costume && b.excludeCostumes;
      return `<tr class="${excluded ? "excluded" : ""} ${pct > 100 ? "over" : ""}">
        <th scope="row">${esc(c.name)}${c.costume ? ' <span class="badge est">séparé</span>' : ""}<small>${esc(c.basis)}</small></th>
        <td><input type="number" inputmode="numeric" min="0" step="100" data-act="planned" data-cat="${c.id}" value="${Math.round(pl)}" aria-label="Budget prévu ${esc(c.name)} en RSD"><small>≈ ${eur(pl)}</small></td>
        <td>${rsd(re)}<small>≈ ${eur(re)}</small></td>
        <td class="${diff < 0 ? "neg" : ""}">${rsd(diff)}<small>${diff < 0 ? "dépassement" : "restant"}</small></td>
        <td><div class="bar"><span style="width:${Math.min(100, pct)}%"></span></div><small>${Math.round(pct)} %</small></td>
      </tr>`;
    }).join("");
    const inc = T.budget.categories.filter((c) => !(c.costume && b.excludeCostumes));
    const totP = inc.reduce((s, c) => s + planned(c.id), 0), totR = inc.reduce((s, c) => s + (real[c.id] || 0), 0);
    const cos = T.budget.categories.find((c) => c.costume);
    const pctTot = totP ? Math.round((totR / totP) * 100) : 0;
    return `
    <header class="page-h"><h1>Budget</h1><p class="muted">${esc(T.budget.note)} Les données restent sur cet appareil.</p></header>
    <section class="card rate">
      <h2 class="h">${icon("wallet")} Taux de conversion</h2>
      <p><strong>1 € = ${r.toLocaleString("fr-FR", { maximumFractionDigits: 4 })} RSD</strong> · ${custom ? `taux saisi le ${esc(b.rateDate ? fmtDate(b.rateDate) : "?")}` : `cours moyen NBS du ${fmtDate(T.meta.rate.date)}`} ${statusBadge(custom ? "estime" : T.meta.rate.status)}</p>
      <p class="muted small">${esc(T.meta.rate.note)}</p>
      <div class="row"><label>Nouveau taux (RSD pour 1 €)<input type="number" id="rate-input" step="0.01" min="50" max="300" inputmode="decimal" placeholder="${T.meta.rate.rsdPerEur}"></label>
      <button class="btn" data-act="rate-set">Mettre à jour</button>${custom ? `<button class="btn" data-act="rate-reset">Revenir au taux NBS</button>` : ""}</div>
      ${sourceLinks(T.meta.rate.sources)}
    </section>
    <section class="card">
      <div class="chips" role="group" aria-label="Scénario">${T.budget.scenarios.map((s) => `<button class="chip ${b.scenario === s.id ? "on" : ""}" data-act="scenario" data-v="${s.id}">${esc(s.name)}</button>`).join("")}</div>
      <label class="switch"><input type="checkbox" data-act="excl-costumes" ${b.excludeCostumes ? "checked" : ""}> Exclure les costumes du budget touristique</label>
      <div class="kpis">
        <div><span>Prévu${b.excludeCostumes ? " (hors costumes)" : ""}</span><strong>${rsd(totP)}</strong><small>≈ ${eur(totP)}</small></div>
        <div><span>Dépensé</span><strong>${rsd(totR)}</strong><small>≈ ${eur(totR)}</small></div>
        <div class="${totP - totR < 0 ? "neg" : ""}"><span>Restant</span><strong>${rsd(totP - totR)}</strong><small>≈ ${eur(totP - totR)}</small></div>
        <div><span>Utilisé</span><strong>${pctTot} %</strong><div class="bar"><span style="width:${Math.min(100, pctTot)}%"></span></div></div>
      </div>
      ${b.excludeCostumes ? `<p class="note">Costumes suivis à part : prévu ${rsd(planned(cos.id))}, dépensé ${rsd(real[cos.id] || 0)} (≈ ${eur(real[cos.id] || 0)}).</p>` : ""}
      <div class="table-wrap"><table class="btable">
        <thead><tr><th>Poste (2 pers.)</th><th>Prévu</th><th>Réel</th><th>Écart</th><th>%</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
      <p class="muted small">Les prix payés saisis dans la liste d'achats s'ajoutent automatiquement au poste correspondant. Changer de scénario remplace les montants prévus.</p>
    </section>
    <form class="card form" id="add-expense">
      <h2 class="h">${icon("plus")} Ajouter une dépense</h2>
      <div class="form-grid">
        <label>Libellé<input name="label" required maxlength="60" placeholder="ex. Taxi aéroport"></label>
        <label>Poste<select name="cat">${T.budget.categories.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join("")}</select></label>
        <label>Montant<input name="amount" type="number" step="0.01" min="0" required inputmode="decimal"></label>
        <label>Devise<select name="currency"><option>RSD</option><option>EUR</option></select></label>
      </div>
      <button class="btn primary" type="submit">${icon("plus")} Enregistrer</button>
    </form>
    <section class="card">
      <h2 class="h">Dépenses saisies (${st.expenses.length})</h2>
      ${st.expenses.length ? `<ul class="plain exp">${st.expenses.slice().reverse().map((e) => {
        const c = T.budget.categories.find((x) => x.id === e.cat);
        const val = e.currency === "EUR" ? Number(e.amount) * r : Number(e.amount);
        return `<li><div><strong>${esc(e.label)}</strong><small>${esc(c ? c.name : e.cat)} · ${new Date(e.ts).toLocaleString("fr-FR", { weekday: "short", hour: "2-digit", minute: "2-digit" })}</small></div>
          <div class="exp-amt"><input type="number" step="0.01" min="0" data-act="exp-amount" data-id="${e.id}" value="${esc(e.amount)}" aria-label="Montant"> ${esc(e.currency)}<small>${e.currency === "EUR" ? "≈ " + rsd(val) : "≈ " + eur(val)}</small></div>
          <button class="icon-btn" data-act="del-exp" data-id="${e.id}" aria-label="Supprimer">${icon("trash")}</button></li>`;
      }).join("")}</ul>` : '<p class="muted">Aucune dépense pour l\'instant.</p>'}
    </section>`;
  }

  /* ================= TRANSPORTS ================= */
  function transports() {
    return `
    <header class="page-h"><h1>Transports</h1><p class="muted">Tous les trajets dans l'ordre. Durées et prix estimés sauf mention contraire.</p></header>
    <section class="card"><h2 class="h">${icon("phone")} Applications et services</h2>
      <div class="apps">${T.apps.map((a) => `<a class="app" href="${esc(a.url)}" target="_blank" rel="noopener"><strong>${esc(a.name)}</strong><span>${esc(a.desc)}</span>${statusBadge(a.status)}</a>`).join("")}</div>
      <h3 class="h3">Taxis : les bons réflexes</h3><ul class="tips">${T.taxiTips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      ${sourceLinks(["bento", "vreme_yandex", "wiki_transport", "eaa_transport"])}
    </section>
    ${["sat", "sun"].map((d) => `<section class="day"><h2 class="day-h">${DAY_LABEL[d]} novembre</h2>${T.legs.filter((l) => l.day === d).map((l) => {
      const url = dirUrl(l.from, l.to, l.mode);
      return `<article class="card legcard">
        <div class="leg-route"><span class="lt">${l.time}</span><div><strong>${esc(placeById(l.from).name)}</strong><span class="arrow">↓ ${icon(MODE_ICON[l.mode])} ${MODE_LABEL[l.mode]} · ${esc(l.duration)}</span><strong>${esc(placeById(l.to).name)}</strong></div></div>
        <dl class="facts"><div><dt>Distance</dt><dd>${esc(l.distance)}</dd></div><div><dt>Prix</dt><dd>${esc(l.price)} ${statusBadge(l.status)}</dd></div></dl>
        <p><strong>Instructions :</strong> ${esc(l.instructions)}</p>
        <p><strong>Alternative :</strong> ${esc(l.alternative)}</p>
        ${url ? `<a class="btn primary" href="${url}" target="_blank" rel="noopener">${icon("nav")} Itinéraire Google Maps</a>` : ""}
        ${sourceLinks(l.sources)}
      </article>`;
    }).join("")}</section>`).join("")}`;
  }

  /* ================= CHECKLIST ================= */
  function checklist() {
    const st = S();
    return `
    <header class="page-h"><h1>Checklist</h1><p class="muted">Touchez une ligne pour la cocher ou la décocher.</p></header>
    ${T.checklists.map((g) => {
      const n = g.items.filter((_, i) => st.checks[`${g.id}:${i}`]).length;
      return `<section class="card">
        <div class="cl-head"><h2 class="h">${esc(g.name)}</h2><span class="pill ${n === g.items.length ? "ok" : ""}">${n}/${g.items.length}</span></div>
        <div class="bar"><span style="width:${(n / g.items.length) * 100}%"></span></div>
        <ul class="plain">${g.items.map((it, i) => {
          const k = `${g.id}:${i}`;
          return `<li><label class="check ${st.checks[k] ? "on" : ""}"><input type="checkbox" data-act="toggle-check" data-key="${k}" ${st.checks[k] ? "checked" : ""}><span>${esc(it)}</span></label></li>`;
        }).join("")}</ul>
        ${n ? `<button class="btn small" data-act="reset-group" data-id="${g.id}">Tout décocher</button>` : ""}
      </section>`;
    }).join("")}`;
  }

  /* ================= PLANS B & URGENCES ================= */
  function urgences() {
    return `
    <header class="page-h"><h1>Plans B & urgences</h1></header>
    <section class="card sos">
      <h2 class="h">${icon("phone")} Numéros utiles</h2>
      <ul class="plain nums">${T.emergency.map((e) => `<li><a class="num" href="tel:${e.number.replace(/\s/g, "")}"><strong>${esc(e.number)}</strong><span>${esc(e.label)}</span></a>${statusBadge(e.status)}${e.note ? `<small>${esc(e.note)}</small>` : ""}</li>`).join("")}</ul>
      ${sourceLinks(["emerg_ca", "n1_112", "ambfr_dir", "ambfr"])}
    </section>
    <h2 class="sec-h">Imprévus : que faire ?</h2>
    ${T.planB.map((b) => `<article class="card planb">
      <h3>${esc(b.title)}</h3>
      <p><strong>Solution :</strong> ${esc(b.action)}</p>
      <div class="kd"><div class="keep"><span>On garde</span>${esc(b.keep)}</div><div class="dropz"><span>On supprime d'abord</span>${esc(b.drop)}</div></div>
    </article>`).join("")}
    <h2 class="sec-h">Douane et bagages au retour</h2>
    ${T.customs.map((c) => `<article class="card"><h3>${esc(c.title)} ${statusBadge(c.status)}</h3><p>${esc(c.text)}</p>${sourceLinks(c.sources)}</article>`).join("")}`;
  }

  /* ================= INFOS / SOURCES / HORS LIGNE ================= */
  function infos() {
    const sw = "serviceWorker" in navigator;
    const credits = window.PHOTO_CREDITS || {};
    return `
    <header class="page-h"><h1>Infos, hors ligne et sources</h1></header>
    <section class="card">
      <h2 class="h">${icon("info")} Utilisation hors ligne</h2>
      <p id="offline-state">${sw ? "Vérification du cache…" : "Ce navigateur ne gère pas les service workers : le site nécessite Internet."}</p>
      <ul class="tips">
        <li>Ouvrez le site une fois avec Internet, depuis une adresse <strong>https://</strong> (ou localhost) : le planning, les fiches, les photos, la carte des points et les données sont alors mis en cache.</li>
        <li>Sans connexion : le fond de carte OpenStreetMap n'affiche que les zones déjà consultées. Les liens Google Maps et les sites externes nécessitent Internet (sauf carte Google téléchargée hors ligne).</li>
        <li>Les cases cochées, achats et dépenses sont enregistrés sur cet appareil (localStorage) : ils ne sont pas partagés entre deux téléphones.</li>
        <li>Installer : Android/Chrome → menu ⋮ → « Installer l'application » ou « Ajouter à l'écran d'accueil ». iPhone/Safari → bouton Partager → « Sur l'écran d'accueil ».</li>
      </ul>
      <p class="muted small">Stockage local : ${Store.available() ? "disponible ✓" : "indisponible (navigation privée ?) : les saisies seront perdues au rechargement"}</p>
    </section>
    <section class="card">
      <h2 class="h">Vos données</h2>
      <p class="muted small">Sauvegardez vos cases et dépenses ou transférez-les vers un autre téléphone (copier-coller).</p>
      <div class="actions"><button class="btn" data-act="export">Copier mes données</button><button class="btn" data-act="import">Importer</button><button class="btn danger" data-act="reset-all">Tout effacer</button></div>
    </section>
    <section class="card">
      <h2 class="h">Limites connues</h2>
      <ul class="tips">
        <li>Aucun horaire n'est vérifié en temps réel : tout a été recherché le ${fmtDate(T.meta.checked)}. Les statuts « À vérifier » signalent les infos à confirmer.</li>
        <li>L'horaire du samedi de Maestro, la carte du Pavilion, les horaires du Little Bay et de Saint-Sava n'ont pas pu être confirmés en ligne.</li>
        <li>Les durées à pied sont estimées (distance à vol d'oiseau × 1,3 à 4,5 km/h) ; les prix de taxi sont des ordres de grandeur.</li>
        <li>Aucune adresse précise de supermarché ni de boulangerie près de Kalenić n'a été vérifiée : les liens « Trouver le plus proche » lancent une recherche Google Maps.</li>
        <li>Les numéros de vol sont ceux que vous avez fournis.</li>
      </ul>
    </section>
    <section class="card">
      <h2 class="h">Toutes les sources</h2>
      <ul class="plain srcs">${Object.values(T.sources).map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a> <small>${s.checked ? "consulté le " + fmtDate(s.checked) : "lien officiel, non consulté"}</small></li>`).join("")}</ul>
    </section>
    <section class="card">
      <h2 class="h">Crédits photos</h2>
      <ul class="plain srcs">${Object.entries(credits).map(([k, c]) => `<li>${esc(k)} : ${esc(c.author)} · ${esc(c.license)} · <a href="${esc(c.source)}" target="_blank" rel="noopener">Commons</a></li>`).join("") || "<li>Chargement…</li>"}</ul>
      <p class="muted small">Fond de carte © contributeurs OpenStreetMap. Carte : Leaflet 1.9.4.</p>
    </section>`;
  }

  /* ================= MENU « PLUS » ================= */
  function more() {
    return `<header class="page-h"><h1>Toutes les sections</h1></header>
    <nav class="menu">${window.NAV.map((n) => `<a href="#/${n.id}">${icon(n.icon)}<span>${n.label}</span></a>`).join("")}</nav>`;
  }

  window.Pages = { home, planning, map: mapPage, places: placesPage, placeDetail, shopping, gastro, budget, transports, checklist, urgences, infos, more, allProducts, timeline };
})();

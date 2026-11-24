/*
 * DONNÉES DU VOYAGE — Belgrade, 28–29 novembre 2026
 * ---------------------------------------------------------------
 * Ce fichier est la seule source de vérité du site. Pour mettre à jour
 * un horaire, un prix ou un statut, modifiez-le ici puis rechargez la page
 * (et incrémentez CACHE_VERSION dans sw.js pour forcer la mise à jour hors ligne).
 *
 * Statuts utilisés (champ `status`) :
 *   "confirme"  : vérifié sur une source officielle ou concordante, à la date `checked`
 *   "estime"    : calcul ou ordre de grandeur (distance, durée, budget)
 *   "verifier"  : source unique, ancienne, tierce ou contradictoire → à confirmer sur place
 *
 * Toutes les recherches ont été faites le 27/10/2026. Aucun horaire n'est
 * vérifié en temps réel par le site.
 */
window.TRIP = {
  meta: {
    title: "Belgrade",
    country: "Serbie",
    dates: { start: "2026-11-28", end: "2026-11-29", label: "Sam. 28 – dim. 29 novembre 2026" },
    timezone: "Europe/Belgrade",
    checked: "2026-10-27",
    rechecked: "2026-11-24",
    travellers: 2,
    diet: "Pas de bœuf, poulet, porc ni dinde. Poisson, œufs et produits laitiers OK.",
    sun: {
      sat: { sunrise: "06:51", sunset: "16:01", civilDusk: "16:33" },
      sun: { sunrise: "06:52", sunset: "16:00", civilDusk: "16:33" },
      status: "estime",
      note: "Calcul astronomique (algorithme NOAA) pour 44,82° N / 20,46° E en heure d'hiver (UTC+1), précision ± 2 min. Contrôle : le même calcul donne 16:20 le 7/11/2025 contre 16:18 publié par timeanddate.",
      sources: ["timeanddate"]
    },
    rate: {
      rsdPerEur: 117.6326,
      date: "2026-11-19",
      status: "confirme",
      note: "Cours moyen officiel de la Banque nationale de Serbie (NBS) au 19/11/2026, relayé par Kurir Biznis (117,40 le 16/10 : le dinar est très stable). Le taux varie chaque jour : modifiable dans la page Budget. Les bureaux de change appliquent leur propre taux.",
      sources: ["kurir_nbs_nov", "kurir_nbs", "nbs"]
    }
  },

  flights: [
    {
      id: "out", dir: "Aller", day: "sat", airline: "Wizz Air", number: "W6 4026",
      from: "Nice (NCE)", to: "Belgrade Nikola Tesla (BEG)",
      dep: "09:40", arr: "11:30",
      status: "verifier",
      note: "Horaires et numéro fournis par vous ; non vérifiés auprès de la compagnie. Vérifiez la carte d'embarquement et l'appli Wizz Air la veille."
    },
    {
      id: "ret", dir: "Retour", day: "sun", airline: "Air Serbia", number: "JU 252",
      from: "Belgrade Nikola Tesla (BEG)", to: "Nice (NCE)",
      dep: "17:40", arr: "19:45",
      status: "verifier",
      note: "Horaires et numéro fournis par vous. Objectif : arrivée à l'aéroport vers 15:15–15:30 (≈ 2 h 15 avant le départ)."
    }
  ],

  /* Horaires critiques affichés sur l'accueil */
  critical: [
    { day: "sat", time: "11:30", label: "Atterrissage W6 4026", status: "verifier", place: "airport" },
    { day: "sat", time: "12:40", label: "Arrivée chez Maestro : lancer les retouches tout de suite", status: "estime", place: "maestro" },
    { day: "sat", time: "16:00", label: "Fermeture de Maestro le samedi (09:00–16:00 selon l'annuaire PlanPlus), fermé dimanche", status: "verifier", place: "maestro" },
    { day: "sat", time: "16:01", label: "Coucher du soleil : être au belvédère de Kalemegdan", status: "estime", place: "kalemegdan" },
    { day: "sat", time: "20:00", label: "Table réservée au Pavilion (fermeture annoncée à 22:00)", status: "verifier", place: "pavilion" },
    { day: "sun", time: "06:00", label: "Petit-déjeuner buffet à l'hôtel dès l'ouverture (06:00–10:30, horaires donnés par vous)", status: "verifier", place: "hotel" },
    { day: "sun", time: "06:25", label: "Check-out définitif, on part avec les bagages", status: "verifier", place: "hotel" },
    { day: "sun", time: "06:40", label: "Yandex Go de l'hôtel vers Kalenić", status: "estime", place: "hotel" },
    { day: "sun", time: "09:20", label: "Yandex Go vers le marché aux puces (ouvert dès 08:00)", status: "confirme", place: "miljakovac" },
    { day: "sun", time: "11:10", label: "Yandex Go vers Ušće (ouvert 10:00–22:00)", status: "verifier", place: "usce" },
        { day: "sun", time: "14:45", label: "Départ d'Ušće directement pour l'aéroport (15:00 au plus tard)", status: "estime", place: "usce" },
    { day: "sun", time: "17:40", label: "Décollage JU 252 vers Nice", status: "verifier", place: "airport" }
  ],

  /* Spécialités à connaître (compatibilité avec le régime : sans bœuf, poulet, porc ni dinde) */
  specialities: [
    { name: "Ajvar", desc: "Purée de poivrons rouges grillés (et parfois d'aubergine).", diet: "ok", note: "Végétal." },
    { name: "Kajmak", desc: "Crème de lait fermentée, à tartiner.", diet: "ok", note: "Laitier : à manger sur place, interdit au retour dans l'UE." },
    { name: "Šopska salata", desc: "Tomate, concombre, oignon, poivron, fromage blanc râpé.", diet: "ok", note: "" },
    { name: "Pohovani kačkavalj", desc: "Fromage kačkavalj pané et frit.", diet: "ok", note: "Huile de friture partagée possible." },
    { name: "Pastrmka", desc: "Truite, souvent grillée ou fumée.", diet: "ok", note: "Présence à vérifier sur chaque carte." },
    { name: "Riblja čorba", desc: "Soupe de poisson de rivière.", diet: "ok", note: "Non trouvée sur les cartes vérifiées." },
    { name: "Burek sa sirom", desc: "Feuilleté au fromage, le petit-déjeuner classique.", diet: "warn", note: "La pâte peut être faite au saindoux (mast). Demandez « bez masti? »." },
    { name: "Gibanica", desc: "Feuilleté au fromage et aux œufs.", diet: "warn", note: "Saindoux possible." },
    { name: "Proja", desc: "Pain de maïs, souvent au fromage.", diet: "warn", note: "Graisse animale ou lardons possibles." },
    { name: "Prebranac", desc: "Haricots blancs au four, à l'oignon et au paprika.", diet: "warn", note: "La version de carême (posni) est sans viande ; d'autres contiennent du lard." },
    { name: "Punjene paprike / sarma", desc: "Poivrons ou chou farcis.", diet: "no", note: "Généralement farcis à la viande : demandez la version posna." },
    { name: "Ćevapi, pljeskavica, karađorđeva", desc: "Grillades et escalope roulée.", diet: "no", note: "Viande : à éviter." }
  ],

  /* ------------------------------------------------------------------ */
  /* SOURCES (citées par identifiant dans tout le fichier)               */
  /* ------------------------------------------------------------------ */
  sources: {
    maestro: { label: "Maestro — site officiel (muska-odela-piramida.rs)", url: "https://muska-odela-piramida.rs/", checked: "2026-10-27" },
    maestro_kontakt: { label: "Maestro — page contact", url: "https://muska-odela-piramida.rs/kontakt/", checked: "2026-10-27" },
    pp_moje: { label: "PlanPlus — Moje odelo (même immeuble que Piramida)", url: "https://www.planplus.rs/moje-odelo-muska-odeca/141638", checked: "2026-10-27" },
    pp_gazela: { label: "PlanPlus — Gazela Family Piramida (Jurija Gagarina 151A)", url: "https://www.planplus.rs/gazela-family-piramida/154057", checked: "2026-10-27" },
    pp_pavilion: { label: "PlanPlus — Pavilion Restaurant, Dobračina 39", url: "https://www.planplus.rs/en/pavilion-restaurant/147269", checked: "2026-10-27" },
    pp_pavhotel: { label: "PlanPlus — Pavilion Social Club & Hotel", url: "https://www.planplus.rs/pavilion-social-club-hotel/130612", checked: "2026-10-27" },
    expedia_pav: { label: "Expedia — Pavilion Hotel & Social Club", url: "https://www.expedia.com/cn/Belgrade-Hotels-Pavilion-Hotel-Social-Club.h89002116.Hotel-Information", checked: "2026-10-27" },
    gsh_pav: { label: "Great Small Hotels — Pavilion Hotel & Social Club", url: "https://www.greatsmallhotels.com/belgrade-boutique-hotels/pavilion-hotel-%26-social-club-belgrade", checked: "2026-10-27" },
    osm: { label: "OpenStreetMap / Nominatim (coordonnées, « Pavilion » au 39 Dobračina)", url: "https://www.openstreetmap.org/search?query=Dobra%C4%8Dina%2039%20Beograd", checked: "2026-10-27" },
    hotels_nobel: { label: "Hotels.com — Nobel Design Hotel", url: "https://za.hotels.com/ho3567316608/nobel-design-hotel", checked: "2026-10-27" },
    kayak_nobel: { label: "Kayak — Nobel Design Hotel", url: "https://www.ca.kayak.com/Belgrade-Hotels-Lifedesign-Hotel.325350.ksp", checked: "2026-10-27" },
    iyp_kalenic: { label: "In Your Pocket — Kalenić pijaca", url: "https://inyourpocket.com/kalenic-pijaca_38549v", checked: "2026-10-27" },
    pp_kalenic: { label: "PlanPlus — Kalenić Public Marketplace", url: "https://www.planplus.rs/en/kalenic-public-marketplace/3687", checked: "2026-10-27" },
    culturetrip_flea: { label: "Culture Trip — marchés aux puces de Serbie", url: "https://theculturetrip.com/europe/serbia/articles/the-5-best-flea-markets-in-serbia", checked: "2026-10-27" },
    airial_kalenic: { label: "Airial — Kalenić Market (stands d'occasion en périphérie)", url: "https://airial.travel/attractions/serbia/beograd/kaleni%C4%87-market-JcheNNRL", checked: "2026-10-27" },
    vreme_kalenic: { label: "Vreme — projet de reconstruction de Kalenić", url: "https://vreme.com/vesti/kalenic-pijaca-rekonstrukcija-20-miliona-evra/", checked: "2026-10-27" },
    bgpijace_hours: { label: "JKP Beogradske pijace — horaires officiels (Miljakovac)", url: "https://www.bgpijace.rs/?page_id=56", checked: "2026-10-27" },
    bgpijace: { label: "JKP Beogradske pijace — site officiel (+381 11 7857 940)", url: "https://www.bgpijace.rs/", checked: "2026-10-27" },
    pp_epoha: { label: "PlanPlus — Antikvarnica Epoha (Maksima Gorkog 1A)", url: "https://www.planplus.rs/antikvarnica-epoha/154534", checked: "2026-10-27" },
    sava_tickets: { label: "Dobročinstvo (agence liée au Temple) — billets et visites", url: "https://dobrocinstvo.rs/hram-svetog-save-2/", checked: "2026-10-27" },
    gm_znak: { label: "Gault&Millau Serbie — Kafana Znak pitanja", url: "https://rs.gaultmillau.com/en/restaurants/kafana-znak-pitanja", checked: "2026-10-27" },
    pp_znak: { label: "PlanPlus — Kafana Znak pitanja", url: "https://www.planplus.rs/en/kafana-znak-pitanja-national-cuisine-restaurant/8283", checked: "2026-10-27" },
    iyp_znak: { label: "In Your Pocket — Kafana ?", url: "https://test.inyourpocket.com/belgrade/kafana_155550v", checked: "2026-10-27" },
    wolt_tri: { label: "Wolt — carte Tri šešira (poissons)", url: "https://wolt.com/en/srb/belgrade/restaurant/tri-eira/items/riba-5", checked: "2026-10-27" },
    n1_tri: { label: "N1 — Tri šešira cité dans une liste de « pièges à touristes »", url: "https://n1info.rs/english/news/belgrade-bohemian-quarter-restaurant-on-tourist-trap-list/", checked: "2026-10-27" },
    iyp_lb: { label: "In Your Pocket — Little Bay", url: "https://www.inyourpocket.com/belgrade/little-bay_38522v", checked: "2026-10-27" },
    pp_lb: { label: "PlanPlus — Little Bay Restaurant", url: "https://www.planplus.rs/en/little-bay-restaurant/11854", checked: "2026-10-27" },
    tj_bakeries: { label: "TableJourney — boulangeries de Belgrade (Trpković)", url: "https://tablejourney.com/serbia/belgrade/bakeries/", checked: "2026-10-27" },
    pp_lilly: { label: "PlanPlus — Lilly Drogerie, Kneza Mihaila 47", url: "https://www.planplus.rs/apoteka-lilly-drogerie/11444", checked: "2026-10-27" },
    wtg_shopping: { label: "World Travel Guide — shopping à Belgrade", url: "https://worldtravelguide.net/guides/europe/serbia/belgrade/shopping", checked: "2026-10-27" },
    bmw_design: { label: "Belgrade My Way — Design District Čumićevo sokače", url: "https://belgrademyway.com/?p=1791", checked: "2026-10-27" },
    pp_gigatron: { label: "PlanPlus — Gigatron (succursales de Belgrade)", url: "https://www.planplus.rs/gigatron/46646", checked: "2026-10-27" },
    wiki_transport: { label: "Wikipedia — Transport à Belgrade (gratuité depuis le 1/1/2025)", url: "https://en.wikipedia.org/wiki/Transport_in_Belgrade", checked: "2026-10-27" },
    nomadic_72: { label: "Nomadic Backpacker — bus 72 aéroport ↔ Zeleni venac", url: "https://www.nomadicbackpacker.com/how-to-get-from-belgrade-airport-to-the-city-centre.html", checked: "2026-10-27" },
    ats_beg: { label: "Airport Transfer Portal — guide BEG (taxi à bon / A1)", url: "https://www.airporttransferportal.com/ar/airport-guides/beg", checked: "2026-10-27" },
    eaa_transport: { label: "EAA 2025 — transports à Belgrade (tarifs taxi, A1)", url: "https://www.e-a-a.org/EAA2025/eaa2025/belgrade_tabs/public_transport.aspx", checked: "2026-10-27" },
    beg_aero: { label: "Aéroport Nikola Tesla — site officiel", url: "https://beg.aero/", checked: null },
    bento: { label: "Bento Travel — applis utiles en Serbie (Uber absent)", url: "https://www.bento.travel/serbia", checked: "2026-10-27" },
    vreme_yandex: { label: "Vreme — taxis disponibles via Yandex Go", url: "https://www.vreme.com/en/drustvo/instaliraj-ruse-ako-ti-u-beogradu-treba-taksi/", checked: "2026-10-27" },
    gsp: { label: "GSP Beograd — transports publics (site officiel)", url: "https://www.gsp.co.rs/", checked: null },
    kurir_nbs: { label: "Kurir Biznis — cours NBS du 16/10/2026", url: "https://biznis.kurir.rs/novcanik/10135346/kursna-lista-16-oktobar-2026-zvanicni-kurs-nbs", checked: "2026-10-27" },
    nbs: { label: "Banque nationale de Serbie — cours du jour", url: "https://www.nbs.rs/", checked: null },
    timeanddate: { label: "timeanddate — lever/coucher du soleil à Belgrade", url: "https://www.timeanddate.com/sun/serbia/belgrade", checked: "2026-10-27" },
    emerg_ca: { label: "Gouvernement du Canada — numéros d'urgence en Serbie", url: "https://travel.gc.ca/assistance/embassies-consulates/serbia", checked: "2026-10-27" },
    n1_112: { label: "N1 — mise en place annoncée du 112 en Serbie", url: "https://n1info.rs/vesti/dacic-ocekuje-se-da-od-polovine-naredne-godine-sistem-112-pocne-da-radi/", checked: "2026-10-27" },
    ambfr_dir: { label: "Annuaire — Ambassade de France, Pariska 11", url: "https://mon-administration.com/ambassade-de-france/mission-diplomatique-serbie-belgrade/", checked: "2026-10-27" },
    ambfr: { label: "Ambassade de France en Serbie — site officiel", url: "https://rs.ambafrance.org/", checked: null },
    eu_personal: { label: "Commission européenne — importations personnelles de produits animaux", url: "https://food.ec.europa.eu/animals/animal-products-movements/personal-imports_en", checked: "2026-10-27" },
    zoll: { label: "Douane allemande — produits animaux dans les bagages (fromage, saucisse)", url: "https://www.zoll.de/EN/Private-individuals/Travel/Entering-Germany/Restrictions/Animals-and-plants-products-containing-animal-or-vegetable-substance/Protection-against-animal-diseases/Provisions-on-the-import-of-animal-products/provisions-on-the-import-of-animal-products_node.html", checked: "2026-10-27" },
    composite: { label: "Règlement délégué (UE) 2023/1674 — biscuits, pâtes à tartiner cacao exemptés", url: "https://eur-lex.europa.eu/eli/reg_del/2023/1674/oj/eng", checked: "2026-10-27" },
    douane_430: { label: "Douane française — franchise 430 € (avion, hors UE)", url: "https://www.douane.gouv.fr/demarche/vous-rapportez-du-tabac-de-lalcool-ou-dautres-marchandises-achetees-hors-de-lunion", checked: "2026-10-27" },
    wiki_plazma: { label: "Wikipedia — Plazma (Bambi, Požarevac)", url: "https://en.wikipedia.org/wiki/Plazma_(biscuit)", checked: "2026-10-27" },
    wiki_eurocrem: { label: "Wikipedia — Eurocrem (Takovo, Gornji Milanovac)", url: "https://en.wikipedia.org/wiki/Eurocrem", checked: "2026-10-27" },
    n021_snacks: { label: "021.rs — histoire de Smoki, Plazma, Bananica", url: "https://www.021.rs/info/srbija/143972/kako-su-nastali-smoki-plazma-bananica-i-rubinov-vinjak", checked: "2026-10-27" },
    pp_maestro: { label: "PlanPlus — fiche Maestro (Jurija Gagarina 151A/30, horaires)", url: "https://www.planplus.rs/en/maestro-men-s-apparel-and-accessories/92684", checked: "2026-11-24" },
    wolt_pav: { label: "Wolt — Pavilion Restaurant (carte, horaires de livraison)", url: "https://wolt.com/en/srb/belgrade/restaurant/restoran-paviljon", checked: "2026-11-24" },
    pp_usce: { label: "PlanPlus — Ušće Shopping Center (10:00–22:00 tous les jours)", url: "https://www.planplus.rs/usce-shopping-center/16016", checked: "2026-11-24" },
    apt_usce: { label: "Apartmani u Beogradu — Ušće (horaires, enseignes, restaurants)", url: "https://apartmani-u-beogradu.com/en/belgrade-shopping-centers/usce-shopping-center", checked: "2026-11-24" },
    tob_usce: { label: "Office du tourisme de Belgrade — Ušće Shopping Centre", url: "https://tob.rs/en/what-to-do/shopping-areas/usce-shopping-centre", checked: "2026-11-24" },
    novosti_buvljak: { label: "Novosti — horaires du 11/11/2026 : « Beogradski buvljak » Miljakovac 08:00–19:00", url: "https://www.novosti.rs/drustvo/vesti/1669587/dan-primirja-drzavni-praznik-radno-vreme-najnovije-vesti", checked: "2026-11-24" },
    informer_buvljak: { label: "Informer — le Buvljak officiel déménage de Novi Beograd à Miljakovac (2023)", url: "https://informer.rs/srbija/beograd/780835/ovde-ce-biti-smesten-novi-buvljak-i-sta-su-njegove-prednosti-udaljen-je-7-kilometara-a-tu-je-i-bg-voz", checked: "2026-11-24" },
    wiki_miljakovac: { label: "Wikipedia — Miljakovac (ouverture du Buvljak le 14/12/2023)", url: "https://www.wikipedia.org/wiki/Miljakovac", checked: "2026-11-24" },
    n1_zemun: { label: "N1 — le marché aux puces informel de Zemun (Vojni put), février 2024", url: "https://n1info.rs/vesti/na-zemunskom-buvljaku-ima-svega-ali-ne-i-mira-za-stanare-obliznjih-kuca/", checked: "2026-11-24" },
    stillin_flea: { label: "Still in Belgrade — guide des marchés aux puces (2018, mis à jour 2020)", url: "https://stillinbelgrade.com/guide-belgrade-flea-markets", checked: "2026-11-24" },
    appsavvy_yandex: { label: "App Savvy Traveller — transferts aéroport (Yandex Go ≈ 1 300–2 000 RSD)", url: "https://appsavvytraveller.com/belgrade-airport-transfers/", checked: "2026-11-24" },
    kurir_nbs_nov: { label: "Kurir Biznis — cours NBS du 19/11/2026 (117,6326)", url: "https://biznis.kurir.rs/amp/10166408/kursna-lista-za-cetvrtak-19-novembar", checked: "2026-11-24" },
    commons: { label: "Wikimedia Commons — photographies sous licence libre", url: "https://commons.wikimedia.org/", checked: "2026-10-27" }
  },

  /* ------------------------------------------------------------------ */
  /* LIEUX                                                               */
  /* cat : hotel | transport | monument | restaurant | bakery | shopping | market */
  /* ------------------------------------------------------------------ */
  places: [
    {
      id: "airport", name: "Aéroport Nikola Tesla (BEG)", cat: "transport",
      address: "Surčin, 11180 Belgrade", lat: 44.81826, lng: 20.30236, photo: null,
      hours: "Arrivée sam. 11:30 — départ dim. 17:40", status: "verifier",
      description: "Aéroport international de Belgrade, à l'ouest de la ville, ≈ 12 km à vol d'oiseau de l'hôtel.",
      why: "Point d'entrée et de sortie du voyage.",
      tips: [
        "Moyen prévu : Yandex Go (prix affiché avant validation). Si l'appli ne trouve pas de voiture : bon de taxi à prix fixe au kiosque du hall d'arrivée, payable en dinars.",
        "Ignorez les rabatteurs qui proposent un taxi dans le hall.",
        "Retirez quelques milliers de dinars au distributeur du hall (taxi, marché de Kalenić en espèces)."
      ],
      budget: "Course vers le centre ≈ 3 000–3 500 RSD (estimation, sources discordantes)",
      duration: "≈ 30–45 min entre l'atterrissage et la sortie (estimation)",
      phone: null, website: "https://beg.aero/",
      sources: ["ats_beg", "eaa_transport", "beg_aero"]
    },
    {
      id: "hotel", name: "Nobel Design Hotel", cat: "hotel",
      address: "Balkanska 18, 11000 Belgrade (Stari Grad)", lat: 44.81135, lng: 20.46008, photo: null,
      hours: "Check-in à partir de 15:00 · check-out avant 12:00 · petit-déjeuner buffet 06:00–10:30 (horaires que vous m'avez donnés)", status: "verifier",
      description: "Hôtel situé en plein centre, entre Terazije et Zeleni venac : Knez Mihailova est à 5 min, Kalemegdan à ≈ 25 min à pied.",
      why: "Camp de base idéal : presque tout le programme se fait à pied depuis l'hôtel.",
      tips: [
        "Hotels.com et Kayak indiquent un check-in à 15:00 et un check-out à 12:00. D'anciennes fiches (« LifeDesign Hotel ») indiquent 14:00 avec early check-in payant (4 920 RSD) : à confirmer avec l'hôtel.",
        "Écrivez à l'hôtel avant le départ : dépôt des bagages possible le samedi ? check-out le dimanche à 06:25 (après le buffet de 06:00) ?",
        "Le dimanche, nous partons avec nos bagages après le check-out et ne revenons pas à l'hôtel."
      ],
      budget: "Déjà réservé",
      duration: "—",
      phone: null, website: null,
      sources: ["hotels_nobel", "kayak_nobel", "osm"]
    },
    {
      id: "maestro", name: "Maestro — Muška odela Piramida", cat: "shopping", sub: "costumes",
      address: "Jurija Gagarina 151a, TC Piramida (locaux 16, 17 et 30), Novi Beograd", lat: 44.80177, lng: 20.38662, photo: null,
      hours: "Lun–ven 09:00–20:00 · sam. 09:00–16:00 · dim. fermé (fiche annuaire PlanPlus de Maestro, non datée ; le site officiel ne publie pas d'horaires)", status: "verifier",
      description: "Fabricant et vendeur serbe de costumes pour homme sous sa propre marque Maestro. Coupes slim, ultra slim, classique, « extended » et grandes tailles ; retouches réalisées sur place.",
      why: "Priorité absolue du voyage : le site officiel annonce un prix unique de 11 800 RSD (≈ 100 €) pour tous les modèles de costume.",
      tips: [
        "Appelez le 011 2168 032 (+381 11 2168 032) avant le départ pour confirmer l'horaire du samedi 28/11 (09:00–16:00 selon l'annuaire) et demander si une retouche peut être prête avant 16:00 : le magasin est fermé le dimanche.",
        "Le site mentionne aussi l'adresse Jurija Gagarina 153a (locaux 16 et 17) : c'est le même centre TC Piramida. Sur place, cherchez les locaux 16, 17 et 30.",
        "Venez avec la chemise et les chaussures que vous porterez, pour juger longueur de manches et de pantalon.",
        "Faites noter sur la facture le délai et les conditions d'échange.",
        "Chemises, chaussures, ceintures et cravates : prix non publiés, à voir sur place."
      ],
      budget: "Costume : 11 800 RSD (≈ 100 €) — prix officiel du site",
      duration: "1 h 30 – 2 h 15 (essayages + retouches)",
      phone: "+381 11 2168 032", website: "https://muska-odela-piramida.rs/",
      sources: ["maestro", "maestro_kontakt", "pp_maestro", "pp_moje", "pp_gazela"]
    },
    {
      id: "pavilion", name: "Pavilion — Dobračina 39", cat: "restaurant",
      address: "Dobračina 39, 11000 Belgrade (Gornji Dorćol)", lat: 44.82057, lng: 20.46390, photo: null,
      hours: "08:00–22:00 tous les jours (PlanPlus) ; 08:00–23:00 sur Wolt (horaires de livraison)", status: "verifier",
      description: "« Dobračina 39 » est une adresse, pas un nom de restaurant. Les annuaires et OpenStreetMap y placent un seul établissement : le Pavilion, boutique-hôtel Art déco ouvert en 2020 (≈ 13 chambres) avec restaurant, deux bars, galerie d'art et « social club ». Les annuaires le nomment aussi « Pavilion Boutique Hotel » ou « Pavilion Hotel & Social Club ».",
      why: "C'est l'établissement qui correspond à votre souhait de dîner « à Dobračina 39 » samedi soir. Un annuaire hôtelier décrit une cuisine locale revisitée en version haut de gamme et une scène cocktail.",
      tips: [
        "La fiche Wolt décrit une cuisine européenne « fusion », des petits-déjeuners (≈ 750–2 400 RSD) et des vins ; les entrées sont servies à partir de 16:00. Je ne peux pas confirmer la carte du soir en salle ni ses prix.",
        "Réservez par téléphone (069 369 6369, soit +381 69 369 6369) et demandez : heure de dernière commande, plats de poisson ou sans viande, ambiance musicale le samedi.",
        "L'annuaire indique une fermeture à 22:00 : arrivée prévue à 20:00 pour dîner sans stress.",
        "Si le restaurant ne sert pas le soir, ou si vous visiez un autre lieu à cette adresse : voir Plans B (Tri šešira à 300 m)."
      ],
      budget: "Non vérifié — prévoir ≈ 4 000–6 000 RSD/pers. (estimation pour un restaurant d'hôtel haut de gamme)",
      duration: "1 h 45",
      phone: "+381 69 369 6369", website: null,
      food: { cuisine: "Cuisine européenne « fusion » et vins (Wolt) ; cuisine locale revisitée selon un annuaire hôtelier", order: ["Demander les plats de poisson du jour", "Entrées végétariennes et fromages"], diet: "Carte inconnue : appelez pour vérifier qu'il existe au moins un plat de poisson ou sans viande.", reservation: "Recommandée : +381 69 369 6369" },
      sources: ["pp_pavilion", "wolt_pav", "pp_pavhotel", "expedia_pav", "gsh_pav", "osm"]
    },
    {
      id: "kalenic", name: "Marché de Kalenić (Kalenić pijaca)", cat: "market",
      address: "Maksima Gorkog 2a, Vračar, Belgrade", lat: 44.80006, lng: 20.47550, photo: "kalenic",
      hours: "06:00–19:00, y compris le dimanche (In Your Pocket et PlanPlus)", status: "verifier",
      description: "Le marché le plus connu de Belgrade, cité par le Financial Times parmi les meilleurs au monde. Fruits, légumes, œufs, poisson, miel, conserves au vinaigre, artisanat, fromage frais (sir) et kajmak. Boulangeries, pâtisseries et petites boutiques tout autour.",
      why: "Le cœur du dimanche : le marché des habitants, avec dégustations proposées par les vendeurs.",
      tips: [
        "Kalenić n'est pas un marché aux puces. Culture Trip indique « pas un marché aux puces au sens traditionnel » ; Airial signale des stands d'occasion en périphérie. Je ne peux pas confirmer leur présence le 29/11.",
        "Antikvarnica Epoha (Maksima Gorkog 1A, en face) est indiquée fermée le dimanche.",
        "Payez en espèces (dinars), en petites coupures.",
        "Fromage et kajmak : à goûter sur place uniquement, leur importation dans l'UE est interdite (voir Achats).",
        "Un projet de reconstruction (halle couverte) est en appel d'offres : vérifiez qu'il n'y a pas de travaux avant d'y aller."
      ],
      budget: "Dégustations + achats : 1 500–4 000 RSD (estimation)",
      duration: "1 h 45 – 2 h",
      phone: null, website: "https://www.bgpijace.rs/",
      sources: ["iyp_kalenic", "pp_kalenic", "culturetrip_flea", "airial_kalenic", "vreme_kalenic", "pp_epoha"]
    },
    {
      id: "kalemegdan", name: "Forteresse de Belgrade & parc de Kalemegdan", cat: "monument",
      address: "Kalemegdan, Stari Grad (monument du Pobednik)", lat: 44.82303, lng: 20.44771, photo: "kalemegdan",
      hours: "Parc et remparts en accès libre ; coucher du soleil sam. ≈ 16:01", status: "estime",
      description: "Forteresse dominant le confluent de la Save et du Danube. Le Pobednik (« Le Vainqueur ») et le belvédère offrent la plus belle vue sur Novi Beograd et Zemun.",
      why: "Le lieu qui fait comprendre la géographie de Belgrade, entre ses deux fleuves. Programmé pour le coucher du soleil.",
      tips: [
        "Coucher du soleil ≈ 16:01, fin du crépuscule civil ≈ 16:33 : arrivez au belvédère du Pobednik avant 16:00.",
        "Après la tombée de la nuit, restez sur les allées éclairées principales.",
        "Les musées de la forteresse ne sont pas programmés (horaires non vérifiés, peu adaptés au rythme)."
      ],
      budget: "Gratuit (parc)",
      duration: "50 min – 1 h",
      phone: null, website: null,
      sources: ["timeanddate", "commons"]
    },
    {
      id: "knez", name: "Rue Knez Mihailova", cat: "monument",
      address: "Kneza Mihaila, Stari Grad", lat: 44.81885, lng: 20.45495, photo: "knez",
      hours: "Rue piétonne, accès libre", status: "confirme",
      description: "La grande rue piétonne commerçante, entre la place de la République et Kalemegdan, bordée d'immeubles du XIXe siècle.",
      why: "Axe naturel de la promenade et du shopping (Lilly, cafés, librairies).",
      tips: ["Beaucoup d'enseignes internationales : concentrez-vous sur la droguerie Lilly et les rues parallèles (Čika Ljubina, Kralja Petra)."],
      budget: "Gratuit", duration: "Traversée 15–20 min ; shopping 45–60 min",
      phone: null, website: null, sources: ["commons"]
    },
    {
      id: "republika", name: "Place de la République (Trg Republike)", cat: "monument",
      address: "Trg Republike, Stari Grad", lat: 44.81622, lng: 20.46030, photo: "republika",
      hours: "Accès libre", status: "confirme",
      description: "Place centrale avec la statue équestre du prince Mihailo, le Musée national et le Théâtre national.",
      why: "Point de repère central entre l'hôtel, Knez Mihailova et Skadarlija.",
      tips: ["Lieu de rendez-vous traditionnel « kod konja » (au cheval)."],
      budget: "Gratuit", duration: "10 min (en passant)",
      phone: null, website: null, sources: ["commons"]
    },
    {
      id: "kosancic", name: "Kosančićev venac & cathédrale Saint-Michel", cat: "monument",
      address: "Kosančićev venac, Stari Grad", lat: 44.81692, lng: 20.45293, photo: "kosancic",
      hours: "Accès libre (rue)", status: "confirme",
      description: "Rue pavée parmi les plus anciennes de la ville, au-dessus de la Save, à côté de la cathédrale orthodoxe (Saborna crkva).",
      why: "Rue secondaire pleine de caractère, juste à côté de la kafana « ? ».",
      tips: ["Passage idéal entre Kalemegdan et la kafana Znak pitanja."],
      budget: "Gratuit", duration: "10–15 min",
      phone: null, website: null, sources: ["commons"]
    },
    {
      id: "dorcol", name: "Dorćol & mosquée Bajrakli", cat: "monument",
      address: "Gospodar Jevremova 11, Dorćol", lat: 44.82206, lng: 20.45735, photo: "dorcol",
      hours: "Quartier en accès libre ; horaires de visite de la mosquée non vérifiés", status: "verifier",
      description: "Vieux quartier entre Knez Mihailova et le Danube : la mosquée Bajrakli (seule mosquée ottomane encore en activité à Belgrade), les rues Gospodar Jevremova, Cara Dušana et Strahinjića bana, cafés et boutiques.",
      why: "Hors programme depuis l'ajout du marché aux puces et d'Ušće. À voir en passant samedi soir si vous avez de l'énergie (10 min depuis Knez Mihailova).",
      tips: ["Mosquée : voir de l'extérieur, entrer seulement si c'est ouvert et en dehors des prières.", "Tenue couvrant épaules et genoux."],
      budget: "Gratuit (+ café)", duration: "1 h – 1 h 15",
      phone: null, website: null, sources: ["commons", "osm"]
    },
    {
      id: "skadarlija", name: "Skadarlija (rue Skadarska)", cat: "monument",
      address: "Skadarska, Stari Grad", lat: 44.81815, lng: 20.46462, photo: "skadarlija",
      hours: "Rue en accès libre", status: "confirme",
      description: "Rue pavée bohème avec ses kafanas historiques, à 300 m de Dobračina 39.",
      why: "Sur le chemin du dîner du samedi ; décor typique de Belgrade le soir.",
      tips: ["Les restaurants de la rue sont touristiques : comparez les cartes affichées."],
      budget: "Gratuit", duration: "10 min (en passant)",
      phone: null, website: null, sources: ["commons"]
    },
    {
      id: "sava", name: "Temple de Saint-Sava (Hram Svetog Save)", cat: "monument",
      address: "Krušedolska 2a, Vračar", lat: 44.79805, lng: 20.46919, photo: "sava",
      hours: "Horaires publics non trouvés · office (liturgie) le dimanche matin", status: "verifier",
      description: "L'une des plus grandes églises orthodoxes du monde. Mosaïque du Christ Pantocrator au-dessus de l'autel, réalisée entre 2016 et 2020 ; crypte richement décorée (église Saint-Prince-Lazare).",
      why: "À 550 m de Kalenić : l'intégrer après le marché ne coûte presque rien en trajet.",
      tips: [
        "Le dimanche matin a lieu la liturgie : entrée discrète, pas de photo au flash, ne traversez pas la nef pendant l'office.",
        "Les groupes guidés ne sont pas admis pendant les offices ; visite guidée « église + crypte » 10 €/pers. (≈ 40 min) selon l'agence partenaire, contact turizamimarketing@hramsvetogsave.rs, +381 60 800 4151.",
        "Tenue couvrant épaules et genoux.",
        "Je ne peux pas confirmer l'horaire d'ouverture de la crypte le dimanche."
      ],
      budget: "Entrée libre dans l'église (visite guidée facultative : 10 €/pers.)",
      duration: "50 min – 1 h",
      phone: "+381 60 800 4151", website: null,
      sources: ["sava_tickets", "commons"]
    },
    {
      id: "znak", name: "Kafana « ? » (Znak pitanja)", cat: "restaurant",
      address: "Kralja Petra 6, Stari Grad", lat: 44.81767, lng: 20.45256, photo: null,
      hours: "Sources contradictoires : 08:00–24:00 (PlanPlus) · sam. 10:00–02:00, fermé lundi (In Your Pocket) · 10:00–22:00 (TableJourney)", status: "verifier",
      description: "La plus ancienne kafana de Belgrade, face à la cathédrale. Cuisine serbe traditionnelle : mezze, grillades, agneau sous la cloche (sač), plats mijotés de saison.",
      why: "Le repas « vraie cuisine serbe » du voyage, à 12 min de Kalemegdan : déjeuner tardif après la forteresse.",
      tips: [
        "Pour vous : šopska salata (tomate, concombre, poivron, fromage sir), ajvar, kajmak, pohovani kačkavalj (fromage pané), fromages. Demandez s'il y a du poisson (pastrmka, truite) : je ne peux pas le confirmer sur leur carte.",
        "⚠ Prebranac (haricots au four), punjene paprike (poivrons farcis), proja et gibanica : la composition varie (lard, saindoux, viande). Demandez « bez mesa i bez masti? » (sans viande et sans saindoux ?).",
        "Téléphone public : +381 11 263 5421."
      ],
      budget: "≈ 2 000–3 000 RSD/pers. (estimation ; Gault&Millau classe la maison dans la gamme supérieure)",
      duration: "1 h 15",
      phone: "+381 11 263 5421", website: null,
      food: { cuisine: "Kafana serbe traditionnelle", order: ["Šopska salata", "Ajvar et kajmak avec du pain", "Pohovani kačkavalj", "Truite (si disponible)"], diet: "⚠ Prebranac, proja, gibanica et légumes farcis : composition à vérifier (viande ou saindoux).", reservation: "Conseillée le samedi : +381 11 263 5421" },
      sources: ["gm_znak", "pp_znak", "iyp_znak"]
    },
    {
      id: "littlebay", name: "Little Bay", cat: "restaurant",
      address: "Dositejeva 9a, Stari Grad", lat: 44.81793, lng: 20.46166, photo: null,
      hours: "Horaires non trouvés ; une source mentionne des concerts le samedi et le dimanche midi", status: "verifier",
      description: "Restaurant au décor de théâtre (loges d'opéra), carte courte ; le saumon est souvent cité par les avis.",
      why: "Hors programme depuis que le dimanche midi est consacré à Ušće. Plan B à 10 min de l'hôtel, avec au moins un plat de poisson signalé.",
      tips: ["Réservez (+381 11 3288 995) et vérifiez l'ouverture du dimanche midi.", "Carte et prix actuels non vérifiés."],
      budget: "≈ 2 000–3 500 RSD/pers. (estimation)",
      duration: "1 h 15",
      phone: "+381 11 3288 995", website: null,
      food: { cuisine: "Cuisine européenne dans un décor de théâtre", order: ["Saumon (souvent cité par les avis)"], diet: "Carte courte : vérifiez le choix de poissons le jour même.", reservation: "Conseillée : +381 11 3288 995" },
      sources: ["iyp_lb", "pp_lb"]
    },
    {
      id: "trisesira", name: "Tri šešira (plan B)", cat: "restaurant",
      address: "Skadarska 29, Skadarlija", lat: 44.81815, lng: 20.46462, photo: "skadarlija",
      hours: "11:00–22:30 tous les jours (fiche Wolt)", status: "verifier",
      description: "Kafana historique de Skadarlija (plus de 150 ans). Carte avec plusieurs poissons.",
      why: "Plan B à 300 m de Dobračina 39 si le Pavilion est complet ou fermé. N1 rapporte qu'elle figure dans une liste de « pièges à touristes ».",
      tips: [
        "Prix relevés sur Wolt : filets de truite fumée 1 630 RSD, saumon grillé 2 610 RSD, bar grillé 2 225 RSD.",
        "Les prix en salle peuvent différer de ceux de la livraison."
      ],
      budget: "≈ 3 000 RSD/pers. (avec poisson)",
      duration: "1 h 30",
      phone: null, website: null,
      food: { cuisine: "Kafana historique de Skadarlija", order: ["Filets de truite fumée (1 630 RSD)", "Bar grillé (2 225 RSD)", "Saumon grillé (2 610 RSD)"], diet: "Plusieurs poissons à la carte (prix relevés sur Wolt).", reservation: "Non indispensable (plan B)" },
      sources: ["wolt_tri", "n1_tri"]
    },
    {
      id: "trpkovic", name: "Pekara Trpković", cat: "bakery",
      address: "Nemanjina 32 (près de Slavija)", lat: 44.80313, lng: 20.46398, photo: null,
      hours: "Lun–ven 06:00–19:00 · sam. 06:00–16:00 · dim. fermé (TableJourney)", status: "verifier",
      description: "Boulangerie réputée pour son burek, avec la file d'attente la plus longue de Belgrade selon TableJourney.",
      why: "Option du samedi seulement si Maestro se termine tôt (fermée le dimanche).",
      tips: ["Burek sa sirom (au fromage). ⚠ La pâte peut contenir du saindoux selon les boulangeries : demandez."],
      budget: "< 300 RSD la part (TableJourney)",
      duration: "20 min",
      phone: "+381 11 361 1268", website: null,
      food: { cuisine: "Boulangerie (pekara)", order: ["Burek sa sirom", "Yaourt à boire"], diet: "⚠ Saindoux possible dans la pâte.", reservation: "Non (file d'attente)" },
      sources: ["tj_bakeries"]
    },
    {
      id: "lilly", name: "Lilly Drogerie — Knez Mihailova", cat: "shopping", sub: "droguerie",
      address: "Kneza Mihaila 47, Stari Grad", lat: 44.81885, lng: 20.45495, photo: null,
      hours: "09:00–22:00 tous les jours, dimanche compris (PlanPlus)", status: "verifier",
      description: "Chaîne serbe de drogueries : cosmétiques, hygiène, compléments, petits produits du quotidien, souvent des marques locales.",
      why: "L'équivalent local d'un drugstore, ouvert tard et le dimanche, sur notre parcours.",
      tips: ["Regardez les marques serbes de soins et les produits en petit format (pratiques en cabine si < 100 ml)."],
      budget: "1 000–3 000 RSD (estimation)", duration: "20–30 min",
      phone: null, website: null, sources: ["pp_lilly"]
    },
    {
      id: "design", name: "Belgrade Design District (Čumićevo sokače)", cat: "shopping", sub: "souvenirs",
      address: "Čumićevo sokače 7-9 (passage près de Terazije)", lat: 44.81400, lng: 20.46172, photo: null,
      hours: "Non trouvés pour le samedi ; variables selon les boutiques", status: "verifier",
      description: "Ancien passage commerçant réinvesti par une trentaine de créateurs serbes : mode, bijoux, céramique, déco, chaussures, pièces sur mesure.",
      why: "Les souvenirs les plus originaux du programme (design local plutôt que magnets), à 5 min de l'hôtel.",
      tips: ["Passez le samedi en fin d'après-midi ; si c'est fermé, retentez le dimanche avant le départ."],
      budget: "2 000–10 000 RSD (estimation)", duration: "30–45 min",
      phone: null, website: null, sources: ["wtg_shopping", "bmw_design"]
    },
    {
      id: "zelenivenac", name: "Marché de Zeleni venac", cat: "market",
      address: "Zeleni venac, Stari Grad", lat: 44.81423, lng: 20.45780, photo: "zeleni",
      hours: "Horaires non confirmés ; les marchés municipaux ouvrent généralement 06:00–19:00", status: "verifier",
      description: "Marché municipal couvert, à 6 min à pied de l'hôtel.",
      why: "Facultatif : plus modeste que Kalenić, mais pratique pour un fruit ou un dernier achat près de l'hôtel.",
      tips: ["Ne remplace pas Kalenić."],
      budget: "—", duration: "15–20 min",
      phone: null, website: "https://www.bgpijace.rs/", sources: ["bgpijace"]
    },
    {
      id: "miljakovac", name: "Beogradski buvljak — marché aux puces (Miljakovac)", cat: "market",
      address: "OTC Miljakovac, Vareška bb, Rakovica (≈ 7 km au sud du centre)", lat: 44.75019, lng: 20.44808, photo: null,
      hours: "08:00–19:00, fermé le lundi (site officiel Beogradske pijace) ; ouvert 08:00–19:00 le 11/11/2026 selon Novosti", status: "confirme",
      description: "Le marché aux puces officiel de Belgrade, « Beogradski buvljak ». Il a quitté la rue Jurija Gagarina à Novi Beograd pour un site neuf à Miljakovac, ouvert le 14/12/2023 : ≈ 230 étals (en partie couverts), plus de 60 boutiques, parking.",
      why: "C'est « le » marché aux puces de Belgrade, géré par la société municipale des marchés, et son ouverture le dimanche dès 08:00 est confirmée. Je ne peux pas confirmer la part d'objets anciens par rapport aux articles neufs bon marché.",
      tips: [
        "Prenez des espèces en petites coupures et négociez : c'est l'usage dans les marchés aux puces.",
        "Gardez sac et téléphone devant vous dans la foule.",
        "Alternative non retenue : le marché aux puces informel de Zemun (Vojni put), le dimanche vers 06:00–10:00 selon un guide local. Adresse exacte et horaires non vérifiés, et il tombe en même temps que Kalenić.",
        "Achats encombrants : pensez au poids des bagages pour le vol."
      ],
      budget: "Achats : 1 000–5 000 RSD (estimation) · Yandex Go ≈ 800–1 200 RSD par trajet (estimation)", duration: "1 h 30",
      phone: "+381 11 7857 940", website: "https://www.bgpijace.rs/",
      sources: ["bgpijace_hours", "novosti_buvljak", "informer_buvljak", "wiki_miljakovac", "n1_zemun", "stillin_flea"]
    },
    {
      id: "usce", name: "Ušće Shopping Center", cat: "shopping", sub: "centre commercial",
      address: "Bulevar Mihajla Pupina 4, Novi Beograd", lat: 44.81562, lng: 20.43702, photo: null,
      hours: "10:00–22:00 tous les jours (PlanPlus et un guide local concordants)", status: "verifier",
      description: "Grand centre commercial de Novi Beograd au pied de la tour Ušće, près du confluent de la Save et du Danube : plus de 150 boutiques d'enseignes internationales et régionales, électronique, beauté, maison, sport, restaurants (dont Fish & Bar et Vapiano selon un guide) et multiplexe Cineplexx.",
      why: "Demandé pour le dimanche. Il remplace le déjeuner assis : on y mange sur le pouce. Le parc d'Ušće voisin offre une vue sur la forteresse de Kalemegdan.",
      tips: [
        "Je ne peux pas confirmer la présence d'un supermarché, de Lilly ou de dm dans le centre : regardez le plan à l'entrée.",
        "Beaucoup d'enseignes sont les mêmes qu'en France (Zara, etc.) : visez les marques serbes et régionales.",
        "Pour manger : Fish & Bar est cité par un guide (poisson, à vérifier sur place).",
        "Départ direct pour l'aéroport à 14:45 au plus tard. Je ne peux pas confirmer l'existence d'une consigne à bagages : gardez les valises avec vous, et l'un de vous peut les surveiller pendant que l'autre fait les boutiques.",
        "Téléphone public : +381 11 285 4505."
      ],
      budget: "En-cas ≈ 800–1 500 RSD/pers. (estimation) + achats",
      duration: "≈ 3 h",
      phone: "+381 11 285 4505", website: null,
      sources: ["pp_usce", "apt_usce", "tob_usce"]
    },
    {
      id: "gigatron", name: "Gigatron (électronique)", cat: "shopping", sub: "electronique",
      address: "Plusieurs succursales à Belgrade", lat: null, lng: null, photo: null,
      hours: "10:00–22:00 tous les jours pour plusieurs succursales (PlanPlus)", status: "verifier",
      description: "Chaîne serbe d'électronique grand public.",
      why: "Non programmé : aucune comparaison de prix n'a montré d'avantage par rapport à la France. Pas de garantie européenne facile, TVA non remboursée simplement.",
      tips: ["Seulement pour un petit accessoire si vous passez devant."],
      budget: "—", duration: "—",
      phone: null, website: null, mapsQuery: "Gigatron Beograd", sources: ["pp_gigatron"]
    }
  ],

  /* ------------------------------------------------------------------ */
  /* TRAJETS (ordre chronologique)                                       */
  /* mode : walk | taxi | transit                                        */
  /* ------------------------------------------------------------------ */
  legs: [
    {
      id: "L1", day: "sat", time: "12:10", from: "airport", to: "maestro", mode: "taxi",
      duration: "20–30 min", distance: "≈ 7 km à vol d'oiseau", price: "Prix affiché dans Yandex Go avant de valider (≈ 1 300–2 000 RSD vers le centre selon un guide 2026 ; Piramida est un peu plus proche)", status: "verifier",
      instructions: "Yandex Go : destination « TC Piramida, Jurija Gagarina 151a, Novi Beograd ». Commandez une fois sortis avec les bagages, suivez le point de prise en charge indiqué dans l'appli et vérifiez la plaque. Le point de rendez-vous exact à l'aéroport n'est pas vérifié.",
      alternative: "Si l'appli ne trouve pas de voiture : bon de taxi à prix fixe au kiosque du hall des arrivées (payable en dinars). Le bus 72 (gratuit) va vers Zeleni venac et ne passe pas par Piramida : non recommandé avec les bagages et Maestro à l'horaire réduit.",
      sources: ["appsavvy_yandex", "ats_beg", "eaa_transport"]
    },
    {
      id: "L2", day: "sat", time: "14:45", from: "maestro", to: "hotel", mode: "taxi",
      duration: "15–25 min", distance: "≈ 6 km à vol d'oiseau, pont sur la Save", price: "≈ 1 000–1 500 RSD (estimation à partir du tarif compteur ≈ 320 RSD + 105 RSD/km)", status: "estime",
      instructions: "Commandez un Yandex Go depuis l'entrée principale de TC Piramida, rue Jurija Gagarina. Vérifiez la plaque indiquée dans l'appli avant de monter.",
      alternative: "CarGo, ou taxi appelé par le magasin. Si les retouches ne sont pas prêtes, voir Plans B.",
      sources: ["eaa_transport", "bento"]
    },
    {
      id: "L3", day: "sat", time: "15:30", from: "hotel", to: "kalemegdan", mode: "walk",
      duration: "25 min", distance: "≈ 1,9 km", price: "Gratuit", status: "estime",
      instructions: "Hôtel → Terazije → place de la République → toute la rue Knez Mihailova → entrée du parc → belvédère du Pobednik.",
      alternative: "Taxi jusqu'à l'entrée de Kalemegdan (≈ 8 min) s'il pleut.",
      sources: []
    },
    {
      id: "L4", day: "sat", time: "16:45", from: "kalemegdan", to: "znak", mode: "walk",
      duration: "12 min", distance: "≈ 0,9 km", price: "Gratuit", status: "estime",
      instructions: "Sortie sud du parc → rue Pariska → Kosančićev venac → Kralja Petra 6 (face à la cathédrale).",
      alternative: "—",
      sources: []
    },
    {
      id: "L5", day: "sat", time: "18:05", from: "znak", to: "lilly", mode: "walk",
      duration: "4 min", distance: "≈ 0,3 km", price: "Gratuit", status: "estime",
      instructions: "Remontez Kralja Petra jusqu'à Knez Mihailova, puis à droite jusqu'au n° 47.",
      alternative: "—", sources: []
    },
    {
      id: "L6", day: "sat", time: "18:50", from: "lilly", to: "design", mode: "walk",
      duration: "10 min", distance: "≈ 0,8 km", price: "Gratuit", status: "estime",
      instructions: "Knez Mihailova → place de la République → Terazije ; le passage Čumićevo sokače s'ouvre à côté.",
      alternative: "—", sources: []
    },
    {
      id: "L7", day: "sat", time: "19:40", from: "hotel", to: "pavilion", mode: "walk",
      duration: "18–20 min", distance: "≈ 1,4 km", price: "Gratuit", status: "estime",
      instructions: "Hôtel → place de la République → Vasina ou Dositejeva → Skadarlija → Dobračina 39.",
      alternative: "Yandex Go (≈ 6 min, ≈ 500–700 RSD estimés) s'il pleut.",
      sources: []
    },
    {
      id: "L8", day: "sat", time: "21:45", from: "pavilion", to: "hotel", mode: "walk",
      duration: "20 min", distance: "≈ 1,4 km", price: "Gratuit", status: "estime",
      instructions: "Même chemin en sens inverse, par les rues éclairées (Skadarlija, place de la République).",
      alternative: "Yandex Go devant le Pavilion, surtout s'il fait très froid : réveil à 05:45.",
      sources: []
    },
    {
      id: "L9", day: "sun", time: "06:40", from: "hotel", to: "kalenic", mode: "taxi",
      duration: "7–10 min", distance: "≈ 2,4 km", price: "≈ 500–800 RSD (estimation)", status: "estime",
      instructions: "Yandex Go commandé à la réception après le check-out. Adresse : « Kalenić pijaca, Maksima Gorkog ».",
      alternative: "À pied, 30 min (Terazije → Kralja Milana → Slavija → Njegoševa) : il fait encore nuit (lever du soleil 06:52).",
      sources: []
    },
    {
      id: "L10", day: "sun", time: "08:40", from: "kalenic", to: "sava", mode: "walk",
      duration: "9 min", distance: "≈ 0,6 km", price: "Gratuit", status: "estime",
      instructions: "Depuis le marché, rejoignez la rue Njegoševa puis le parc du Temple (le dôme est visible).",
      alternative: "Si vous êtes en retard : commandez directement le Yandex Go vers le marché aux puces depuis Kalenić.", sources: []
    },
    {
      id: "L11", day: "sun", time: "09:20", from: "sava", to: "miljakovac", mode: "taxi",
      duration: "15–20 min", distance: "≈ 5,5 km à vol d'oiseau", price: "≈ 800–1 200 RSD (estimation)", status: "estime",
      instructions: "Yandex Go depuis le parvis (rue Krušedolska). Destination : « OTC Miljakovac – Beogradski buvljak, Vareška ».",
      alternative: "CarGo. Le site est aussi desservi par le train urbain BG voz (arrêt à 150 m selon Informer), mais je n'ai pas vérifié l'horaire du dimanche.",
      sources: ["informer_buvljak"]
    },
    {
      id: "L12", day: "sun", time: "11:10", from: "miljakovac", to: "usce", mode: "taxi",
      duration: "20–25 min", distance: "≈ 7,5 km à vol d'oiseau", price: "≈ 1 000–1 400 RSD (estimation)", status: "estime",
      instructions: "Yandex Go depuis l'entrée du marché. Destination : « Ušće Shopping Center, Bulevar Mihajla Pupina 4 ».",
      alternative: "CarGo. Si le trafic est dense, l'appli affiche la durée : raccourcissez Ušće, jamais la marge de l'aéroport.",
      sources: []
    },
    {
      id: "L13", day: "sun", time: "14:45", from: "usce", to: "airport", mode: "taxi",
      duration: "20–30 min (prévoir 40 min si trafic)", distance: "≈ 10,5 km à vol d'oiseau", price: "≈ 1 300–2 000 RSD selon un guide 2026 (prix exact affiché dans Yandex Go)", status: "verifier",
      instructions: "Commandez un Yandex Go à 14:35 depuis l'entrée principale d'Ušće, côté Bulevar Mihajla Pupina (prix affiché avant validation). Vérifiez que le coffre suffit pour toutes les valises. Départ au plus tard à 15:00.",
      alternative: "CarGo, ou un taxi appelé depuis l'accueil du centre. En dernier recours, le bus 72 (gratuit) passe par Novi Beograd en direction de l'aéroport, toutes les 30 min environ selon un guide : arrêt exact à vérifier, avec départ avancé à 14:15.",
      sources: ["appsavvy_yandex", "eaa_transport", "nomadic_72", "wiki_transport"]
    }
  ],

  /* ------------------------------------------------------------------ */
  /* PLANNING                                                            */
  /* priority : imperatif | recommande | facultatif                      */
  /* dropOrder : ordre de suppression en cas de retard (1 = en premier)  */
  /* ------------------------------------------------------------------ */
  activities: [
    {
      id: "sat-arr", day: "sat", start: "11:30", end: "12:10", place: "airport", priority: "imperatif",
      title: "Arrivée à Belgrade",
      desc: "Atterrissage du Wizz Air W6 4026, contrôle des passeports (frontière hors Schengen), bagages, retrait de dinars, Yandex Go.",
      leg: null, budget: "Retrait conseillé : 10 000–15 000 RSD pour 2 (≈ 85–130 €)",
      tips: ["Passeport à portée de main.", "Distributeur dans le hall : refusez la « conversion » en euros proposée par l'automate.", "Commandez le Yandex Go vers Piramida une fois les bagages récupérés."],
      booking: null
    },
    {
      id: "sat-maestro", day: "sat", start: "12:40", end: "14:45", place: "maestro", priority: "imperatif",
      title: "Costumes chez Maestro (TC Piramida)",
      desc: "Essayages sans se presser, choix du ou des costumes, chemises et accessoires, retouches sur place. C'est la contrainte horaire du voyage : le magasin est probablement fermé le dimanche et ferme tôt le samedi (≈ 16:00 chez les voisins).",
      leg: "L1", budget: "11 800 RSD par costume (≈ 100 €)",
      tips: [
        "Dès l'arrivée, demandez l'heure de fermeture et le délai des retouches, puis lancez les retouches avant de choisir les accessoires.",
        "Si les retouches ne peuvent pas être prêtes avant la fermeture : voir Plans B (retouche en France).",
        "Grignotez à l'aéroport ou dans le centre commercial : le vrai repas est à 17:00."
      ],
      booking: "Appeler +381 11 2168 032 avant le départ pour confirmer l'horaire du samedi 28/11"
    },
    {
      id: "sat-hotel", day: "sat", start: "15:10", end: "15:30", place: "hotel", priority: "imperatif",
      title: "Check-in au Nobel Design Hotel",
      desc: "Check-in annoncé à partir de 15:00 : dépôt des bagages et des costumes.",
      leg: "L2", budget: "—",
      tips: ["Suspendez les costumes dès l'arrivée.", "Demandez à la réception où le chauffeur Yandex peut s'arrêter devant l'hôtel."],
      booking: "Confirmer par e-mail l'heure de check-in"
    },
    {
      id: "sat-kalemegdan", day: "sat", start: "15:55", end: "16:45", place: "kalemegdan", priority: "imperatif",
      title: "Kalemegdan au coucher du soleil",
      desc: "Traversée de Knez Mihailova (repérage des boutiques), puis belvédère du Pobednik sur le confluent Save-Danube. Coucher du soleil ≈ 16:01, lumière bleue jusqu'à ≈ 16:33.",
      leg: "L3", budget: "Gratuit",
      tips: ["Si vous êtes en retard, allez directement au belvédère et faites le reste du parc après.", "Couvrez-vous : il fait vite froid au bord des remparts."],
      booking: null
    },
    {
      id: "sat-znak", day: "sat", start: "17:00", end: "18:05", place: "znak", priority: "recommande",
      title: "Repas tardif à la kafana « ? »",
      desc: "Cuisine serbe dans la plus ancienne kafana de la ville, par Kosančićev venac. Repas léger pour garder de l'appétit pour 20:00.",
      leg: "L4", budget: "≈ 2 000–3 000 RSD/pers. (estimation)",
      tips: ["Šopska salata, ajvar, kajmak, fromage pané.", "⚠ Vérifiez la composition des plats traditionnels (voir fiche)."],
      booking: null, dropOrder: 3
    },
    {
      id: "sat-shopping", day: "sat", start: "18:10", end: "19:15", place: "lilly", priority: "recommande",
      title: "Shopping : Lilly, supermarché et Design District",
      desc: "Droguerie Lilly (ouverte jusqu'à 22:00), puis le supermarché le plus proche (Maxi, IDEA ou Univerexport) pour les snacks serbes, puis le Design District si ouvert. Snacks : c'est le bon moment, car les horaires du dimanche ne sont pas vérifiés.",
      leg: "L5", budget: "Snacks 2 000–4 000 RSD ; droguerie 1 000–3 000 RSD (estimations)",
      tips: ["Cochez la liste d'achats dans l'onglet Achats.", "Repassez à l'hôtel déposer les sacs à 19:15."],
      booking: null, dropOrder: 2
    },
    {
      id: "sat-dinner", day: "sat", start: "20:00", end: "21:45", place: "pavilion", priority: "imperatif",
      title: "Dîner au Pavilion — Dobračina 39",
      desc: "Dîner au restaurant du boutique-hôtel Pavilion, après une marche par la place de la République et Skadarlija.",
      leg: "L7", budget: "≈ 4 000–6 000 RSD/pers. (non vérifié)",
      tips: ["L'annuaire indique une fermeture à 22:00 : ne pas arriver après 20:00.", "Demandez les plats de poisson ou sans viande."],
      booking: "Réserver pour 20:00 au +381 69 369 6369"
    },
    {
      id: "sat-back", day: "sat", start: "21:45", end: "22:10", place: "hotel", priority: "recommande",
      title: "Retour à l'hôtel",
      desc: "Retour à pied ou en taxi. Bouclez les valises, préparez les sacs pour le marché et réglez le réveil à 05:45 (buffet dès 06:00).",
      leg: "L8", budget: "—", tips: ["Sac cabas et espèces pour Kalenić."], booking: null
    },
    {
      id: "sun-breakfast", day: "sun", start: "06:00", end: "06:25", place: "hotel", priority: "recommande",
      title: "Petit-déjeuner buffet à l'hôtel",
      desc: "Buffet du Nobel Design Hotel, servi de 06:00 à 10:30 : nous y sommes dès l'ouverture. C'est le dernier vrai repas avant l'avion (pas de déjeuner assis) : mangez bien.",
      leg: null, budget: "Selon votre réservation (inclus ou non : à vérifier)",
      tips: ["Réveil à 05:45, valises bouclées la veille au soir.", "Pour vous au buffet : œufs, fromages, yaourts, pains, poisson fumé s'il y en a ; évitez la charcuterie."],
      booking: null
    },
    {
      id: "sun-checkout", day: "sun", start: "06:25", end: "06:40", place: "hotel", priority: "imperatif",
      title: "Check-out définitif, départ avec les bagages",
      desc: "Check-out définitif : nous partons avec tous nos bagages et ne revenons pas à l'hôtel. Les valises nous suivent toute la journée, jusqu'à l'aéroport.",
      leg: null, budget: "—",
      tips: ["Valises fermées, passeports et chargeur à portée de main, un sac cabas vide pour les achats.", "Costumes dans la housse, en haut de la valise ou à la main.", "Demandez une voiture avec un coffre assez grand en commandant le Yandex Go."],
      booking: null
    },
    {
      id: "sun-kalenic", day: "sun", start: "06:50", end: "08:40", place: "kalenic", priority: "imperatif",
      title: "Marché de Kalenić",
      desc: "Arrivée vers le lever du soleil (06:52), quand les vendeurs s'installent. Tour complet : halle et étals de fromages et kajmak (dégustation), fruits et légumes d'hiver, conserves (ajvar, turšija), miel, puis la périphérie pour les éventuels stands d'occasion. Les boulangeries autour du marché permettent de goûter un burek si l'envie vous prend.",
      leg: "L9", budget: "1 500–4 000 RSD (estimation)",
      tips: [
        "Ordre conseillé : 1) produits laitiers (dégustation) ; 2) conserves et ajvar en bocaux fermés ; 3) miel et fruits secs ; 4) périphérie et artisanat.",
        "Espèces en petites coupures ; les vendeurs proposent souvent de goûter.",
        "Fromage et kajmak : à consommer sur place, interdits à l'importation dans l'UE.",
        "Vous portez valises et achats jusqu'à l'aéroport : l'un de vous garde les bagages pendant que l'autre parcourt les allées. Bocaux et achats lourds en fin de visite.",
        "⚠ Burek : la garniture « sir » est du fromage, mais la pâte peut contenir du saindoux. Demandez « bez masti? »."
      ],
      booking: null
    },
    {
      id: "sun-sava", day: "sun", start: "08:50", end: "09:20", place: "sava", priority: "facultatif",
      title: "Temple de Saint-Sava (visite courte)",
      desc: "Extérieur et parvis, puis la nef avec la mosaïque du Pantocrator à tour de rôle (l'un garde les valises dehors). Le dimanche matin a lieu la liturgie : attitude discrète.",
      leg: "L10", budget: "Gratuit",
      tips: ["Épaules et genoux couverts.", "En cas de retard, sautez cette étape."],
      booking: null, dropOrder: 1
    },
    {
      id: "sun-buvljak", day: "sun", start: "09:40", end: "11:10", place: "miljakovac", priority: "imperatif",
      title: "Marché aux puces de Belgrade (Beogradski buvljak)",
      desc: "Le marché aux puces officiel de la ville, à Miljakovac : objets, vêtements, outils, curiosités. Flânez, comparez, négociez.",
      leg: "L11", budget: "1 000–5 000 RSD (estimation)",
      tips: ["Espèces et négociation.", "Gardez les valises devant vous dans la foule.", "Pensez à la place restante dans les valises.", "Commandez le Yandex Go pour Ušće à 11:05."],
      booking: null
    },
    {
      id: "sun-usce", day: "sun", start: "11:35", end: "14:40", place: "usce", priority: "imperatif",
      title: "Ušće Shopping Center (avec un en-cas sur place)",
      desc: "Shopping à Novi Beograd, sans repas assis : un en-cas dans le centre. Si le temps le permet, sortez quelques minutes dans le parc d'Ušće pour la vue sur Kalemegdan.",
      leg: "L12", budget: "En-cas ≈ 800–1 500 RSD/pers. (estimation) + achats",
      tips: ["Consultez d'abord le plan du centre pour cibler les marques serbes et régionales.", "Avant de partir : bocaux bien emballés en soute, liquides hors du bagage cabine.", "Commandez le Yandex Go pour l'aéroport à 14:35."],
      booking: null
    },
    {
      id: "sun-airport", day: "sun", start: "14:45", end: "15:20", place: "airport", priority: "imperatif",
      title: "Départ pour l'aéroport",
      desc: "Yandex Go directement d'Ušće vers l'aéroport Nikola Tesla. Départ au plus tard à 15:00. Vol Air Serbia JU 252 à 17:40, arrivée à Nice à 19:45.",
      leg: "L13", budget: "≈ 1 300–2 000 RSD (selon un guide 2026)",
      tips: ["Dépensez ou changez vos derniers dinars avant le contrôle.", "Le contrôle des passeports à la sortie peut prendre du temps."],
      booking: "Yandex Go commandé à 14:35 depuis Ušće (sinon CarGo)"
    }
  ],

  /* ------------------------------------------------------------------ */
  /* SHOPPING : catégories → lieux ou enseignes                          */
  /* ------------------------------------------------------------------ */
  shopCategories: [
    {
      id: "costumes", name: "Costumes et vêtements", icon: "suit",
      items: [
        { place: "maestro", products: "Costumes de marque Maestro (prix unique 11 800 RSD), chemises, chaussures, ceintures, cravates", why: "Fabricant serbe, toutes les tailles et coupes annoncées, retouches sur place", proximity: "Étape dédiée, en route entre l'aéroport et l'hôtel" }
      ]
    },
    {
      id: "droguerie", name: "Drogueries et cosmétiques", icon: "drop",
      items: [
        { place: "lilly", products: "Soins de marques locales, hygiène, petits formats de voyage", why: "Chaîne serbe ouverte tous les jours jusqu'à 22:00 (annuaire)", proximity: "Sur Knez Mihailova, samedi 18:05 et dimanche" },
        { name: "dm drogerie", mapsQuery: "dm drogerie Beograd centar", products: "Droguerie allemande très présente en Serbie : intérêt limité par rapport à la France", why: "Seulement si Lilly n'a pas un produit", proximity: "Succursales du centre non vérifiées", status: "verifier" }
      ]
    },
    {
      id: "supermarches", name: "Supermarchés", icon: "cart",
      items: [
        { name: "Maxi", mapsQuery: "Maxi supermarket Stari Grad Beograd", products: "Snacks serbes, ajvar, épices, boissons", why: "Grande chaîne de supermarchés en Serbie", proximity: "Magasin le plus proche à localiser avec le lien carte ; horaires du dimanche non vérifiés", status: "verifier" },
        { name: "IDEA", mapsQuery: "IDEA market Stari Grad Beograd", products: "Même rayonnage local", why: "Alternative si Maxi n'est pas sur le chemin", proximity: "À localiser ; horaires non vérifiés", status: "verifier" },
        { name: "Univerexport", mapsQuery: "Univerexport Beograd centar", products: "Chaîne serbe ; bon rayon de produits régionaux", why: "Une source de 2024-2025 indique une fermeture à 18:00 les jours fériés pour la plupart des magasins", proximity: "À localiser", status: "verifier" }
      ]
    },
    {
      id: "snacks", name: "Snacks et confiseries", icon: "candy",
      items: [
        { name: "Rayon confiserie d'un supermarché", products: "Plazma, Smoki, Eurocrem, Najlepše želje, Bananica, Jaffa…", why: "Les vraies madeleines de Proust serbes, introuvables en France", proximity: "Samedi soir, supermarché près de Knez Mihailova", status: "estime" }
      ]
    },
    {
      id: "centres", name: "Centres commerciaux", icon: "store",
      items: [
        { place: "usce", products: "Mode, beauté, électronique, maison, sport ; restaurants", why: "Demandé ; plus de 150 boutiques, ouvert le dimanche", proximity: "Dimanche 11:35–14:40, puis départ direct pour l'aéroport" }
      ]
    },
    {
      id: "electronique", name: "Électronique et gadgets", icon: "plug",
      items: [
        { place: "gigatron", products: "Électronique grand public", why: "Aucun avantage de prix démontré par rapport à la France : pas de détour conseillé", proximity: "Hors itinéraire" }
      ]
    },
    {
      id: "souvenirs", name: "Souvenirs et artisanat", icon: "gift",
      items: [
        { place: "design", products: "Bijoux, céramique, mode et déco de créateurs serbes", why: "Souvenirs originaux, pièces uniques", proximity: "À 5 min de l'hôtel" },
        { place: "kalenic", products: "Artisanat, miel, conserves maison", why: "Achat direct au producteur", proximity: "Dimanche matin" }
      ]
    },
    {
      id: "vintage", name: "Brocante et vintage", icon: "clock",
      items: [
        { place: "kalenic", products: "Stands d'occasion signalés en périphérie du marché", why: "Présence le 29/11 non confirmée", proximity: "Dimanche matin" },
        { place: "miljakovac", products: "Le marché aux puces officiel : objets, vêtements, outils, curiosités", why: "Ouvert le dimanche dès 08:00 (source officielle)", proximity: "Dimanche 09:40–11:10" }
      ]
    },
    {
      id: "marches", name: "Marchés", icon: "basket",
      items: [
        { place: "kalenic", products: "Fromages, kajmak, ajvar, miel, fruits, légumes", why: "Le marché emblématique des habitants", proximity: "Dimanche 06:50" },
        { place: "zelenivenac", products: "Fruits, légumes, produits frais", why: "Facultatif, à côté de l'hôtel", proximity: "6 min de l'hôtel" }
      ]
    }
  ],

  /* ------------------------------------------------------------------ */
  /* LISTE D'ACHATS (pré-remplie ; d'autres produits s'ajoutent dans le site) */
  /* bag : cabine | soute | sur-place                                     */
  /* ------------------------------------------------------------------ */
  products: [
    { id: "p-costume", name: "Costume Maestro", cat: "Maestro", price: "11 800 RSD", priceStatus: "confirme", where: "maestro", worth: "Oui : priorité du voyage", fragile: "Encombrant : housse à costume", bag: "cabine", note: "Portez-en un dans l'avion ou utilisez une housse. Vérifiez la franchise de 430 €/personne." },
    { id: "p-taille", name: "Tailles et coupes à essayer (slim / classique)", cat: "Maestro", price: null, priceStatus: null, where: "maestro", worth: "—", fragile: "—", bag: "—", note: "Notez vos tailles dans le champ quantité ou en commentaire." },
    { id: "p-chemise", name: "Chemises", cat: "Maestro", price: null, priceStatus: "verifier", where: "maestro", worth: "Si la qualité convient", fragile: "Non", bag: "soute", note: "Prix non publiés." },
    { id: "p-chaussures", name: "Chaussures", cat: "Maestro", price: null, priceStatus: "verifier", where: "maestro", worth: "À voir sur place", fragile: "Encombrant", bag: "soute", note: "" },
    { id: "p-ceinture", name: "Ceinture", cat: "Maestro", price: null, priceStatus: "verifier", where: "maestro", worth: "À voir", fragile: "Non", bag: "soute", note: "" },
    { id: "p-cravate", name: "Cravate", cat: "Maestro", price: null, priceStatus: "verifier", where: "maestro", worth: "À voir", fragile: "Non", bag: "cabine", note: "" },
    { id: "p-gilet", name: "Gilet (éventuel)", cat: "Maestro", price: null, priceStatus: "verifier", where: "maestro", worth: "À voir", fragile: "Non", bag: "cabine", note: "" },
    { id: "p-retouches", name: "Retouches demandées (manches, ourlets)", cat: "Maestro", price: null, priceStatus: "verifier", where: "maestro", worth: "Indispensable", fragile: "—", bag: "—", note: "Faites-les noter sur le ticket avec l'heure de retrait." },
    { id: "p-facture", name: "Facture + conditions de retour", cat: "Maestro", price: null, priceStatus: null, where: "maestro", worth: "Indispensable", fragile: "—", bag: "cabine", note: "Utile pour la douane en cas de contrôle." },

    { id: "p-ajvar", name: "Ajvar (bocal fermé)", cat: "Marché", price: null, priceStatus: "verifier", where: "kalenic", worth: "Oui : spécialité de poivrons, végétale", fragile: "Verre : fragile", bag: "soute", note: "Pâte à tartiner, donc soumise à la règle des 100 ml en cabine. Les marques de supermarché sont une alternative." },
    { id: "p-sir", name: "Fromage (sir) et kajmak", cat: "Marché", price: null, priceStatus: "verifier", where: "kalenic", worth: "À déguster sur place seulement", fragile: "Périssable", bag: "sur-place", note: "Importation de produits laitiers dans l'UE interdite pour les voyageurs (règlement 2019/2122)." },
    { id: "p-miel", name: "Miel", cat: "Marché", price: null, priceStatus: "verifier", where: "kalenic", worth: "Possible", fragile: "Verre : fragile", bag: "soute", note: "Je ne peux pas confirmer la limite applicable au miel : vérifiez la page « personal imports » de la Commission avant d'acheter." },
    { id: "p-tursija", name: "Turšija (légumes au vinaigre)", cat: "Marché", price: null, priceStatus: "verifier", where: "kalenic", worth: "Oui si bocal bien fermé", fragile: "Verre, liquide", bag: "soute", note: "" },
    { id: "p-vintage", name: "Objet vintage ou artisanal", cat: "Marché", price: null, priceStatus: null, where: "kalenic", worth: "Si coup de cœur", fragile: "Selon l'objet", bag: "cabine", note: "Présence des stands d'occasion non confirmée." },

    { id: "p-plazma", name: "Plazma (biscuits, Bambi)", cat: "Supermarché", price: null, priceStatus: "verifier", where: "supermarche", worth: "Oui : biscuit emblématique serbe depuis 1967", fragile: "Se brise", bag: "cabine", note: "Biscuits : exemptés de contrôle sanitaire dans les bagages (moins de 20 % de produits laitiers et d'œufs transformés)." },
    { id: "p-smoki", name: "Smoki (soufflés à la cacahuète)", cat: "Supermarché", price: null, priceStatus: "verifier", where: "supermarche", worth: "Oui : snack culte", fragile: "Volumineux", bag: "soute", note: "Fabricant à vérifier sur l'emballage." },
    { id: "p-eurocrem", name: "Eurocrem (pâte à tartiner bicolore, Takovo)", cat: "Supermarché", price: null, priceStatus: "verifier", where: "supermarche", worth: "Oui : fabriquée à Gornji Milanovac", fragile: "Pot", bag: "soute", note: "Pâte à tartiner : soumise aux 100 ml en cabine. Certaines pâtes au cacao sont exemptées depuis 2023 : vérifiez la teneur en lait." },
    { id: "p-zelje", name: "Najlepše želje (chocolat)", cat: "Supermarché", price: null, priceStatus: "verifier", where: "supermarche", worth: "Oui", fragile: "Chaleur", bag: "cabine", note: "Origine serbe à vérifier sur l'emballage." },
    { id: "p-bananica", name: "Bananica / « Bananko »", cat: "Supermarché", price: null, priceStatus: "verifier", where: "supermarche", worth: "Oui pour Bananica", fragile: "Fragile", bag: "cabine", note: "Bananica : née en 1938 à l'usine Roda, ancêtre de Štark. Je ne peux pas confirmer la marque « Bananko »." },
    { id: "p-medeno", name: "Medeno srce (cœur en pain d'épices)", cat: "Supermarché", price: null, priceStatus: "verifier", where: "supermarche", worth: "Souvenir sucré", fragile: "Fragile", bag: "cabine", note: "Je ne peux pas confirmer le fabricant ni l'origine." },
    { id: "p-jaffa", name: "Jaffa (biscuits à l'orange)", cat: "Supermarché", price: null, priceStatus: "verifier", where: "supermarche", worth: "Oui", fragile: "Se brise", bag: "cabine", note: "Origine (Crvenka, Serbie) non vérifiée ici : regardez l'emballage." },
    { id: "p-gaufrettes", name: "Gaufrettes balkaniques", cat: "Supermarché", price: null, priceStatus: "verifier", where: "supermarche", worth: "Oui", fragile: "Se brise", bag: "cabine", note: "Vérifiez l'origine : beaucoup de marques en rayon sont croates ou slovènes." },
    { id: "p-sale", name: "Snacks salés locaux", cat: "Supermarché", price: null, priceStatus: "verifier", where: "supermarche", worth: "À tester", fragile: "Volumineux", bag: "soute", note: "" },
    { id: "p-boissons", name: "Boissons régionales", cat: "Supermarché", price: null, priceStatus: "verifier", where: "supermarche", worth: "À boire sur place", fragile: "Lourd", bag: "sur-place", note: "Liquides > 100 ml interdits en cabine." },

    { id: "p-design", name: "Cadeau de créateur (Design District)", cat: "Souvenirs", price: null, priceStatus: "verifier", where: "design", worth: "Oui", fragile: "Selon l'objet", bag: "cabine", note: "" },
    { id: "p-artisanat", name: "Objet artisanal", cat: "Souvenirs", price: null, priceStatus: "verifier", where: "kalenic", worth: "Oui", fragile: "Selon l'objet", bag: "cabine", note: "" },
    { id: "p-gadget", name: "Petit gadget ou accessoire électronique", cat: "Souvenirs", price: null, priceStatus: "verifier", where: "gigatron", worth: "Pas d'avantage de prix démontré", fragile: "—", bag: "cabine", note: "Batteries externes : en cabine uniquement." }
  ],

  /* ------------------------------------------------------------------ */
  /* BUDGET — montants pour 2 personnes, en RSD (estimations modifiables) */
  /* ------------------------------------------------------------------ */
  budget: {
    note: "Montants estimés pour 2 personnes, hors vols et hôtel. Seul le prix d'un costume Maestro (11 800 RSD) provient d'une source officielle ; tout le reste est une estimation. Aucun montant n'est un tarif imposé.",
    categories: [
      { id: "transports", name: "Transports", essential: true, scenarios: { eco: 7000, confort: 9000, genereux: 11000 }, basis: "6 courses Yandex Go : aéroport ×2 (≈ 1 300–2 000), Piramida → hôtel, hôtel → Kalenić, marché aux puces, Ušće" },
      { id: "repas", name: "Repas", essential: true, scenarios: { eco: 10000, confort: 16000, genereux: 22000 }, basis: "Kafana « ? », Pavilion, en-cas à Ušće (petit-déjeuner à l'hôtel selon la réservation)" },
      { id: "cafes", name: "Cafés", essential: false, scenarios: { eco: 1500, confort: 3000, genereux: 5000 }, basis: "≈ 300–500 RSD le café (estimation)" },
      { id: "visites", name: "Visites", essential: false, scenarios: { eco: 0, confort: 0, genereux: 2400 }, basis: "Sites gratuits ; option visite guidée de Saint-Sava 10 €/pers." },
      { id: "snacks", name: "Snacks", essential: false, scenarios: { eco: 2000, confort: 4000, genereux: 7000 }, basis: "Achats en supermarché et au marché" },
      { id: "souvenirs", name: "Souvenirs", essential: false, scenarios: { eco: 3000, confort: 8000, genereux: 15000 }, basis: "Design District, artisanat, droguerie" },
      { id: "costumes", name: "Vêtements et costumes", essential: false, costume: true, scenarios: { eco: 11800, confort: 23600, genereux: 47200 }, basis: "1, 2 ou 4 costumes à 11 800 RSD (accessoires non chiffrés)" },
      { id: "imprevus", name: "Imprévus", essential: true, scenarios: { eco: 3000, confort: 5000, genereux: 8000 }, basis: "Taxi supplémentaire, pharmacie, consigne…" }
    ],
    scenarios: [
      { id: "eco", name: "Économique" },
      { id: "confort", name: "Confortable" },
      { id: "genereux", name: "Shopping généreux" }
    ]
  },

  /* ------------------------------------------------------------------ */
  /* CHECKLISTS                                                          */
  /* ------------------------------------------------------------------ */
  checklists: [
    { id: "avant", name: "Avant le départ", items: [
      "Passeports valides (la Serbie est hors UE et hors Schengen)",
      "Appeler Maestro (+381 11 2168 032) : confirmer 09:00–16:00 le sam. 28/11 et des retouches prêtes avant 16:00",
      "E-mail à l'hôtel : check-in samedi, check-out dimanche à 06:25 ; petit-déjeuner inclus ?",
      "Installer Yandex Go (moyen principal), vérifier le mode de paiement proposé (carte ou espèces) ; CarGo en secours",
      "Télécharger la carte hors ligne de Belgrade dans Google Maps",
      "Ouvrir ce site une fois en ligne sur le téléphone (mise en cache) et l'ajouter à l'écran d'accueil",
      "Prévenir la banque du voyage ; vérifier les frais de paiement et de retrait hors zone euro",
      "Vérifier le forfait mobile : la Serbie n'est pas incluse dans l'itinérance UE",
      "Housse à costume et sacs zip pour les bocaux"
    ]},
    { id: "resa", name: "Réservations", items: [
      "Dîner au Pavilion (Dobračina 39) sam. 20:00, au +381 69 369 6369",
      "Yandex Go dim. 14:35 d'Ušće vers l'aéroport (plan B : CarGo)",
      "Check-in en ligne Wizz Air (aller)",
      "Check-in en ligne Air Serbia (retour)"
    ]},
    { id: "docs", name: "Documents et infos", items: [
      "Cartes d'embarquement dans le téléphone et en capture d'écran",
      "Adresse de l'hôtel en écriture locale : Balkanska 18",
      "Assurance voyage ou carte bancaire avec assistance (la carte européenne d'assurance maladie ne couvre pas la Serbie)",
      "Numéros d'urgence notés (page Plans B)"
    ]},
    { id: "maestro", name: "Achats chez Maestro", items: [
      "Essayer 2 coupes (slim et classique)",
      "Vérifier épaules, manches et longueur de pantalon avec les chaussures",
      "Retouches lancées avec l'heure de retrait notée",
      "Chemise(s)", "Ceinture", "Cravate", "Chaussures (si intéressantes)",
      "Facture et conditions d'échange"
    ]},
    { id: "alim", name: "Achats alimentaires", items: [
      "Ajvar (bocal scellé, en soute)",
      "Biscuits et snacks serbes (voir onglet Achats)",
      "Goûter kajmak et fromage sur place, ne pas les rapporter",
      "Bocaux emballés dans des vêtements et des sacs zip"
    ]},
    { id: "souv", name: "Souvenirs", items: [
      "Cadeau de créateur (Design District)",
      "Objet artisanal ou vintage (Kalenić)",
      "Petits cadeaux en droguerie (Lilly)"
    ]},
    { id: "final", name: "Avant l'aéroport", items: [
      "Liquides et pâtes à tartiner > 100 ml en soute",
      "Costumes dans la housse, en cabine",
      "Poids des bagages contrôlé",
      "Rien oublié dans la chambre ni à la consigne",
      "Départ d'Ušće pour l'aéroport à 14:45 au plus tard",
      "Derniers dinars dépensés",
      "Départ de l'hôtel au plus tard à 15:00"
    ]}
  ],

  /* ------------------------------------------------------------------ */
  /* PLANS B                                                             */
  /* ------------------------------------------------------------------ */
  planB: [
    { id: "b-flight", title: "Retard d'avion (45–60 min)", icon: "plane",
      action: "Allez directement de l'aéroport à Maestro en Yandex Go, appelez le magasin pendant le trajet (+381 11 2168 032) et lancez les retouches dès l'arrivée.",
      keep: "Maestro, check-in, Pavilion à 20:00.",
      drop: "1) Repas à la kafana « ? » (remplacé par un en-cas) ; 2) shopping du samedi soir, reporté au dimanche ; 3) Kalemegdan raccourci (belvédère seulement, même de nuit)." },
    { id: "b-maestro-shop", title: "Maestro fermé ou introuvable", icon: "store",
      action: "Locaux 16, 17 et 30 du TC Piramida (aussi indiqué au 153a). Demandez « Maestro odela » à l'accueil ou appelez. S'il est fermé : le même immeuble abrite d'autres boutiques de costumes (Moje odelo, Loensee), selon les annuaires.",
      keep: "L'objectif costume.", drop: "Kalemegdan raccourci au belvédère, même de nuit ; le dimanche, la vue sur la forteresse depuis le parc d'Ušće compense." },
    { id: "b-retouche", title: "Retouches impossibles à temps", icon: "scissors",
      action: "Le magasin est probablement fermé dimanche : achetez sans retouche si la taille convient, et faites faire ourlets et manches par un retoucheur en France (gardez la facture). Pour une petite retouche, demandez si elle peut être prête avant la fermeture.",
      keep: "L'achat.", drop: "Retarder le départ du magasin, quitte à arriver à Kalemegdan à la nuit (vue nocturne, toujours belle)." },
    { id: "b-weather", title: "Pluie ou grand froid", icon: "rain",
      action: "Yandex Go pour les trajets à pied de plus de 15 min. Kalemegdan raccourci au belvédère. Davantage de temps à l'intérieur : kafana, Lilly, Design District, et l'intérieur de Saint-Sava.",
      keep: "Kalenić, le marché aux puces (une partie des étals est couverte) et Ušće (intérieur).", drop: "Saint-Sava, puis la promenade dans le parc d'Ušće." },
    { id: "b-flea", title: "Marché aux puces décevant, fermé ou en retard", icon: "clock",
      action: "S'il est fermé (jour férié imprévu) ou décevant : allez directement à Ušće, qui ouvre à 10:00. Les stands d'occasion de Kalenić sont l'autre chance de brocante. Le marché informel de Zemun (dimanche tôt, ≈ 06:00–10:00 selon un guide) n'est pas compatible avec Kalenić.",
      keep: "Kalenić, Ušće et la marge de l'aéroport.", drop: "Saint-Sava, puis du temps au marché aux puces." },
    { id: "b-restaurant", title: "Restaurant complet ou fermé", icon: "fork",
      action: "Samedi : Tri šešira (Skadarska 29, à 300 m, ouvert jusqu'à 22:30 selon Wolt), ou les autres kafanas de Skadarlija. Dimanche : pas de repas assis prévu ; en-cas à Ušće.",
      keep: "Un vrai repas serbe.", drop: "—" },
    { id: "b-museum", title: "Saint-Sava inaccessible (office, événement)", icon: "church",
      action: "Admirez l'extérieur et le parvis, puis partez plus tôt au marché aux puces. La crypte n'est pas garantie le dimanche.",
      keep: "Le marché.", drop: "La visite intérieure." },
    { id: "b-app", title: "Appli de transport en panne", icon: "phone",
      action: "Si Yandex Go ne trouve pas de voiture ou ne fonctionne pas : CarGo. Sinon faites appeler un taxi par l'hôtel ou le restaurant. À l'aéroport : le kiosque des bons de taxi. Transports publics gratuits depuis le 01/01/2025 ; bus 72 vers l'aéroport depuis Zeleni venac. N'utilisez pas Uber : il ne fonctionne pas en Serbie.",
      keep: "La marge de l'aéroport.", drop: "—" },
    { id: "b-traffic", title: "Trafic important vers l'aéroport", icon: "car",
      action: "Commandez le Yandex Go pour l'aéroport à 14:15 au lieu de 14:35 (l'appli indique la durée avec le trafic). Départ d'Ušće à 15:00 au plus tard dans tous les cas.",
      keep: "Le vol.", drop: "Derniers achats, puis café." },
    { id: "b-bags", title: "Trop d'achats pour les bagages", icon: "bag",
      action: "Achetez un sac pliable ou une valise bon marché (Ušće ou le marché aux puces). Vérifiez les franchises bagages de l'Air Serbia JU 252. Payez un bagage en soute en ligne avant 14:00 (moins cher qu'au comptoir, en général). Liquides et bocaux en soute. Comme vous portez les valises toute la journée, limitez les achats lourds avant Ušće.",
      keep: "Costumes en cabine.", drop: "Snacks volumineux (Smoki) : à manger sur place !" }
  ],

  emergency: [
    { label: "Police", number: "192", status: "confirme", sources: ["emerg_ca"] },
    { label: "Pompiers", number: "193", status: "confirme", sources: ["emerg_ca"] },
    { label: "Ambulance (SAMU)", number: "194", status: "confirme", sources: ["emerg_ca"] },
    { label: "Numéro européen 112", number: "112", status: "verifier", note: "Son déploiement complet en Serbie n'est pas confirmé : utilisez de préférence 192, 193 ou 194.", sources: ["n1_112"] },
    { label: "Ambassade de France (standard)", number: "+381 11 302 35 00", status: "verifier", note: "Pariska 11, Belgrade. Numéro trouvé dans des annuaires, à confirmer sur le site officiel de l'ambassade.", sources: ["ambfr_dir", "ambfr"] },
    { label: "Marchés municipaux (Beogradske pijace)", number: "+381 11 7857 940", status: "confirme", sources: ["bgpijace"] },
    { label: "Maestro (costumes)", number: "+381 11 2168 032", status: "confirme", sources: ["maestro_kontakt"] }
  ],

  customs: [
    { title: "Produits laitiers et viande : interdits", text: "Les voyageurs venant d'un pays hors UE comme la Serbie ne peuvent pas rapporter de viande, de lait ni de produits laitiers (fromage, kajmak) dans leurs bagages, sauf quelques exceptions (aliments pour bébé ou médicaux).", status: "confirme", sources: ["eu_personal", "zoll"] },
    { title: "Biscuits, chocolats, confiseries : en général autorisés", text: "Les produits composites de longue conservation sont exemptés : biscuits et gaufrettes (moins de 20 % de produits laitiers et d'œufs transformés), chocolat et confiserie. Un règlement de 2023 a ajouté les crackers et certaines pâtes à tartiner au cacao. Lisez les étiquettes.", status: "verifier", sources: ["composite"] },
    { title: "Liquides en cabine (sûreté aérienne)", text: "Règle distincte de la douane : les liquides, gels et pâtes (ajvar, Eurocrem, miel) au-delà de 100 ml voyagent en soute. Les règles exactes de l'aéroport de Belgrade et d'Air Serbia sont à vérifier.", status: "verifier", sources: [] },
    { title: "Franchise de valeur : 430 € par personne", text: "À l'arrivée en France par avion depuis un pays hors UE, les achats sont exonérés jusqu'à 430 € par voyageur de 15 ans ou plus. Au-delà, déclarez-les au circuit rouge et payez la TVA et les droits. Tabac et alcool ont leurs propres limites. Deux costumes à 11 800 RSD (≈ 200 €) restent sous le seuil.", status: "confirme", sources: ["douane_430"] }
  ],

  apps: [
    { name: "Yandex Go", desc: "Notre moyen principal. Très utilisée à Belgrade ; permet aussi de commander des taxis de compagnies officielles.", url: "https://go.yandex/", status: "verifier" },
    { name: "CarGo", desc: "Solution de secours. Appli serbe de VTC, l'équivalent local d'Uber.", url: "https://cargo.rs/", status: "verifier" },
    { name: "Bon de taxi de l'aéroport", desc: "Prix fixe par zone, payable en dinars au kiosque des arrivées.", url: "https://beg.aero/", status: "verifier" },
    { name: "GSP Beograd", desc: "Transports publics, gratuits depuis le 1er janvier 2025 (l'A1 reste probablement payant).", url: "https://www.gsp.co.rs/", status: "verifier" },
    { name: "Google Maps", desc: "Téléchargez la zone de Belgrade hors ligne avant le départ.", url: "https://www.google.com/maps/@44.8125,20.4612,13z", status: "confirme" }
  ],

  taxiTips: [
    "Moyen principal : Yandex Go (prix affiché avant validation). Uber ne fonctionne pas en Serbie ; CarGo en secours.",
    "À l'aéroport, utilisez uniquement le bon de taxi au prix fixe, acheté au kiosque.",
    "Le reste du temps, on marche : le centre se parcourt à pied. Sinon, faites appeler un taxi par l'hôtel ou le restaurant. Évitez les taxis hélés près des sites touristiques.",
    "Avant de monter, vérifiez la plaque et le modèle affichés dans l'appli.",
    "Dans un taxi au compteur, vérifiez que le compteur démarre. Tarif indicatif relevé : ≈ 320 RSD de prise en charge + ≈ 105 RSD/km le jour en semaine (sources divergentes)."
  ]
};

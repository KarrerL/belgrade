# Belgrade · 28–29 novembre 2026 — compagnon de voyage

Site web progressif (PWA) pour suivre le voyage sur téléphone : planning heure par heure, carte, fiches des lieux, achats, budget, transports, checklists et plans B.
Aucun compte ni serveur de données. Vos cases cochées, achats et dépenses restent **sur l'appareil**.

Déplacements : **Yandex Go** pour les 4 trajets longs (aéroport ↔ Piramida, Piramida → hôtel, hôtel → Kalenić à l'aube, hôtel → aéroport) ; **à pied** pour tout le reste. Secours : CarGo, taxi appelé par l'hôtel, bon de taxi de l'aéroport.

## Structure

```
index.html              coquille de l'application
css/app.css             design (clair/sombre, mobile d'abord)
data/trip.js            ★ TOUTES les données du voyage (planning, lieux, trajets, achats, budget, sources)
data/photo-credits.js   crédits des photos (généré)
js/store.js             état local (localStorage)
js/ui.js                composants et utilitaires (heure de Belgrade, RSD/EUR, liens Google Maps)
js/pages.js             rendu des pages
js/app.js               routeur, interactions, carte Leaflet, service worker
sw.js                   cache hors ligne
manifest.webmanifest    installation sur l'écran d'accueil
vendor/leaflet/         Leaflet 1.9.4 hébergé localement (pas de CDN)
img/                    photos Wikimedia Commons (licences libres)
tools/                  scripts : géocodage, photos, vérification des liens
```

Pas de framework ni de build : HTML, CSS et JavaScript natifs.

## Lancer en local (ordinateur)

```bash
python -m http.server 8765
```

Puis ouvrez <http://localhost:8765>. Ouvrir `index.html` en double-clic fonctionne aussi, mais **sans** le mode hors ligne : un service worker exige http(s).

## Consulter sur le téléphone

1. **Le plus simple :** publiez le site (voir plus bas) et ouvrez l'adresse https sur le téléphone.
2. **En Wi-Fi local, pour tester :** lancez `python -m http.server 8765 --bind 0.0.0.0`, puis ouvrez `http://<IP-du-PC>:8765` sur le téléphone. Le mode hors ligne ne s'active pas dans ce cas, car il faut du https.
3. **Installer comme une application :**
   - Android / Chrome : menu ⋮ → « Installer l'application » (ou « Ajouter à l'écran d'accueil »).
   - iPhone / Safari : Partager → « Sur l'écran d'accueil ».
4. **Avant de partir :** ouvrez le site une fois avec Internet et parcourez la Carte autour du centre, pour mettre les tuiles en cache. L'écran « Hors ligne & sources » doit afficher « ✓ Prêt pour le hors ligne ». Téléchargez aussi Belgrade dans Google Maps hors ligne.

## Publier en ligne (gratuit, https)

Le dossier est statique : il suffit de le publier tel quel.

- **Netlify Drop :** glissez le dossier sur <https://app.netlify.com/drop> pour obtenir immédiatement une URL https.
- **GitHub Pages :** créez un dépôt, poussez ces fichiers, puis activez Settings → Pages → branche `main`, dossier `/`.
- **Cloudflare Pages / Vercel :** projet statique, sans commande de build, dossier de sortie `/`.

Les données personnelles (budget, cases cochées) ne sont jamais envoyées au serveur d'hébergement.

## Mettre à jour un horaire ou un prix

1. Modifiez `data/trip.js` : chaque information a un `status` (`confirme`, `estime` ou `verifier`) et des `sources`.
2. Incrémentez `CACHE_VERSION` dans `sw.js` (par exemple `"v3"`), sinon les téléphones garderont l'ancienne version en cache.
3. Republiez. Le taux EUR/RSD se modifie aussi directement dans la page Budget.

Scripts utiles : `python tools/check_links.py` vérifie tous les liens ; `python tools/geocode.py` recalcule les coordonnées (OpenStreetMap).

## Fonctionnalités testées (27/10/2026, Chrome, mobile 375 px et ordinateur 1280 px, thèmes clair et sombre)

- [x] Navigation entre les 11 sections (barre du bas sur mobile, menu latéral sur ordinateur) ; aucune erreur dans la console.
- [x] Accueil : « prochaine étape », heure de départ et itinéraire calculés selon l'heure de Belgrade. Testé avec l'heure simulée sam. 15:40 : prochaine étape Kalemegdan, départ 15:30 ; horaires critiques passés grisés.
- [x] Activité marquée « terminée » sur l'accueil : état identique dans le planning, la frise et la fiche, et conservé après rechargement.
- [x] Planning : filtres Samedi / Dimanche / Programme du jour / priorité (5 activités impératives le samedi) ; 16 boutons Google Maps.
- [x] Carte Leaflet + OpenStreetMap : 20 marqueurs par catégorie ; le filtre Restaurants retire 4 marqueurs ; popup → fiche du lieu ; tracé du samedi.
- [x] Liste d'achats : case « acheté », quantité, prix payé (le saisir coche aussi « acheté »), filtre prévus/achetés, ajout et suppression d'un produit.
- [x] Budget, calculs vérifiés à la main : scénario Confortable hors costumes = 50 000 RSD ; dépense de 30 € convertie en 3 522 RSD (117,40) ; scénario Économique = 40 800 RSD ; taux saisi 120 puis retour au taux NBS ; modification d'une dépense ; exclusion ou inclusion des costumes.
- [x] Checklists cochables et décochables (compteur 1/9 → 0/9), bouton « Tout décocher ».
- [x] Recherche dans les lieux (et produits) et dans le guide des magasins.
- [x] **Hors ligne réel :** serveur arrêté puis page rechargée. Planning, cases cochées et photos s'affichent depuis le cache du service worker.
- [x] Liens externes : 58 URL testées par script ; aucune n'est morte (les quelques codes 403/429 viennent de protections anti-robots).

## Limites connues

- **Aucune vérification en temps réel** : les horaires et prix ont été recherchés le 27/10/2026. Les badges « À vérifier » signalent ce qui doit être confirmé.
- **Maestro :** l'horaire du samedi n'est publié nulle part. Seuls les commerces voisins du même centre sont indiqués 09:00/10:00–16:00, et fermés le dimanche. **Appelez le +381 11 2168 032.**
- **Dobračina 39 = Pavilion** (boutique-hôtel avec restaurant et bars) : carte, prix et dernière commande non trouvés en ligne. Fermeture à 22:00 selon un annuaire, d'où la réservation à 20:00.
- **Kalenić :** 06:00–19:00 selon deux guides ; présence de stands d'occasion le 29/11 non confirmée. Le seul vrai marché aux puces dont l'ouverture le dimanche est confirmée officiellement est Miljakovac (plan B, excentré).
- Saint-Sava (horaires, crypte), Little Bay (horaires du dimanche) et les supermarchés (adresses, horaires du dimanche) ne sont pas vérifiés. Les boutons « Trouver le plus proche » lancent une recherche Google Maps.
- Les durées à pied et les prix de taxi sont estimés. Les tracés de la carte sont des lignes droites schématiques.
- Hors ligne, le fond de carte n'affiche que les zones déjà consultées. Google Maps et les sites externes demandent Internet.
- Les données sont propres à chaque appareil : utilisez « Copier mes données » / « Importer » pour les transférer.
- Les numéros de vol (W6 4026, JU 252) sont ceux que vous avez fournis.

## Sources principales

Toutes les sources, avec leur date de consultation, sont listées dans le site (page « Hors ligne & sources ») et à côté de chaque information. Les principales :

- Maestro : <https://muska-odela-piramida.rs/> (prix 11 800 RSD, adresses, téléphone)
- Pavilion, Dobračina 39 : PlanPlus, Expedia, Great Small Hotels, OpenStreetMap
- Kalenić : In Your Pocket, PlanPlus, Culture Trip, Vreme ; Miljakovac : <https://www.bgpijace.rs/?page_id=56>
- Hôtel : Hotels.com, Kayak (check-in 15:00, check-out 12:00)
- Transports : Wikipedia (gratuité depuis le 1/1/2025), guides de conférences belgradoises 2025, Bento Travel (Uber absent)
- Taux : cours moyen NBS du 16/10/2026 = 117,40 RSD/€ (Kurir Biznis)
- Coucher du soleil : calcul astronomique NOAA, contrôlé avec timeanddate
- Douane : Commission européenne (importations personnelles), douane.gouv.fr (franchise de 430 €)
- Photos : Wikimedia Commons (auteurs et licences dans `data/photo-credits.js`)

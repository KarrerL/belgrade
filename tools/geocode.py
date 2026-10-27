"""Géocode les lieux du voyage via OpenStreetMap Nominatim (usage ponctuel, 1 requête/s).

Usage : python tools/geocode.py
Affiche lat/lon et le nom OSM trouvé, à recopier dans data/trip.js.
"""
import json
import time
import urllib.parse
import urllib.request

QUERIES = [
    "Belgrade Nikola Tesla Airport",
    "Balkanska 18, Beograd",
    "Jurija Gagarina 151a, Beograd",
    "Piramida, Novi Beograd",
    "Dobračina 39, Beograd",
    "Kalenić pijaca, Beograd",
    "Pobednik, Beograd",
    "Kneza Mihaila 47, Beograd",
    "Trg Republike, Beograd",
    "Hram Svetog Save, Beograd",
    "Kralja Petra 6, Beograd",
    "Nemanjina 32, Beograd",
    "Čumićevo sokače, Beograd",
    "Zeleni venac, Beograd",
    "Skadarska 29, Beograd",
    "Dositejeva 9a, Beograd",
    "Trg Slavija, Beograd",
    "Bajrakli džamija, Beograd",
    "Buvljak Miljakovac, Beograd",
    "Kosančićev venac, Beograd",
    "Kalemegdan, Beograd",
]

for q in QUERIES:
    url = "https://nominatim.openstreetmap.org/search?" + urllib.parse.urlencode(
        {"format": "jsonv2", "limit": 1, "q": q}
    )
    req = urllib.request.Request(url, headers={"User-Agent": "BelgradeTripCompanion/1.0 (personal use)"})
    try:
        data = json.load(urllib.request.urlopen(req, timeout=20))
        if data:
            d = data[0]
            print(f"{q} | {float(d['lat']):.5f}, {float(d['lon']):.5f} | {d['display_name'][:80]}")
        else:
            print(f"{q} | NONE")
    except Exception as e:  # noqa: BLE001
        print(f"{q} | ERROR {e}")
    time.sleep(1.1)

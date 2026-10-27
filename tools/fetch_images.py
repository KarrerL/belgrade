"""Télécharge les photos d'illustration depuis Wikipedia/Wikimedia Commons (licences libres)
et écrit les crédits dans data/photo-credits.js.

Usage : python tools/fetch_images.py
Les images sont stockées en local (img/) pour fonctionner hors ligne.
"""
import json
import time
import pathlib
import re
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
IMG = ROOT / "img"
IMG.mkdir(exist_ok=True)
UA = {"User-Agent": "BelgradeTripCompanion/1.0 (personal use)"}

# id local -> titre de l'article Wikipedia (en)
PAGES = {
    "kalemegdan": "Belgrade_Fortress",
    "knez": "Knez_Mihailova_Street",
    "republika": "Republic_Square,_Belgrade",
    "sava": "Church_of_Saint_Sava",
    "kalenic": "sr:Каленић_пијаца",
    "skadarlija": "Skadarlija",
    "dorcol": "Dorćol",
    "aeroport": "Belgrade_Nikola_Tesla_Airport",
    "bajrakli": "Bajrakli_Mosque",
    "zeleni": "Zeleni_Venac",
    "kosancic": "Kosančićev_Venac",
}


def get_json(url):
    return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30))


def strip_html(s):
    return re.sub(r"<[^>]+>", "", s or "").strip()


credits = {}
for key, title in PAGES.items():
    time.sleep(6)
    try:
        lang, _, t = title.rpartition(":") if title.startswith("sr:") else ("en", "", title)
        s = get_json(f"https://{lang}.wikipedia.org/api/rest_v1/page/summary/" + urllib.parse.quote(t))
        orig = (s.get("originalimage") or {}).get("source")
        if not orig:
            print(key, "pas d'image")
            continue
        fname = urllib.parse.unquote(orig.split("?")[0].rsplit("/", 1)[-1])
        fname = re.sub(r"^\d+px-", "", fname)
        info = get_json(
            "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo"
            "&iiprop=url|extmetadata&iiurlwidth=960&titles=" + urllib.parse.quote("File:" + fname)
        )
        page = next(iter(info["query"]["pages"].values()))
        if "imageinfo" not in page:
            print(key, "fichier non trouvé sur Commons", fname)
            continue
        ii = page["imageinfo"][0]
        meta = ii.get("extmetadata", {})
        thumb = ii.get("thumburl") or ii["url"]
        clean = thumb.split("?")[0]
        ext = ".jpg" if clean.lower().endswith((".jpg", ".jpeg")) else pathlib.Path(clean).suffix.lower()
        out = IMG / f"{key}{ext}"
        out.write_bytes(urllib.request.urlopen(urllib.request.Request(thumb, headers=UA), timeout=60).read())
        credits[key] = {
            "file": f"img/{key}{ext}",
            "author": strip_html(meta.get("Artist", {}).get("value")),
            "license": strip_html(meta.get("LicenseShortName", {}).get("value")),
            "source": ii.get("descriptionurl"),
        }
        print(key, "OK", out.name, out.stat().st_size, credits[key]["license"])
    except Exception as e:  # noqa: BLE001
        print(key, "ERREUR", e)

(ROOT / "data").mkdir(exist_ok=True)
(ROOT / "data" / "photo-credits.js").write_text(
    "/* Généré par tools/fetch_images.py — crédits des photos Wikimedia Commons */
window.PHOTO_CREDITS = "
    + json.dumps(credits, ensure_ascii=False, indent=2) + ";
",
    encoding="utf-8",
)

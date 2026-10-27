"""Vérifie que tous les liens externes cités dans data/trip.js répondent.

Usage : python tools/check_links.py
"""
import pathlib
import re
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
text = (ROOT / "data" / "trip.js").read_text(encoding="utf-8")
urls = sorted(set(re.findall(r'https?://[^"\s]+', text)))
UA = {"User-Agent": "Mozilla/5.0 (BelgradeTripCompanion link check)"}

for url in urls:
    try:
        req = urllib.request.Request(url, headers=UA)
        code = urllib.request.urlopen(req, timeout=20).status
    except urllib.error.HTTPError as e:
        code = e.code
    except Exception as e:  # noqa: BLE001
        code = type(e).__name__
    print(f"{code}\t{url}")

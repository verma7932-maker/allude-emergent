"""One-off cleanup of TEST_ data created during UI/API testing."""
import os, re, requests
from pathlib import Path
from dotenv import dotenv_values

BASE = (dotenv_values("/app/frontend/.env")["REACT_APP_BACKEND_URL"]).rstrip("/")
API = f"{BASE}/api"
c = Path("/app/memory/test_credentials.md").read_text()
email = re.search(r'(?im)^\s*[-*]\s*Email:\s*(\S+)', c).group(1)
pwd = re.search(r'(?im)^\s*[-*]\s*Password:\s*(\S+)', c).group(1)
tok = requests.post(f"{API}/auth/login", json={"email": email, "password": pwd}).json()["token"]
s = requests.Session(); s.headers["Authorization"] = f"Bearer {tok}"

for e in s.get(f"{API}/dealer-enquiries").json():
    if e["name"].startswith("TEST_"):
        print("del enquiry", e["id"], s.delete(f"{API}/dealer-enquiries/{e['id']}").status_code)
for m in s.get(f"{API}/contact-messages").json():
    if m["name"].startswith("TEST_"):
        print("del message", m["id"], s.delete(f"{API}/contact-messages/{m['id']}").status_code)
for p in s.get(f"{API}/products", params={"all": True}).json():
    if p["name"].startswith("TEST_"):
        print("del product", p["slug"], s.delete(f"{API}/products/{p['id']}").status_code)
for cat in s.get(f"{API}/categories", params={"all": True}).json():
    if cat["name"].startswith("TEST_"):
        print("del category", cat["slug"], s.delete(f"{API}/categories/{cat['id']}").status_code)
for m in s.get(f"{API}/media").json():
    if (m.get("original_filename") or "").startswith("test_"):
        print("del media", m["id"], s.delete(f"{API}/media/{m['id']}").status_code)

hp = requests.get(f"{API}/content/homepage").json()
if "hero_subtitle_test" in hp:
    hp.pop("hero_subtitle_test")
    print("cleaning homepage test key", s.put(f"{API}/content/homepage", json={"data": hp}).status_code)
print("remaining enquiries", len(s.get(f"{API}/dealer-enquiries").json()),
      "messages", len(s.get(f"{API}/contact-messages").json()),
      "products", len(s.get(f"{API}/products", params={"all": True}).json()))

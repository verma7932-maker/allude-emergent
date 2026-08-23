"""ALLUDE INDIA backend API tests (public catalogue, forms, admin CMS)."""
import os
import re
import io
import uuid
from pathlib import Path

import pytest
import requests
from dotenv import dotenv_values

frontend_env = dotenv_values("/app/frontend/.env")
base_url = os.environ.get("REACT_APP_BACKEND_URL") or frontend_env.get("REACT_APP_BACKEND_URL")
if not base_url:
    raise RuntimeError("REACT_APP_BACKEND_URL missing")
BASE = base_url.rstrip("/")
API = f"{BASE}/api"


@pytest.fixture(scope="session")
def creds():
    p = Path("/app/memory/test_credentials.md")
    c = p.read_text()
    e = re.search(r'(?im)^\s*(?:[-*]\s*)?(?:\*\*)?email(?:\*\*)?\s*:\s*`?([^`\s]+)', c)
    pw = re.search(r'(?im)^\s*(?:[-*]\s*)?(?:\*\*)?password(?:\*\*)?\s*:\s*`?(\S+)', c)
    assert e and pw, "creds missing"
    return {"email": e.group(1), "password": pw.group(1)}


@pytest.fixture(scope="session")
def token(creds):
    r = requests.post(f"{API}/auth/login", json=creds, timeout=30)
    if r.status_code != 200:
        pytest.fail(f"login failed {r.status_code}: {r.text[:300]}")
    return r.json()["token"]


@pytest.fixture(scope="session")
def admin(token):
    s = requests.Session()
    s.headers.update({"Authorization": f"Bearer {token}"})
    return s


# ---------------- Auth ----------------
class TestAuth:
    def test_login_success(self, creds):
        r = requests.post(f"{API}/auth/login", json=creds, timeout=30)
        assert r.status_code == 200, r.text
        d = r.json()
        assert isinstance(d.get("token"), str) and len(d["token"]) > 10
        assert d["user"]["email"] == creds["email"].lower()
        assert d["user"]["role"] == "admin"

    def test_login_wrong_password(self, creds):
        r = requests.post(f"{API}/auth/login", json={"email": creds["email"], "password": "wrongpass123"}, timeout=30)
        assert r.status_code == 401, r.text

    def test_me(self, admin, creds):
        r = admin.get(f"{API}/auth/me", timeout=30)
        assert r.status_code == 200
        assert r.json()["email"] == creds["email"].lower()

    def test_protected_without_token(self):
        for ep in ["/auth/me", "/dashboard/stats", "/dealer-enquiries", "/contact-messages", "/media"]:
            r = requests.get(f"{API}{ep}", timeout=30)
            assert r.status_code == 401, f"{ep} -> {r.status_code}"

    def test_bcrypt_hash_format(self):
        import subprocess
        out = subprocess.run(
            ["python", "-c",
             "import os,asyncio;from dotenv import load_dotenv;load_dotenv('/app/backend/.env');"
             "from motor.motor_asyncio import AsyncIOMotorClient;"
             "c=AsyncIOMotorClient(os.environ['MONGO_URL']);db=c[os.environ['DB_NAME']];"
             "print(asyncio.get_event_loop().run_until_complete(db.users.find_one({}))['password_hash'])"],
            capture_output=True, text=True)
        assert "$2b$" in out.stdout, out.stdout + out.stderr

    def test_brute_force_lockout(self, creds):
        """Playbook check: lockout after 5 failed attempts (informational)."""
        codes = []
        for _ in range(6):
            r = requests.post(f"{API}/auth/login", json={"email": creds["email"], "password": "bad"}, timeout=30)
            codes.append(r.status_code)
        assert 429 in codes or 423 in codes, f"No lockout implemented; codes={codes}"


# ---------------- Public catalogue ----------------
class TestPublicCatalogue:
    def test_categories(self):
        r = requests.get(f"{API}/categories", timeout=30)
        assert r.status_code == 200
        cats = r.json()
        assert len(cats) == 3, cats
        slugs = sorted(c["slug"] for c in cats)
        assert all(c["published"] for c in cats)
        assert "_id" not in cats[0]
        assert slugs == sorted(["formal-trousers", "casual-trousers", "shirts"]), slugs

    def test_category_by_slug(self):
        slug = requests.get(f"{API}/categories", timeout=30).json()[0]["slug"]
        r = requests.get(f"{API}/categories/{slug}", timeout=30)
        assert r.status_code == 200 and r.json()["slug"] == slug

    def test_category_404(self):
        assert requests.get(f"{API}/categories/nope-xyz", timeout=30).status_code == 404

    def test_products_list(self):
        r = requests.get(f"{API}/products", timeout=30)
        assert r.status_code == 200
        ps = r.json()
        assert len(ps) > 0
        assert all(p["published"] for p in ps)

    def test_products_filters(self):
        cats = requests.get(f"{API}/categories", timeout=30).json()
        for c in cats:
            r = requests.get(f"{API}/products", params={"category": c["slug"]}, timeout=30)
            assert r.status_code == 200
            assert len(r.json()) > 0, f"no products for {c['slug']}"
            assert all(p["category_slug"] == c["slug"] for p in r.json())
        r = requests.get(f"{API}/products", params={"featured": "true"}, timeout=30)
        assert r.status_code == 200 and all(p["featured"] for p in r.json())

    def test_product_by_slug_and_404(self):
        p = requests.get(f"{API}/products", timeout=30).json()[0]
        r = requests.get(f"{API}/products/{p['slug']}", timeout=30)
        assert r.status_code == 200 and r.json()["id"] == p["id"]
        assert requests.get(f"{API}/products/unknown-slug-xyz", timeout=30).status_code == 404


# ---------------- Content ----------------
class TestContent:
    KEYS = ["homepage", "about", "contact", "social", "seo"]

    def test_get_content_public(self):
        for k in self.KEYS:
            r = requests.get(f"{API}/content/{k}", timeout=30)
            assert r.status_code == 200, f"{k} -> {r.status_code} {r.text[:200]}"
            assert r.json()["key"] == k

    def test_put_requires_auth(self):
        r = requests.put(f"{API}/content/homepage", json={"data": {"x": 1}}, timeout=30)
        assert r.status_code == 401

    def test_put_and_persist(self, admin):
        orig = requests.get(f"{API}/content/homepage", timeout=30).json()
        payload = {k: v for k, v in orig.items() if k != "key"}
        payload["hero_subtitle_test"] = "TEST_VALUE"
        r = admin.put(f"{API}/content/homepage", json={"data": payload}, timeout=30)
        assert r.status_code == 200, r.text
        got = requests.get(f"{API}/content/homepage", timeout=30).json()
        assert got.get("hero_subtitle_test") == "TEST_VALUE"


# ---------------- Dealer enquiries ----------------
class TestDealerEnquiries:
    def test_create_and_admin_retrieve(self, admin):
        payload = {"name": "TEST_Dealer", "company": "TEST Retail", "phone": "9810000000",
                   "email": "test_dealer@example.com", "city": "Mumbai", "state": "Maharashtra",
                   "business_type": "Retailer", "business_details": "5 stores", "message": "TEST msg"}
        r = requests.post(f"{API}/dealer-enquiries", json=payload, timeout=30)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["ok"] is True and d.get("id")
        eid = d["id"]
        g = admin.get(f"{API}/dealer-enquiries/{eid}", timeout=30)
        assert g.status_code == 200
        doc = g.json()
        assert doc["name"] == "TEST_Dealer" and doc["status"] == "New" and doc["city"] == "Mumbai"

        # filters
        for params in [{"search": "TEST_Dealer"}, {"city": "mumbai"}, {"state": "maharashtra"},
                       {"business_type": "Retailer"}, {"status": "New"}]:
            lr = admin.get(f"{API}/dealer-enquiries", params=params, timeout=30)
            assert lr.status_code == 200
            assert any(x["id"] == eid for x in lr.json()), f"filter {params} missed enquiry"

        # status patch
        pr = admin.patch(f"{API}/dealer-enquiries/{eid}/status", json={"status": "Contacted"}, timeout=30)
        assert pr.status_code == 200
        assert admin.get(f"{API}/dealer-enquiries/{eid}", timeout=30).json()["status"] == "Contacted"

        # delete
        dr = admin.delete(f"{API}/dealer-enquiries/{eid}", timeout=30)
        assert dr.status_code == 200
        assert admin.get(f"{API}/dealer-enquiries/{eid}", timeout=30).status_code == 404

    def test_honeypot(self, admin):
        payload = {"name": "TEST_Bot", "phone": "1", "email": "bot@example.com", "website": "http://spam.com"}
        r = requests.post(f"{API}/dealer-enquiries", json=payload, timeout=30)
        assert r.status_code == 200 and r.json().get("ok") is True
        assert "id" not in r.json()
        lr = admin.get(f"{API}/dealer-enquiries", params={"search": "TEST_Bot"}, timeout=30)
        assert lr.json() == [], "honeypot enquiry was stored"

    def test_validation(self):
        r = requests.post(f"{API}/dealer-enquiries", json={"name": "x", "phone": "1", "email": "not-an-email"}, timeout=30)
        assert r.status_code == 422
        r2 = requests.post(f"{API}/dealer-enquiries", json={"company": "x"}, timeout=30)
        assert r2.status_code == 422


# ---------------- Contact messages ----------------
class TestContactMessages:
    def test_create_retrieve_patch_delete(self, admin):
        payload = {"name": "TEST_Contact", "email": "test_contact@example.com", "phone": "9820000000",
                   "subject": "TEST subject", "message": "TEST message body"}
        r = requests.post(f"{API}/contact-messages", json=payload, timeout=30)
        assert r.status_code == 200, r.text
        mid = r.json()["id"]
        lst = admin.get(f"{API}/contact-messages", timeout=30)
        assert lst.status_code == 200
        found = [m for m in lst.json() if m["id"] == mid]
        assert found and found[0]["subject"] == "TEST subject" and found[0]["status"] == "New"
        assert admin.patch(f"{API}/contact-messages/{mid}/status", json={"status": "Read"}, timeout=30).status_code == 200
        after = [m for m in admin.get(f"{API}/contact-messages", timeout=30).json() if m["id"] == mid]
        assert after[0]["status"] == "Read"
        assert admin.delete(f"{API}/contact-messages/{mid}", timeout=30).status_code == 200
        assert not [m for m in admin.get(f"{API}/contact-messages", timeout=30).json() if m["id"] == mid]

    def test_honeypot(self, admin):
        r = requests.post(f"{API}/contact-messages", json={"name": "TEST_SpamC", "email": "s@example.com",
                                                           "message": "spam", "website": "x"}, timeout=30)
        assert r.status_code == 200 and "id" not in r.json()
        assert not [m for m in admin.get(f"{API}/contact-messages", timeout=30).json() if m["name"] == "TEST_SpamC"]


# ---------------- Admin products CRUD ----------------
class TestProductsCRUD:
    def test_crud(self, admin):
        slug = f"test-product-{uuid.uuid4().hex[:8]}"
        payload = {"name": "TEST_Product", "slug": slug, "category_slug": "shirts", "sku": "TST-1",
                   "images": ["https://example.com/a.jpg"], "mrp": 2999, "colors": ["Black"],
                   "sizes": ["38"], "fabric": "Cotton", "fit": "Slim", "description": "TEST",
                   "features": ["f1"], "care": "wash", "featured": True, "published": True}
        r = admin.post(f"{API}/products", json=payload, timeout=30)
        assert r.status_code == 200, r.text
        p = r.json()
        pid = p["id"]
        assert p["slug"] == slug and p["mrp"] == 2999

        g = requests.get(f"{API}/products/{slug}", timeout=30)
        assert g.status_code == 200 and g.json()["name"] == "TEST_Product"

        dup = admin.post(f"{API}/products", json=payload, timeout=30)
        assert dup.status_code == 400, f"duplicate slug allowed: {dup.status_code}"

        u = admin.put(f"{API}/products/{pid}", json={"name": "TEST_Product_Updated", "fit": "Regular"}, timeout=30)
        assert u.status_code == 200, u.text
        assert u.json()["name"] == "TEST_Product_Updated"
        assert requests.get(f"{API}/products/{slug}", timeout=30).json()["fit"] == "Regular"

        assert admin.put(f"{API}/products/{uuid.uuid4()}", json={"name": "x"}, timeout=30).status_code == 404

        assert admin.delete(f"{API}/products/{pid}", timeout=30).status_code == 200
        assert requests.get(f"{API}/products/{slug}", timeout=30).status_code == 404

    def test_create_requires_auth(self):
        r = requests.post(f"{API}/products", json={"name": "x", "slug": "y", "category_slug": "shirts"}, timeout=30)
        assert r.status_code == 401


# ---------------- Admin categories CRUD + reorder ----------------
class TestCategoriesCRUD:
    def test_crud_and_reorder(self, admin):
        slug = f"test-cat-{uuid.uuid4().hex[:6]}"
        r = admin.post(f"{API}/categories", json={"name": "TEST_Cat", "slug": slug, "description": "d",
                                                  "order": 99, "published": False}, timeout=30)
        assert r.status_code == 200, r.text
        cid = r.json()["id"]
        assert requests.get(f"{API}/categories/{slug}", timeout=30).status_code == 200
        # unpublished should not appear in public list
        assert not [c for c in requests.get(f"{API}/categories", timeout=30).json() if c["id"] == cid]

        dup = admin.post(f"{API}/categories", json={"name": "x", "slug": slug}, timeout=30)
        assert dup.status_code == 400

        u = admin.put(f"{API}/categories/{cid}", json={"name": "TEST_Cat2"}, timeout=30)
        assert u.status_code == 200 and u.json()["name"] == "TEST_Cat2"

        pub = requests.get(f"{API}/categories", timeout=30).json()
        ids = [c["id"] for c in pub]
        rr = admin.post(f"{API}/categories/reorder", json=list(reversed(ids)), timeout=30)
        assert rr.status_code == 200, rr.text
        new_ids = [c["id"] for c in requests.get(f"{API}/categories", timeout=30).json()]
        assert new_ids == list(reversed(ids)), new_ids
        # restore
        admin.post(f"{API}/categories/reorder", json=ids, timeout=30)

        assert admin.delete(f"{API}/categories/{cid}", timeout=30).status_code == 200
        assert requests.get(f"{API}/categories/{slug}", timeout=30).status_code == 404


# ---------------- Dashboard ----------------
class TestDashboard:
    def test_stats(self, admin):
        r = admin.get(f"{API}/dashboard/stats", timeout=30)
        assert r.status_code == 200
        d = r.json()
        for k in ["products", "categories", "enquiries", "new_enquiries", "messages", "new_messages"]:
            assert isinstance(d[k], int), f"{k} not int"
        assert d["categories"] >= 3 and d["products"] > 0


# ---------------- Media ----------------
class TestMedia:
    PNG = (b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00"
           b"\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82")

    def test_upload_list_serve_delete(self, admin, token):
        files = {"file": ("test_pixel.png", io.BytesIO(self.PNG), "image/png")}
        r = requests.post(f"{API}/media", files=files, headers={"Authorization": f"Bearer {token}"}, timeout=60)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["url"].startswith("/api/media/") and d["size"] > 0
        mid = d["id"]

        lst = admin.get(f"{API}/media", timeout=30)
        assert lst.status_code == 200 and any(m["id"] == mid for m in lst.json())

        srv = requests.get(f"{BASE}{d['url']}", timeout=60)
        assert srv.status_code == 200, f"serve failed {srv.status_code}"
        assert srv.content == self.PNG

        assert admin.delete(f"{API}/media/{mid}", timeout=30).status_code == 200
        assert not any(m["id"] == mid for m in admin.get(f"{API}/media", timeout=30).json())
        assert requests.get(f"{BASE}{d['url']}", timeout=30).status_code == 404

    def test_upload_requires_auth(self):
        files = {"file": ("x.png", io.BytesIO(self.PNG), "image/png")}
        assert requests.post(f"{API}/media", files=files, timeout=30).status_code == 401


# ---------------- SEO ----------------
class TestSEO:
    def test_robots(self):
        r = requests.get(f"{BASE}/robots.txt", timeout=30)
        assert r.status_code == 200, r.status_code
        assert "User-agent" in r.text and "Sitemap" in r.text

    def test_sitemap(self):
        r = requests.get(f"{BASE}/sitemap.xml", timeout=30)
        assert r.status_code == 200, r.status_code
        assert "<urlset" in r.text and "/collections" in r.text

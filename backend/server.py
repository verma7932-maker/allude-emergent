from dotenv import load_dotenv
from pathlib import Path
import os

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import logging
import uuid
from datetime import datetime, timezone
from typing import Optional, List

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response, UploadFile, File, Header, Query
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import Response as StarletteResponse, PlainTextResponse
from motor.motor_asyncio import AsyncIOMotorClient

import models
import auth
import storage
import email_service
import seed_data

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="ALLUDE INDIA API")
api = APIRouter(prefix="/api")

FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")


# ---------------- Auth ----------------
@api.post("/auth/login")
async def login(payload: models.LoginInput, response: Response):
    email = payload.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not auth.verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = auth.create_access_token(str(user["_id"]), email)
    response.set_cookie("access_token", token, httponly=True, secure=True, samesite="none", max_age=604800, path="/")
    return {"token": token, "user": {"email": email, "name": user.get("name", "Admin"), "role": user.get("role", "admin")}}


@api.get("/auth/me")
async def me(admin=Depends(auth.get_current_admin)):
    return {"email": admin["email"], "role": "admin"}


@api.post("/auth/logout")
async def logout(response: Response, admin=Depends(auth.get_current_admin)):
    response.delete_cookie("access_token", path="/")
    return {"ok": True}


# ---------------- Categories ----------------
@api.get("/categories")
async def list_categories(all: bool = False):
    q = {} if all else {"published": True}
    docs = await db.categories.find(q, {"_id": 0}).sort("order", 1).to_list(1000)
    return docs


@api.get("/categories/{slug}")
async def get_category(slug: str):
    doc = await db.categories.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Category not found")
    return doc


@api.post("/categories")
async def create_category(payload: models.CategoryCreate, admin=Depends(auth.get_current_admin)):
    if await db.categories.find_one({"slug": payload.slug}):
        raise HTTPException(status_code=400, detail="Slug already exists")
    cat = models.Category(**payload.model_dump())
    await db.categories.insert_one(cat.model_dump())
    return cat.model_dump()


@api.put("/categories/{id}")
async def update_category(id: str, payload: models.CategoryUpdate, admin=Depends(auth.get_current_admin)):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    res = await db.categories.update_one({"id": id}, {"$set": updates})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return await db.categories.find_one({"id": id}, {"_id": 0})


@api.delete("/categories/{id}")
async def delete_category(id: str, admin=Depends(auth.get_current_admin)):
    await db.categories.delete_one({"id": id})
    return {"ok": True}


@api.post("/categories/reorder")
async def reorder_categories(order: List[str], admin=Depends(auth.get_current_admin)):
    for idx, cid in enumerate(order):
        await db.categories.update_one({"id": cid}, {"$set": {"order": idx}})
    return {"ok": True}


# ---------------- Products ----------------
@api.get("/products")
async def list_products(category: Optional[str] = None, featured: Optional[bool] = None,
                        new_collection: Optional[bool] = None, all: bool = False):
    q = {}
    if not all:
        q["published"] = True
    if category:
        q["category_slug"] = category
    if featured is not None:
        q["featured"] = featured
    if new_collection is not None:
        q["new_collection"] = new_collection
    docs = await db.products.find(q, {"_id": 0}).sort("order", 1).to_list(1000)
    return docs


@api.get("/products/{slug}")
async def get_product(slug: str):
    doc = await db.products.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        doc = await db.products.find_one({"id": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")
    return doc


@api.post("/products")
async def create_product(payload: models.ProductCreate, admin=Depends(auth.get_current_admin)):
    if await db.products.find_one({"slug": payload.slug}):
        raise HTTPException(status_code=400, detail="Slug already exists")
    p = models.Product(**payload.model_dump())
    await db.products.insert_one(p.model_dump())
    return p.model_dump()


@api.put("/products/{id}")
async def update_product(id: str, payload: models.ProductUpdate, admin=Depends(auth.get_current_admin)):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    res = await db.products.update_one({"id": id}, {"$set": updates})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return await db.products.find_one({"id": id}, {"_id": 0})


@api.delete("/products/{id}")
async def delete_product(id: str, admin=Depends(auth.get_current_admin)):
    await db.products.delete_one({"id": id})
    return {"ok": True}


# ---------------- Dealer Enquiries ----------------
@api.post("/dealer-enquiries")
async def create_enquiry(payload: models.DealerEnquiryCreate):
    if payload.website:  # honeypot
        return {"ok": True}
    data = payload.model_dump()
    data.pop("website", None)
    enq = models.DealerEnquiry(**data)
    doc = enq.model_dump()
    await db.dealer_enquiries.insert_one(doc)
    await email_service.notify_dealer_enquiry(doc)
    return {"ok": True, "id": enq.id}


@api.get("/dealer-enquiries")
async def list_enquiries(search: Optional[str] = None, city: Optional[str] = None,
                         state: Optional[str] = None, business_type: Optional[str] = None,
                         status: Optional[str] = None, admin=Depends(auth.get_current_admin)):
    q = {}
    if city:
        q["city"] = {"$regex": city, "$options": "i"}
    if state:
        q["state"] = {"$regex": state, "$options": "i"}
    if business_type:
        q["business_type"] = business_type
    if status:
        q["status"] = status
    if search:
        q["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"company": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"phone": {"$regex": search, "$options": "i"}},
        ]
    docs = await db.dealer_enquiries.find(q, {"_id": 0}).sort("created_at", -1).to_list(2000)
    return docs


@api.get("/dealer-enquiries/{id}")
async def get_enquiry(id: str, admin=Depends(auth.get_current_admin)):
    doc = await db.dealer_enquiries.find_one({"id": id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return doc


@api.patch("/dealer-enquiries/{id}/status")
async def update_enquiry_status(id: str, payload: models.StatusUpdate, admin=Depends(auth.get_current_admin)):
    res = await db.dealer_enquiries.update_one({"id": id}, {"$set": {"status": payload.status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return {"ok": True}


@api.delete("/dealer-enquiries/{id}")
async def delete_enquiry(id: str, admin=Depends(auth.get_current_admin)):
    await db.dealer_enquiries.delete_one({"id": id})
    return {"ok": True}


# ---------------- Contact Messages ----------------
@api.post("/contact-messages")
async def create_message(payload: models.ContactCreate):
    if payload.website:  # honeypot
        return {"ok": True}
    data = payload.model_dump()
    data.pop("website", None)
    msg = models.ContactMessage(**data)
    doc = msg.model_dump()
    await db.contact_messages.insert_one(doc)
    await email_service.notify_contact_message(doc)
    return {"ok": True, "id": msg.id}


@api.get("/contact-messages")
async def list_messages(status: Optional[str] = None, admin=Depends(auth.get_current_admin)):
    q = {}
    if status:
        q["status"] = status
    docs = await db.contact_messages.find(q, {"_id": 0}).sort("created_at", -1).to_list(2000)
    return docs


@api.patch("/contact-messages/{id}/status")
async def update_message_status(id: str, payload: models.StatusUpdate, admin=Depends(auth.get_current_admin)):
    res = await db.contact_messages.update_one({"id": id}, {"$set": {"status": payload.status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"ok": True}


@api.delete("/contact-messages/{id}")
async def delete_message(id: str, admin=Depends(auth.get_current_admin)):
    await db.contact_messages.delete_one({"id": id})
    return {"ok": True}


# ---------------- Content (homepage / about / contact / social / seo) ----------------
async def _get_content(key: str):
    doc = await db.content.find_one({"key": key}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Content not found")
    return doc


async def _put_content(key: str, data: dict):
    data["key"] = key
    await db.content.update_one({"key": key}, {"$set": data}, upsert=True)
    return await db.content.find_one({"key": key}, {"_id": 0})


@api.get("/content/{key}")
async def get_content(key: str):
    return await _get_content(key)


@api.put("/content/{key}")
async def put_content(key: str, payload: models.ContentUpdate, admin=Depends(auth.get_current_admin)):
    return await _put_content(key, payload.data)


# ---------------- Media ----------------
@api.post("/media")
async def upload_media(file: UploadFile = File(...), admin=Depends(auth.get_current_admin)):
    ext = file.filename.split(".")[-1].lower() if "." in file.filename else "bin"
    fid = str(uuid.uuid4())
    path = f"{storage.APP_NAME}/media/{fid}.{ext}"
    data = await file.read()
    content_type = file.content_type or storage.MIME_TYPES.get(ext, "application/octet-stream")
    result = storage.put_object(path, data, content_type)
    doc = {
        "id": fid,
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": content_type,
        "size": result.get("size", len(data)),
        "url": f"/api/media/{result['path']}",
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.media.insert_one(doc)
    return {k: v for k, v in doc.items() if k != "_id"}


@api.get("/media")
async def list_media(admin=Depends(auth.get_current_admin)):
    docs = await db.media.find({"is_deleted": False}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return docs


@api.delete("/media/{id}")
async def delete_media(id: str, admin=Depends(auth.get_current_admin)):
    await db.media.update_one({"id": id}, {"$set": {"is_deleted": True}})
    return {"ok": True}


@api.get("/media/{path:path}")
async def serve_media(path: str):
    record = await db.media.find_one({"storage_path": path, "is_deleted": False})
    if not record:
        raise HTTPException(status_code=404, detail="Media not found")
    try:
        content, ctype = storage.get_object(path)
    except Exception:
        raise HTTPException(status_code=404, detail="Media not found")
    return StarletteResponse(content=content, media_type=record.get("content_type", ctype),
                             headers={"Cache-Control": "public, max-age=86400"})


# ---------------- Dashboard ----------------
@api.get("/dashboard/stats")
async def dashboard_stats(admin=Depends(auth.get_current_admin)):
    return {
        "products": await db.products.count_documents({}),
        "categories": await db.categories.count_documents({}),
        "enquiries": await db.dealer_enquiries.count_documents({}),
        "new_enquiries": await db.dealer_enquiries.count_documents({"status": "New"}),
        "messages": await db.contact_messages.count_documents({}),
        "new_messages": await db.contact_messages.count_documents({"status": "New"}),
    }


app.include_router(api)


# ---------------- SEO: sitemap & robots (root level) ----------------
@app.get("/robots.txt", response_class=PlainTextResponse)
async def robots():
    return f"User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: {FRONTEND_URL}/sitemap.xml\n"


@app.get("/sitemap.xml")
async def sitemap():
    urls = ["/", "/collections", "/about", "/dealer-enquiry", "/contact"]
    cats = await db.categories.find({"published": True}, {"_id": 0, "slug": 1}).to_list(1000)
    urls += [f"/collections/{c['slug']}" for c in cats]
    prods = await db.products.find({"published": True}, {"_id": 0, "slug": 1}).to_list(1000)
    urls += [f"/product/{p['slug']}" for p in prods]
    items = "".join(f"<url><loc>{FRONTEND_URL}{u}</loc></url>" for u in urls)
    xml = f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{items}</urlset>'
    return StarletteResponse(content=xml, media_type="application/xml")


app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[FRONTEND_URL, "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    # Storage
    try:
        storage.init_storage()
        logger.info("Storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")

    # Indexes
    await db.users.create_index("email", unique=True)
    await db.categories.create_index("slug", unique=True)
    await db.products.create_index("slug", unique=True)

    # Seed admin
    admin_email = os.environ["ADMIN_EMAIL"].lower().strip()
    admin_password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "email": admin_email, "password_hash": auth.hash_password(admin_password),
            "name": "ALLUDE Admin", "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Admin seeded")
    elif not auth.verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": auth.hash_password(admin_password)}})
        logger.info("Admin password updated")

    # Seed content (only if empty)
    if await db.categories.count_documents({}) == 0:
        for c in seed_data.CATEGORIES:
            await db.categories.insert_one(models.Category(**c).model_dump())
        logger.info("Categories seeded")
    if await db.products.count_documents({}) == 0:
        for p in seed_data.PRODUCTS:
            await db.products.insert_one(models.Product(**p).model_dump())
        logger.info("Products seeded")
    for blob in [seed_data.HOMEPAGE, seed_data.ABOUT, seed_data.CONTACT_INFO, seed_data.SOCIAL_LINKS, seed_data.SEO_SETTINGS]:
        if await db.content.find_one({"key": blob["key"]}) is None:
            await db.content.insert_one(dict(blob))
    logger.info("Startup complete")


@app.on_event("shutdown")
async def shutdown():
    client.close()

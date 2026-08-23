from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional, Annotated, Any
from datetime import datetime, timezone
from bson import ObjectId
import uuid


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def gen_id() -> str:
    return str(uuid.uuid4())


# ---------- Auth ----------
class LoginInput(BaseModel):
    email: EmailStr
    password: str


# ---------- Category ----------
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: str = ""
    image: str = ""
    order: int = 0
    featured: bool = True
    published: bool = True


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    order: Optional[int] = None
    featured: Optional[bool] = None
    published: Optional[bool] = None


class Category(CategoryBase):
    id: str = Field(default_factory=gen_id)
    created_at: str = Field(default_factory=now_iso)


# ---------- Product ----------
class ProductBase(BaseModel):
    name: str
    sku: str = ""
    slug: str
    category_slug: str
    images: List[str] = []
    mrp: Optional[float] = None
    colors: List[str] = []
    sizes: List[str] = []
    fabric: str = ""
    fit: str = ""
    description: str = ""
    features: List[str] = []
    care: str = ""
    status: str = "active"  # active | draft
    featured: bool = False
    new_collection: bool = False
    order: int = 0
    published: bool = True


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: Optional[str] = None
    sku: Optional[str] = None
    slug: Optional[str] = None
    category_slug: Optional[str] = None
    images: Optional[List[str]] = None
    mrp: Optional[float] = None
    colors: Optional[List[str]] = None
    sizes: Optional[List[str]] = None
    fabric: Optional[str] = None
    fit: Optional[str] = None
    description: Optional[str] = None
    features: Optional[List[str]] = None
    care: Optional[str] = None
    status: Optional[str] = None
    featured: Optional[bool] = None
    new_collection: Optional[bool] = None
    order: Optional[int] = None
    published: Optional[bool] = None


class Product(ProductBase):
    id: str = Field(default_factory=gen_id)
    created_at: str = Field(default_factory=now_iso)


# ---------- Dealer Enquiry ----------
class DealerEnquiryCreate(BaseModel):
    name: str
    company: str = ""
    phone: str
    email: EmailStr
    city: str = ""
    state: str = ""
    business_type: str = ""
    business_details: str = ""
    message: str = ""
    website: str = ""  # honeypot


class DealerEnquiry(BaseModel):
    id: str = Field(default_factory=gen_id)
    name: str
    company: str = ""
    phone: str
    email: str
    city: str = ""
    state: str = ""
    business_type: str = ""
    business_details: str = ""
    message: str = ""
    status: str = "New"
    created_at: str = Field(default_factory=now_iso)


class StatusUpdate(BaseModel):
    status: str


# ---------- Contact Message ----------
class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str = ""
    subject: str = ""
    message: str
    website: str = ""  # honeypot


class ContactMessage(BaseModel):
    id: str = Field(default_factory=gen_id)
    name: str
    email: str
    phone: str = ""
    subject: str = ""
    message: str
    status: str = "New"
    created_at: str = Field(default_factory=now_iso)


# ---------- Content blobs (single documents keyed by 'key') ----------
class ContentUpdate(BaseModel):
    data: dict

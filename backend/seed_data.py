"""Default demo/placeholder content seeded on first run. All editable via admin CMS."""

FORMAL_IMG = "/products/formal-trouser.png"
CASUAL_IMG = "/products/casual-trouser.png"
SHIRTS_IMG = "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"
HERO_IMG = "https://images.unsplash.com/photo-1603530066858-c589c83d99bd?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600"
ABOUT_IMG = "https://images.pexels.com/photos/1719463/pexels-photo-1719463.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1200"
MADE_IMG = "https://images.unsplash.com/photo-1568288796918-03e7d93306bd?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"
INNO_IMG = "https://images.pexels.com/photos/6766244/pexels-photo-6766244.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1200"
FORMAL2 = FORMAL_IMG
CASUAL2 = CASUAL_IMG
SHIRT2 = "https://images.unsplash.com/photo-1562157873-818bc0726f68?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"

CATEGORIES = [
    {
        "name": "Formal Trousers",
        "slug": "formal-trousers",
        "description": "Precision-tailored formal trousers with a clean silhouette, refined drape and enduring corporate elegance.",
        "image": FORMAL_IMG,
        "order": 1, "featured": True, "published": True,
    },
    {
        "name": "Casual Trousers",
        "slug": "casual-trousers",
        "description": "Contemporary tapered casual trousers engineered for comfort, movement and a modern relaxed edge.",
        "image": CASUAL_IMG,
        "order": 2, "featured": True, "published": True,
    },
    {
        "name": "Shirts",
        "slug": "shirts",
        "description": "Premium contemporary shirts crafted from quality fabrics with a considered fit and versatile styling.",
        "image": SHIRTS_IMG,
        "order": 3, "featured": True, "published": True,
    },
]

PRODUCTS = [
    {
        "name": "Charcoal Tailored Formal Trouser", "sku": "ALD-FT-001", "slug": "charcoal-tailored-formal-trouser",
        "category_slug": "formal-trousers", "images": [FORMAL_IMG, FORMAL2], "mrp": 2499,
        "colors": ["Charcoal", "Black", "Navy"], "sizes": ["30", "32", "34", "36", "38", "40"],
        "fabric": "Poly-viscose blend", "fit": "Slim Fit",
        "description": "A refined charcoal formal trouser with a sharp crease, comfortable waistband and a tailored slim silhouette for the modern professional.",
        "features": ["Wrinkle resistant finish", "Reinforced waistband", "Clean tailored break"],
        "care": "Dry clean recommended. Warm iron if required.",
        "featured": True, "new_collection": False, "order": 1, "status": "active", "published": True,
    },
    {
        "name": "Classic Pleated Formal Trouser", "sku": "ALD-FT-002", "slug": "classic-pleated-formal-trouser",
        "category_slug": "formal-trousers", "images": [FORMAL2, FORMAL_IMG], "mrp": 2799,
        "colors": ["Grey", "Charcoal"], "sizes": ["30", "32", "34", "36", "38"],
        "fabric": "Wool-blend suiting", "fit": "Regular Fit",
        "description": "A timeless pleated formal trouser offering relaxed movement with structured formal polish.",
        "features": ["Single pleat front", "Soft handle fabric", "All-day comfort"],
        "care": "Dry clean only.",
        "featured": False, "new_collection": True, "order": 2, "status": "active", "published": True,
    },
    {
        "name": "Olive Tapered Casual Trouser", "sku": "ALD-CT-001", "slug": "olive-tapered-casual-trouser",
        "category_slug": "casual-trousers", "images": [CASUAL_IMG, CASUAL2], "mrp": 2199,
        "colors": ["Olive", "Khaki", "Stone"], "sizes": ["30", "32", "34", "36", "38"],
        "fabric": "Stretch cotton twill", "fit": "Tapered Fit",
        "description": "A modern olive casual trouser with a tapered leg, stretch comfort and contemporary versatility from weekday to weekend.",
        "features": ["4-way stretch comfort", "Tapered modern leg", "Durable twill weave"],
        "care": "Machine wash cold. Do not bleach.",
        "featured": True, "new_collection": True, "order": 1, "status": "active", "published": True,
    },
    {
        "name": "Stone Slim Casual Trouser", "sku": "ALD-CT-002", "slug": "stone-slim-casual-trouser",
        "category_slug": "casual-trousers", "images": [CASUAL2, CASUAL_IMG], "mrp": 1999,
        "colors": ["Stone", "Beige"], "sizes": ["30", "32", "34", "36"],
        "fabric": "Cotton twill", "fit": "Slim Fit",
        "description": "A clean stone-toned casual trouser with a slim fit and understated everyday sophistication.",
        "features": ["Breathable cotton", "Slim tailored fit", "Everyday versatility"],
        "care": "Machine wash cold.",
        "featured": False, "new_collection": False, "order": 2, "status": "active", "published": True,
    },
    {
        "name": "Contemporary Formal Shirt", "sku": "ALD-SH-001", "slug": "contemporary-formal-shirt",
        "category_slug": "shirts", "images": [SHIRTS_IMG, SHIRT2], "mrp": 1799,
        "colors": ["White", "Sky Blue", "Charcoal"], "sizes": ["38", "40", "42", "44"],
        "fabric": "Premium cotton", "fit": "Slim Fit",
        "description": "A crisp contemporary shirt in premium cotton with a modern collar and a clean, versatile finish.",
        "features": ["Premium cotton weave", "Modern collar", "Easy-care finish"],
        "care": "Machine wash cold. Warm iron.",
        "featured": True, "new_collection": False, "order": 1, "status": "active", "published": True,
    },
    {
        "name": "Textured Casual Shirt", "sku": "ALD-SH-002", "slug": "textured-casual-shirt",
        "category_slug": "shirts", "images": [SHIRT2, SHIRTS_IMG], "mrp": 1699,
        "colors": ["Sand", "Olive", "White"], "sizes": ["38", "40", "42", "44"],
        "fabric": "Cotton-linen blend", "fit": "Regular Fit",
        "description": "A relaxed textured shirt in a cotton-linen blend for breathable, refined casual styling.",
        "features": ["Breathable cotton-linen", "Soft textured handle", "Relaxed regular fit"],
        "care": "Machine wash cold. Mild iron.",
        "featured": False, "new_collection": True, "order": 2, "status": "active", "published": True,
    },
]

HOMEPAGE = {
    "key": "homepage",
    "hero_image": HERO_IMG,
    "hero_video": "",
    "hero_heading": "ALLUDE",
    "hero_subtitle": "Crafted for the Modern Gentleman",
    "hero_primary_label": "EXPLORE COLLECTION",
    "hero_primary_link": "/collections",
    "hero_secondary_label": "DISCOVER ALLUDE",
    "hero_secondary_link": "/about",
    "intro_heading": "CONTEMPORARY MENSWEAR. REFINED BY DESIGN.",
    "intro_body": "ALLUDE brings together international fashion inspiration, premium fabrics and contemporary design, crafted in India with an uncompromising focus on comfort, fit and timeless style.",
    "collections_heading": "EXPLORE THE COLLECTION",
    "made_image": MADE_IMG,
    "made_heading": "MADE IN INDIA",
    "made_statement": "DESIGNED FOR THE MODERN INDIAN GENTLEMAN. CRAFTED IN INDIA.",
    "made_body": "Every ALLUDE garment is manufactured in India with a focus on craftsmanship, quality and attention to detail, honouring skilled workmanship at every step.",
    "innovation_image": INNO_IMG,
    "innovation_heading": "DESIGN INNOVATION EXCELLENCE",
    "innovation_subheading": "CREATING ORIGINAL DESIGNS WITH CREATIVITY & PRECISION",
    "innovation_body": "We study international fashion trends, consumer preferences and Indian market requirements to guide considered fabric selection and product development. Quality-focused manufacturing and skilled craftsmanship come together in contemporary designs built for comfort and timeless style.",
    "stats": [
        {"value": "2020", "label": "Established"},
        {"value": "100%", "label": "Quality Focused"},
        {"value": "PAN INDIA", "label": "Market Presence"},
        {"value": "INNOVATION", "label": "Driven Design"},
    ],
    "strengths": [
        {"icon": "sparkles", "title": "QUALITY FABRICS", "body": "We use quality fabrics ensuring comfort, durability and style."},
        {"icon": "factory", "title": "ADVANCED MANUFACTURING", "body": "Modern infrastructure with strict quality control processes."},
        {"icon": "pen-tool", "title": "INNOVATIVE DESIGN", "body": "Contemporary designs that match global fashion trends."},
        {"icon": "handshake", "title": "STRONG DEALER RELATIONSHIPS", "body": "Building long-term relationships with dealers and retail partners across India."},
        {"icon": "leaf", "title": "RESPONSIBLE APPROACH", "body": "Responsible practices for a better tomorrow and a better world."},
    ],
    "why_connect": [
        {"icon": "award", "title": "TRUSTED FASHION PARTNER", "body": "Partner with a premium apparel brand with a strong focus on quality."},
        {"icon": "cog", "title": "MANUFACTURING EXCELLENCE", "body": "Advanced manufacturing capabilities delivering superior quality and innovation."},
        {"icon": "map-pin", "title": "PAN INDIA PRESENCE", "body": "Serving customers and business partners across India."},
        {"icon": "headset", "title": "DEDICATED SUPPORT", "body": "Our team is ready to assist with fast and professional support."},
    ],
    "sections_visibility": {
        "intro": True, "collections": True, "featured": True, "about": True,
        "innovation": True, "made": True, "strengths": True, "why_connect": True,
        "dealer_cta": True, "contact_cta": True,
    },
}

ABOUT = {
    "key": "about",
    "heading": "ABOUT ALLUDE",
    "hero_image": ABOUT_IMG,
    "sections": [
        {
            "heading": "THE ALLUDE STORY",
            "body": "Established in 2020, ALLUDE INDIA is a premium menswear brand crafting contemporary apparel for the modern Indian gentleman. We blend international fashion inspiration with Indian craftsmanship to create clothing that feels confident, refined and effortlessly current.",
            "image": HERO_IMG,
        },
        {
            "heading": "OUR PHILOSOPHY",
            "body": "We believe premium menswear should balance comfort, fit and timeless style. Every piece is considered, from fabric selection to the final stitch, so that quality is felt as much as it is seen.",
            "image": INNO_IMG,
        },
        {
            "heading": "CRAFTED IN INDIA",
            "body": "Our garments are manufactured in India with modern infrastructure and strict quality control, honouring skilled workmanship and a responsible approach to how we make what we make.",
            "image": MADE_IMG,
        },
    ],
}

CONTACT_INFO = {
    "key": "contact",
    "company": "ALLUDE INDIA",
    "address": "3rd Floor, Plot No. 211, Okhla Phase 3, Road Okhla, New Delhi - 110020",
    "phone": "011-29932340",
    "email": "support@alludeindia.com",
}

SOCIAL_LINKS = {
    "key": "social",
    "links": [],  # e.g. {"platform": "Instagram", "url": "https://..."}
}

SEO_SETTINGS = {
    "key": "seo",
    "pages": {
        "home": {"title": "ALLUDE INDIA - Crafted for the Modern Gentleman", "description": "Premium Indian menswear - formal trousers, casual trousers and shirts. Contemporary design, quality fabrics, Indian craftsmanship.", "slug": "/", "og_image": HERO_IMG},
        "collections": {"title": "Collections | ALLUDE INDIA", "description": "Explore ALLUDE collections - formal trousers, casual trousers and premium shirts.", "slug": "/collections", "og_image": FORMAL_IMG},
        "about": {"title": "About | ALLUDE INDIA", "description": "About ALLUDE INDIA - premium menswear established in 2020, crafted in India.", "slug": "/about", "og_image": ABOUT_IMG},
        "dealer": {"title": "Dealer Enquiry | ALLUDE INDIA", "description": "Partner with ALLUDE. Dealer, retailer and distributor enquiries across India.", "slug": "/dealer-enquiry", "og_image": HERO_IMG},
        "contact": {"title": "Contact | ALLUDE INDIA", "description": "Contact ALLUDE INDIA, New Delhi.", "slug": "/contact", "og_image": HERO_IMG},
    },
}

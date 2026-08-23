import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api, { mediaUrl } from "@/lib/api";
import Reveal from "@/components/Reveal";
import Btn from "@/components/Btn";
import ProductCard from "@/components/ProductCard";
import useSeo from "@/hooks/useSeo";

export default function ProductDetail() {
  const { slug } = useParams();
  const [p, setP] = useState(null);
  const [active, setActive] = useState(0);
  const [related, setRelated] = useState([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setP(null); setActive(0); setNotFound(false);
    api.get(`/products/${slug}`).then((r) => {
      setP(r.data);
      api.get("/products", { params: { category: r.data.category_slug } })
        .then((rr) => setRelated(rr.data.filter((x) => x.slug !== r.data.slug).slice(0, 3)))
        .catch(() => {});
    }).catch(() => setNotFound(true));
  }, [slug]);

  useSeo({ title: p ? `${p.name} | ALLUDE INDIA` : "ALLUDE INDIA", description: p?.description, image: mediaUrl(p?.images?.[0]) });

  if (notFound) return (
    <div className="pt-[140px] pb-40 text-center">
      <h1 className="heading-display text-4xl text-neutral-900 uppercase">Product not found</h1>
      <Link to="/collections" className="kicker text-neutral-900 link-underline mt-4 inline-block">Back to Collections →</Link>
    </div>
  );
  if (!p) return <div className="h-screen" />;

  const images = p.images?.length ? p.images : [""];

  return (
    <div className="pt-[84px]">
      <div className="max-w-[1500px] mx-auto px-5 md:px-10 py-10 md:py-16">
        <nav className="kicker text-neutral-400 mb-8">
          <Link to="/collections" className="link-underline">Collections</Link> /{" "}
          <Link to={`/collections/${p.category_slug}`} className="link-underline capitalize">{p.category_slug?.replace(/-/g, " ")}</Link> / {p.name}
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-16">
          {/* Gallery */}
          <div>
            <div className="aspect-[3/4] overflow-hidden bg-neutral-100">
              {images[active] ? (
                <img data-testid="product-main-image" src={mediaUrl(images[active])} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-wordmark text-5xl text-neutral-300">ALLUDE</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 mt-3">
                {images.map((img, i) => (
                  <button key={i} data-testid={`product-thumb-${i}`} onClick={() => setActive(i)}
                    className={`w-20 h-24 overflow-hidden border ${active === i ? "border-neutral-900" : "border-neutral-200"}`}>
                    <img src={mediaUrl(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:pt-4">
            <Reveal>
              {p.new_collection && <span className="kicker bg-neutral-900 text-white px-3 py-1.5 inline-block mb-4">New Collection</span>}
              <p className="kicker text-neutral-400 mb-2">{p.sku}</p>
              <h1 className="heading-display text-4xl md:text-5xl text-neutral-900 uppercase leading-tight">{p.name}</h1>
              {p.mrp != null && <p className="font-body text-2xl text-neutral-900 mt-4">₹{Number(p.mrp).toLocaleString("en-IN")}</p>}
              <p className="font-body text-lg text-neutral-600 leading-relaxed mt-6">{p.description}</p>

              <div className="mt-8 space-y-5">
                {p.colors?.length > 0 && (
                  <div><p className="kicker text-neutral-400 mb-2">Colours</p>
                    <div className="flex flex-wrap gap-2">{p.colors.map((c) => <span key={c} className="border border-neutral-300 px-4 py-2 font-body text-sm text-neutral-700">{c}</span>)}</div>
                  </div>
                )}
                {p.sizes?.length > 0 && (
                  <div><p className="kicker text-neutral-400 mb-2">Sizes</p>
                    <div className="flex flex-wrap gap-2">{p.sizes.map((s) => <span key={s} className="border border-neutral-300 w-12 h-12 flex items-center justify-center font-body text-sm text-neutral-700">{s}</span>)}</div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-9">
                <Btn to="/collections" variant="outline" dataTestId="product-explore-btn">Explore</Btn>
                <Btn to="/contact" variant="solid" dataTestId="product-contact-btn">Contact ALLUDE</Btn>
              </div>
            </Reveal>

            {/* Specs */}
            <div className="mt-12 border-t border-neutral-200">
              {[["Fabric", p.fabric], ["Fit", p.fit], ["Care", p.care]].filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="grid grid-cols-3 py-4 border-b border-neutral-200">
                  <p className="kicker text-neutral-400">{k}</p>
                  <p className="col-span-2 font-body text-neutral-700">{v}</p>
                </div>
              ))}
              {p.features?.length > 0 && (
                <div className="grid grid-cols-3 py-4 border-b border-neutral-200">
                  <p className="kicker text-neutral-400">Features</p>
                  <ul className="col-span-2 font-body text-neutral-700 space-y-1">{p.features.map((f, i) => <li key={i}>· {f}</li>)}</ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-24 md:mt-32">
            <h2 className="heading-display text-3xl md:text-4xl text-neutral-900 uppercase mb-10">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {related.map((r) => <ProductCard key={r.id} product={r} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api, { mediaUrl } from "@/lib/api";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import useSeo from "@/hooks/useSeo";

export default function CategoryPage() {
  const { slug } = useParams();
  const [cat, setCat] = useState(null);
  const [products, setProducts] = useState([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setCat(null);
    api.get(`/categories/${slug}`).then((r) => setCat(r.data)).catch(() => setNotFound(true));
    api.get("/products", { params: { category: slug } }).then((r) => setProducts(r.data)).catch(() => {});
  }, [slug]);

  useSeo({ title: cat ? `${cat.name} | ALLUDE INDIA` : "ALLUDE INDIA", description: cat?.description, image: mediaUrl(cat?.image) });

  if (notFound) return (
    <div className="pt-[140px] pb-40 text-center">
      <h1 className="heading-display text-4xl text-neutral-900 uppercase">Category not found</h1>
      <Link to="/collections" className="kicker text-neutral-900 link-underline mt-4 inline-block">Back to Collections →</Link>
    </div>
  );
  if (!cat) return <div className="h-screen" />;

  return (
    <div className="pt-[84px]">
      {/* Category hero */}
      <section className="relative h-[52vh] md:h-[64vh] overflow-hidden bg-neutral-900">
        <img src={mediaUrl(cat.image)} alt={cat.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full max-w-[1500px] mx-auto px-5 md:px-10 flex flex-col justify-end pb-14">
          <Reveal>
            <nav className="kicker text-white/60 mb-4"><Link to="/collections" className="link-underline">Collections</Link> / {cat.name}</nav>
            <h1 className="heading-display text-5xl sm:text-6xl lg:text-8xl text-white uppercase">{cat.name}</h1>
          </Reveal>
        </div>
      </section>

      <div className="max-w-[1500px] mx-auto px-5 md:px-10 py-14 md:py-20">
        <Reveal><p className="font-body text-lg text-neutral-600 max-w-2xl leading-relaxed mb-14">{cat.description}</p></Reveal>
        {products.length === 0 ? (
          <p data-testid="category-empty" className="font-body text-neutral-500 py-20 text-center">No products in this collection yet.</p>
        ) : (
          <div data-testid="category-products" className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.08}><ProductCard product={p} /></Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

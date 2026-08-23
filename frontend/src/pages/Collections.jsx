import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { mediaUrl } from "@/lib/api";
import Reveal from "@/components/Reveal";
import useSeo from "@/hooks/useSeo";

export default function Collections() {
  const [cats, setCats] = useState([]);
  const [seo, setSeo] = useState(null);
  useEffect(() => {
    api.get("/categories").then((r) => setCats(r.data)).catch(() => {});
    api.get("/content/seo").then((r) => setSeo(r.data?.pages?.collections)).catch(() => {});
  }, []);
  useSeo({ title: seo?.title, description: seo?.description, image: seo?.og_image });

  return (
    <div className="pt-[84px]">
      <div className="max-w-[1500px] mx-auto px-5 md:px-10 py-16 md:py-24">
        <Reveal>
          <p className="kicker text-neutral-400 mb-3">Explore</p>
          <h1 className="heading-display text-5xl sm:text-6xl lg:text-7xl text-neutral-900 uppercase">The Collection</h1>
          <p className="font-body text-lg text-neutral-600 max-w-2xl mt-5 leading-relaxed">
            Contemporary menswear across formal trousers, casual trousers and shirts — designed with precision and crafted in India.
          </p>
        </Reveal>
      </div>

      <div className="max-w-[1500px] mx-auto px-5 md:px-10 pb-24 md:pb-32 space-y-4 md:space-y-6">
        {cats.map((c, i) => (
          <Reveal key={c.slug} delay={i * 0.08}>
            <Link
              to={`/collections/${c.slug}`}
              data-testid={`collections-item-${c.slug}`}
              className="group grid lg:grid-cols-12 gap-0 border border-neutral-200 hover:border-neutral-900 transition-colors overflow-hidden"
            >
              <div className={`lg:col-span-7 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="aspect-[16/10] overflow-hidden bg-neutral-100">
                  <img src={mediaUrl(c.image)} alt={c.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-105" />
                </div>
              </div>
              <div className="lg:col-span-5 flex flex-col justify-center p-8 md:p-14">
                <span className="font-wordmark text-3xl text-neutral-200">0{i + 1}</span>
                <h2 className="heading-display text-3xl md:text-5xl text-neutral-900 uppercase mt-4">{c.name}</h2>
                <p className="font-body text-neutral-600 leading-relaxed mt-4 max-w-md">{c.description}</p>
                <span className="kicker text-neutral-900 mt-8 group-hover:translate-x-1 transition-transform">Explore Collection →</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

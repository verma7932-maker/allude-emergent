import React from "react";
import { Link } from "react-router-dom";
import { mediaUrl } from "@/lib/api";

export default function ProductCard({ product, index = 0 }) {
  const img = mediaUrl(product.images?.[0]);
  return (
    <Link
      to={`/product/${product.slug}`}
      data-testid={`product-card-${product.slug}`}
      className="group block"
    >
      <div className="relative overflow-hidden bg-neutral-100 aspect-[3/4]">
        {img ? (
          <img
            src={img}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300 font-wordmark text-4xl">ALLUDE</div>
        )}
        {product.new_collection && (
          <span className="absolute top-4 left-4 bg-neutral-900 text-white kicker px-3 py-1.5">New</span>
        )}
      </div>
      <div className="pt-4">
        <p className="kicker text-neutral-400 mb-1.5">{product.category_slug?.replace(/-/g, " ")}</p>
        <h3 className="font-display font-bold text-lg text-neutral-900 leading-tight group-hover:opacity-60 transition-opacity">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-2">
          {product.mrp != null && <p className="font-body text-neutral-600">₹{Number(product.mrp).toLocaleString("en-IN")}</p>}
          <span className="kicker text-neutral-900">Explore →</span>
        </div>
      </div>
    </Link>
  );
}

import { useEffect } from "react";

// Lightweight SEO: sets document title + meta description + og image.
export default function useSeo({ title, description, image }) {
  useEffect(() => {
    if (title) document.title = title;
    const setMeta = (attr, key, value) => {
      if (!value) return;
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", image);
    setMeta("property", "og:type", "website");
  }, [title, description, image]);
}

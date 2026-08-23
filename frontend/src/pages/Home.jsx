import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import api, { mediaUrl } from "@/lib/api";
import Reveal from "@/components/Reveal";
import Btn from "@/components/Btn";
import Wordmark from "@/components/Wordmark";
import ProductCard from "@/components/ProductCard";
import useSeo from "@/hooks/useSeo";
import * as Icons from "lucide-react";

function iconFor(name) {
  const map = {
    sparkles: Icons.Sparkles, factory: Icons.Factory, "pen-tool": Icons.PenTool,
    handshake: Icons.Handshake, leaf: Icons.Leaf, award: Icons.Award, cog: Icons.Cog,
    "map-pin": Icons.MapPin, headset: Icons.Headphones,
  };
  return map[name] || Icons.Circle;
}

export default function Home() {
  const [hp, setHp] = useState(null);
  const [cats, setCats] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [about, setAbout] = useState(null);
  const [seo, setSeo] = useState(null);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, reduce ? 0 : 120]);

  useEffect(() => {
    api.get("/content/homepage").then((r) => setHp(r.data)).catch(() => {});
    api.get("/categories").then((r) => setCats(r.data)).catch(() => {});
    api.get("/products", { params: { featured: true } }).then((r) => setFeatured(r.data.slice(0, 4))).catch(() => {});
    api.get("/content/about").then((r) => setAbout(r.data)).catch(() => {});
    api.get("/content/seo").then((r) => setSeo(r.data?.pages?.home)).catch(() => {});
  }, []);

  useSeo({ title: seo?.title, description: seo?.description, image: seo?.og_image });

  if (!hp) return <div className="h-screen bg-white" />;
  const vis = hp.sections_visibility || {};

  return (
    <div>
      {/* HERO */}
      <section data-testid="hero-section" className="relative h-[92vh] md:h-screen overflow-hidden bg-neutral-900">
        <motion.div style={{ y: heroY }} className="absolute inset-0 -bottom-32">
          <img src={mediaUrl(hp.hero_image)} alt="ALLUDE menswear" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-vignette" />
        </motion.div>
        <div className="relative h-full max-w-[1500px] mx-auto px-5 md:px-10 flex flex-col justify-end pb-20 md:pb-28">
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="kicker text-white/70 mb-4">Established 2020 · Made in India</p>
            <h1 className="font-wordmark uppercase leading-none text-white text-6xl sm:text-7xl md:text-8xl lg:text-[9rem]" style={{ letterSpacing: "0.12em" }}>ALLUDE</h1>
            <p className="font-display text-xl md:text-3xl text-white/90 mt-4 tracking-tight">
              {hp.hero_subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-9">
              <Btn to={hp.hero_primary_link} variant="light-solid" dataTestId="hero-primary-btn">
                {hp.hero_primary_label}
              </Btn>
              <Btn to={hp.hero_secondary_link} variant="light-outline" dataTestId="hero-secondary-btn">
                {hp.hero_secondary_label}
              </Btn>
            </div>
          </motion.div>
        </div>
      </section>

      {/* INTRO */}
      {vis.intro !== false && (
        <section data-testid="intro-section" className="max-w-[1500px] mx-auto px-5 md:px-10 py-24 md:py-36">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <Reveal className="lg:col-span-8">
              <h2 className="heading-display text-4xl sm:text-5xl lg:text-6xl text-neutral-900 max-w-4xl uppercase">
                {hp.intro_heading}
              </h2>
            </Reveal>
            <Reveal delay={0.15} className="lg:col-span-4">
              <p className="font-body text-lg text-neutral-600 leading-relaxed">{hp.intro_body}</p>
              <Link to="/about" data-testid="intro-discover-link" className="kicker inline-block mt-6 text-neutral-900 link-underline">
                Discover ALLUDE →
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* COLLECTIONS */}
      {vis.collections !== false && (
        <section data-testid="collections-section" className="bg-neutral-50 py-24 md:py-32">
          <div className="max-w-[1500px] mx-auto px-5 md:px-10">
            <div className="flex items-end justify-between mb-14">
              <Reveal>
                <p className="kicker text-neutral-400 mb-3">The Collection</p>
                <h2 className="heading-display text-4xl sm:text-5xl lg:text-6xl text-neutral-900 uppercase">
                  {hp.collections_heading}
                </h2>
              </Reveal>
              <Link to="/collections" data-testid="collections-viewall" className="hidden md:inline-block kicker text-neutral-900 link-underline">View all →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {cats.map((c, i) => (
                <Reveal key={c.slug} delay={i * 0.1}>
                  <Link to={`/collections/${c.slug}`} data-testid={`collection-card-${c.slug}`} className="group block">
                    <div className={`relative overflow-hidden bg-neutral-200 ${i === 1 ? "md:mt-12" : ""}`}>
                      <div className="aspect-[3/4]">
                        <img src={mediaUrl(c.image)} alt={c.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-105" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-7">
                        <h3 className="font-display font-extrabold text-2xl md:text-3xl text-white uppercase">{c.name}</h3>
                        <span className="kicker text-white/80 mt-2 inline-block">Explore →</span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FEATURED */}
      {vis.featured !== false && featured.length > 0 && (
        <section data-testid="featured-section" className="max-w-[1500px] mx-auto px-5 md:px-10 py-24 md:py-32">
          <Reveal>
            <p className="kicker text-neutral-400 mb-3">Selected Pieces</p>
            <h2 className="heading-display text-4xl sm:text-5xl text-neutral-900 uppercase mb-14">Featured Products</h2>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}><ProductCard product={p} /></Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ABOUT split */}
      {vis.about !== false && about && (
        <section data-testid="home-about-section" className="bg-neutral-900 text-white">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[420px] lg:min-h-[640px]">
              <img src={mediaUrl(about.hero_image)} alt="About ALLUDE" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="flex items-center px-6 md:px-16 py-20">
              <Reveal>
                <p className="kicker text-white/50 mb-4">About ALLUDE</p>
                <h2 className="heading-display text-4xl sm:text-5xl lg:text-6xl uppercase mb-6">{about.sections?.[0]?.heading || "The ALLUDE Story"}</h2>
                <p className="font-body text-lg text-white/70 leading-relaxed max-w-xl">{about.sections?.[0]?.body}</p>
                <Btn to="/about" variant="light-outline" className="mt-9" dataTestId="home-about-btn">Read More</Btn>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* DESIGN INNOVATION */}
      {vis.innovation !== false && (
        <section data-testid="innovation-section" className="max-w-[1500px] mx-auto px-5 md:px-10 py-24 md:py-36">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <Reveal className="lg:col-span-6">
              <div className="aspect-[4/5] overflow-hidden bg-neutral-100">
                <img src={mediaUrl(hp.innovation_image)} alt="Design innovation" loading="lazy" className="w-full h-full object-cover" />
              </div>
            </Reveal>
            <div className="lg:col-span-6">
              <Reveal>
                <p className="kicker text-neutral-400 mb-4">{hp.innovation_heading}</p>
                <h2 className="heading-display text-3xl sm:text-4xl lg:text-5xl text-neutral-900 uppercase mb-6">{hp.innovation_subheading}</h2>
                <p className="font-body text-lg text-neutral-600 leading-relaxed">{hp.innovation_body}</p>
              </Reveal>
              <div className="grid grid-cols-2 gap-px bg-neutral-200 mt-12 border border-neutral-200">
                {(hp.stats || []).map((s, i) => (
                  <Reveal key={i} delay={i * 0.08} className="bg-white p-7">
                    <p className="font-display font-extrabold text-3xl md:text-4xl text-neutral-900">{s.value}</p>
                    <p className="kicker text-neutral-500 mt-2">{s.label}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MADE IN INDIA */}
      {vis.made !== false && (
        <section data-testid="made-section" className="relative h-[70vh] md:h-[85vh] overflow-hidden">
          <img src={mediaUrl(hp.made_image)} alt="Made in India" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/45" />
          <div className="relative h-full max-w-[1500px] mx-auto px-5 md:px-10 flex flex-col justify-center">
            <Reveal>
              <p className="kicker text-white/60 mb-4">{hp.made_heading}</p>
              <h2 className="heading-display text-3xl sm:text-5xl lg:text-6xl text-white uppercase max-w-4xl">{hp.made_statement}</h2>
              <p className="font-body text-lg text-white/80 leading-relaxed max-w-2xl mt-6">{hp.made_body}</p>
            </Reveal>
          </div>
        </section>
      )}

      {/* OUR STRENGTHS */}
      {vis.strengths !== false && (
        <section data-testid="strengths-section" className="max-w-[1500px] mx-auto px-5 md:px-10 py-24 md:py-32">
          <Reveal><p className="kicker text-neutral-400 mb-3">What Sets Us Apart</p>
          <h2 className="heading-display text-4xl sm:text-5xl text-neutral-900 uppercase mb-14">Our Strengths</h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 border-t border-l border-neutral-200">
            {(hp.strengths || []).map((s, i) => {
              const Icon = iconFor(s.icon);
              return (
                <Reveal key={i} delay={i * 0.06} className="border-r border-b border-neutral-200 p-8 hover:bg-neutral-50 transition-colors">
                  <Icon size={30} strokeWidth={1.3} className="text-neutral-900" />
                  <h3 className="font-display font-bold text-lg text-neutral-900 uppercase mt-6 mb-3 leading-tight">{s.title}</h3>
                  <p className="font-body text-neutral-600 leading-relaxed text-[15px]">{s.body}</p>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      {/* WHY CONNECT */}
      {vis.why_connect !== false && (
        <section data-testid="why-connect-section" className="bg-neutral-900 text-white py-24 md:py-32">
          <div className="max-w-[1500px] mx-auto px-5 md:px-10">
            <Reveal><p className="kicker text-white/40 mb-3">Partnership</p>
            <h2 className="heading-display text-4xl sm:text-5xl uppercase mb-14">Why Connect With Us?</h2></Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
              {(hp.why_connect || []).map((w, i) => {
                const Icon = iconFor(w.icon);
                return (
                  <Reveal key={i} delay={i * 0.08} className="bg-neutral-900 p-8">
                    <span className="font-wordmark text-2xl text-white/30">0{i + 1}</span>
                    <Icon size={28} strokeWidth={1.3} className="text-white mt-6" />
                    <h3 className="font-display font-bold text-lg uppercase mt-5 mb-3 leading-tight">{w.title}</h3>
                    <p className="font-body text-white/60 leading-relaxed text-[15px]">{w.body}</p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* DEALER CTA */}
      {vis.dealer_cta !== false && (
        <section data-testid="dealer-cta-section" className="max-w-[1500px] mx-auto px-5 md:px-10 py-24 md:py-32">
          <div className="border border-neutral-900 p-10 md:p-20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <Reveal>
              <p className="kicker text-neutral-400 mb-3">Partner with ALLUDE</p>
              <h2 className="heading-display text-4xl sm:text-5xl lg:text-6xl text-neutral-900 uppercase max-w-2xl">Become an ALLUDE Dealer</h2>
              <p className="font-body text-lg text-neutral-600 mt-5 max-w-xl leading-relaxed">Join our growing network of dealers, retailers and distributors across India.</p>
            </Reveal>
            <Btn to="/dealer-enquiry" variant="solid" dataTestId="dealer-cta-btn" className="shrink-0">Dealer Enquiry →</Btn>
          </div>
        </section>
      )}

      {/* CONTACT CTA */}
      {vis.contact_cta !== false && (
        <section data-testid="contact-cta-section" className="bg-neutral-50 py-20 md:py-28">
          <div className="max-w-[1500px] mx-auto px-5 md:px-10 text-center">
            <Reveal>
              <Wordmark className="h-9 md:h-11 mx-auto mb-5" />
              <p className="font-display text-2xl md:text-3xl text-neutral-900 tracking-tight mb-8">Let's create something refined together.</p>
              <Btn to="/contact" variant="outline" dataTestId="contact-cta-btn">Contact ALLUDE</Btn>
            </Reveal>
          </div>
        </section>
      )}
    </div>
  );
}

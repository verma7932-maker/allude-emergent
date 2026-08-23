import React, { useEffect, useState } from "react";
import api, { mediaUrl } from "@/lib/api";
import Reveal from "@/components/Reveal";
import Btn from "@/components/Btn";
import Wordmark from "@/components/Wordmark";
import useSeo from "@/hooks/useSeo";

export default function About() {
  const [about, setAbout] = useState(null);
  const [hp, setHp] = useState(null);
  const [seo, setSeo] = useState(null);
  useEffect(() => {
    api.get("/content/about").then((r) => setAbout(r.data)).catch(() => {});
    api.get("/content/homepage").then((r) => setHp(r.data)).catch(() => {});
    api.get("/content/seo").then((r) => setSeo(r.data?.pages?.about)).catch(() => {});
  }, []);
  useSeo({ title: seo?.title, description: seo?.description, image: seo?.og_image });
  if (!about) return <div className="h-screen" />;

  return (
    <div className="pt-[84px]">
      <section className="relative h-[60vh] md:h-[72vh] overflow-hidden bg-neutral-900">
        <img src={mediaUrl(about.hero_image)} alt="About ALLUDE" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative h-full max-w-[1500px] mx-auto px-5 md:px-10 flex flex-col justify-end pb-16">
          <Reveal>
            <p className="kicker text-white/60 mb-4">Established 2020</p>
            <h1 className="heading-display text-5xl sm:text-7xl lg:text-8xl text-white uppercase">{about.heading}</h1>
          </Reveal>
        </div>
      </section>

      <div className="max-w-[1500px] mx-auto px-5 md:px-10 py-24 md:py-32 space-y-24 md:space-y-40">
        {(about.sections || []).map((s, i) => (
          <div key={i} className="grid lg:grid-cols-12 gap-10 md:gap-16 items-center">
            <Reveal className={`lg:col-span-6 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
              <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                <img src={mediaUrl(s.image)} alt={s.heading} loading="lazy" className="w-full h-full object-cover" />
              </div>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-6">
              <span className="font-wordmark text-3xl text-neutral-200">0{i + 1}</span>
              <h2 className="heading-display text-3xl sm:text-4xl lg:text-5xl text-neutral-900 uppercase mt-3 mb-6">{s.heading}</h2>
              <p className="font-body text-lg text-neutral-600 leading-relaxed max-w-xl">{s.body}</p>
            </Reveal>
          </div>
        ))}
      </div>

      {hp && (
        <section className="bg-neutral-50 py-20 md:py-28">
          <div className="max-w-[1500px] mx-auto px-5 md:px-10 text-center">
            <Wordmark className="h-9 md:h-11 mx-auto mb-5" />
            <p className="font-display text-2xl md:text-3xl text-neutral-900 tracking-tight mb-8">{hp.hero_subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Btn to="/collections" variant="solid" dataTestId="about-collection-btn">Explore Collection</Btn>
              <Btn to="/dealer-enquiry" variant="outline" dataTestId="about-dealer-btn">Dealer Enquiry</Btn>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

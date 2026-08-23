import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { PageHead, AdminButton, Input, Textarea, Field } from "@/pages/admin/AdminUI";
import MediaPicker from "@/pages/admin/MediaPicker";

export default function AdminHomepage() {
  const [d, setD] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.get("/content/homepage").then((r) => setD(r.data)).catch(() => {}); }, []);
  const set = (k, v) => setD((p) => ({ ...p, [k]: v }));
  const setVis = (k, v) => setD((p) => ({ ...p, sections_visibility: { ...(p.sections_visibility || {}), [k]: v } }));
  const setStat = (i, k, v) => setD((p) => { const s = [...p.stats]; s[i] = { ...s[i], [k]: v }; return { ...p, stats: s }; });
  const setArr = (arr, i, k, v) => setD((p) => { const a = [...p[arr]]; a[i] = { ...a[i], [k]: v }; return { ...p, [arr]: a }; });

  const save = async () => {
    setSaving(true);
    try { const { key, ...data } = d; await api.put("/content/homepage", { data }); toast.success("Homepage saved"); }
    catch { toast.error("Save failed"); } finally { setSaving(false); }
  };

  if (!d) return <p className="font-body text-neutral-500">Loading...</p>;

  const Section = ({ title, children }) => (
    <div className="border border-neutral-200 bg-white p-6 mb-5">
      <h2 className="font-display font-bold text-lg text-neutral-900 uppercase mb-5">{title}</h2>
      {children}
    </div>
  );

  return (
    <div>
      <PageHead title="Homepage" sub="Edit homepage content & sections">
        <AdminButton onClick={save} disabled={saving} data-testid="homepage-save-btn">{saving ? "Saving..." : "Save Changes"}</AdminButton>
      </PageHead>

      <Section title="Hero">
        <MediaPicker value={d.hero_image} onChange={(v) => set("hero_image", v)} label="Hero Image" dataTestId="hero-image-picker" />
        <div className="grid md:grid-cols-2 gap-x-5">
          <Field label="Hero Heading (wordmark)"><Input value={d.hero_heading} onChange={(e) => set("hero_heading", e.target.value)} /></Field>
          <Field label="Hero Subtitle"><Input value={d.hero_subtitle} onChange={(e) => set("hero_subtitle", e.target.value)} data-testid="hero-subtitle-input" /></Field>
          <Field label="Primary Button Label"><Input value={d.hero_primary_label} onChange={(e) => set("hero_primary_label", e.target.value)} /></Field>
          <Field label="Primary Button Link"><Input value={d.hero_primary_link} onChange={(e) => set("hero_primary_link", e.target.value)} /></Field>
          <Field label="Secondary Button Label"><Input value={d.hero_secondary_label} onChange={(e) => set("hero_secondary_label", e.target.value)} /></Field>
          <Field label="Secondary Button Link"><Input value={d.hero_secondary_link} onChange={(e) => set("hero_secondary_link", e.target.value)} /></Field>
        </div>
      </Section>

      <Section title="Introduction">
        <Field label="Heading"><Input value={d.intro_heading} onChange={(e) => set("intro_heading", e.target.value)} /></Field>
        <Field label="Body"><Textarea rows={3} value={d.intro_body} onChange={(e) => set("intro_body", e.target.value)} /></Field>
        <Field label="Collections Heading"><Input value={d.collections_heading} onChange={(e) => set("collections_heading", e.target.value)} /></Field>
      </Section>

      <Section title="Design Innovation Excellence">
        <MediaPicker value={d.innovation_image} onChange={(v) => set("innovation_image", v)} label="Image" />
        <Field label="Heading"><Input value={d.innovation_heading} onChange={(e) => set("innovation_heading", e.target.value)} /></Field>
        <Field label="Subheading"><Input value={d.innovation_subheading} onChange={(e) => set("innovation_subheading", e.target.value)} /></Field>
        <Field label="Body"><Textarea rows={3} value={d.innovation_body} onChange={(e) => set("innovation_body", e.target.value)} /></Field>
        <label className="kicker text-neutral-500 block mb-2">Stat Blocks</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(d.stats || []).map((s, i) => (
            <div key={i} className="border border-neutral-200 p-3">
              <Input value={s.value} onChange={(e) => setStat(i, "value", e.target.value)} className="mb-2 font-bold" />
              <Input value={s.label} onChange={(e) => setStat(i, "label", e.target.value)} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Made in India">
        <MediaPicker value={d.made_image} onChange={(v) => set("made_image", v)} label="Image" />
        <Field label="Heading"><Input value={d.made_heading} onChange={(e) => set("made_heading", e.target.value)} /></Field>
        <Field label="Statement"><Input value={d.made_statement} onChange={(e) => set("made_statement", e.target.value)} /></Field>
        <Field label="Body"><Textarea rows={2} value={d.made_body} onChange={(e) => set("made_body", e.target.value)} /></Field>
      </Section>

      <Section title="Our Strengths">
        {(d.strengths || []).map((s, i) => (
          <div key={i} className="grid md:grid-cols-3 gap-3 mb-3 border-b border-neutral-100 pb-3">
            <Input value={s.title} onChange={(e) => setArr("strengths", i, "title", e.target.value)} placeholder="Title" />
            <Input value={s.icon} onChange={(e) => setArr("strengths", i, "icon", e.target.value)} placeholder="icon (lucide)" />
            <Textarea rows={1} value={s.body} onChange={(e) => setArr("strengths", i, "body", e.target.value)} placeholder="Body" />
          </div>
        ))}
      </Section>

      <Section title="Why Connect With Us">
        {(d.why_connect || []).map((s, i) => (
          <div key={i} className="grid md:grid-cols-3 gap-3 mb-3 border-b border-neutral-100 pb-3">
            <Input value={s.title} onChange={(e) => setArr("why_connect", i, "title", e.target.value)} placeholder="Title" />
            <Input value={s.icon} onChange={(e) => setArr("why_connect", i, "icon", e.target.value)} placeholder="icon (lucide)" />
            <Textarea rows={1} value={s.body} onChange={(e) => setArr("why_connect", i, "body", e.target.value)} placeholder="Body" />
          </div>
        ))}
      </Section>

      <Section title="Section Visibility">
        <div className="flex flex-wrap gap-5">
          {Object.entries(d.sections_visibility || {}).map(([k, v]) => (
            <label key={k} className="flex items-center gap-2 font-body text-sm capitalize cursor-pointer">
              <input type="checkbox" checked={v} onChange={(e) => setVis(k, e.target.checked)} data-testid={`vis-${k}`} /> {k.replace(/_/g, " ")}
            </label>
          ))}
        </div>
      </Section>

      <AdminButton onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</AdminButton>
    </div>
  );
}

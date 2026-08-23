import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { PageHead, AdminButton, Input, Textarea, Field } from "@/pages/admin/AdminUI";
import MediaPicker from "@/pages/admin/MediaPicker";

export default function AdminSEO() {
  const [pages, setPages] = useState(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => { api.get("/content/seo").then((r) => setPages(r.data?.pages || {})).catch(() => {}); }, []);
  const set = (page, k, v) => setPages((p) => ({ ...p, [page]: { ...p[page], [k]: v } }));
  const save = async () => { setSaving(true); try { await api.put("/content/seo", { data: { pages } }); toast.success("SEO saved"); } catch { toast.error("Save failed"); } finally { setSaving(false); } };
  if (!pages) return <p className="font-body text-neutral-500">Loading...</p>;

  return (
    <div>
      <PageHead title="SEO Settings" sub="Per-page titles, descriptions, slugs & OG images">
        <AdminButton onClick={save} disabled={saving} data-testid="seo-save-btn">{saving ? "Saving..." : "Save"}</AdminButton>
      </PageHead>
      {Object.entries(pages).map(([page, s]) => (
        <div key={page} className="border border-neutral-200 bg-white p-6 mb-5">
          <h2 className="font-display font-bold text-lg text-neutral-900 uppercase mb-4">{page}</h2>
          <div className="grid md:grid-cols-2 gap-x-5">
            <Field label="SEO Title"><Input value={s.title || ""} onChange={(e) => set(page, "title", e.target.value)} data-testid={`seo-title-${page}`} /></Field>
            <Field label="URL Slug"><Input value={s.slug || ""} onChange={(e) => set(page, "slug", e.target.value)} /></Field>
            <div className="md:col-span-2"><Field label="Meta Description"><Textarea rows={2} value={s.description || ""} onChange={(e) => set(page, "description", e.target.value)} /></Field></div>
            <div className="md:col-span-2"><MediaPicker value={s.og_image} onChange={(v) => set(page, "og_image", v)} label="Open Graph Image" /></div>
          </div>
        </div>
      ))}
      <AdminButton onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</AdminButton>
    </div>
  );
}

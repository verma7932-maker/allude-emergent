import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { PageHead, AdminButton, Input, Textarea, Field } from "@/pages/admin/AdminUI";
import MediaPicker from "@/pages/admin/MediaPicker";
import { Plus, Trash2 } from "lucide-react";

export default function AdminAbout() {
  const [d, setD] = useState(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => { api.get("/content/about").then((r) => setD(r.data)).catch(() => {}); }, []);
  const set = (k, v) => setD((p) => ({ ...p, [k]: v }));
  const setSec = (i, k, v) => setD((p) => { const s = [...p.sections]; s[i] = { ...s[i], [k]: v }; return { ...p, sections: s }; });
  const addSec = () => setD((p) => ({ ...p, sections: [...(p.sections || []), { heading: "", body: "", image: "" }] }));
  const delSec = (i) => setD((p) => ({ ...p, sections: p.sections.filter((_, x) => x !== i) }));

  const save = async () => {
    setSaving(true);
    try { const { key, ...data } = d; await api.put("/content/about", { data }); toast.success("About saved"); }
    catch { toast.error("Save failed"); } finally { setSaving(false); }
  };
  if (!d) return <p className="font-body text-neutral-500">Loading...</p>;

  return (
    <div>
      <PageHead title="About Allude" sub="Edit the About page">
        <AdminButton onClick={save} disabled={saving} data-testid="about-save-btn">{saving ? "Saving..." : "Save Changes"}</AdminButton>
      </PageHead>
      <div className="border border-neutral-200 bg-white p-6 mb-5">
        <Field label="Page Heading"><Input value={d.heading} onChange={(e) => set("heading", e.target.value)} /></Field>
        <MediaPicker value={d.hero_image} onChange={(v) => set("hero_image", v)} label="Hero Image" />
      </div>
      {(d.sections || []).map((s, i) => (
        <div key={i} className="border border-neutral-200 bg-white p-6 mb-5">
          <div className="flex justify-between items-center mb-4">
            <span className="kicker text-neutral-400">Section {i + 1}</span>
            <button onClick={() => delSec(i)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
          </div>
          <Field label="Heading"><Input value={s.heading} onChange={(e) => setSec(i, "heading", e.target.value)} /></Field>
          <Field label="Body"><Textarea rows={3} value={s.body} onChange={(e) => setSec(i, "body", e.target.value)} /></Field>
          <MediaPicker value={s.image} onChange={(v) => setSec(i, "image", v)} label="Image" />
        </div>
      ))}
      <AdminButton variant="outline" onClick={addSec} className="mb-6"><Plus size={16} /> Add Section</AdminButton>
      <div><AdminButton onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</AdminButton></div>
    </div>
  );
}

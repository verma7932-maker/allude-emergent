import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { PageHead, AdminButton, Input, Select } from "@/pages/admin/AdminUI";
import { Plus, Trash2 } from "lucide-react";

const PLATFORMS = ["Instagram", "Facebook", "LinkedIn", "Twitter", "YouTube", "Other"];

export default function AdminSocial() {
  const [links, setLinks] = useState([]);
  const [saving, setSaving] = useState(false);
  useEffect(() => { api.get("/content/social").then((r) => setLinks(r.data?.links || [])).catch(() => {}); }, []);
  const setL = (i, k, v) => setLinks((p) => { const a = [...p]; a[i] = { ...a[i], [k]: v }; return a; });
  const add = () => setLinks((p) => [...p, { platform: "Instagram", url: "" }]);
  const del = (i) => setLinks((p) => p.filter((_, x) => x !== i));
  const save = async () => { setSaving(true); try { await api.put("/content/social", { data: { links: links.filter((l) => l.url) } }); toast.success("Saved"); } catch { toast.error("Save failed"); } finally { setSaving(false); } };

  return (
    <div>
      <PageHead title="Social Links" sub="Manage footer social media links">
        <AdminButton onClick={save} disabled={saving} data-testid="social-save-btn">{saving ? "Saving..." : "Save"}</AdminButton>
      </PageHead>
      <div className="border border-neutral-200 bg-white p-6 max-w-2xl">
        {links.map((l, i) => (
          <div key={i} className="flex gap-3 mb-3" data-testid={`social-row-${i}`}>
            <Select value={l.platform} onChange={(e) => setL(i, "platform", e.target.value)} className="max-w-[180px]">{PLATFORMS.map((p) => <option key={p}>{p}</option>)}</Select>
            <Input value={l.url} onChange={(e) => setL(i, "url", e.target.value)} placeholder="https://..." />
            <button onClick={() => del(i)} className="p-2 border border-neutral-300 text-red-600 hover:border-red-600"><Trash2 size={14} /></button>
          </div>
        ))}
        {links.length === 0 && <p className="font-body text-neutral-500 mb-4">No social links yet.</p>}
        <AdminButton variant="outline" onClick={add} data-testid="social-add-btn"><Plus size={16} /> Add Link</AdminButton>
      </div>
    </div>
  );
}

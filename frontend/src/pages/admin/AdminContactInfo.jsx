import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { PageHead, AdminButton, Input, Textarea, Field } from "@/pages/admin/AdminUI";

export default function AdminContactInfo() {
  const [d, setD] = useState(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => { api.get("/content/contact").then((r) => setD(r.data)).catch(() => {}); }, []);
  const set = (k, v) => setD((p) => ({ ...p, [k]: v }));
  const save = async () => {
    setSaving(true);
    try { const { key, ...data } = d; await api.put("/content/contact", { data }); toast.success("Contact info saved"); }
    catch { toast.error("Save failed"); } finally { setSaving(false); }
  };
  if (!d) return <p className="font-body text-neutral-500">Loading...</p>;
  return (
    <div>
      <PageHead title="Contact Info" sub="Company contact details shown on the site">
        <AdminButton onClick={save} disabled={saving} data-testid="contactinfo-save-btn">{saving ? "Saving..." : "Save"}</AdminButton>
      </PageHead>
      <div className="border border-neutral-200 bg-white p-6 max-w-2xl">
        <Field label="Company Name"><Input value={d.company} onChange={(e) => set("company", e.target.value)} /></Field>
        <Field label="Address"><Textarea rows={3} value={d.address} onChange={(e) => set("address", e.target.value)} /></Field>
        <Field label="Phone"><Input value={d.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
        <Field label="Email"><Input value={d.email} onChange={(e) => set("email", e.target.value)} /></Field>
      </div>
    </div>
  );
}

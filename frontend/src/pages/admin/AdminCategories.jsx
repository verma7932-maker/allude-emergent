import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api, { mediaUrl } from "@/lib/api";
import { PageHead, AdminButton, Input, Textarea, Field, slugify } from "@/pages/admin/AdminUI";
import MediaPicker from "@/pages/admin/MediaPicker";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";

const blank = { name: "", slug: "", description: "", image: "", order: 0, featured: true, published: true };

export default function AdminCategories() {
  const [cats, setCats] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const load = () => api.get("/categories", { params: { all: true } }).then((r) => setCats(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(blank); setOpen(true); };
  const openEdit = (c) => { setEditing(c); setForm({ ...blank, ...c }); setOpen(true); };
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, slug: form.slug || slugify(form.name), order: Number(form.order) || 0 };
    try {
      if (editing) await api.put(`/categories/${editing.id}`, payload);
      else await api.post("/categories", payload);
      toast.success("Saved");
      setOpen(false);
      load();
    } catch (err) { toast.error(err.response?.data?.detail || "Save failed"); }
    finally { setSaving(false); }
  };

  const del = async (c) => {
    if (!window.confirm(`Delete "${c.name}"? Products in this category will remain but unlinked.`)) return;
    await api.delete(`/categories/${c.id}`);
    toast.success("Deleted"); load();
  };

  const move = async (idx, dir) => {
    const arr = [...cats];
    const j = idx + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[idx], arr[j]] = [arr[j], arr[idx]];
    setCats(arr);
    await api.post("/categories/reorder", arr.map((c) => c.id));
    load();
  };

  return (
    <div>
      <PageHead title="Categories" sub={`${cats.length} categories`}>
        <AdminButton onClick={openNew} data-testid="category-add-btn"><Plus size={16} /> Add Category</AdminButton>
      </PageHead>

      <div className="grid gap-4">
        {cats.map((c, i) => (
          <div key={c.id} data-testid={`category-row-${c.slug}`} className="border border-neutral-200 bg-white flex items-center gap-5 p-4">
            <div className="w-20 h-24 bg-neutral-100 overflow-hidden shrink-0">{c.image && <img src={mediaUrl(c.image)} alt="" className="w-full h-full object-cover" />}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-lg text-neutral-900 uppercase">{c.name} {!c.published && <span className="kicker text-red-500">hidden</span>}</h3>
              <p className="font-body text-sm text-neutral-500 line-clamp-2 mt-1">{c.description}</p>
            </div>
            <div className="flex flex-col gap-1">
              <button onClick={() => move(i, -1)} className="p-1 border border-neutral-300 hover:border-neutral-900 disabled:opacity-30" disabled={i === 0}><ArrowUp size={14} /></button>
              <button onClick={() => move(i, 1)} className="p-1 border border-neutral-300 hover:border-neutral-900 disabled:opacity-30" disabled={i === cats.length - 1}><ArrowDown size={14} /></button>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(c)} data-testid={`category-edit-${c.slug}`} className="p-2 border border-neutral-300 hover:border-neutral-900"><Pencil size={14} /></button>
              <button onClick={() => del(c)} data-testid={`category-delete-${c.slug}`} className="p-2 border border-neutral-300 text-red-600 hover:border-red-600"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl rounded-none bg-white">
          <DialogHeader><DialogTitle className="font-display font-extrabold text-2xl uppercase">{editing ? "Edit Category" : "Add Category"}</DialogTitle></DialogHeader>
          <form onSubmit={save} data-testid="category-form" className="mt-2">
            <Field label="Name *"><Input value={form.name} onChange={(e) => set("name", e.target.value)} required data-testid="category-name-input" /></Field>
            <Field label="Slug (auto)"><Input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder={slugify(form.name)} /></Field>
            <Field label="Description"><Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} /></Field>
            <MediaPicker value={form.image} onChange={(url) => set("image", url)} label="Category Image" dataTestId="category-image-picker" />
            <div className="flex gap-6 py-2">
              <label className="flex items-center gap-2 font-body text-sm cursor-pointer"><input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} /> Featured on homepage</label>
              <label className="flex items-center gap-2 font-body text-sm cursor-pointer"><input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} /> Published</label>
            </div>
            <div className="flex gap-3 mt-4">
              <AdminButton type="submit" disabled={saving} data-testid="category-save-btn">{saving ? "Saving..." : "Save"}</AdminButton>
              <AdminButton type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</AdminButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

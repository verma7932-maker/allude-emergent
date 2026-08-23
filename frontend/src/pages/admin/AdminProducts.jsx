import React, { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import api, { mediaUrl } from "@/lib/api";
import { PageHead, AdminButton, Input, Textarea, Select, Field, slugify } from "@/pages/admin/AdminUI";
import MediaPicker from "@/pages/admin/MediaPicker";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const blank = {
  name: "", sku: "", slug: "", category_slug: "", images: [], mrp: "", colors: [], sizes: [],
  fabric: "", fit: "", description: "", features: [], care: "", status: "active",
  featured: false, new_collection: false, order: 0, published: true,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => api.get("/products", { params: { all: true } }).then((r) => setProducts(r.data)).catch(() => {}), []);
  useEffect(() => { load(); api.get("/categories", { params: { all: true } }).then((r) => setCats(r.data)).catch(() => {}); }, [load]);

  const openNew = () => { setEditing(null); setForm(blank); setOpen(true); };
  const openEdit = (p) => { setEditing(p); setForm({ ...blank, ...p, mrp: p.mrp ?? "" }); setOpen(true); };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setList = (k) => (e) => set(k, e.target.value.split(",").map((s) => s.trim()).filter(Boolean));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
      mrp: form.mrp === "" ? null : Number(form.mrp),
      order: Number(form.order) || 0,
      images: form.images.filter(Boolean),
    };
    try {
      if (editing) await api.put(`/products/${editing.id}`, payload);
      else await api.post("/products", payload);
      toast.success("Saved");
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Save failed");
    } finally { setSaving(false); }
  };

  const del = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    await api.delete(`/products/${p.id}`);
    toast.success("Deleted");
    load();
  };

  return (
    <div>
      <PageHead title="Products" sub={`${products.length} products`}>
        <AdminButton onClick={openNew} data-testid="product-add-btn"><Plus size={16} /> Add Product</AdminButton>
      </PageHead>

      <div className="border border-neutral-200 bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead><tr className="text-left kicker text-neutral-400 border-b border-neutral-200">
            <th className="px-4 py-3">Image</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">SKU</th>
            <th className="px-4 py-3">Category</th><th className="px-4 py-3">MRP</th><th className="px-4 py-3">Flags</th><th className="px-4 py-3">Actions</th>
          </tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} data-testid={`product-row-${p.slug}`} className="border-b border-neutral-100 font-body text-neutral-700">
                <td className="px-4 py-3"><div className="w-12 h-14 bg-neutral-100 overflow-hidden">{p.images?.[0] && <img src={mediaUrl(p.images[0])} alt="" className="w-full h-full object-cover" />}</div></td>
                <td className="px-4 py-3 font-medium text-neutral-900">{p.name}{!p.published && <span className="kicker text-red-500 ml-2">draft</span>}</td>
                <td className="px-4 py-3">{p.sku || "—"}</td>
                <td className="px-4 py-3 capitalize">{p.category_slug?.replace(/-/g, " ")}</td>
                <td className="px-4 py-3">{p.mrp != null ? `₹${Number(p.mrp).toLocaleString("en-IN")}` : "—"}</td>
                <td className="px-4 py-3 space-x-1">{p.featured && <span className="kicker border border-neutral-300 px-1.5 py-0.5">Feat</span>}{p.new_collection && <span className="kicker border border-neutral-300 px-1.5 py-0.5">New</span>}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} data-testid={`product-edit-${p.slug}`} className="p-1.5 border border-neutral-300 hover:border-neutral-900"><Pencil size={14} /></button>
                    <button onClick={() => del(p)} data-testid={`product-delete-${p.slug}`} className="p-1.5 border border-neutral-300 text-red-600 hover:border-red-600"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-none bg-white">
          <DialogHeader><DialogTitle className="font-display font-extrabold text-2xl uppercase">{editing ? "Edit Product" : "Add Product"}</DialogTitle></DialogHeader>
          <form onSubmit={save} data-testid="product-form" className="grid grid-cols-1 md:grid-cols-2 gap-x-5 mt-2">
            <Field label="Name *"><Input value={form.name} onChange={(e) => set("name", e.target.value)} required data-testid="product-name-input" /></Field>
            <Field label="SKU / Code"><Input value={form.sku} onChange={(e) => set("sku", e.target.value)} /></Field>
            <Field label="Slug (auto)"><Input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder={slugify(form.name)} /></Field>
            <Field label="Category *">
              <Select value={form.category_slug} onChange={(e) => set("category_slug", e.target.value)} required data-testid="product-category-select">
                <option value="">Select</option>{cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </Select>
            </Field>
            <Field label="MRP (₹)"><Input type="number" value={form.mrp} onChange={(e) => set("mrp", e.target.value)} /></Field>
            <Field label="Display Order"><Input type="number" value={form.order} onChange={(e) => set("order", e.target.value)} /></Field>
            <Field label="Colours (comma separated)"><Input value={form.colors.join(", ")} onChange={setList("colors")} /></Field>
            <Field label="Sizes (comma separated)"><Input value={form.sizes.join(", ")} onChange={setList("sizes")} /></Field>
            <Field label="Fabric"><Input value={form.fabric} onChange={(e) => set("fabric", e.target.value)} /></Field>
            <Field label="Fit"><Input value={form.fit} onChange={(e) => set("fit", e.target.value)} /></Field>
            <div className="md:col-span-2"><Field label="Description"><Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} /></Field></div>
            <div className="md:col-span-2"><Field label="Features (comma separated)"><Input value={form.features.join(", ")} onChange={setList("features")} /></Field></div>
            <div className="md:col-span-2"><Field label="Care Instructions"><Input value={form.care} onChange={(e) => set("care", e.target.value)} /></Field></div>

            <div className="md:col-span-2">
              <label className="kicker text-neutral-500 block mb-2">Images</label>
              {form.images.map((img, i) => (
                <div key={i} className="flex gap-2 items-center mb-2">
                  <Input value={img} onChange={(e) => { const arr = [...form.images]; arr[i] = e.target.value; set("images", arr); }} placeholder="Image URL" />
                  <button type="button" onClick={() => set("images", form.images.filter((_, x) => x !== i))} className="p-2 border border-neutral-300"><X size={14} /></button>
                </div>
              ))}
              <MediaPicker value="" onChange={(url) => url && set("images", [...form.images, url])} label="" dataTestId="product-image-picker" />
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-6 py-3 border-t border-neutral-200 mt-2">
              {[["featured", "Featured"], ["new_collection", "New Collection"], ["published", "Published"]].map(([k, lbl]) => (
                <label key={k} className="flex items-center gap-2 font-body text-sm cursor-pointer">
                  <input type="checkbox" checked={!!form[k]} onChange={(e) => set(k, e.target.checked)} data-testid={`product-${k}-check`} /> {lbl}
                </label>
              ))}
            </div>
            <div className="md:col-span-2 flex gap-3 mt-4">
              <AdminButton type="submit" disabled={saving} data-testid="product-save-btn">{saving ? "Saving..." : "Save Product"}</AdminButton>
              <AdminButton type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</AdminButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

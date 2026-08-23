import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api, { mediaUrl } from "@/lib/api";
import { PageHead, AdminButton } from "@/pages/admin/AdminUI";
import { Upload, Trash2, Copy } from "lucide-react";

export default function AdminMedia() {
  const [items, setItems] = useState([]);
  const [uploading, setUploading] = useState(false);

  const load = () => api.get("/media").then((r) => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const upload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        await api.post("/media", fd, { headers: { "Content-Type": "multipart/form-data" } });
      }
      toast.success("Uploaded"); load();
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); e.target.value = ""; }
  };

  const del = async (id) => { if (!window.confirm("Delete this media?")) return; await api.delete(`/media/${id}`); toast.success("Deleted"); load(); };
  const copy = (url) => { navigator.clipboard.writeText(mediaUrl(url)); toast.success("URL copied"); };

  return (
    <div>
      <PageHead title="Media" sub={`${items.length} files`}>
        <label className="inline-flex items-center gap-2 px-5 py-2.5 kicker border bg-neutral-900 text-white hover:bg-neutral-700 cursor-pointer">
          <Upload size={16} /> {uploading ? "Uploading..." : "Upload Media"}
          <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={upload} data-testid="media-upload-input" />
        </label>
      </PageHead>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((m) => (
          <div key={m.id} data-testid={`media-item-${m.id}`} className="border border-neutral-200 bg-white group">
            <div className="aspect-square bg-neutral-100 overflow-hidden">
              {m.content_type?.startsWith("video") ? (
                <video src={mediaUrl(m.url)} className="w-full h-full object-cover" />
              ) : (
                <img src={mediaUrl(m.url)} alt={m.original_filename} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="p-2 flex items-center justify-between">
              <p className="font-body text-xs text-neutral-500 truncate">{m.original_filename}</p>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => copy(m.url)} className="p-1 hover:text-black text-neutral-400"><Copy size={13} /></button>
                <button onClick={() => del(m.id)} className="p-1 hover:text-red-600 text-neutral-400"><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="col-span-full py-16 text-center font-body text-neutral-500">No media uploaded yet.</p>}
      </div>
    </div>
  );
}

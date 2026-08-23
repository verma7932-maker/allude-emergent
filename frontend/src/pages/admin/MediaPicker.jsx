import React, { useState } from "react";
import { toast } from "sonner";
import api, { mediaUrl } from "@/lib/api";
import { Input } from "@/pages/admin/AdminUI";
import { Upload, X } from "lucide-react";

// Image input: paste a URL or upload a file (stored via object storage).
export default function MediaPicker({ value, onChange, label = "Image", dataTestId }) {
  const [uploading, setUploading] = useState(false);

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await api.post("/media", fd, { headers: { "Content-Type": "multipart/form-data" } });
      onChange(res.data.url);
      toast.success("Uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-4">
      {label && <label className="kicker text-neutral-500 block mb-2">{label}</label>}
      <div className="flex gap-3 items-start">
        {value ? (
          <div className="relative w-24 h-24 border border-neutral-200 shrink-0">
            <img src={mediaUrl(value)} alt="" className="w-full h-full object-cover" />
            <button type="button" onClick={() => onChange("")} className="absolute -top-2 -right-2 bg-white border border-neutral-300 p-0.5"><X size={14} /></button>
          </div>
        ) : (
          <label className="w-24 h-24 border border-dashed border-neutral-300 shrink-0 flex flex-col items-center justify-center cursor-pointer hover:border-neutral-900 text-neutral-400">
            <Upload size={18} />
            <span className="kicker mt-1">{uploading ? "..." : "Upload"}</span>
            <input type="file" accept="image/*,video/*" className="hidden" onChange={upload} data-testid={dataTestId ? `${dataTestId}-file` : undefined} />
          </label>
        )}
        <Input placeholder="Or paste image URL" value={value || ""} onChange={(e) => onChange(e.target.value)} data-testid={dataTestId} />
      </div>
    </div>
  );
}

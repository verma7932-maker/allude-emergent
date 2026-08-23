import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { PageHead, AdminButton, Select } from "@/pages/admin/AdminUI";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Eye } from "lucide-react";

const STATUSES = ["New", "Read", "Replied", "Closed"];

export default function AdminMessages() {
  const [list, setList] = useState([]);
  const [status, setStatus] = useState("");
  const [detail, setDetail] = useState(null);

  const load = () => api.get("/contact-messages", { params: status ? { status } : {} }).then((r) => setList(r.data)).catch(() => {});
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [status]);

  const updateStatus = async (id, s) => { await api.patch(`/contact-messages/${id}/status`, { status: s }); toast.success("Updated"); load(); if (detail?.id === id) setDetail({ ...detail, status: s }); };
  const del = async (id) => { if (!window.confirm("Delete this message?")) return; await api.delete(`/contact-messages/${id}`); toast.success("Deleted"); load(); setDetail(null); };

  return (
    <div>
      <PageHead title="Contact Messages" sub={`${list.length} messages`}>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} data-testid="message-filter-status"><option value="">All Status</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</Select>
      </PageHead>
      <div className="border border-neutral-200 bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[680px]">
          <thead><tr className="text-left kicker text-neutral-400 border-b border-neutral-200">
            <th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Subject</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th>
          </tr></thead>
          <tbody>
            {list.map((m) => (
              <tr key={m.id} data-testid={`message-row-${m.id}`} className="border-b border-neutral-100 font-body text-neutral-700">
                <td className="px-4 py-3 font-medium text-neutral-900">{m.name}</td><td className="px-4 py-3">{m.email}</td><td className="px-4 py-3">{m.subject || "—"}</td>
                <td className="px-4 py-3"><Select value={m.status} onChange={(e) => updateStatus(m.id, e.target.value)} className="!py-1 !text-xs">{STATUSES.map((s) => <option key={s}>{s}</option>)}</Select></td>
                <td className="px-4 py-3"><div className="flex gap-2">
                  <button onClick={() => setDetail(m)} data-testid={`message-view-${m.id}`} className="p-1.5 border border-neutral-300 hover:border-neutral-900"><Eye size={14} /></button>
                  <button onClick={() => del(m.id)} data-testid={`message-delete-${m.id}`} className="p-1.5 border border-neutral-300 text-red-600 hover:border-red-600"><Trash2 size={14} /></button>
                </div></td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center font-body text-neutral-500">No messages.</td></tr>}
          </tbody>
        </table>
      </div>

      <Dialog open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <DialogContent className="max-w-lg rounded-none bg-white">
          <DialogHeader><DialogTitle className="font-display font-extrabold text-2xl uppercase">Message</DialogTitle></DialogHeader>
          {detail && (
            <div className="font-body text-sm space-y-3 mt-2">
              {[["Name", detail.name], ["Email", detail.email], ["Phone", detail.phone], ["Subject", detail.subject], ["Message", detail.message]].map(([k, v]) => (
                <div key={k} className="grid grid-cols-3 gap-3 border-b border-neutral-100 pb-2"><span className="kicker text-neutral-400">{k}</span><span className="col-span-2 text-neutral-800">{v || "—"}</span></div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

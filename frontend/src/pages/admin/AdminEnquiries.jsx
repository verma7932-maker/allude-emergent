import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { PageHead, AdminButton, Input, Select } from "@/pages/admin/AdminUI";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Eye, Search } from "lucide-react";

const STATUSES = ["New", "Contacted", "In Discussion", "Converted", "Closed"];
const TYPES = ["Dealer", "Retailer", "Distributor", "Multi-Brand Store", "Other"];

export default function AdminEnquiries() {
  const [list, setList] = useState([]);
  const [filters, setFilters] = useState({ search: "", city: "", state: "", business_type: "", status: "" });
  const [detail, setDetail] = useState(null);

  const load = () => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    api.get("/dealer-enquiries", { params }).then((r) => setList(r.data)).catch(() => {});
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [filters]);

  const setF = (k) => (e) => setFilters((f) => ({ ...f, [k]: e.target.value }));

  const updateStatus = async (id, status) => {
    await api.patch(`/dealer-enquiries/${id}/status`, { status });
    toast.success("Status updated");
    load();
    if (detail?.id === id) setDetail({ ...detail, status });
  };

  const del = async (id) => {
    if (!window.confirm("Delete this enquiry?")) return;
    await api.delete(`/dealer-enquiries/${id}`);
    toast.success("Deleted"); load(); setDetail(null);
  };

  return (
    <div>
      <PageHead title="Dealer Enquiries" sub={`${list.length} enquiries`} />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="relative col-span-2 md:col-span-1">
          <Search size={15} className="absolute left-3 top-3 text-neutral-400" />
          <Input placeholder="Search..." className="pl-9" value={filters.search} onChange={setF("search")} data-testid="enquiry-search" />
        </div>
        <Input placeholder="City" value={filters.city} onChange={setF("city")} data-testid="enquiry-filter-city" />
        <Input placeholder="State" value={filters.state} onChange={setF("state")} data-testid="enquiry-filter-state" />
        <Select value={filters.business_type} onChange={setF("business_type")} data-testid="enquiry-filter-type"><option value="">All Types</option>{TYPES.map((t) => <option key={t}>{t}</option>)}</Select>
        <Select value={filters.status} onChange={setF("status")} data-testid="enquiry-filter-status"><option value="">All Status</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</Select>
      </div>

      <div className="border border-neutral-200 bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[760px]">
          <thead><tr className="text-left kicker text-neutral-400 border-b border-neutral-200">
            <th className="px-4 py-3">Name</th><th className="px-4 py-3">Company</th><th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">City</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th>
          </tr></thead>
          <tbody>
            {list.map((e) => (
              <tr key={e.id} data-testid={`enquiry-row-${e.id}`} className="border-b border-neutral-100 font-body text-neutral-700">
                <td className="px-4 py-3 font-medium text-neutral-900">{e.name}</td>
                <td className="px-4 py-3">{e.company || "—"}</td><td className="px-4 py-3">{e.phone}</td>
                <td className="px-4 py-3">{e.city || "—"}</td><td className="px-4 py-3">{e.business_type || "—"}</td>
                <td className="px-4 py-3">
                  <Select value={e.status} onChange={(ev) => updateStatus(e.id, ev.target.value)} className="!py-1 !text-xs" data-testid={`enquiry-status-${e.id}`}>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </Select>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => setDetail(e)} data-testid={`enquiry-view-${e.id}`} className="p-1.5 border border-neutral-300 hover:border-neutral-900"><Eye size={14} /></button>
                    <button onClick={() => del(e.id)} data-testid={`enquiry-delete-${e.id}`} className="p-1.5 border border-neutral-300 text-red-600 hover:border-red-600"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center font-body text-neutral-500">No enquiries found.</td></tr>}
          </tbody>
        </table>
      </div>

      <Dialog open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <DialogContent className="max-w-lg rounded-none bg-white">
          <DialogHeader><DialogTitle className="font-display font-extrabold text-2xl uppercase">Enquiry Detail</DialogTitle></DialogHeader>
          {detail && (
            <div className="font-body text-sm space-y-3 mt-2">
              {[["Name", detail.name], ["Company / Store", detail.company], ["Phone", detail.phone], ["Email", detail.email], ["City", detail.city], ["State", detail.state], ["Business Type", detail.business_type], ["Business Details", detail.business_details], ["Message", detail.message]].map(([k, v]) => (
                <div key={k} className="grid grid-cols-3 gap-3 border-b border-neutral-100 pb-2">
                  <span className="kicker text-neutral-400">{k}</span><span className="col-span-2 text-neutral-800">{v || "—"}</span>
                </div>
              ))}
              <div className="flex items-center gap-3 pt-2">
                <span className="kicker text-neutral-400">Status</span>
                <Select value={detail.status} onChange={(e) => updateStatus(detail.id, e.target.value)} className="max-w-[200px]">{STATUSES.map((s) => <option key={s}>{s}</option>)}</Select>
              </div>
              <div className="pt-3"><AdminButton variant="danger" onClick={() => del(detail.id)}><Trash2 size={14} /> Delete</AdminButton></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { PageHead } from "@/pages/admin/AdminUI";
import { Package, FolderTree, Inbox, MessageSquare } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    api.get("/dashboard/stats").then((r) => setStats(r.data)).catch(() => {});
    api.get("/dealer-enquiries").then((r) => setEnquiries(r.data.slice(0, 5))).catch(() => {});
  }, []);

  const cards = [
    { label: "Products", value: stats?.products, icon: Package, to: "/admin/products" },
    { label: "Categories", value: stats?.categories, icon: FolderTree, to: "/admin/categories" },
    { label: "Dealer Enquiries", value: stats?.enquiries, sub: `${stats?.new_enquiries || 0} new`, icon: Inbox, to: "/admin/enquiries" },
    { label: "Contact Messages", value: stats?.messages, sub: `${stats?.new_messages || 0} new`, icon: MessageSquare, to: "/admin/messages" },
  ];

  return (
    <div>
      <PageHead title="Dashboard" sub="Overview of your ALLUDE website" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} data-testid={`stat-${c.label.toLowerCase().replace(/\s/g, "-")}`} className="border border-neutral-200 bg-white p-6 hover:border-neutral-900 transition-colors">
            <div className="flex items-center justify-between">
              <c.icon size={22} strokeWidth={1.5} className="text-neutral-900" />
              {c.sub && <span className="kicker text-neutral-400">{c.sub}</span>}
            </div>
            <p className="font-display font-extrabold text-4xl text-neutral-900 mt-6">{c.value ?? "—"}</p>
            <p className="kicker text-neutral-500 mt-1">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 border border-neutral-200 bg-white">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-neutral-900 uppercase">Recent Dealer Enquiries</h2>
          <Link to="/admin/enquiries" className="kicker text-neutral-900 link-underline">View all →</Link>
        </div>
        {enquiries.length === 0 ? (
          <p className="p-6 font-body text-neutral-500">No enquiries yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="text-left kicker text-neutral-400 border-b border-neutral-200">
              <th className="px-6 py-3">Name</th><th className="px-6 py-3">Company</th><th className="px-6 py-3">City</th><th className="px-6 py-3">Type</th><th className="px-6 py-3">Status</th>
            </tr></thead>
            <tbody>
              {enquiries.map((e) => (
                <tr key={e.id} className="border-b border-neutral-100 font-body text-neutral-700">
                  <td className="px-6 py-3">{e.name}</td><td className="px-6 py-3">{e.company || "—"}</td>
                  <td className="px-6 py-3">{e.city || "—"}</td><td className="px-6 py-3">{e.business_type || "—"}</td>
                  <td className="px-6 py-3"><span className="kicker border border-neutral-300 px-2 py-1">{e.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

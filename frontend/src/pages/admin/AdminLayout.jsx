import React from "react";
import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Wordmark from "@/components/Wordmark";
import {
  LayoutDashboard, Package, FolderTree, Home as HomeIcon, Info,
  Inbox, MessageSquare, Image as ImageIcon, Share2, Search, LogOut, ExternalLink, Phone,
} from "lucide-react";

const LINKS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/homepage", label: "Homepage", icon: HomeIcon },
  { to: "/admin/about", label: "About Allude", icon: Info },
  { to: "/admin/enquiries", label: "Dealer Enquiries", icon: Inbox },
  { to: "/admin/messages", label: "Contact", icon: MessageSquare },
  { to: "/admin/media", label: "Media", icon: ImageIcon },
  { to: "/admin/contact-info", label: "Contact Info", icon: Phone },
  { to: "/admin/social", label: "Social Links", icon: Share2 },
  { to: "/admin/seo", label: "SEO Settings", icon: Search },
];

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className="min-h-screen bg-neutral-50 flex items-center justify-center"><p className="kicker text-neutral-400">Loading...</p></div>;
  if (!user) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col fixed h-screen">
        <div className="p-6 border-b border-neutral-200">
          <Wordmark className="h-6" />
          <p className="kicker text-neutral-400 mt-1">CMS</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              data-testid={`admin-nav-${l.label.toLowerCase().replace(/\s/g, "-")}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 font-display text-sm font-medium transition-colors ${
                  isActive ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
                }`
              }
            >
              <l.icon size={18} strokeWidth={1.6} /> {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-neutral-200 space-y-2">
          <a href="/" target="_blank" rel="noopener noreferrer" data-testid="admin-view-site" className="flex items-center gap-3 px-2 py-2 font-display text-sm text-neutral-600 hover:text-black">
            <ExternalLink size={16} /> View Site
          </a>
          <button onClick={() => { logout(); navigate("/admin/login"); }} data-testid="admin-logout" className="flex items-center gap-3 px-2 py-2 font-display text-sm text-neutral-600 hover:text-red-600 w-full">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8 md:p-10 max-w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

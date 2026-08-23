import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import Wordmark from "@/components/Wordmark";
import api from "@/lib/api";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Collections", to: "/collections", dropdown: true },
  { label: "About", to: "/about" },
  { label: "Dealer Enquiry", to: "/dealer-enquiry" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [cats, setCats] = useState([]);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    api.get("/categories").then((r) => setCats(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropOpen(false);
  }, [location.pathname]);

  const solid = scrolled || !isHome || mobileOpen;
  const textColor = solid ? "text-neutral-900" : "text-white";

  return (
    <header
      data-testid="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        solid ? "bg-white/90 backdrop-blur-xl border-b border-neutral-200" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1500px] mx-auto px-5 md:px-10">
        <div className="flex items-center justify-between h-[68px] md:h-[84px]">
          <Link to="/" data-testid="nav-logo" className={textColor}>
            <Wordmark dark={!solid} className="h-6 md:h-7" dataTestId="nav-logo-img" />
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {NAV.map((item) =>
              item.dropdown ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setDropOpen(true)}
                  onMouseLeave={() => setDropOpen(false)}
                >
                  <Link
                    to={item.to}
                    data-testid="nav-collections"
                    className={`kicker flex items-center gap-1.5 link-underline ${textColor}`}
                  >
                    {item.label} <ChevronDown size={13} strokeWidth={2.5} />
                  </Link>
                  {dropOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-5">
                      <div className="bg-white border border-neutral-200 min-w-[240px] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]">
                        {cats.map((c) => (
                          <Link
                            key={c.slug}
                            to={`/collections/${c.slug}`}
                            data-testid={`nav-dropdown-${c.slug}`}
                            className="block px-6 py-4 kicker text-neutral-700 hover:bg-neutral-900 hover:text-white transition-colors border-b border-neutral-100 last:border-0"
                          >
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.to}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                  className={`kicker link-underline ${textColor}`}
                >
                  {item.label}
                </NavLink>
              )
            )}
          </nav>

          <button
            data-testid="mobile-menu-toggle"
            className={`lg:hidden ${textColor}`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div data-testid="mobile-menu" className="lg:hidden bg-white border-t border-neutral-200 h-[calc(100vh-68px)] overflow-y-auto">
          <nav className="flex flex-col px-6 py-6">
            {NAV.filter((n) => !n.dropdown).map((item) => (
              <Link
                key={item.label}
                to={item.to}
                data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                className="py-5 border-b border-neutral-100 font-display font-bold text-2xl text-neutral-900"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-6">
              <p className="kicker text-neutral-400 mb-3">Collections</p>
              {cats.map((c) => (
                <Link
                  key={c.slug}
                  to={`/collections/${c.slug}`}
                  data-testid={`mobile-cat-${c.slug}`}
                  className="block py-3 font-display font-medium text-lg text-neutral-700"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Linkedin, Twitter, Youtube, Globe } from "lucide-react";
import Wordmark from "@/components/Wordmark";
import api from "@/lib/api";

const ICONS = { instagram: Instagram, facebook: Facebook, linkedin: Linkedin, twitter: Twitter, youtube: Youtube };

export default function Footer() {
  const [contact, setContact] = useState(null);
  const [social, setSocial] = useState([]);

  useEffect(() => {
    api.get("/content/contact").then((r) => setContact(r.data)).catch(() => {});
    api.get("/content/social").then((r) => setSocial(r.data?.links || [])).catch(() => {});
  }, []);

  return (
    <footer data-testid="main-footer" className="bg-white border-t border-neutral-200">
      <div className="max-w-[1500px] mx-auto px-5 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Wordmark className="h-9 md:h-11" />
            <p className="mt-5 font-display text-lg text-neutral-500 tracking-tight">
              Crafted for the Modern Gentleman
            </p>
          </div>

          <div className="lg:col-span-3">
            <p className="kicker text-neutral-400 mb-6">Navigate</p>
            <ul className="space-y-3">
              {[
                ["Home", "/"],
                ["Collections", "/collections"],
                ["About Allude", "/about"],
                ["Dealer Enquiry", "/dealer-enquiry"],
                ["Contact", "/contact"],
              ].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} data-testid={`footer-link-${label.toLowerCase().replace(/\s/g, "-")}`} className="font-display font-medium text-neutral-700 hover:text-black link-underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="kicker text-neutral-400 mb-6">Contact</p>
            {contact && (
              <div className="space-y-3 text-neutral-600 font-body">
                <p className="font-display font-bold text-neutral-900">{contact.company}</p>
                <p className="max-w-xs leading-relaxed">{contact.address}</p>
                <p><a href={`tel:${contact.phone}`} className="hover:text-black link-underline">{contact.phone}</a></p>
                <p><a href={`mailto:${contact.email}`} className="hover:text-black link-underline">{contact.email}</a></p>
              </div>
            )}
            {social.length > 0 && (
              <div className="flex gap-4 mt-6">
                {social.map((s, i) => {
                  const Icon = ICONS[(s.platform || "").toLowerCase()] || Globe;
                  return (
                    <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" data-testid={`footer-social-${i}`} className="w-10 h-10 border border-neutral-300 flex items-center justify-center hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors">
                      <Icon size={17} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-neutral-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-sm text-neutral-400">© {new Date().getFullYear()} ALLUDE INDIA. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" data-testid="footer-privacy" className="text-sm text-neutral-500 hover:text-black link-underline">Privacy Policy</Link>
            <Link to="/terms" data-testid="footer-terms" className="text-sm text-neutral-500 hover:text-black link-underline">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

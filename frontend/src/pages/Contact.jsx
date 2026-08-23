import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import Reveal from "@/components/Reveal";
import Btn from "@/components/Btn";
import useSeo from "@/hooks/useSeo";
import { MapPin, Phone, Mail, CheckCircle2 } from "lucide-react";

const empty = { name: "", email: "", phone: "", subject: "", message: "", website: "" };

export default function Contact() {
  const [info, setInfo] = useState(null);
  const [f, setF] = useState(empty);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});
  useSeo({ title: "Contact | ALLUDE INDIA", description: "Contact ALLUDE INDIA, New Delhi." });

  useEffect(() => { api.get("/content/contact").then((r) => setInfo(r.data)).catch(() => {}); }, []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const validate = () => {
    const err = {};
    if (!f.name.trim()) err.name = "Required";
    if (!f.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) err.email = "Valid email required";
    if (!f.message.trim()) err.message = "Required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) { toast.error("Please fix the highlighted fields."); return; }
    setSubmitting(true);
    try {
      await api.post("/contact-messages", f);
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch { toast.error("Something went wrong. Please try again."); }
    finally { setSubmitting(false); }
  };

  const inputCls = (k) => `w-full border ${errors[k] ? "border-red-400" : "border-neutral-300"} px-4 py-3.5 font-body text-neutral-900 bg-white focus:border-neutral-900 focus:outline-none transition-colors`;

  return (
    <div className="pt-[84px]">
      <div className="max-w-[1500px] mx-auto px-5 md:px-10 py-16 md:py-24 grid lg:grid-cols-12 gap-12 md:gap-20">
        <Reveal className="lg:col-span-5">
          <p className="kicker text-neutral-400 mb-3">Get in Touch</p>
          <h1 className="heading-display text-5xl sm:text-6xl lg:text-7xl text-neutral-900 uppercase">Contact<br />ALLUDE</h1>
          {info && (
            <div className="mt-10 space-y-8 border-t border-neutral-200 pt-8">
              <p className="font-display font-extrabold text-2xl text-neutral-900 uppercase">{info.company}</p>
              <div className="flex items-start gap-4"><MapPin size={22} strokeWidth={1.4} className="text-neutral-900 mt-1 shrink-0" /><p className="font-body text-neutral-600 leading-relaxed max-w-xs">{info.address}</p></div>
              <div className="flex items-center gap-4"><Phone size={22} strokeWidth={1.4} className="text-neutral-900 shrink-0" /><a href={`tel:${info.phone}`} className="font-body text-neutral-600 hover:text-black link-underline">{info.phone}</a></div>
              <div className="flex items-center gap-4"><Mail size={22} strokeWidth={1.4} className="text-neutral-900 shrink-0" /><a href={`mailto:${info.email}`} className="font-body text-neutral-600 hover:text-black link-underline">{info.email}</a></div>
            </div>
          )}
        </Reveal>

        <div className="lg:col-span-7">
          {done ? (
            <div data-testid="contact-success" className="border border-neutral-200 p-12 text-center">
              <CheckCircle2 size={48} strokeWidth={1.2} className="mx-auto text-neutral-900" />
              <h2 className="heading-display text-3xl text-neutral-900 uppercase mt-6">Message Sent</h2>
              <p className="font-body text-neutral-600 mt-4 leading-relaxed">Thank you for reaching out. We will respond as soon as possible.</p>
              <Btn onClick={() => { setDone(false); setF(empty); }} variant="outline" className="mt-8" dataTestId="contact-another-btn">Send Another</Btn>
            </div>
          ) : (
            <form onSubmit={submit} data-testid="contact-form" className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input type="text" name="website" value={f.website} onChange={set("website")} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
              <div><label className="kicker text-neutral-500 block mb-2">Name *</label><input data-testid="contact-name" className={inputCls("name")} value={f.name} onChange={set("name")} /></div>
              <div><label className="kicker text-neutral-500 block mb-2">Email *</label><input data-testid="contact-email" className={inputCls("email")} value={f.email} onChange={set("email")} /></div>
              <div><label className="kicker text-neutral-500 block mb-2">Phone</label><input data-testid="contact-phone" className={inputCls("phone")} value={f.phone} onChange={set("phone")} /></div>
              <div><label className="kicker text-neutral-500 block mb-2">Subject</label><input data-testid="contact-subject" className={inputCls("subject")} value={f.subject} onChange={set("subject")} /></div>
              <div className="sm:col-span-2"><label className="kicker text-neutral-500 block mb-2">Message *</label><textarea rows={6} data-testid="contact-message" className={inputCls("message")} value={f.message} onChange={set("message")} /></div>
              <div className="sm:col-span-2"><Btn type="submit" variant="solid" disabled={submitting} dataTestId="contact-submit-btn">{submitting ? "Sending..." : "Send Message →"}</Btn></div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

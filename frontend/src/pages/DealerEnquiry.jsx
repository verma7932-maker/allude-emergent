import React, { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import Reveal from "@/components/Reveal";
import Btn from "@/components/Btn";
import useSeo from "@/hooks/useSeo";
import { CheckCircle2 } from "lucide-react";

const BUSINESS_TYPES = ["Dealer", "Retailer", "Distributor", "Multi-Brand Store", "Other"];
const STATES = ["Andhra Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Odisha","Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","Uttarakhand","West Bengal","Other"];

const empty = { name: "", company: "", phone: "", email: "", city: "", state: "", business_type: "", business_details: "", message: "", website: "" };

export default function DealerEnquiry() {
  const [f, setF] = useState(empty);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});
  useSeo({ title: "Dealer Enquiry | ALLUDE INDIA", description: "Partner with ALLUDE. Dealer, retailer and distributor enquiries across India." });

  const set = (k) => (e) => setF({ ...f, [k]: e?.target ? e.target.value : e });

  const validate = () => {
    const err = {};
    if (!f.name.trim()) err.name = "Required";
    if (!f.phone.trim() || !/^[0-9+\-\s()]{7,15}$/.test(f.phone)) err.phone = "Valid phone required";
    if (!f.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) err.email = "Valid email required";
    if (!f.business_type) err.business_type = "Required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) { toast.error("Please fix the highlighted fields."); return; }
    setSubmitting(true);
    try {
      await api.post("/dealer-enquiries", f);
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = (k) => `w-full border ${errors[k] ? "border-red-400" : "border-neutral-300"} px-4 py-3.5 font-body text-neutral-900 bg-white focus:border-neutral-900 focus:outline-none transition-colors`;

  if (done) return (
    <div className="pt-[140px] pb-40 max-w-2xl mx-auto px-5 text-center">
      <CheckCircle2 size={56} strokeWidth={1.2} className="mx-auto text-neutral-900" />
      <h1 data-testid="dealer-success" className="heading-display text-4xl md:text-5xl text-neutral-900 uppercase mt-8">Enquiry Received</h1>
      <p className="font-body text-lg text-neutral-600 mt-5 leading-relaxed">Thank you for your interest in partnering with ALLUDE. Our team will review your enquiry and get in touch with you shortly.</p>
      <Btn onClick={() => { setDone(false); setF(empty); }} variant="outline" className="mt-8" dataTestId="dealer-another-btn">Submit Another</Btn>
    </div>
  );

  return (
    <div className="pt-[84px]">
      <div className="max-w-[1500px] mx-auto px-5 md:px-10 py-16 md:py-24 grid lg:grid-cols-12 gap-12 md:gap-20">
        <Reveal className="lg:col-span-5">
          <p className="kicker text-neutral-400 mb-3">Partner with ALLUDE</p>
          <h1 className="heading-display text-5xl sm:text-6xl lg:text-7xl text-neutral-900 uppercase">Dealer Enquiry</h1>
          <p className="font-body text-lg text-neutral-600 mt-6 leading-relaxed max-w-lg">
            A premium B2B partnership experience for dealers, retailers and distributors interested in working with ALLUDE. Share your details and our team will connect with you.
          </p>
          <div className="mt-10 space-y-4 border-t border-neutral-200 pt-8">
            {["Premium apparel brand with a quality focus","Advanced manufacturing capabilities","Pan-India presence & dedicated support"].map((t) => (
              <p key={t} className="flex items-start gap-3 font-body text-neutral-700"><span className="w-1.5 h-1.5 bg-neutral-900 mt-2.5 shrink-0" />{t}</p>
            ))}
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          <form onSubmit={submit} data-testid="dealer-form" className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <input type="text" name="website" value={f.website} onChange={set("website")} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
            <div><label className="kicker text-neutral-500 block mb-2">Name *</label><input data-testid="dealer-name" className={inputCls("name")} value={f.name} onChange={set("name")} /></div>
            <div><label className="kicker text-neutral-500 block mb-2">Company / Store Name</label><input data-testid="dealer-company" className={inputCls("company")} value={f.company} onChange={set("company")} /></div>
            <div><label className="kicker text-neutral-500 block mb-2">Phone *</label><input data-testid="dealer-phone" className={inputCls("phone")} value={f.phone} onChange={set("phone")} /></div>
            <div><label className="kicker text-neutral-500 block mb-2">Email *</label><input data-testid="dealer-email" className={inputCls("email")} value={f.email} onChange={set("email")} /></div>
            <div><label className="kicker text-neutral-500 block mb-2">City</label><input data-testid="dealer-city" className={inputCls("city")} value={f.city} onChange={set("city")} /></div>
            <div><label className="kicker text-neutral-500 block mb-2">State</label>
              <select data-testid="dealer-state" className={inputCls("state")} value={f.state} onChange={set("state")}>
                <option value="">Select State</option>{STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div><label className="kicker text-neutral-500 block mb-2">Business Type *</label>
              <select data-testid="dealer-business-type" className={inputCls("business_type")} value={f.business_type} onChange={set("business_type")}>
                <option value="">Select Type</option>{BUSINESS_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2"><label className="kicker text-neutral-500 block mb-2">Current Business / Store Details</label><textarea rows={3} data-testid="dealer-details" className={inputCls("business_details")} value={f.business_details} onChange={set("business_details")} /></div>
            <div className="sm:col-span-2"><label className="kicker text-neutral-500 block mb-2">Message</label><textarea rows={4} data-testid="dealer-message" className={inputCls("message")} value={f.message} onChange={set("message")} /></div>
            <div className="sm:col-span-2">
              <Btn type="submit" variant="solid" disabled={submitting} dataTestId="dealer-submit-btn">{submitting ? "Submitting..." : "Submit Enquiry →"}</Btn>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import React from "react";

export const Field = ({ label, children }) => (
  <div className="mb-4">
    {label && <label className="kicker text-neutral-500 block mb-2">{label}</label>}
    {children}
  </div>
);

export const inputCls = "w-full border border-neutral-300 px-3 py-2.5 font-body text-sm text-neutral-900 bg-white focus:border-neutral-900 focus:outline-none transition-colors";

export const Input = (props) => <input {...props} className={`${inputCls} ${props.className || ""}`} />;
export const Textarea = (props) => <textarea {...props} className={`${inputCls} ${props.className || ""}`} />;
export const Select = ({ children, ...props }) => <select {...props} className={`${inputCls} ${props.className || ""}`}>{children}</select>;

export const AdminButton = ({ children, variant = "solid", ...props }) => {
  const v = {
    solid: "bg-neutral-900 text-white hover:bg-neutral-700 border-neutral-900",
    outline: "bg-white text-neutral-900 border-neutral-300 hover:border-neutral-900",
    danger: "bg-white text-red-600 border-red-300 hover:bg-red-600 hover:text-white",
  }[variant];
  return (
    <button {...props} className={`inline-flex items-center gap-2 px-5 py-2.5 kicker border transition-colors disabled:opacity-50 ${v} ${props.className || ""}`}>
      {children}
    </button>
  );
};

export const PageHead = ({ title, sub, children }) => (
  <div className="flex flex-wrap items-end justify-between gap-4 mb-8 pb-6 border-b border-neutral-200">
    <div>
      <h1 className="font-display font-extrabold text-3xl text-neutral-900 uppercase">{title}</h1>
      {sub && <p className="font-body text-neutral-500 mt-1">{sub}</p>}
    </div>
    <div className="flex gap-3">{children}</div>
  </div>
);

// Convert a string to a URL slug
export const slugify = (s) =>
  (s || "").toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

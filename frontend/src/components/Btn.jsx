import React from "react";
import { Link } from "react-router-dom";

// Sharp, high-contrast button. variant: solid | outline | ghost-light
export default function Btn({ to, href, onClick, children, variant = "solid", className = "", dataTestId, type = "button", disabled }) {
  const base =
    "inline-flex items-center justify-center gap-2 px-8 py-4 kicker transition-colors duration-300 disabled:opacity-50";
  const variants = {
    solid: "bg-neutral-900 text-white hover:bg-neutral-700 border border-neutral-900",
    outline: "bg-transparent text-neutral-900 border border-neutral-900 hover:bg-neutral-900 hover:text-white",
    "light-solid": "bg-white text-neutral-900 hover:bg-neutral-200 border border-white",
    "light-outline": "bg-transparent text-white border border-white/70 hover:bg-white hover:text-neutral-900",
  };
  const cls = `${base} ${variants[variant]} ${className}`;
  if (to) return <Link to={to} className={cls} data-testid={dataTestId}>{children}</Link>;
  if (href) return <a href={href} className={cls} data-testid={dataTestId}>{children}</a>;
  return <button type={type} onClick={onClick} disabled={disabled} className={cls} data-testid={dataTestId}>{children}</button>;
}

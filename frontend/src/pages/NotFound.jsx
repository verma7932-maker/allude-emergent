import React from "react";
import { Link } from "react-router-dom";
import Btn from "@/components/Btn";

export default function NotFound() {
  return (
    <div className="pt-[140px] pb-40 max-w-2xl mx-auto px-5 text-center">
      <p className="font-wordmark text-7xl md:text-9xl text-neutral-200">404</p>
      <h1 className="heading-display text-3xl md:text-4xl text-neutral-900 uppercase mt-4">Page Not Found</h1>
      <p className="font-body text-lg text-neutral-600 mt-4 leading-relaxed">The page you are looking for doesn't exist or has been moved.</p>
      <Btn to="/" variant="solid" className="mt-8" dataTestId="notfound-home-btn">Back to Home</Btn>
    </div>
  );
}

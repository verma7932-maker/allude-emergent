import React from "react";

// ALLUDE brand wordmark — uses the supplied logo artwork.
// dark=true renders the white version for use on dark backgrounds.
export default function Wordmark({ className = "h-8", dark = false, alt = "ALLUDE", dataTestId }) {
  const src = dark ? "/allude-logo-white.png" : "/allude-logo.png";
  return (
    <img
      src={src}
      alt={alt}
      data-testid={dataTestId}
      className={`inline-block w-auto ${className}`}
      draggable={false}
    />
  );
}

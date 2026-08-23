import React from "react";
import useSeo from "@/hooks/useSeo";

export default function Legal({ type = "privacy" }) {
  const isPrivacy = type === "privacy";
  useSeo({ title: `${isPrivacy ? "Privacy Policy" : "Terms & Conditions"} | ALLUDE INDIA` });
  return (
    <div className="pt-[120px] pb-32 max-w-3xl mx-auto px-5 md:px-10">
      <h1 className="heading-display text-4xl md:text-5xl text-neutral-900 uppercase mb-8">
        {isPrivacy ? "Privacy Policy" : "Terms & Conditions"}
      </h1>
      <div className="font-body text-neutral-600 leading-relaxed space-y-5">
        {isPrivacy ? (
          <>
            <p>ALLUDE INDIA respects your privacy. Information submitted through our enquiry and contact forms is used solely to respond to your request and to manage business communications.</p>
            <p>We do not sell or share your personal information with third parties for marketing purposes. Enquiry data is stored securely and accessible only to authorised ALLUDE personnel.</p>
            <p>For any privacy-related questions, please contact us at support@alludeindia.com.</p>
          </>
        ) : (
          <>
            <p>This website is operated by ALLUDE INDIA. It presents our brand and product catalogue for informational and business partnership purposes.</p>
            <p>Product images, descriptions and pricing are indicative and may be updated at any time. This website does not currently offer online ordering or payment.</p>
            <p>All content, branding and imagery are the property of ALLUDE INDIA and may not be reproduced without permission.</p>
          </>
        )}
      </div>
    </div>
  );
}

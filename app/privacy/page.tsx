import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${site.name}.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold text-stone-900 sm:text-4xl">Privacy Policy</h1>
      <div className="prose-content mt-6">
        <p>
          This Privacy Policy explains how {site.name} (&quot;we&quot;, &quot;us&quot;) collects and uses information when you visit{" "}
          {site.domain}.
        </p>
        <h2>Information We Collect</h2>
        <p>
          We may collect standard analytics data (pages visited, general location, device/browser type) to
          understand how our site is used. We do not knowingly collect sensitive personal or health information
          through normal site browsing.
        </p>
        <h2>Cookies & Affiliate Links</h2>
        <p>
          We use cookies for basic site analytics and to support affiliate tracking when you click a link to a
          retailer. Third-party retailers and ad networks may set their own cookies subject to their own privacy
          policies.
        </p>
        <h2>Contact</h2>
        <p>
          Questions about this policy can be sent to <a href={`mailto:editorial@${site.domain}`}>editorial@{site.domain}</a>.
        </p>
      </div>
    </div>
  );
}

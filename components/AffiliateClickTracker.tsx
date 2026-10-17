"use client";

import { useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";

/** Sends a GA4 `affiliate_click` event for every outbound Amazon link, so
 *  Analytics shows which pages and products send buyers to Amazon. */
export default function AffiliateClickTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const link = (e.target as HTMLElement | null)?.closest?.("a");
      if (!link || !/amazon\.com\//.test(link.href)) return;
      const asin = link.href.match(/\/dp\/([A-Z0-9]{10})/)?.[1];
      sendGAEvent("event", "affiliate_click", {
        link_url: link.href,
        link_text: (link.textContent ?? "").trim().slice(0, 100),
        asin: asin ?? "search",
        page_path: window.location.pathname,
      });
    }
    // Capture phase so the event fires even if a handler stops propagation.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}

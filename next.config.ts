import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Mane 'n Tail's review is canonical at its own URL; send the duplicate there.
      { source: "/reviews/mane-n-tail-shampoo", destination: "/mane-n-tail-shampoo-read-first", permanent: true },
    ];
  },
};

export default nextConfig;

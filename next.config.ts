import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['consists-certified-cube-five.trycloudflare.com'],
  async headers() {
    return [
      {
        source: "/embed/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

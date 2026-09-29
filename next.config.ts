import type { NextConfig } from "next";

// The Django API (../simbatech-api). Browser requests to /api/* are proxied there, so the
// site and the API share one origin and the API's session cookie just works.
const API_URL = process.env.API_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_URL}/api/:path*` }];
  },
};

export default nextConfig;

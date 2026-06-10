import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Filenames are NOT content-hashed (assets get re-exported in place),
        // so keep browser staleness bounded and let ETags revalidate. Do not
        // add `immutable` here without versioning the filenames first.
        source: "/avatars-3d/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/office-view.mp4",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600" }],
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  transpilePackages: ["apple-liquid-glass-webgl"],
  env: {
    // Permite usar WEB3FORMS_ACCESS_KEY en Vercel si ya la creaste antes del cambio client-side.
    NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY:
      process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim() ||
      process.env.WEB3FORMS_ACCESS_KEY?.trim() ||
      "",
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    ] }];
  },
  async redirects() {
    return [{ source: "/ofertas", destination: "/", permanent: false }];
  },
};

export default nextConfig;

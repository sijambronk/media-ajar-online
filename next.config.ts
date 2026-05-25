import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false, // Menyembunyikan seluruh indikator development
  reactCompiler: false,
  output: "standalone",
  // @ts-ignore - Required for dynamic local network HMR
  allowedDevOrigins: process.env.NEXT_PUBLIC_DEV_IP ? [process.env.NEXT_PUBLIC_DEV_IP, "localhost:3000", "localhost:2000"] : ["localhost:3000", "localhost:2000"],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;

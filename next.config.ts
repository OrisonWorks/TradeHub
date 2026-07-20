import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/TradeHub',
  assetPrefix: '/TradeHub',
};

export default nextConfig;

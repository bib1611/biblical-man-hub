import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS domains for feed images
      },
    ],
    formats: ['image/webp', 'image/avif'], // Modern formats for better compression
  },
};

export default nextConfig;

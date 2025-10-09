import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  basePath: '/admin',
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui.shadcn.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co/',
      },
      {
        protocol: 'https',
        hostname: 'mongoladventist.org',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.databridgemarketresearch.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'backend',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '103.143.40.184',
        port: '4001',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'glovo.dhmedia.io',
      },
      {
        protocol: 'https',
        hostname: 'imageproxy.wolt.com',
      },
      {
        protocol: 'https',
        hostname: 'consumer-static-assets.wolt.com',
      },
    ],
  },
};

export default nextConfig;
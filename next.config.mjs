/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Nothing special needed
  },
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
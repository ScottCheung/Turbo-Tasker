/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep a production build from replacing the dev server's .next cache.
  distDir: process.env.NODE_ENV === "production" ? ".next-build" : ".next"
};

export default nextConfig;

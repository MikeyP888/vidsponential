/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure proper build output for Vercel with middleware
  experimental: {
    // This ensures routes-manifest.json is generated
    instrumentationHook: true,
  },
}

module.exports = nextConfig

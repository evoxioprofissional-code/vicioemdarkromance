/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Permite upload de PDFs maiores via Server Actions (admin → catálogo).
    serverActions: { bodySizeLimit: "50mb" },
  },
};

export default nextConfig;

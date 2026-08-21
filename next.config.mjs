/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Permite upload de PDFs maiores via Server Actions (admin → catálogo).
    serverActions: { bodySizeLimit: "50mb" },
  },
  webpack: (config) => {
    // react-pdf/pdfjs tenta resolver "canvas" (dependência nativa opcional que
    // só existe no Node). No navegador não é usada — desativamos para o build.
    config.resolve.alias = { ...config.resolve.alias, canvas: false };
    return config;
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        pathname: '/**',
      },
      // Adicione outros domínios conforme necessário
    ],
  },
  webpack(config, { isServer }) {
    if (process.env.NODE_ENV === 'production') {
      config.devtool = false; // Desabilita source maps em produção
    }
    return config;
  },
};

export default nextConfig;

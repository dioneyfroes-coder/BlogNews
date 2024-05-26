/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { isServer }) {
    if (process.env.NODE_ENV === 'production') {
      config.devtool = false; // Desabilita source maps em produção
    }
    return config;
  },
};

export default nextConfig;

import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  webpack: (config) => {
    config.ignoreWarnings = [/webpack.cache.PackFileCacheStrategy/];
    return config;
  },
};

export default withNextIntl(nextConfig);
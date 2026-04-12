import path from "path";
import { fileURLToPath } from "url";
import createNextIntlPlugin from "next-intl/plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  outputFileTracingRoot: path.join(__dirname, "../"),
  webpack: (config) => {
    config.ignoreWarnings = [/webpack.cache.PackFileCacheStrategy/];
    return config;
  },
};

export default withNextIntl(nextConfig);
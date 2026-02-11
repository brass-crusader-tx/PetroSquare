/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@petrosquare/ui"],
};

module.exports = nextConfig;

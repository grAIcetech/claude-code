/** @type {import('next').NextConfig} */
const isGhPages = process.env.GH_PAGES === '1';
const repoBase = '/claude-code';

const nextConfig = {
  reactStrictMode: true,
  ...(isGhPages
    ? {
        output: 'export',
        basePath: repoBase,
        assetPrefix: `${repoBase}/`,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;

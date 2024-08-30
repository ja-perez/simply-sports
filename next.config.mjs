/** @type {import('next').NextConfig} */

const imageConfig =
    process.env.MODE === 'prod'
    ? { images: { loader: 'custom', loaderFile: './loader.ts' }}
    : {}

const nextConfig = {
    assetPrefix: process.env.MODE === 'prod' ? '/team19/' : '',
    ...imageConfig,
};

export default nextConfig;

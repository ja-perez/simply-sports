/** @type {import('next').NextConfig} */
const nextConfig = {
    assetPrefix: process.env.MODE === 'prod' ? '/team19/' : '',
};

export default nextConfig;

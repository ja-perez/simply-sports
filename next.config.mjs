import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */

const imageConfig =
    process.env.MODE === 'prod'
    ? { images: { loader: 'custom', loaderFile: './loader.ts' }}
    : {}

const nextConfig = {
    // Configure 'pageExtensions' to include markdown and MDX files
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    assetPrefix: process.env.MODE === 'prod' ? '/team19/' : '',
    ...imageConfig,
};

const withMDX = createMDX({
    extension: /\.mdx?$/,
});


export default withMDX(nextConfig);

import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm';
import rehypePrism  from 'rehype-prism-plus';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import rehypeCodeTitles from 'rehype-code-titles';
import { visit } from "unist-util-visit";

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
    options: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
            preProcess,
            rehypePrism,
            rehypeAutolinkHeadings,
            rehypeSlug,
            rehypeCodeTitles,
            postProcess
        ]
    }
});

function preProcess(tree) {
    visit(tree, (node) => {
        if (node?.type === "element" && node?.tagName === "pre") {
            const [codeEl] = node.children;
            if (codeEl.tagName !== "code") return;
            node.raw = codeEl.children?.[0].value;
        }
    });
};

function postProcess(tree) {
    console.log(1)
    visit(tree, "element", (node) => {
        if (node?.type === "element" && node?.tagName === "pre") {
            node.properties["raw"] = node.raw;
        }
    });
};


export default withMDX(nextConfig);

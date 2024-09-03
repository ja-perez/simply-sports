import { compileMDX } from "next-mdx-remote/rsc";
import { promises as fs } from "fs";
import path from "path";


async function parseMdx<Frontmatter>(rawMdx: string) {
    return await compileMDX<Frontmatter>({
        source: rawMdx,
        options: {
            parseFrontmatter: true,
        },
    })
}

type BaseMdxFormatter = {
    title: string;
    description: string;
};

export async function getDocsForSlug(slug: string) {
    try {
        const contentPath = getDocsContentPath(slug);
        const rawMdx = await fs.readFile(contentPath, "utf-8");
        return await parseMdx<BaseMdxFormatter>(rawMdx);
    } catch (err) {
        console.error(`Error with getting docs for slug: ${slug}`);
        console.log(err);
    }
}

function getDocsContentPath(slug: string) {
    return path.join(process.cwd(), "src", "contents", "learn", `${slug}`, "index.mdx")
}


import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import LearnBreadcrumb from "@/components/learn/learn-breadcrumb"

import { getDocsForSlug } from "@/lib/markdown";
import { notFound } from "next/navigation";


interface LearnPageProps {
    params: { slug: string[] };
}

export default async function LearnPage({
    params: {
        slug = []
    }
}: LearnPageProps) {
    const pathName = slug.join("/");
    const res = await getDocsForSlug(pathName);
    if (!res) notFound();
    return (
        <>
        <Container id="learn-container">
            <LearnBreadcrumb paths={slug} />
            <Typography variant="h3">
                {res.frontmatter.title}
            </Typography>
            <Typography variant="subtitle1">
                {res.frontmatter.description}
            </Typography>
            <div className="">
                {res.content}
            </div>
        </Container>
        </>
    )
}
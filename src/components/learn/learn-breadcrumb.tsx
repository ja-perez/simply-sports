import Breadcrumbs from "@mui/material/Breadcrumbs";
import CustomLink from "@/components/custom-link";

export default function LearnBreadcrumb({
    paths
}: { paths: string[] }) {
    return (
        <Breadcrumbs separator=">" aria-label="breadcrumb">
            <CustomLink href="learn/introduction">
                Learn
            </CustomLink>
            {paths.map((path, index) => (
                <CustomLink href={"learn/" + paths.slice(0,index+1).join("/")} key={path} >
                    {toTitleCase(path)}
                </CustomLink>
            ))}
        </Breadcrumbs>
    )
}

function toTitleCase(input: string): string {
    const words = input.split("-");
    const capitalizeWords = words.map((word) =>
    word.charAt(0).toUpperCase() + word.slice(1));
    return capitalizeWords.join(" ");
}
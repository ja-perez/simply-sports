import CustomLink from "@/components/custom-link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function NotFound() {
    return (
        <Container
            sx={{
                display: "flex",
                flexDirection:"column",
                justifyItems: "start",
                gap: "12px"
            }}
            >
                <div>
                    <Typography variant="h2">404</Typography>
                    <Typography variant="subtitle1">Page not found</Typography>
                    </div>

                <CustomLink href="learn" >
                    Back to learning page
                    </CustomLink>
                <CustomLink href="/" >
                    Back to homepage
                    </CustomLink>
        </Container>
    )
}
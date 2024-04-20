import TopBarNav from "@/components/top-bar-nav";

import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main>
            <TopBarNav />
            <Container 
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    height: "100vh",
                    pt: { xs: 12, sm: 16 },
                    pb: { xs: 8, sm: 12 },
                }}
                maxWidth="lg"
                id="sports-news-container"
            >
                <Grid container spacing={2} id="sports-news-content-grid-container">

                    {/* Main Body */}
                    <Grid item xs={12} id="sports-news-body-grid-item">
                        {children}
                    </Grid>
                </Grid>
            </Container>
        </main>
    )
}
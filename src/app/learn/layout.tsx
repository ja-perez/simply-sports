import TopBarNav from "@/components/top-bar-nav";
import SideNav from "@/components/learn/side-nav";

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
                id="learn-container"
            >
                <Grid container spacing={2} id="learn-content-grid-container">

                    {/* Side Navigation */}
                    <Grid item xs={2} id="learn-nav-grid-item">
                        <SideNav />

                    </Grid>

                    {/* Main Body */}
                    <Grid item xs={10} id="learn-body-grid-item">
                        {children}
                    </Grid>
                </Grid>
            </Container>
        </main>
    )
}
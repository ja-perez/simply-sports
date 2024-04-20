import TopBarNav from "@/components/top-bar-nav";
import SideNav from "@/components/side-nav";

import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";

const sideNavProps = {
    page_id: "practice",
    subheader: "Practice Navigation",
    links: [
        { name: 'lounge', label: 'Lounge', href: '/practice/lounge'},
        { name: 'practice', label: 'Tutorial', href: '/practice/tutorial'},
    ],
}

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
                id="practice-container"
            >
                <Grid container spacing={2} id="practice-content-grid-container">

                    {/* Side Navigation */}
                    <Grid item xs={2} id="practice-nav-grid-item">
                        <SideNav page_id={sideNavProps.page_id} subheader={sideNavProps.subheader}
                        links={sideNavProps.links} />
                    </Grid>

                    {/* Main Body */}
                    <Grid item xs={10} id="practice-body-grid-item">
                        {children}
                    </Grid>
                </Grid>
            </Container>
        </main>
    )
}
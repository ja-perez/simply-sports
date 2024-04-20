import TopBarNav from "@/components/top-bar-nav";
import SideNav from "@/components/side-nav";

import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";

const sideNavProps = {
    page_id: "learn",
    subheader: "Learn Navigation",
    links: [
        { name: 'introduction', label: 'Introduction', href: '/learn/introduction'},
        { name: 'terms', label: 'Terms', href: '/learn/terms'},
        { name: 'practice', label: 'Practice', href: '/learn/practice'},
        { name: 'resources', label: 'Resources', href: '/learn/resources'},
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
                id="learn-container"
            >
                <Grid container spacing={2} id="learn-content-grid-container">

                    {/* Side Navigation */}
                    <Grid item xs={2} id="learn-nav-grid-item">
                        <SideNav page_id={sideNavProps.page_id} subheader={sideNavProps.subheader}
                        links={sideNavProps.links} />
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
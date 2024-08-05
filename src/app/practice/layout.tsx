import TopBarNav from "@/components/top-bar-nav";

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
                maxWidth="lg" 
                id="practice-container"
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    height: "100vh",
                    pt: { xs: 12, sm: 16 },
                    pb: { xs: 8, sm: 12 },
                }}
            >
                {children}
            </Container>
        </main>
    )
}
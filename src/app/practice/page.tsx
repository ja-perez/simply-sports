import TopBarNav from "@/components/top-bar-nav";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

export default function Practice() {
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
                    <Grid item xs={2} id="practice-nav-grid-item">
                        <Box sx={{ textAlign: 'center' }} border="dashed 1px">
                            <h1>Practice Nav</h1>
                        </Box>
                    </Grid>
                    <Grid item xs={10} id="practice-body-grid-item">
                        <Box sx={{ textAlign: 'center' }} border="dashed 1px">
                            <p>Practice Content</p>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </main>
    );
}
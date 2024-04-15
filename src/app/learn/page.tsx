import TopBarNav from '@/components/top-bar-nav';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

export default function Learn() {
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
                    <Grid item xs={2} id="learn-nav-grid-item">
                        <Box sx={{ textAlign: 'center' }} border="dashed 1px">
                            <h1>Learn Nav</h1>
                        </Box>
                    </Grid>
                    <Grid item xs={10} id="learn-body-grid-item">
                        <Box sx={{ textAlign: 'center' }} border="dashed 1px">
                            <p>Learn Content</p>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </main>
    );
}
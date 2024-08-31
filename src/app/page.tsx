import TopBarNav from '@/components/top-bar-nav';
import { Hero, Features, Background } from '@/components/home';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

export default function Home() {
    return (
        <main>
			<TopBarNav />
            <Container
                sx={{
                    display: 'flex',
                    height: "100vh",
                    pt: { xs: 12, sm: 16 },
                    pb: { xs: 8, sm: 12 },
                }}
                maxWidth="lg"
                id="home-container"
                >
                    <Grid container spacing={2} id="home-grid-container">
                        <Grid item xs={12} id="hero-grid-item">
                            <Hero />
                        </Grid>
                        <Grid item xs={12}>
                        <Divider />
                        </Grid>
                        <Grid item xs={12} id="features-grid-item">
                            <Features />
                        </Grid>
                        <Grid item xs={12}>
                        <Divider />
                        </Grid>
                        <Grid item xs={12} id="mission-grid-item">
                            <Background />
                        </Grid>
                    </Grid>
            </Container>

        </main>
    );
}
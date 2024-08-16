import Container from "@mui/material/Container";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

export default function PracticeLogin() {
    return (
        <Grid
            container
            sx={{
                display: 'flex',
                height: "100vh",
            }}
            maxWidth="lg"
            id="landing-page-container"
            >
            <Grid item xs={5.5} id="left-side-grid-item" textAlign={"center"}>
                Continue as guest
                </Grid>

            <Divider id="landing-page-divider" orientation="vertical" sx={{ mx: 2, }}/>

            <Grid item xs={5.5} id="right-side-grid-item" textAlign={"center"}>
                <Grid item xs={12} id="sign-in-grid-item">
                    Sign in
                    </Grid>

                <Grid item xs={12} id="right-side-divider">
                    <Divider variant="middle" sx={{ my: 2, }}/>
                    </Grid>

                <Grid item xs={12} id="sign-up-grid-item">
                    Sign up
                    </Grid>

                </Grid>
        </Grid>
    );
}   
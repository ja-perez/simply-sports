
import Dashboard from "./dashboard/page";
import LandingPage from "@/components/practice/landing-page";

import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import SectionNav from "@/components/practice/section-nav";

export default function Practice() {
    const userLoggedIn = false;
    return (
        <>
        <Grid container spacing={2}
        id="practice-grid-container">

            { userLoggedIn ? 
            (
                <>

            <Grid item xs={12} id="practice-grid-nav-item">
                <SectionNav />
                <Divider sx={{ my: 2 }} />
            </Grid>
            {/* Main Body */}
            <Grid item xs={12} id="practice-grid-body-item">
                <Dashboard />
            </Grid>
                </>
            ) :
            (
            <>
            {/* Main Body */}
            <Grid item xs={12} id="practice-grid-body-item">
                <LandingPage />
            </Grid>
                </>
            )
            }

        </Grid>
        </>
    );
}
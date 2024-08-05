import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

export default function SectionNav() {
    return (
        <>
            <Grid container spacing={2} id="news-filter-grid-container" >
                <Grid item xs={3.5} id="sports-filter-grid-item" sx={{ display:'flex', justifyContent:'center'}}>
                    <Button variant="outlined" color="primary">
                        Select Match
                    </Button>
                </Grid>

                <Grid item xs={3.5} id="sports-filter-grid-item" sx={{ display:'flex', justifyContent:'center'}}>
                    <Button variant="outlined" color="primary">
                        Random Match
                    </Button>
                </Grid>

                <Grid item xs={3.5} id="team-filter-grid-item"  sx={{ display:'flex', justifyContent:'center'}}>
                    <Button variant="outlined" color="primary">
                        Go to Dashboard
                    </Button>
                </Grid>
            </Grid >
        </>
    );
}
import Grid from '@mui/material/Grid';

import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import Disclaimer from '@/components/practice/disclaimer';
import MenuActions from '@/components/practice/menu-actions';
import CustomLink from '@/components/custom-link';

export default function Practice() {
    return (
        <>
        <Grid container spacing={2}
            sx={{
                display: 'flex',
            }}
        >
            <Grid item xs={12}>
                <Typography variant="h2">
                    Practice Lounge
                </Typography>
                </Grid>

            <Grid item xs={12}>
                <Typography variant="subtitle1">
                    Put your gambling skills to the test with our simulated betting sessions. Choose from over 100+
                    matches spanning various sports, leagues, and seasons. If you find yourself losing one to many
                    fictional dollars, visit the&nbsp;
                    <CustomLink href="learn" {...{className:"underline"}}>Learning Academy</CustomLink>
                    &nbsp;for some tips and breakdowns on what goes into a &quot;good&quot; bet.
                    </Typography>
                </Grid>

            <Grid item xs={12}>
                <Divider aria-hidden="true"/>
                </Grid>

            <Grid item xs={12}>
                <Disclaimer />
                </Grid>

            <MenuActions />
        </Grid>
        </>
    );
}
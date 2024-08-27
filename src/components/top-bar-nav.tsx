
import TopBarProfile from '@/components/topbar/top-bar-profile';

import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';

import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import CustomLink from '@/components/custom-link';
import { topBarNavLinks } from '@/components/nav-links';
import Sports from '@mui/icons-material/Sports';

export default function TopBarNav() {
    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    boxShadow: 0,
                    bgcolor: 'transparent',
                    mt: 2,
                }}
            >
                <Container maxWidth="lg">
                    {/* 
                        Paper component is used to create a shadow effect on the AppBar.
                        elevation={5} creates a shadow effect of magnitude 5 out of 24, higher the number, "deeper" the shadow.
                        color: 'white' as navlinks text color is inheritted 
                    */}
                    <Paper elevation={5} sx={{ borderRadius: '1000px', color: 'white' }}> 
                        <Toolbar
                            variant="regular"
                            sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderRadius: '1000px',
                            bgcolor: 'teal',
                            }}
                            id="app-toolbar"
                        >
                            <TopBarLeftSide />
                            {/* Below commented out is the profile icon with accompanying items */}
                            {/* <TopBarRightSide/> */}
                        </Toolbar>
                    </Paper>
                </Container>

            </AppBar>
        </>
    )
}

function TopBarLeftSide() {
    return (
        <Box
            sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                px: 0,
            }}
            id="top-bar-left-side"
        >
            <TopBarLogo />
            <TopBarLinks />
        </Box>
    )
}

function TopBarRightSide() {
    return (
        <TopBarProfile />
    )
}

function TopBarLogo() {
    return (
        <CustomLink href="/" {...{ className:"flex items-center" }}>
            <Sports />
            <Typography variant="body1" sx={{ pr: '12px'}}>
                SimplySports
            </Typography>
        </CustomLink>
    )
}

function TopBarLinks() {
    return (
        <Box sx={{ display: {xs: 'none', md: 'flex'} }}>
            {topBarNavLinks.map((link) => (
                <CustomLink
                    href={link.href}
                    key={link.name}
                    {...{ className:"flex items-center" }}
                >
                    <MenuItem
                        sx={{ py: '6px', px: '12px', borderRadius: '5px'}}
                    >
                        <Typography variant="body2" >
                            {link.label}
                        </Typography>
                    </MenuItem>
                </CustomLink>
            ))}
        </Box>
    )
}


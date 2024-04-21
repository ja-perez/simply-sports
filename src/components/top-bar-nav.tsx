
import TopBarProfile from '@/components/topbar/top-bar-profile';

import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';

import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import Link from 'next/link';

import Home from '@mui/icons-material/Home';
import School from '@mui/icons-material/School';
import LocalActivity from '@mui/icons-material/LocalActivity';
import Sports from '@mui/icons-material/Sports';
import SportsSoccer from '@mui/icons-material/SportsSoccer';


const links = [
    { name: 'home', label: 'Home', href: '/', icon: Home, sections: ['about', 'features', 'background']},
    { name: 'sports&news', label: 'Sports & News', href: '/sports-news', icon: SportsSoccer, sections: ['news', 'sports']},
    { name: 'learn', label: 'Learn', href: '/learn', icon: School, sections: ['tutorials', 'courses', 'resources']},
    { name: 'practice', label: 'Practice', href: '/practice', icon: LocalActivity, sections: ['lounge', 'tutorial']},
]

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
                        Paper component is used to create a shadow effect on the AppBar
                        elevation={5} creates a shadow effect of magnitude 5 out of 24, higher the number, "deeper" the shadow
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
        <Link href="/" className="flex items-center">
            <Sports />
            <Typography variant="body1" sx={{ pr: '12px'}}>
                SimplySports
            </Typography>
        </Link>
    )
}

function TopBarLinks() {
    return (
        <Box sx={{ display: {xs: 'none', md: 'flex'} }}>
            {links.map((link) => (
                <Link
                    key={link.name}
                    href={link.href}
                    className="py-6px px-12px "
                >
                    <MenuItem
                        sx={{ py: '6px', px: '12px', borderRadius: '5px'}}
                    >
                        <Typography variant="body2" >
                            {link.label}
                        </Typography>
                    </MenuItem>
                </Link>
            ))}
        </Box>
    )
}


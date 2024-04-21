import Link from 'next/link'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import List from '@mui/material/List'
import ListSubheader from '@mui/material/ListSubheader'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'

const learnProps = {
    page_id: "learn",
    subheader: "Learn Navigation",
    links: [
        { name: 'introduction', label: 'Introduction', href: '/learn/introduction'},
        { name: 'terminology', label: 'Terminology', href: '/learn/terminology'},
        { name: 'resources', label: 'Resources', href: '/learn/resources'},
    ],
}

export default function SideNav() {
    return (
        <>
            <Paper elevation={5} >
                <Box sx={{ textAlign: 'center' }} border="dashed 1px">
                    <List
                        component="nav"
                        aria-labelledby={learnProps.page_id + "-nav-list"}
                        subheader={
                            <ListSubheader component="div" id="side-nav-list" >
                                {learnProps.subheader}
                            </ListSubheader>
                        }
                    >
                        {learnProps.links.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                            >
                                <ListItemButton>
                                    <ListItemText primary={link.label} />
                                </ListItemButton>
                            </Link>
                        ))}
                    </List>
                </Box>
            </Paper>
            <Paper elevation={5} sx={{ borderRadius: '5px' }} >
                <Box sx={{ borderRadius: '5px', bgcolor: 'teal' }} my={2} id='practice-button-box' >
                    <Link
                        key="practice-link"
                        href="/practice"
                        id="practice-link"
                        className="flex justify-center"
                    >
                        <Button id="practice-button" sx={{ color: 'white', width: '100%' }}>
                            <Typography variant="button" id="practice-label">Practice</Typography>
                        </Button>
                    </Link>
                </Box>
            </Paper>
        </>
    )
}
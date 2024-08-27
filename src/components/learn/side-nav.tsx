import CustomLink from '@/components/custom-link'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import List from '@mui/material/List'
import ListSubheader from '@mui/material/ListSubheader'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'

import { learnSideNav } from '@/components/nav-links'


const learnProps = {
    page_id: "learn",
    subheader: "Learn Navigation",
    links: learnSideNav
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
                            <CustomLink
                                href={link.href}
                                key={link.name}
                            >
                                <ListItemButton>
                                    <ListItemText primary={link.label} />
                                </ListItemButton>
                            </CustomLink>
                        ))}
                    </List>
                </Box>
            </Paper>
            <Paper elevation={5} sx={{ borderRadius: '5px' }} >
                <Box sx={{ borderRadius: '5px', bgcolor: 'teal' }} my={2} id='practice-button-box' >
                    <CustomLink
                        href="practice"
                        key="practice-link"
                        {...{
                            id:"practice-link",
                            className:"flex justify-center"
                        }}
                    >
                        <Button id="practice-button" sx={{ color: 'white', width: '100%' }}>
                            <Typography variant="button" id="practice-label">Practice</Typography>
                        </Button>
                    </CustomLink>
                </Box>
            </Paper>
        </>
    )
}

import Link from 'next/link'
import List from '@mui/material/List'
import ListSubheader from '@mui/material/ListSubheader'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Box from '@mui/material/Box'
import { Paper } from '@mui/material'

interface SideNavProps {
    page_id: string,
    subheader: string,
    links: any[]
}

export default function SideNav( { page_id, subheader, links } : SideNavProps) {
    return (
        <>
            <Paper elevation={5} >
                <Box sx={{ textAlign: 'center' }} border="dashed 1px">
                    <List
                        component="nav"
                        aria-labelledby={page_id + "-nav-list"}
                        subheader={
                            <ListSubheader component="div" id="side-nav-list">
                                {subheader}
                            </ListSubheader>
                        }
                    >
                        {links.map((link) => (
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
        </>
    )
}
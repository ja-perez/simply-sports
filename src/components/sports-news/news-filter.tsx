'use client';
import React from 'react';

import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

import Sports from '@mui/icons-material/Sports';
import SportsFootball from '@mui/icons-material/SportsFootball';
import SportsSoccer from '@mui/icons-material/SportsSoccer';
import Typography from '@mui/material/Typography';

import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

export default function NewsFilter() {
    const [currentSport, setCurrentSport] = React.useState(sportsFilter.items[0]);
    const [currentLeague, setCurrentLeague] = React.useState(leagueFilter.items[0]);
    const [currentTeam, setCurrentTeam] = React.useState(teamFilter.items[0]);

    return (
        <>
            <Grid container spacing={2} id="news-filter-grid-container" >
                <Grid item xs={4} id="sports-filter-grid-item" sx={{ display:'flex', justifyContent:'center'}}>
                    <MenuFilter type={sportsFilter.type} items={sportsFilter.items} currentSelection={currentSport} setCurrentSelection={setCurrentSport}/>
                </Grid>

                <Grid item xs={4} id="sports-filter-grid-item" sx={{ display:'flex', justifyContent:'center'}}>
                    <MenuFilter type={leagueFilter.type} items={leagueFilter.items} currentSelection={currentLeague} setCurrentSelection={setCurrentLeague}/>
                </Grid>

                <Grid item xs={4} id="team-filter-grid-item"  sx={{ display:'flex', justifyContent:'center'}}>
                    <MenuFilter type={teamFilter.type} items={teamFilter.items} currentSelection={currentTeam} setCurrentSelection={setCurrentTeam}/>
                </Grid>
            </Grid >
            <Divider sx={{ my: 2 }} />

        </>
    )
}

interface MenuFilterProps {
    type: string;
    items: any[];
    currentSelection: any;
    setCurrentSelection: any;
}

function MenuFilter({ type, items, currentSelection, setCurrentSelection}: MenuFilterProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    }
    return (
        <>
            <Button
                id={type + "-button"}
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <Typography variant="body1" >{type}</Typography>
                <Divider orientation="vertical" flexItem sx={{mx:2}}/>
                <currentSelection.icon />
                {currentSelection.name}
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                'aria-labelledby': type + '-button',
                }}
            >
                {items.map((item) => (
                    <MenuItem key={item.id} onClick={() => {
                        setCurrentSelection(item);
                        handleClose();
                    }}>
                        {item.name}
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}

const sportsFilter = {
    type: 'Sport',
    items: [
        { name: 'All', id: 0, icon: Sports },
        { name: 'Football', id: 1, icon: SportsFootball },
        { name: 'Soccer', id: 2, icon: SportsSoccer },
    ]
}
const leagueFilter = {
    type: 'League',
    items: [
        { sport: 'Soccer', name: 'All', id: 0, icon: Sports },
        { sport: 'Soccer', name: 'Premier League', id: 1, icon: SportsFootball },
        { sport: 'Soccer', name: 'La Liga', id: 2, icon: SportsSoccer },
    ]
}
const teamFilter = {
    type: 'Team',
    items: [
        { league: 'Premier League', name: 'All', id: 0, icon: Sports },
        { league: 'Premier League', name: 'Manchester United', id: 1, icon: SportsFootball },
        { league: 'Premier League', name: 'Real Madrid', id: 2, icon: SportsSoccer },
    ]
}
'use client';
import React from 'react';
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { 
    Grid, 
    Button, 
    Typography, 
    Menu, 
    MenuItem,
    Divider, 
} from "@mui/material";
import { ButtonProps } from '@mui/material/Button';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import SportsSoccer from '@mui/icons-material/SportsSoccer';
import SportsBaseballIcon from '@mui/icons-material/SportsCricket';
import PublicIcon from '@mui/icons-material/Public';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { styled } from '@mui/material/styles';


interface ContentFilterProps {
    sports: {
        [key: string]: {
            title: string;
        };
    },
    leagues: {
        [key: string]: {
            title: string;
        };
    }
}

export default function ContentFilter({
    sports,
    leagues
}: ContentFilterProps) {
    return (
        <Grid container spacing={2} id="news-filter-grid-container" >
            <Grid item xs={6} id="sport-filter-grid-item" sx={{ display:'flex', justifyContent:'center', alignItems:'center'}}>
                <MenuFilter label="Sport" paramKey="sport" items={sports}/>
            </Grid>

            <Grid item xs={6} id="league-filter-grid-item" sx={{ display:'flex', justifyContent:'center', alignItems:'center'}}>
                <MenuFilter label="League" paramKey="league" items={leagues}/>
            </Grid>
        </Grid>
    )
}

const StyledDiv = styled('div')(({ theme }) => ({
    ...theme.typography.button,
    ...theme.typography.body1,
    color: theme.palette.primary.main
}))

interface MenuFilterProps {
    label: string;
    paramKey: string;
    items: {
        [key: string]: {
            title: string;
        };
    }
}

function MenuFilter({
    label,
    paramKey,
    items,
}: MenuFilterProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    }

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    function handleSelection(key:string, value: string) {
        const params = new URLSearchParams(searchParams);
        params.set(key, value);
        if (key === "sport") params.set("league", "all");
        replace(`${pathname}?${params.toString()}`);
   }

    const currentSelection = searchParams.get(paramKey) || "all";

    return (
        <>
            <StyledDiv id={paramKey + "-label"} sx={{ textAlign:"center"}}>
                {label}
            </StyledDiv>
            <Divider orientation="vertical" variant="middle" flexItem sx={{mx:2}}/>
            <Button
                id={paramKey + "-button"}
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                disabled={Object.keys(items).length === 0}
            >
                {currentSelection === "all" && <PublicIcon/>}
                {currentSelection === "soccer" && <SportsSoccer/>}
                {currentSelection === "football" && <SportsFootballIcon/>}
                {currentSelection === "baseball" && <SportsBaseballIcon/>}
                <Typography variant="body1" >{items[currentSelection]?.title || "All"}</Typography>
                <KeyboardArrowDownIcon/>
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                'aria-labelledby': paramKey + '-button',
                }}
            >
                {Object.keys(items).map((item: string) => (
                    <MenuItem 
                        key={item + "-menu-item"} 
                        onClick={() => {
                            handleSelection(paramKey, item);
                            handleClose();
                        }}
                        disabled={item === searchParams.get(paramKey)}

                    >
                            {items[item].title}
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}

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
import { sportOptions, leagueOptions } from "@/lib/placeholder-data";


interface ContentFilterProps {
    sport: string,
}

export default function ContentFilter({
    sport,
}: ContentFilterProps) {
    return (
        <Grid container spacing={2} id="news-filter-grid-container" >
            <Grid item xs={6} id="sport-filter-grid-item" sx={{ display:'flex', justifyContent:'center'}}>
                <MenuFilter label="Sport" paramKey="sport" items={sportOptions}/>
            </Grid>

            <Grid item xs={6} id="league-filter-grid-item" sx={{ display:'flex', justifyContent:'center'}}>
                <MenuFilter label="League" paramKey="league" items={leagueOptions[sport]}/>
            </Grid>
        </Grid>
    )
}

interface MenuFilterProps {
    label: string,
    paramKey: string,
    items: string[],
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
        if (key === "sport") {
            params.set("league", "All");
        }
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <>
            <Button
                id={paramKey + "-button"}
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                disabled={items.length === 0}
            >
                <Typography variant="body1" >{label}</Typography>
                <Divider orientation="vertical" flexItem sx={{mx:2}}/>
                {/* <currentSelection.icon /> */}
                <Typography variant="body1" >{searchParams.get(paramKey) || "All"}</Typography>
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
                {items.map((item) => (
                    <MenuItem 
                        key={item} 
                        onClick={() => {
                            handleSelection(paramKey, item);
                            handleClose();
                        }}
                        disabled={item === searchParams.get(paramKey)
                            || (searchParams.get(paramKey) === null && item === "All")
                        }
                    >
                            {item}
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}
'use client';
import { useState } from 'react';

import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';

import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';

import CustomLink from '@/components/custom-link';
import { Match } from '@/lib/definitions';

const columns: GridColDef[] = [
    { field: 'label', headerName: 'Match Name', width:350},
    { field: 'date', headerName: 'Date', width:150},
    { field: 'sport', headerName: 'Sport', width:100},
    { field: 'league', headerName: 'League', width:150},
    { field: 'homeTeam', headerName: 'Home Team', width:200},
    { field: 'awayTeam', headerName: 'Away Team', width:200},
]

export default function MenuActions() {
    const [showTable, setShowTable]  = useState(false);
    const [match, setMatch] = useState<Match | null>(null);
    const [matches, setMatches] = useState<Array<Match>>([]);


    function resetStates() {
        setMatch(null);
        setMatches([]);
        setShowTable(false);
    }

    async function handleAllMatches() {
        if (showTable) {
            resetStates()
        } else {
            setMatch(null);
            setShowTable(!showTable);
            (await fetch('/api/matches')).json()
            .then((data: []) => {
                setMatches(data)
            })
        }
    }

    async function handleTableSelection(ids: GridRowSelectionModel) {
        const selectedIds = new Set(ids);
        const selectedRowData = matches.filter((match) =>
            selectedIds.has(match.id.toString())
        )
        const selectedMatch = selectedRowData[0];
        setMatch(selectedMatch);
    }

    async function handleRandomMatch() {
        if (showTable) {
            setMatch(null);
            setShowTable(false);
        }
        (await fetch('/api/matches/random')).json()
        .then((data: Match) => {
            data.date = new Date(data.date)
            setMatch(data)
        });
    }

    return (
        <>
        <Grid item xs={12}>
            <Card sx={{ display:'flex', flexDirection:'column'}}>
                <CardHeader
                    title="Start a practice betting session"
                    />

                <Divider flexItem variant="middle"/>

                <CardContent sx={{ display:'flex', justifyContent:'space-around'}}>
                    <Button  sx={{marginY:"5px"}} onClick={handleAllMatches}
                        variant={showTable ? "contained" : "outlined"}
                        >
                        All matches
                        </Button>
                    <Button variant="outlined" sx={{marginY:"5px"}} onClick={handleRandomMatch}>
                        Random match
                        </Button>

                    {process.env.MODE === "prod"
                    ? null
                    : <Button id="dev" href="practice/session" variant="contained">
                        practice session
                        </Button>
                    }
                </CardContent>
            </Card>
        </Grid>

        <Grid item xs={12}>
            <Collapse in={showTable}>
                <DataGrid
                    loading={!matches.length}
                    slotProps={{
                        loadingOverlay: {
                            variant: 'skeleton',
                            noRowsVariant: 'skeleton'
                        }
                    }}
                    sx={{ backgroundColor: 'white' }}
                    rows={matches}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    pageSizeOptions={[5]}
                    onRowSelectionModelChange={handleTableSelection}
                    />
            </Collapse>
        </Grid>

        <Grid item xs={12}>
            <MatchSummary match={match} />
        </Grid>
        </>
    )
}


function MatchSummary({
    match
}: { match: Match | null }) {
    if (match === undefined) match = null;
    const matchHeader = match !== null
    ? (match.metadata.sport === 'soccer'
        ? `${match.metadata.sport} - ${match.metadata.season}`.toUpperCase()
        : `${match.metadata.sport} - ${match.metadata.league} - ${match.metadata.seasonId} ${match.metadata.season}`.toUpperCase()
    ) : 'No match selected'

    return (
        <>
        <Card>
            <CardHeader
                title={matchHeader}
                titleTypographyProps={{ variant:'subtitle1' }}
                />
            <Divider flexItem variant="middle" />
            <CardContent
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                }}
                >
                <div className="w-3/4 px-2 flex justify-center min-h-20"
                >
                    <Container className="rounded-md bg-[#0000001f]">
                        <Typography variant="h4">
                            {match !== null ? `${match.label}` : '-'}
                            </Typography>
                        <Typography variant="subtitle1">
                            {match !== null ? `${match.date} @ ${match.venue.name}` : '-'}
                            </Typography>
                    </Container>
                    </div>
                <div className="w-1/4 px-2 flex justify-center"
                >
                    <CustomLink
                        href={`practice/session/${match?.id}`}
                        key="practice-session-link">
                        <Button size="large" disabled={match === null} variant="contained">
                            Start Practice
                        </Button>
                    </CustomLink>

                </div>
            </CardContent>
        </Card>
        </>
    )
}



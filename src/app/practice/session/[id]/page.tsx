import React, { Suspense } from "react";
import { notFound } from "next/navigation";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import SessionActions from "@/components/practice/session-actions";
import { fetchMatchById } from "@/lib/data";
import { Team, Match } from "@/lib/definitions"


export default async function Page({ params }: { params: { id: string }}) {
    const matchId = params.id;
    const match: Match = await fetchMatchById(matchId);
    if (!match) {
        notFound();
    }
    const formattedMatch = {
        id: matchId,
        odds: {
            ...match.odds[0], 
            _id: null,
            home: {...match.odds[0].home, _id: null},
            away: {...match.odds[0].away, _id: null},
        },
        teams: {
            away: {...match.teams.away, _id: null, roster: null, logos: null},
            home: {...match.teams.home, _id: null, roster: null, logos: null},
        },
    }

    return (
        <>
        <Grid container spacing={2}
            id="practice-session-container"
            >
            <Grid item xs={12}>
                <SessionHeader match={match} />
                </Grid>

            <Grid item xs={12}>
                <SessionDetails match={match} />
            </Grid>

            <SessionActions match={formattedMatch}/>
        </Grid>
        </>
    )
}

function SessionHeader({ match }: { match: any}) {
    return (
        <>
        <Card>
            <CardHeader
                title="Practice Session"
                id="session-card-header"
                />
            <Divider variant="middle"/>
            <CardContent id="session-card-content">
                <Typography variant="h5" align="center">
                    {match.label}
                </Typography>
                <Typography variant="subtitle1" align="center">
                    {match.date}
                    </Typography>
                <Container
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyItems: "space-around",
                        justifyContent: "center"
                    }}>
                    <Typography variant="body1" sx={{flexGrow:1}} textAlign={"right"}>
                        {match.metadata.sport.toUpperCase()}
                        </Typography>
                    <Divider flexItem orientation="vertical" sx={{mx:2}}/>
                    <Typography variant="body1" sx={{flexGrow:0}} textAlign={"center"}>
                        {match.metadata.league}
                        </Typography>
                    <Divider flexItem orientation="vertical" sx={{mx:2}}/>
                    <Typography variant="body1" sx={{flexGrow:1}}>
                        {match.metadata.seasonYear} {match.metadata.seasonId.toUpperCase()}
                        </Typography>
                    </Container>
                </CardContent>
            </Card>
        </>
    )
}

function SessionDetails({ match }: { match: any}) {
    return (
        <>
            <Grid item xs={12}>
                <Card>
                    <CardHeader
                        title="Match Details"
                        id="match-details-card-header"
                        />
                    <Divider variant="middle"/>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <MatchData match={match}/>
                                </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h5" id="league-standings" align="center">
                                    League Standings
                                </Typography>
                                <LeagueStandings standings={match.standings}/>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </>
    )
}

const MatchItemLabel = ({label, content}: {label:string; content:string;}) => {
    return (
        <>
        <Grid item xs={2}>
            <Typography>
                {label}
            </Typography>
        </Grid>
        <Grid item xs={10}>
            <Typography align="center">
                {content}
            </Typography>
        </Grid>
        </>
    )
}

function MatchData({ match }: { match: any}) {
    return (
        <>
        <Grid container spacing={2} id="match-data-container"
        sx={{ height:"100%", justifyContent:"space-between"}}
        >
            <MatchItemLabel label="Venue" content={match.venue.name} />
            <MatchItemLabel label="Referee" content={match.official} />
            <MatchItemLabel label="Home" content={match.teams.home.name} />
            <MatchItemLabel label="Away" content={match.teams.away.name} />
        </Grid>
        </>
    )
}

type Standings = {
    [key: number]: {
        w: number,
        l: number,
        d?: number,
        team: Team
    }
}

const columns: GridColDef[] = [
    { field: 'rank', headerName: 'Rank', flex: 1 },
    { field: 'teamName', headerName: 'Team', flex: 2 },
    { field: 'w', headerName: 'Wins', flex: 1 },
    { field: 'l', headerName: 'Losses', flex: 1 },
    { field: 'd', headerName: 'Draws', flex: 1 },
]


function LeagueStandings({ standings }: { standings: Standings}) {
    var teamIdToWins: {[key: string]: number} = {};
    for (const teamId of Object.keys(standings)) {
        teamIdToWins[teamId] = standings[parseInt(teamId)].w
    }
    const sortable = Object.entries(teamIdToWins).sort(([,a],[,b]) => b-a)
    const drawsIncluded = Object.hasOwn(standings[parseInt(sortable[0][0])], 'd')
    const formattedStandings = sortable.map((vals, i) => {
        const teamId = parseInt(vals[0]);
        const wins = vals[1];
        return {
            id: teamId,
            rank: i + 1,
            w: wins,
            l: standings[teamId].l,
            d: drawsIncluded ? standings[teamId].d : null,
            teamName: standings[teamId].team.name
        }
    })

    return (
        <>
        <Box>
            <DataGrid
                columnVisibilityModel={{
                    d: drawsIncluded,
                }}
                rows={formattedStandings}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5]}
            />
        </Box>
        </>
    )
}

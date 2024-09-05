'use client';
import { useState } from 'react';

import CustomLink from '../custom-link';
import Container from "@mui/material/Container"
import { 
    Grid,
    Divider, 
    Paper, 
    Typography, 
    Chip,
    Card, CardContent, CardHeader,
    Accordion,
    AccordionSummary,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button
} from '@mui/material';
import BetCard from './bet-cards';


export default function PracticeSession() {
    return (
        <>
        <Grid container spacing={2}
            id="practice-session-container"
            >
            <Grid item xs={12}>
                <Card>
                    <CardHeader
                        title="Practice Session"
                        id="session-card-header"
                        />
                    <Divider variant="middle"/>
                    <CardContent id="session-card-content">
                        <Typography variant="h5" align="center">
                            {match.title}
                        </Typography>
                        <Typography variant="subtitle1" align="center">
                            {match.date.toDateString()}
                            </Typography>
                        <Container
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyItems: "space-around",
                                justifyContent: "center"
                            }}>
                            <Typography variant="body1">
                                {match.metadata.sport}
                                </Typography>

                            <Divider flexItem orientation="vertical" sx={{mx:2}}/>

                            <Typography variant="body1">
                                {match.metadata.league}
                                </Typography>

                            <Divider flexItem orientation="vertical" sx={{mx:2}}/>

                            <Typography variant="body1">
                                {match.metadata.season}
                                </Typography>
                            </Container>
                        </CardContent>
                    </Card>
                </Grid>
            <Grid item xs={12}>
                <Card>
                    <CardHeader
                        title="Match Details"
                        id="match-details-card-header"
                        />
                    <Divider variant="middle"/>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <MatchData />
                                </Grid>
                            <Grid item xs={8}>
                                <Typography variant="h5" id="league-standings" align="center">
                                    League Standings
                                </Typography>
                                <LeagueStandings />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <BetCard />
            </Grid>
            <Grid item xs={6}>
                <Card sx={{display:'flex', justifyContent:'center'}}>
                    <Button size="large" sx={{ width:"100%"}}>
                        <CustomLink href="practice">
                            Return to Menu
                        </CustomLink>
                    </Button>
                </Card>
            </Grid>
            <Grid item xs={6}>
                <Card sx={{display:'flex', justifyContent:'center', marginBottom:"10px"}}>
                    <Button size="large" sx={{ width:"100%"}} href="/practice/result">
                        Submit Betting Slip
                    </Button>
                </Card>
            </Grid>
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

function MatchData() {
    return (
        <>
        <Grid container spacing={2} id="match-data-container"
        sx={{ height:"100%", justifyContent:"space-between"}}
        >
            <MatchItemLabel label="Venue" content={match.venue.name} />
            <MatchItemLabel label="Referee" content={match.metadata.referee} />
            <MatchItemLabel label="Home" content={match.teams[0].name} />
            <MatchItemLabel label="Away" content={match.teams[1].name} />
        </Grid>
        </>
    )
}


function LeagueStandings() {
    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width="20%" align="center">Rank</TableCell>
                            <TableCell width="80%" align="center">Team</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {leagueSeasonStandings.standings.map((row) => (
                            <TableRow
                                key={row.rank}
                                >
                                    <TableCell align="center" component="th" scope="row">
                                        {row.rank}
                                    </TableCell>
                                    <TableCell align="center" component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                </TableRow>

                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )

}

const match = {
    title:"Team A vs. Team B",
    date: new Date(),
    metadata: {
        sport: "Soccer",
        league: "Premier League",
        season: "2024",
        referee: "Person A"
    },
    venue: {
        name: "Arena X"
    },
    teams: [
        {
            homeAway: "home",
            name: "Team A"
        },
        {
            homeAway: "away",
            name: "Team B"
        }
    ]
}

const leagueSeasonStandings = {
    year: "2024",
    upToDate: new Date(),
    standings: [
        { name: "Team A", rank: 1},
        { name: "Team C", rank: 2},
        { name: "Team B", rank: 3},
        { name: "Team D", rank: 4},
    ]
}
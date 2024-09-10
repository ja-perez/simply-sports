'use client';
import { useState } from 'react';

import {
    Grid,
    Card,
    CardHeader,
    CardContent,
    TableContainer,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableHead,
    Paper,
    Button,
    Divider,
    Alert
} from "@mui/material"

import { Odds, Team } from '@/lib/definitions';
import { submitBetSlip } from '@/lib/actions';

interface SessionMatch {
    id: string;
    odds: Odds;
    teams: {
        home: Omit<Team, "logos" | "roster">;
        away: Omit<Team, "logos" | "roster">;
    }
}

interface SlipChoices {
    matchId: string;
    spread: 'none' | 'home' | 'away';
    moneyline: 'none' | 'home' | 'away';
    total: 'none' | 'home' | 'away';
}


export default function SessionActions({ match }: { match : SessionMatch }) {
    const initialState = { message: "", errors: {} };
    const [state, setState] = useState(initialState);

    const [slipChoices, setSlipChoices] = useState<SlipChoices>({
        matchId: match.id, 
        'spread': 'none', 
        'moneyline': 'none', 
        'total': 'none'
    })

    function handleClick( 
        type: 'spread' | 'moneyline' | 'total', 
        value: 'none' | 'home' | 'away'
    ) {
        const updatedChoices = {...slipChoices}
        if (slipChoices[type] === value) {
            updatedChoices[type] = 'none';
        } else {
            updatedChoices[type] = value;
        }
        setSlipChoices(updatedChoices)
    }

    return (
        <>
        <Grid item xs={12}>
            {state.message !== "" &&
            <Alert severity="error" onClose={() => {setState(initialState)}}>
                {state.message}
            </Alert>
            }
            <Card>
                <CardHeader
                    title="Betting Slip"/>
                <Divider variant="middle" />
                <CardContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center"></TableCell>
                                    <TableCell align="center">Spread</TableCell>
                                    <TableCell align="center">Money Line</TableCell>
                                    <TableCell align="center">Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <BetRow odds={match.odds} team={match.teams.home} slipChoices={slipChoices} handleClick={handleClick}/>
                                <BetRow odds={match.odds} team={match.teams.away} slipChoices={slipChoices} handleClick={handleClick}/>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
                <CardContent>
                    <Button size="large" onClick={async () => {
                        (submitBetSlip(state, slipChoices)).then((res) => {
                            if (res) setState(res);
                        })
                    }}>
                        Submit Betting Slip
                    </Button>
                </CardContent>
            </Card>

        </Grid>
        </>
    )
}


interface BetRowProps {
    odds: Odds,
    team: Omit<Team, "roster" | "logos">,
    slipChoices: SlipChoices,
    handleClick: (
        type: 'spread' | 'moneyline' | 'total', 
        value: 'none' | 'home' | 'away'
    ) => void,
}

function BetRow({
    odds, 
    team, 
    slipChoices, 
    handleClick
}: BetRowProps) {
    const isHome = team.homeAway === "home"
    const teamOdds = isHome ? odds.home : odds.away;

    return (
        <TableRow
            key={team.homeAway}
            >
            <TableCell align="center" component="th" scope="row">
                {team.name}
            </TableCell>
            <TableCell align="center" component="th" scope="row">
                <Button onClick={() => handleClick("spread", isHome ? "home" : "away")}
                variant={
                    slipChoices["spread"] === team.homeAway
                    ? "contained"
                    : "outlined"
                }>
                    {teamOdds.underdog && "+"}
                    {teamOdds.spread}
                    {" "}
                    {teamOdds.underdog && "+"}
                    {teamOdds.spreadOdds}
                </Button>
            </TableCell>
            <TableCell align="center" component="th" scope="row">
                    <Button onClick={() => handleClick("moneyline", isHome ? "home" : "away")} 
                    variant={
                        slipChoices['moneyline'] === team.homeAway
                        ? "contained"
                        : "outlined"
                    }
                    >
                    {teamOdds.underdog && "+"}
                    {teamOdds.moneyLine}
                    </Button>
            </TableCell>
            <TableCell align="center" component="th" scope="row">
                <Button onClick={() => handleClick("total", isHome ? "home" : "away")}
                variant={
                    slipChoices['total'] === team.homeAway
                    ? "contained"
                    : "outlined"
                }>
                {isHome ? "O " : "U "}
                {odds.overUnder}
                {" "}
                {odds.overOdds > 0 && "+"}
                {odds.overOdds}
                </Button>
            </TableCell>
        </TableRow>
    )
}
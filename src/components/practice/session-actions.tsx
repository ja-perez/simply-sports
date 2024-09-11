'use client';
import { useState } from 'react';

import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

import { Odds, Team } from '@/lib/definitions';
import { submitBetSlip, State, Results } from '@/lib/actions';
import CustomLink from '@/components/custom-link';

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
    const initialState: State = { message: "", errors: {}, success: false, results: {} };
    const [state, setState] = useState(initialState);

    const totalPayout = (
        state.results !== undefined && state.results.spread !== undefined ? state.results.spread.payout : 0
    ) + (
        state.results !== undefined && state.results.moneyline !== undefined ? state.results.moneyline.payout : 0
    ) + (
        state.results !== undefined && state.results.total !== undefined ? state.results.total.payout : 0
    )

    const initialChoices: SlipChoices = {
        matchId: match.id, 
        'spread': 'none', 
        'moneyline': 'none', 
        'total': 'none'
    }
    const [slipChoices, setSlipChoices] = useState<SlipChoices>(initialChoices)

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
        <Grid id="bet-slip-grid-item" item xs={12}>
            {state.message !== "" &&
            <Alert severity="error" onClose={() => {setState(initialState)}}>
                {state.message}
            </Alert>
            }
            <Card>
                <CardHeader
                    title="Betting Slip"/>
                <Divider variant="middle" />
                <CardContent
                    sx={{ display: 'flex', flexDirection: 'column',
                        justifyItems: 'space-between', alignItems: 'center',
                    }}
                    >
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
                                <BetRow 
                                odds={match.odds} 
                                team={match.teams.home} 
                                slipChoices={slipChoices} 
                                handleClick={handleClick}
                                success={state.success}
                                results={state.results}/>
                                <BetRow 
                                odds={match.odds} 
                                team={match.teams.away} 
                                slipChoices={slipChoices} 
                                handleClick={handleClick}
                                success={state.success}
                                results={state.results}/>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button size="large" variant="outlined" sx={{width:'fit-content', marginTop: "5px"}}
                        disabled={state.success}
                        hidden={state.success}
                        onClick={async () => {
                            (submitBetSlip(state, slipChoices)).then((res) => {
                                if (res) setState(res);
                            })
                        }}>
                        View Results
                    </Button>

                </CardContent>
            </Card>
        </Grid>

        {state.success ?
        <Grid id="session-result-grid-item" item xs={12}
            container spacing={2} sx={{ alignItems: "center"}}>
            <Grid item xs={8}>
                <Card>
                    <CardContent sx={{
                        display:'flex', justifyContent:'space-around', alignItems: 'center',
                        flexDirection: 'column'
                    }}>
                        <Typography variant="h4">
                            Match Result
                        </Typography>
                        <Divider variant="middle" flexItem />
                        <Typography variant="subtitle1">
                            {`Winner: ${match.teams.home.winner ? match.teams.home.name : match.teams.away.name}`}
                        </Typography>
                        <Typography variant="h5">
                            {match.teams.home.abbreviation}{" "}{match.teams.home.score}
                            {" - "}
                            {match.teams.away.score}{" "}{match.teams.away.abbreviation}
                        </Typography>
                        <Typography variant="h5">
                            {`Total Payout*: ${totalPayout}`}
                        </Typography>
                        <div className="flex w-full justify-around">
                            <Typography variant="body1" align="center">
                                {state.results !== undefined && state.results.spread !== undefined && !state.results.spread.success && !state.results.spread.payout
                                ? "(Void) "
                                : null}
                                {`Spread: $${slipChoices.spread === 'none' ? '-' : (state.results !== undefined && state.results.spread !== undefined) ? state.results.spread.payout : '-'}`}
                                </Typography>
                            <Divider orientation="vertical" flexItem/>
                            <Typography variant="body1">
                                {`Moneyline: $${slipChoices.moneyline === 'none' ? '-' : (state.results !== undefined && state.results.moneyline !== undefined) ? state.results.moneyline.payout : '-'}`}
                                </Typography>
                            <Divider orientation="vertical" flexItem/>
                            <Typography variant="body1">
                                {state.results !== undefined && state.results.total !== undefined && !state.results.total.success && state.results.total.payout > 0
                                ? "(Void) "
                                : null}
                                {`Total: $${slipChoices.total === 'none' ? '-' : (state.results !== undefined && state.results.total !== undefined) ? state.results.total.payout : '-'}`}
                            </Typography>
                        </div>
                    <Typography variant="subtitle1">
                        {"*Assuming minimum wager necessary for $100 profit on win"}
                    </Typography>
                    <Typography variant="subtitle1">
                        {"Voids, a.k.a. Pushes, are considered \"losses\" but return the original wager"}
                    </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={4}>
                <Card>
                    <CardContent sx={{
                        display: 'flex', flexDirection:'column',
                        justifyContent: 'center', alignItems: 'center',
                    }}>
                        <Button size="large" variant="contained" sx={{m:"4px", width:"100%"}}
                            onClick={() => {
                                setState(initialState);
                                setSlipChoices(initialChoices);
                            }}>
                            Reset Session
                        </Button>
                        <CustomLink href="practice" {...{className: "w-full my-1"}}>
                            <Button size="large" variant="contained" sx={{width:"100%"}}>
                                Return to Practice Lounge
                            </Button>
                        </CustomLink>
                    </CardContent>
                </Card>
            </Grid>

        </Grid>
        : null}
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
    ) => void
    success?: true | false,
    results?: Results
}

function BetRow({
    odds, 
    team, 
    slipChoices, 
    handleClick,
    success,
    results
}: BetRowProps) {
    const isHome = team.homeAway === "home"
    const teamOdds = isHome ? odds.home : odds.away;

    return (
        <TableRow
            key={team.homeAway}
            >
            <TableCell align="center" component="th" scope="row">
                <Typography variant="h5">
                    {team.name}
                </Typography>
            </TableCell>
            <TableCell align="center" component="th" scope="row">
                <Button onClick={() => (!success ? handleClick("spread", isHome ? "home" : "away") : null)}
                disabled={slipChoices["spread"] !== team.homeAway && success}
                color={slipChoices["spread"] === team.homeAway && success
                    ? ((results !== undefined && results.spread !== undefined && results.spread.success) ? "success" : "error")
                    : undefined
                }
                variant={
                    slipChoices["spread"] === team.homeAway
                    ? "contained"
                    : "outlined"
                }>
                    {teamOdds.underdog && "+"}
                    {teamOdds.favorite && "-"}
                    {Math.abs(teamOdds.spread)}
                    {" "}
                    {teamOdds.spreadOdds}
                </Button>
            </TableCell>
            <TableCell align="center" component="th" scope="row">
                <Button onClick={() => (!success ? handleClick("moneyline", isHome ? "home" : "away") : null)}
                    disabled={slipChoices["moneyline"] !== team.homeAway && success}
                color={slipChoices["moneyline"] === team.homeAway && success
                    ? ((results !== undefined && results.moneyline !== undefined && results.moneyline.success) ? "success" : "error")
                    : undefined
                }
                    variant={
                        slipChoices['moneyline'] === team.homeAway
                        ? "contained"
                        : "outlined"
                    }>
                    {teamOdds.moneyLine > 0 && "+"}
                    {teamOdds.moneyLine}
                </Button>
            </TableCell>
            <TableCell align="center" component="th" scope="row">
                <Button onClick={() => (!success ? handleClick("total", isHome ? "home" : "away") : null)}
                    disabled={slipChoices["total"] !== team.homeAway && success}
                color={slipChoices["total"] === team.homeAway && success
                    ? ((results !== undefined && results.total !== undefined && results.total.success) ? "success" : "error")
                    : undefined
                }
                    variant={
                        slipChoices['total'] === team.homeAway
                        ? "contained"
                        : "outlined"
                    }>
                    {isHome ? "O " : "U "}{odds.overUnder}
                    {" "}
                    {odds.overOdds > 0 && "+"}{isHome ? odds.overOdds : odds.underOdds}
                </Button>
            </TableCell>
        </TableRow>
    )
}
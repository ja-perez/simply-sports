import Grid from "@mui/material/Grid"
import {
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
    Divider
} from "@mui/material"


export default function BetCard() {
    return (
        <Card>
            <CardHeader
                title="Betting Slip"/>
            <Divider variant="middle"/>
            <CardContent>
                <BetTable />
            </CardContent>
        </Card>
    )
}


function BetTable() {
    return (
        <>
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
                        <BetRow odds={match.odds} team={match.teams[0]} />
                        <BetRow odds={match.odds} team={match.teams[1]} />
                    </TableBody>
                </Table>
            </TableContainer>

        </>
    )
}

interface BetRowProps {
    odds: {
        overUnder: number,
        spread: number,
        overOdds: number,
        underOdds: number,
        drawOdds: number,
        away: {
            favorite: true | false,
            underdog: true | false,
            moneyLine: number,
            spreadOdds: number,
            spread: number,
        },
        home: {
            favorite: true | false,
            underdog: true | false,
            moneyLine: number,
            spreadOdds: number,
            spread: number,
        },
    },
    team: {
        homeAway: string,
        name: string
    }
}

function BetRow({odds, team}: BetRowProps) {
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
                <Button variant="outlined">
                    {teamOdds.underdog && "+"}
                    {teamOdds.spread}
                    {" "}
                    {teamOdds.underdog && "+"}
                    {teamOdds.spreadOdds}
                </Button>
            </TableCell>
            <TableCell align="center" component="th" scope="row">
                <Button variant="outlined">
                {teamOdds.underdog && "+"}
                {teamOdds.moneyLine}
                </Button>
            </TableCell>
            <TableCell align="center" component="th" scope="row">
                <Button variant="outlined">
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

const match = {
    odds: {
        overUnder: 2.5,
        spread: -0.5,
        overOdds: -105,
        underOdds: 125,
        drawOdds: 300,
        away: {
            favorite: false,
            underdog: true,
            moneyLine: 380,
            spreadOdds: 115,
            spread: 0.5
        },
        home: {
            favorite: true,
            underdog: false,
            moneyLine: -150,
            spreadOdds: -160,
            spread:-0.5
        }
    },
    teams: [
        {
            homeAway: "home",
            name: "Team A",
        },
        {
            homeAway: "away",
            name: "Team B"
        }
    ]
}
import {
    Grid,
    Container,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Button,
    Divider
} from "@mui/material"


export default function BetResult() {
    return (
        <>
        <Grid container spacing={2}
            id="practice-session-container"
            >
            <Grid item xs={12}>
                <Card>
                    <CardHeader
                        title="Practice Session - Match Result"
                        id="session-card-header"
                        />
                    <Divider variant="middle"/>
                    <CardContent id="session-card-content">
                        <Typography variant="h5" align="center">
                            {match.teams[0].name + " vs. " + match.teams[1].name}
                        </Typography>
                        <Typography variant="h5" align="center">
                            {match.teams[0].score}
                            {" - "}
                            {match.teams[1].score}
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
                        title="Bet Results" 
                        />
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <MoneylineResult />
                            </Grid>
                            <Grid item xs={12}>
                                <SpreadResult />
                            </Grid>
                            <Grid item xs={12}>
                                <TotalResult />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={6}>
                <Card>
                    <CardHeader
                        title="Theoritical Payout"/>
                    <CardContent>
                        $$
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={6}>
                <Card>
                    <CardContent sx={{
                        display:'flex',
                        flexDirection:'column'
                    }}>
                        <Button variant="outlined" sx={{marginY:"5px"}} href="/practice">
                            Return to Practice Lounge
                        </Button>
                        <Button variant="outlined" sx={{marginY:"5px"}}>
                            Sign in to save result
                        </Button>
                        {process.env.MODE === "prod"
                        ? null
                        :<Button variant="outlined" sx={{marginY:"5px"}} href="/practice/session">
                            Return to Bet Session
                            </Button>
                        }
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
        </>
    )
}

function MoneylineResult() {
    return (
        <>
        Moneyline
        </>
    )
}
function SpreadResult() {
    return (
        <>
        Spread
        </>
    )
}
function TotalResult() {
    return (
        <>
        Total
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
            name: "Team A",
            winner: true,
            score: 1,
        },
        {
            homeAway: "away",
            name: "Team B",
            winner: false,
            score: 0,
        }
    ]
}
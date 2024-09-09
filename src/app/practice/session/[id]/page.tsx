import { Suspense } from "react";
import { notFound } from "next/navigation";

import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import PracticeSession from "@/components/practice/practice-session";
import { fetchMatchById } from "@/lib/data";


export default async function Page({ params }: { params: { id: string }}) {
    const matchId = params.id;
    const match = await fetchMatchById(matchId);
    if (!match) {
        notFound();
    }
    return (
        <>
        <Grid container spacing={2}
            id="practice-session-container"
            >
            <Grid item xs={12}>
                <MatchHeader match={match} />
                </Grid>
        </Grid>
        </>
    )
}

function MatchHeader({ match }: { match: any}) {
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
                    <Typography variant="body1" sx={{width:"40%"}} textAlign={"right"}>
                        {match.metadata.sport.toUpperCase()}
                        </Typography>
                    <Divider flexItem orientation="vertical" sx={{mx:2}}/>
                    <Typography variant="body1" sx={{width:"20%"}} textAlign={"center"}>
                        {match.metadata.league}
                        </Typography>
                    <Divider flexItem orientation="vertical" sx={{mx:2}}/>
                    <Typography variant="body1" sx={{width:"40%"}}>
                        {match.metadata.seasonYear} Season
                        </Typography>
                    </Container>
                </CardContent>
            </Card>
        </>
    )
}
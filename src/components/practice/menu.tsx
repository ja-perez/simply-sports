'use client';
import { getSession } from 'next-auth/react';

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"

import CustomLink from "@/components/custom-link"
import SectionNav from "./section-nav"
import Dashboard from "./dashboard"

import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import CardContent from "@mui/material/CardContent"
import Button from "@mui/material/Button"

export default function Menu() {
    return (
        <>
        <Container 
            sx={{
                width:"100%",
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: "100%",
                }}>
            <Typography variant="h2" textAlign={"center"}>
                Welcome to the Practice Lounge!
            </Typography>
            <Divider flexItem aria-hidden="true"/>
            <Disclaimer />

            {/* Main Body */}
            <Typography variant="body1">
                Put your gambling skills to the test with our simulated betting sessions. Choose from over 100+
                matches spanning various sports, leagues, and seasons. If you find yourself losing one to many
                fictional dollars, visit the
                <CustomLink href="learn" {...{className:"underline"}} > Learning Academy </CustomLink>
                for some tips and breakdowns on what goes into a &quot;good&quot; bet.
            </Typography>
            <Card sx={{ display:'flex', flexDirection:'column', width:'max-content'}}>
                <CardHeader
                title="Start a practice betting session"
                />
                <Divider flexItem/>
                <CardContent sx={{ display:'flex', flexDirection:'column'}}>
                    <Button variant="outlined" sx={{marginY:"5px"}}>
                        All matches
                    </Button>
                    <Button variant="outlined" sx={{marginY:"5px"}}>
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


        </Container>
        </>
    )
}

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OpenInNew from "@mui/icons-material/OpenInNew"
import PriorityHigh from '@mui/icons-material/PriorityHigh';
import Link from "next/link"

function Disclaimer() {
    return (
        <>
        <Accordion sx={{ marginY:"15px"}}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls="panel1-content"
                id="disclaimer-accordion-header"
                >
                    <PriorityHigh />
                    Disclaimers
                </AccordionSummary>
            <AccordionDetails>
                <Typography variant="body1" gutterBottom>
                    Gambling laws vary state-by-state and online betting in particular has only recently seen legalization
                    in some states. This website is purely for educational purposes and bets placed in the practice lounge
                    are done with fake currency, no transactions are necessary, required, or possible. Before signing up for
                    any sportsbook and/or depositing funds, ensure your local laws allow for such activities and that the
                    company is reputable.
                </Typography>
                <Divider />
                <Typography variant="body1" gutterBottom>
                    Gambling is a risky venture with serious consequences if not managed properly. Addiction is a serious concern
                    and can lead to financial disaster. If you believe you or a loved one are suffering from gambling addiction, 
                    refer to the following resource and if necessary seek professional help from a local help-center.
                </Typography>
                <Link 
                target="_blank"
                href="https://www.helpguide.org/mental-health/addiction/gambling-addiction-and-problem-gambling">
                    <Typography
                        sx={{ textDecoration:"underline"}}
                    >
                        HelpGuide.org - Gambling Addiction and Problem Gambling
                    <OpenInNew />
                    </Typography>
                </Link>
            </AccordionDetails>
        </Accordion>
        </>
    )
}
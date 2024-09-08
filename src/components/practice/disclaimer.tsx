import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OpenInNew from "@mui/icons-material/OpenInNew"
import PriorityHigh from '@mui/icons-material/PriorityHigh';

import Link from "next/link"

export default function Disclaimer() {
    return (
        <>
        <Accordion>
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
import { fetchArticlesByParams } from '@/lib/data';

import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import ListItem from '@mui/material/ListItem';

import ArticleRibbon from '@/components/news-teams/article-ribbon';
import { siteToMedia } from '@/components/news-teams/site-icons';


interface LatestNewsProps {
    sport: string;
    league: string;
}

export default async function LatestNews({
    sport,
    league,
}: LatestNewsProps) {
    const params: {[key: string]: string} = {};
    if (sport !== "all") params["metadata.sport"] = sport;
    if (league !== "all") params["metadata.league"] = league;
    const res = await fetchArticlesByParams(params);
    const articles = res ? res : {};

    return (
        <>
        <Grid container spacing={2} id="latest-news-grid-container">
            <Grid 
                item xs={12} component="ul"
                id="latest-news-source-chips-grid-item"
                sx={{ display:"flex", justifyContent:"left"}}
                >
                {Object.entries(articles).map( source => (
                    <ListItem key={source[0]} sx={{ width:"fit-content", padding:"5px"}}>
                        <Chip 
                            icon={siteToMedia(source[0])}
                            component="a" 
                            label={source[0]}
                            sx={{ marginX:"5px" }}
                            href={`#${source[0]}-news-grid-item`}
                            clickable
                            variant="outlined"
                            size="medium"
                            />                       
                    </ListItem>
                ))}
            </Grid>
            {Object.entries(articles).map((source) => (
                <Grid item xs={12} id={`${source[0]}-news-grid-item`} key={source[0]}>
                    <ArticleRibbon source={source[0]} articles={source[1]}/>
                </Grid>
            ))}
        </Grid>
        </>
    );
}

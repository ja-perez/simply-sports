import { fetchArticlesByParams } from '@/lib/data';

import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Link from 'next/link';

interface LatestNewsProps {
    sport: string;
    league: string;
}

export default async function LatestNews({
    sport,
    league,
}: LatestNewsProps) {
    console.log("Fetching articles for sport: ", sport, " league: ", league);
    const params: {[key: string]: string} = {};
    if (sport !== "all") params["metadata.sport"] = sport;
    if (league !== "all") params["metadata.league"] = league;
    const res = await fetchArticlesByParams(params);
    const articles = res ? res : {};

    return (
        <>
        <Grid container spacing={2} id="latest-news-grid-container">
            <Grid item xs={12} id="latest-news-grid-item-0"
            sx={{ display:"flex", justifyContent:"left"}}>
                {Object.entries(articles).map( source => (
                    <Link href={`#${source[0]}-news-grid-item`} key={source[0]}>
                        <Chip label={source[0]} sx={{ marginX:"5px" }}/>
                    </Link>
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

interface articleRibbonProps {
    source: string;
    articles: Article[];
}

function ArticleRibbon({
    source,
    articles,
}: articleRibbonProps) {
    return (
        <>
        <Grid 
            container 
            spacing={2} 
            id="article-ribbon-grid-container"
            sx={{ marginTop: "0"}}
        >
            <Grid item xs={12} id="article-ribbon-title-grid-item">
                <h2>{source}</h2>
            </Grid>
            <Grid 
                item 
                xs={12} 
                id="article-ribbon-articles-grid-item"
                sx={{ display: "flex", justifyContent: "space-around", overflow: "hidden"}}
            >
                {articles.map((article) => (
                    <div 
                        key={article.article_id} 
                        id={article.article_id} 
                        className="outline-dashed p-4 m-2 min-w-64"> 
                        <ArticleCard article={article}/>
                    </div>
                ))}
            </Grid>
        </Grid>
        </>
    );
}

import { Article } from '@/lib/definitions';
import Card from '@mui/material/Card';
import { CardActionArea } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import passage from 'next-auth/providers/passage';

function ArticleCard({ article }: { article: Article }) {
    const article_id = article.article_id;
    const article_href = article.href;
    const article_site = article.metadata.site;
    const article_image = extractImgBySrc(article, "");
    const article_title = article.title;
    const article_date = article.metadata.date.toDateString();
    return (
        <>
        <Card id={`card-article-${article_id}`}>
            <CardActionArea href={article_href} target="_blank">
                <CardMedia
                    id="article-card-media"
                    component="img"
                    height={article_image.height}
                    width={article_image.width}
                    image={article_image.href}
                    alt={article_image.alt}
                />
                <CardContent>
                    <Typography variant="body1" component="div">
                        {article_title}
                    </Typography>
                    <Typography variant="caption">
                        {article_date}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
        </>
    );
}

function extractImgBySrc(article: Article, src: string) {
    switch (src) {
        case "ESPN":
            return {}
        case "The Guardian":
            return {}
        default:
            return {
                href: "https://via.placeholder.com/150",
                alt: "Placeholder Image",
                height: 150,
                width: 150,
            }
        
    }
}
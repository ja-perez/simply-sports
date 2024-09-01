'use client';
import { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'

import { usePathname, useSearchParams } from 'next/navigation';

import { Article } from '@/lib/definitions';
import { siteToMedia } from '@/components/news-teams/site-icons';
import { CardHeader } from '@mui/material';


interface articleRibbonProps {
    source: string;
    articles: Article[];
    categories: {
        sport: string;
        league: string;
    }
}

export default function ArticleRibbon({
    source,
    articles,
    categories,
}: articleRibbonProps) {
    const [ currArticles, setCurrArticles ] = useState(articles);
    const [ currCategory, setCurrCategory ] = useState(categories);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        setCurrArticles(articles);
        setCurrCategory(categories);
    }, [pathname, searchParams, articles, categories])

    return (
        <>
        <Card 
            raised={true}
            id="article-ribbon-card"
            >
            <CardHeader
                avatar={siteToMedia(source)}
                title={source}
                titleTypographyProps={{ variant:"h5"}}
                sx={{ paddingBottom:"5px", paddingTop:"8px"}}
                id="article-ribbon-card-header"
                />
            <Divider variant="middle" />
            <CardContent 
                sx={{ paddingTop:"5px", paddingLeft:"16px", paddingBottom:"16px", '&:last-child': { pb: "16px" }}}
                id="article-ribbon-card-content"
                >
                <Grid 
                    container 
                    spacing={1} 
                    id="article-ribbon-card-grid-container"
                    sx={{ marginTop: "0", flexWrap: "nowrap"}}
                    >
                    {currArticles.map((article) => (
                        <Grid
                            item xs={4}
                            key={article.article_id} 
                            id={article.article_id} 
                            > 
                            <ArticleCard article={article} category={currCategory}/>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
        </>
    );
}

interface articleCardProps {
    article: Article;
    category: {
        sport: string;
        league: string;
    }
}

function ArticleCard({
    article, category 
}: articleCardProps) {
    const article_id = article.article_id;
    const article_href = article.href;
    const article_site = article.metadata.site;
    const article_image = extractImgBySrc(article, article_site);
    const article_title = article.title;
    const article_date = article.metadata.date.toDateString();
    const article_type = article.metadata.type ? article.metadata.type.toLowerCase() : "default";
    const article_sport = article.metadata.sport;
    const article_league = article.metadata.league;
    return (
        <>
        <Card id={`card-article-${article_id}`} sx={{ height:"100%"}}>
            <CardActionArea href={article_href} target="_blank" 
                sx={{ 
                    height:"100%",
                    display:"flex",
                    flexDirection:"column",
                    justifyContent:"start"
                }}
                >
                <CardMedia
                    id="article-card-media"
                    component="img"
                    height={article_image.height}
                    width={article_image.width}
                    image={article_image.href}
                    alt={article_image.alt}
                />
                <CardContent 
                    sx={{ 
                        display:"flex", 
                        flexDirection:"column", 
                        flexGrow: 1,
                        justifyContent:"space-between",
                        alignItems:"start",
                        width:"100%",
                    }}
                    >
                    <Typography variant="body1">
                        {article_title}
                    </Typography>
                    <section id="article-card-section"
                        className="flex justify-between items-center w-full">
                        <Typography variant="caption">
                            {article_date}
                        </Typography>
                        <section id="article-card-chips">
                            {article_type !== "default"
                            ? <Chip label={article_type} />
                            : null}
                            {category.sport === "all"
                            ? <Chip label={article_sport} />
                            : null}
                            <Chip label={article_league} />
                        </section>
                    </section>
                </CardContent>
            </CardActionArea>
        </Card>
        </>
    );
}

function extractImgBySrc(article: Article, src: string) {
    const media = article.media;
    let img = {
        href: "https://via.placeholder.com/150",
        alt: "Placeholder Image",
        height: 150,
        width: 150
    }
    switch (src) {
        case "ESPN":
            if ("header" in media) {
                img = {...media.header[0], href: media.header[0].url}
            } else if ("Media" in media) {
                img = {...media.Media[0], href: media.Media[0].url}
            } else if ("576x324" in media) {
                img = {...media["576x324"][0], href: media["576x324"][0].url}
            }
            return img
        case "The Guardian":
            if ("thumbnail" in media) {
                img.href = media.thumbnail[0].url
                img.alt = media.thumbnail[0].alt
                img.height = media.thumbnail[0].height
                img.width = media.thumbnail[0].width
            } else if ("main" in media) {
                img.href = media.main[0].url
                img.alt = media.main[0].alt
                img.height = media.main[0].height
                img.width = media.main[0].width
            }
            return img
        default:
            return img
    }
}
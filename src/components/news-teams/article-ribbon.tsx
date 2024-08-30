'use client';
import { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { usePathname, useSearchParams } from 'next/navigation';

import { Article } from '@/lib/definitions';


interface articleRibbonProps {
    source: string;
    articles: Article[];
}

export default function ArticleRibbon({
    source,
    articles,
}: articleRibbonProps) {
    const [currArticles, setCurrArticles] = useState(articles);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const url = `${pathname}?${searchParams}`;
        setCurrArticles(articles);
    }, [pathname, searchParams, articles])

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
                {currArticles.map((article) => (
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

function ArticleCard({ article }: { article: Article }) {
    const article_id = article.article_id;
    const article_href = article.href;
    const article_site = article.metadata.site;
    const article_image = extractImgBySrc(article, article_site);
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
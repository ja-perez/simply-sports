import { fetchArticlesBySourceSportLeague} from '@/lib/data';
import { testArticle } from '@/lib/placeholder-data';

import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Link from 'next/link';

interface LatestNewsProps {
    sport: string;
    league: string;
    sources: string[];
}

export default async function LatestNews({
    sport,
    league,
    sources,
}: LatestNewsProps) {
    var articlesBySource: {[source: string]: Article[]} = {};
    for (const source of sources) {
        const articles = await fetchArticlesBySourceSportLeague(source, sport, league);
        articlesBySource[source] = articles ? articles : [];
    }

    const testArticles: Article[] = [];
    for (let i = 0; i < 9; i++) {
        const tempArticle: Article = {...testArticle, id: i.toString()}
        testArticles.push(tempArticle)
    }
    const testArticlesBySource = sources.map((source) => {
        return { source: source, articles: testArticles }
    })

    return (
        <>
        <Grid container spacing={2} id="latest-news-grid-container">
            <Grid item xs={12} id="latest-news-grid-item-0"
            sx={{ display:"flex", justifyContent:"space-around"}}>
                {testArticlesBySource.map((source) => (
                    <Link href={`#${source.source}-news-grid-item`} key={source.source}>
                        <Chip label={source.source}/>
                    </Link>
                ))}
            </Grid>
            {testArticlesBySource.map((source) => (
                <Grid item xs={12} id={`${source.source}-news-grid-item`} key={source.source}>
                    <ArticleRibbon source={source.source} articles={source.articles}/>
                </Grid>
            ))}
            {/* <Grid item xs={12} id="latest-news-grid-item-1">
                <ArticleRibbon source="Latest News" articles={testArticles}/>
            </Grid>
            <Grid item xs={12} id="latest-news-grid-item-2">
                <ArticleRibbon source="Latest News" articles={testArticles}/>
            </Grid>
             <Grid item xs={12} id="latest-news-grid-item-3">
                <ArticleRibbon source="Latest News" articles={testArticles}/>
            </Grid>            */}
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
            sx={{ outline:"dashed 1px", marginTop: "0"}}
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
                        key={article.id} 
                        id={article.id} 
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

function ArticleCard({ article }: { article: Article }) {
    return (
        <>
        <Card id={`card-article-${article.id}`}>
            <CardActionArea href={article.href} target="_blank">
                <CardMedia
                    id="article-card-media"
                    component="img"
                    height={article.image.height}
                    width={article.image.width}
                    image={article.image.href}
                    alt={article.image.alt}
                />
                <CardContent>
                    <Typography variant="h5" component="div">
                        {article.title}
                    </Typography>
                    <Typography variant="body1" noWrap>
                        {article.description}
                    </Typography>
                    <Typography variant="caption">
                        {article.metadata.date.toDateString()}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
        </>
    );
}

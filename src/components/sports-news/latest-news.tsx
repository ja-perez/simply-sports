import { fetchArticlesBySportLeague} from '@/lib/data';
import { testArticle } from '@/lib/placeholder-data';

import Container from '@mui/material/Container';

interface LatestNewsProps {
    sport: string;
    league: string;
}

export default async function LatestNews({
    sport,
    league,
}: LatestNewsProps) {
    const articles = await fetchArticlesBySportLeague(sport, league);
    const testArticles = []
    for (let i = 0; i < 9; i++) {
        const tempArticle = {...testArticle, id: i.toString()}
        testArticles.push(tempArticle)
    }
    return (
        <>
        <Container id="latest-news-container" sx={{ display: "flex", justifyContent: "space-around", flexWrap:"wrap"}}>
            {testArticles.map((article) => (
                <div key={article.id} id={article.id} className="outline-dashed p-4 m-2"> 
                    {articleCard({ article })}
                </div>
            ))}
        </Container>
        </>
    );
}

interface articleRibbonProps {
    source: string;
    articles: string[];
}

function articleRibbon({
    source,
    articles,
}: articleRibbonProps) {
    return (
        <>
        </>
    );
}

import { Article } from '@/lib/definitions';
import Card from '@mui/material/Card';
import { CardActionArea } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

function articleCard({ article }: { article: Article }) {
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
                    <Typography variant="body2" >
                        {article.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
        </>
    );
}
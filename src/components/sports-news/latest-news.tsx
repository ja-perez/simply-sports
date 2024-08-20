import { fetchArticlesBySportLeague} from '@/lib/data';

interface LatestNewsProps {
    sport: string;
    league: string;
}

export default async function LatestNews({
    sport,
    league,
}: LatestNewsProps) {
    const articles = await fetchArticlesBySportLeague(sport, league);
    return (
        <>
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
import Button from '@mui/material/Button';

function articleCard({ article }: { article: Article }) {
    return (
        <>
        <Card>
            <CardActionArea>
                <CardMedia
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
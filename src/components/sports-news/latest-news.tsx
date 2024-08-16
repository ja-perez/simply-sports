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
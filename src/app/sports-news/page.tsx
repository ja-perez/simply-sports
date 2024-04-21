import NewsFilter from "@/components/sports-news/news-filter";
import NewsRibbon from "@/components/sports-news/news-ribbon";
import NewsArticles from "@/components/sports-news/news-articles";

export default function SportsNewsPage() {
    return (
        <>
            {/* Main Body */}
            <NewsFilter />
            <NewsRibbon/>
            <NewsArticles />
        </>
    );
}
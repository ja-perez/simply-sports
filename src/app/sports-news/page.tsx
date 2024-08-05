import NewsFilter from "@/components/sports-news/news-filter";
import NewsRibbon from "@/components/sports-news/news-ribbon";
import NewsArticles from "@/components/sports-news/news-articles";

import Divider from '@mui/material/Divider';

export default function SportsNewsPage() {
    return (
        <>
            {/* Main Body */}
            <NewsFilter />
            <Divider sx={{ my: 2 }} />    

            <NewsRibbon/>
            <NewsArticles />
        </>
    );
}
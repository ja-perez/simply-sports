import ContentFilter from "@/components/sports-news/content-filter";
import NewsFilter from "@/components/sports-news/news-filter";
import NewsRibbon from "@/components/sports-news/news-ribbon";
import NewsArticles from "@/components/sports-news/news-articles";

import Divider from '@mui/material/Divider';

import { Suspense } from 'react';

export default async function Page({
    searchParams,
}: {
    searchParams?: {
        sport?: string;
        league?: string;
    }
}) {
    const sport = searchParams?.sport || 'All';
    const league = searchParams?.league || 'All';

    return (
        <>
            {/* Main Body */}
            <ContentFilter sport={sport}/>
            {/* <NewsFilter /> */}
            <Divider sx={{ my: 2 }} />

            <NewsRibbon/>
            <NewsArticles />
        </>
    );
}
import ContentFilter from "@/components/sports-news/content-filter";
import LatestNews from "@/components/sports-news/latest-news";

import Divider from '@mui/material/Divider';

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
            {/* <NewsFilter /> */}
            <ContentFilter sport={sport}/>
            <Divider sx={{ my: 2 }} />
            <LatestNews sport={sport} league={league}/>
        </>
    );
}
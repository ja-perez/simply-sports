import ContentFilter from "@/components/sports-news/content-filter";
import LatestNews from "@/components/sports-news/latest-news";

import Divider from '@mui/material/Divider';
import { Suspense } from "react";

import { promises as fs } from 'fs';

export default async function Page({
    searchParams,
}: {
    searchParams?: {
        sport?: string;
        league?: string;
    }
}) {
    const sportParam = searchParams?.sport || "all";
    const leagueParam = searchParams?.league || "all";

    const file = await fs.readFile(process.cwd() + '/src/lib/api.data.json', 'utf8');
    const data = JSON.parse(file);
    const sports = data.sports;
    const sport = Object.hasOwn(sports, sportParam) ? sportParam : "all";
    const leagues = data.leagues[sport];
    const league = Object.hasOwn(leagues, leagueParam) ? leagueParam : "all";

    return (
        <>
            {/* Main Body */}
            <ContentFilter sports={sports} leagues={leagues}/>
            <Divider sx={{ my: 2 }} />
            <Suspense fallback={<div>Loading Latest News...</div>}>
                <LatestNews sport={sport} league={league}/>
            </Suspense>
        </>
    );
}

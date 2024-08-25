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
    const league = Object.hasOwn(sports[sport], leagueParam) ? leagueParam : "all";
    const leagues = data.leagues[sport];

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


/*
    Note:
    Issue found with the way content filter and params are being passed to the page component.
    The searchParams are simply retrieved by this page and passed to the content filter and
    latest news, however there are no checks to see if the searchParams are valid or if they
    correspond to any actual sports or leagues. This could lead to errors if the searchParams
    are updated manually by the user in the browser.

    In content filter, the actual sport options and corresponding league options for those sports
    are retrieved. Depending on how I handle errors, it may be best to check the validity of the
    sport and league in the page component before passing them to the child components.

*/
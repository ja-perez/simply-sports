export interface Article {
    article_id: string;
    title: string;
    description: string;
    image: {
        href: string;
        alt: string | "";
        width: number;
        height: number;
    }
    href: string;
    metadata: {
        site: string,
        sport: string,
        league: string,
        date: Date,
        type: string | "default";
    },
    media: {
        [key: string]: [
            {
                url: string;
                alt: string | "";
                width: number;
                height: number;
            }
        ]
    }
}

export interface CustomImage {
    href: string;
    alt: string | "";
    width: number;
    height: number;
    rel?: Array<string>;
}

export interface Roster {
    players: Array<Player>;
    formation?: string;
}

export interface Team {
    id: number;
    name: string;
    abbreviation: string;
    homeAway: string;
    score: number;
    winner: boolean;
    logos: Array<CustomImage>;
    roster: Roster;
    metadata: {
        sport: string,
        league: string,
    };
}

export interface Player {
    id: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    position: string;
    status?: string;
    starter?: boolean;
    jersey: string;
    metadata: {
        teamName: string,
        teamId: string,
    }
}

export interface TeamOdds {
    favorite: boolean;
    underdog: boolean;
    moneyLine: number;
    spreadOdds: number;
    spread: number;
}

export interface Odds {
    provider: {
        id: string,
        name: string;
    }
    overUnder: number;
    spread: number;
    overOdds: number;
    underOdds: number;
    drawOdds?: number;
    home: TeamOdds;
    away: TeamOdds;
}

export interface Venue {
    id: string;
    name: string;
    images: Array<CustomImage>
}

export interface Match {
    id: number;
    label: string;
    date: Date;
    venue: Venue;
    official: string;
    metadata: {
        sport: string;
        league: string;
        season: number;
        seasonId?: number;
    }
    teams: {
        "home": Team,
        "away": Team,
    }
    odds: Array<Odds>
}
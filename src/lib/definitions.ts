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

export interface Sport {
    id: string;
    name: string;
    league_ids: Array<string>;
}

export interface League {
    id: string;
    name: string;
    team_ids: Array<string>;
}

export interface Team {
    id: string;
    name: string;
    abbreviation: string;
    logos: [
        {
            href: string;
            alt: string | "";
            width: number;
            height: number;
        }
    ]
    metadata: {
        sport: string,
        league: string,
    }
    player_ids: Array<string>;
}

export interface Player {
    id: string;
    first_name: string;
    last_name: string;
    image_url: string;
    position: string;
    status: string;
    metadata: {
        sport: string,
        league: string,
        team: string,
    }
}
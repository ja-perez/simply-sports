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

export interface Video {
    video_id: string;
    title: string;
    desription: string;
    href: string
    thumbnail: string;
    metadata: {
        site: string;
        geoRestrictions: Array<string>;
        embargoDate: Date;
        expirationDate: Date;
        date: string;
    }
}

export interface Match {
    match_id: string;
    teams: [
        { team_info: Team },
        { team_info: Team }
    ],
    venue: {
        id: string;
        fullName: string;
        shortName: string;
        address: {
            city: string;
            country: string;
        }
    },
    odds: {
        spread: {},
        total: {},
        moneyline: {}
    },
    media: {
        article: Article,
        videos: Array<Video>
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
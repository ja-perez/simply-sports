const sportOptions = [
    "All",
    "Soccer",
    "Football",
    "Basketball",
    "Baseball",
    "Hockey",
]

type Options = {
    [key: string]: string[];
}

const leagueOptions: Options = {
    "All": [],
    "Soccer": [
        "All",
        "Premier League",
        "La Liga",
        "Serie A",
        "Bundesliga",
        "Ligue 1",
    ],
    "Football": [
        "All",
        "NFL",
        "NCAA",
    ],
    "Basketball": [
        "All",
        "NBA",
        "NCAA",
    ],
    "Baseball": [
        "All",
        "MLB",
    ],
    "Hockey": [
        "All",
        "NHL",
    ],
}

import { Article } from "./definitions";
const testArticle: Article = {
    id: "1",
    title: "Test Article",
    description: "This is a test article",
    image: {
        href: "https://via.placeholder.com/100",
        alt: "Placeholder image",
        width: 100,
        height: 100,
    },
    href: "https://example.com",
    metadata: {
        site: "Test Site",
        sport: "Soccer",
        league: "Premier League",
        date: new Date(),
    }
}

export { sportOptions, leagueOptions, testArticle }
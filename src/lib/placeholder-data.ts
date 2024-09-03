import { Article, Match } from "./definitions";
const testArticle: Article = {
    article_id: "1",
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
        type: "default"
    },
    media: {}
}

const testMatch = {
    match_id: "123456",
    name: "Team A at Team B"
}

export { testArticle, testMatch }
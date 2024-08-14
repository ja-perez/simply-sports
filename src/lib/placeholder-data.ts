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

export { sportOptions, leagueOptions }
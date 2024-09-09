export type NavLink = {
    id: string;
    label: string;
    href: string;
    sections?: Array<NavLink>;
}

export const topBarRoutes: Array<NavLink> = [
    {
        id: "home",
        label: "Home",
        href: "/",
        sections: [
            { id: "about", label: "About", href:"/about"},
            { id: "features", label: "Features", href:"/features"},
            { id: "background", label: "background", href:"/background"},
        ]
    },
    {
        id: "news-teams",
        label: "News & Teams",
        href: "news-teams",
    },
    {
        id: "learn",
        label: "Learning Center",
        href: "learn",
        sections: [
            { id: "introduction", label: "Introduction", href:"introduction",
                sections: [
                    { id: "bet-types", label: "Bet Types", href:"bet-types"}
                ]
            },
            { id: "terminology", label: "Terminology", href:"terminology"},
            { id: "resources", label: "Resources", href:"resources"},
        ]
    },
    {
        id: "practice",
        label: "Practice Lounge",
        href: "practice",
        sections: [
            { id: "menu", label: "Menu", href: "menu" },
            { id: "dashboard", label: "Dashboard", href: "dashboard" },
            { id: "session", label: "Session", href: "session" },
        ]
    }
]
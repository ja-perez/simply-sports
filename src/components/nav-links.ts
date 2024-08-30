import Home from '@mui/icons-material/Home';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import School from '@mui/icons-material/School';

const homeLink = {
    name: 'home',
    label: 'Home',
    href: '/',
    icon: Home,
    sections: ['about', 'features', 'background']
}
const newsTeamsLink = {
    name: 'news-teams',
    label: 'News & Teams',
    href: 'news-teams',
    icon: NewspaperIcon,
    sections: ['about', 'features', 'background']
}
const learnLink = {
    name: 'learn',
    label: 'Learning Academy',
    href: 'learn',
    icon: School,
    sections: ['introduction', 'terminology', 'resources']
}
const practiceLink = {
    name: 'practice',
    label: 'Practice Lounge',
    href: 'practice',
    sections: ['lounge', 'tutorial']
}

const topBarNavLinks = [
    homeLink,
    newsTeamsLink,
    learnLink,
    practiceLink
]

const learnSideNav = learnLink.sections.map((section) => {
    return {
        name: section,
        label: section.charAt(0).toUpperCase() + section.slice(1),
        href: 'learn/' + section
    }
})

export { topBarNavLinks, learnSideNav }
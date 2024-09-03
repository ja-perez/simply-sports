import { ComponentType } from 'react';
import { SvgIconProps } from '@mui/material/SvgIcon'
import Home from '@mui/icons-material/Home';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import School from '@mui/icons-material/School';

export type NavLink = {
    name: string;
    label: string;
    href: string;
    icon?: ComponentType<SvgIconProps>;
    sections: Array<string>;
}

const homeLink: NavLink = {
    name: 'home',
    label: 'Home',
    href: '/',
    icon: Home,
    sections: ['about', 'features', 'background']
}
const newsTeamsLink: NavLink = {
    name: 'news-teams',
    label: 'News & Teams',
    href: 'news-teams',
    icon: NewspaperIcon,
    sections: ['about', 'features', 'background']
}
const learnLink: NavLink = {
    name: 'learn',
    label: 'Learning Academy',
    href: 'learn',
    icon: School,
    sections: ['introduction', 'terminology', 'resources']
}
const practiceLink: NavLink = {
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
        href: section
    }
})

export { topBarNavLinks, learnSideNav }
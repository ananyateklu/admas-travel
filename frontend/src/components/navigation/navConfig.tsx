import { HomeIcon, BookIcon, ContactIcon } from '../common/icons';

export interface NavLink {
    path: string;
    label: string;
    icon: JSX.Element;
    description?: string;
}

export const navLinks = [
    {
        path: '/',
        label: 'Home',
        icon: HomeIcon({ className: "w-5 h-5" }),
        description: 'Return to homepage'
    },
    {
        path: '/book',
        label: 'Book',
        icon: BookIcon({ className: "w-5 h-5" }),
        description: 'Book your trip'
    },
    {
        path: '/contact',
        label: 'Contact',
        icon: ContactIcon({ className: "w-5 h-5" }),
        description: 'Get in touch'
    }
] as const; 
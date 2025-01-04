import { HomeIcon, BookIcon, ContactIcon, InfoIcon, BookingsIcon } from '../common/icons';

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
        icon: HomeIcon({ className: "w-4 h-4" }),
        description: 'Return to homepage'
    },
    {
        path: '/about-us',
        label: 'About',
        icon: InfoIcon({ className: "w-4 h-4" }),
        description: 'Learn about us'
    },
    {
        path: '/book',
        label: 'Book Flight',
        icon: BookIcon({ className: "w-4 h-4" }),
        description: 'Book a new flight'
    },
    {
        path: '/bookings',
        label: 'My Trips',
        icon: BookingsIcon({ className: "w-4 h-4" }),
        description: 'View your booked trips'
    },
    {
        path: '/contact',
        label: 'Contact',
        icon: ContactIcon({ className: "w-4 h-4" }),
        description: 'Get in touch'
    }
] as const;
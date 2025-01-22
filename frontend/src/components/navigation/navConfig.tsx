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
        label: 'Flight',
        icon: BookIcon({ className: "w-4 h-4" }),
        description: 'Book a new flight'
    },
    {
        path: '/hotels',
        label: 'Hotels',
        icon: BookIcon({ className: "w-4 h-4" }),
        description: 'Search and book hotels'
    },
    {
        path: '/car-booking',
        label: 'Cars',
        icon: BookIcon({ className: "w-4 h-4" }),
        description: 'Rent a car'
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
    },
    {
        path: '/explore-more',
        label: 'Explore Ethiopia',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        description: 'Discover Ethiopian wonders and cities'
    }
] as const;
import { HomeIcon, BookIcon, ContactIcon, InfoIcon, BookingsIcon } from '../common/icons';

export interface DropdownItem {
    path: string;
    label: string;
    icon: JSX.Element;
    description?: string;
}

export interface NavLink {
    path: string;
    label: string;
    icon: JSX.Element;
    description?: string;
    dropdown?: DropdownItem[];
}

export const navLinks: NavLink[] = [
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
        label: 'Book',
        icon: BookIcon({ className: "w-4 h-4" }),
        description: 'Book your travel',
        dropdown: [
            {
                path: '/book',
                label: 'Flight',
                icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ),
                description: 'Book a flight'
            },
            {
                path: '/hotels',
                label: 'Hotels',
                icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                ),
                description: 'Book a hotel'
            },
            {
                path: '/car-booking',
                label: 'Cars',
                icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10h1.5a2 2 0 114 0h1a2 2 0 114 0h1.5" />
                    </svg>
                ),
                description: 'Rent a car'
            }
        ]
    },
    {
        path: '/bookings',
        label: 'Bookings',
        icon: BookingsIcon({ className: "w-4 h-4" }),
        description: 'View your bookings',
        dropdown: [
            {
                path: '/bookings',
                label: 'My Trips',
                icon: BookingsIcon({ className: "w-4 h-4" }),
                description: 'View all your trips'
            },
            {
                path: '/bookings/hotels',
                label: 'Hotel Bookings',
                icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                ),
                description: 'View your hotel reservations'
            },
            {
                path: '/bookings/cars',
                label: 'Car Rentals',
                icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10h1.5a2 2 0 114 0h1a2 2 0 114 0h1.5" />
                    </svg>
                ),
                description: 'View your car rentals'
            }
        ]
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
];
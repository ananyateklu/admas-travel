import { Airport } from '../../services/flightService';

export interface BookingData {
    bookingId: string;
    userId: string;
    bookingReference: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    status: string;
    previousStatus?: string;
    totalPassengers: number;
    createdAt: string | { toDate: () => Date };
    from: Airport | null;
    to: Airport | null;
    tripType: string;
    class: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    passengers: Array<{
        type: string;
        fullName: string;
        dateOfBirth: string;
        passportNumber: string;
        passportExpiry: string;
        nationality: string;
    }>;
}

export const ADMIN_EMAILS = ['ananya.meseret@gmail.com'];
export const BOOKING_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'] as const;
export type BookingStatus = typeof BOOKING_STATUSES[number];

export interface StatusOption {
    value: BookingStatus;
    label: string;
    icon: JSX.Element;
    className: string;
    step: number;
    colors: {
        active: string;
        completed: string;
        connector: string;
        inactive: string;
        label: string;
    };
}

export type TabType = 'details' | 'passengers' | 'contact'; 
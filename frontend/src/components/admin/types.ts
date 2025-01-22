import { Airport } from '../../services/flightService';

export interface BookingData {
    bookingId: string;
    userId: string;
    bookingReference: string;
    destination: string;
    departureDate: string;
    departureTime?: string;
    returnDate?: string;
    returnTime?: string;
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
    specialRequests?: string;
    passengers: Array<{
        type: string;
        fullName: string;
        dateOfBirth: string;
        passportNumber: string;
        passportExpiry: string;
        nationality: string;
    }>;
    rating?: {
        score: number;
        comment: string;
        createdAt: string | { toDate: () => Date };
        updatedAt?: string | { toDate: () => Date };
    };
}

export const ADMIN_EMAILS = [
    import.meta.env.VITE_ADMIN_EMAIL_1,
    import.meta.env.VITE_ADMIN_EMAIL_2
].filter(Boolean);

export const BOOKING_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'] as const;
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

export interface AdvancedFilters {
    dateRange?: {
        start: string;
        end: string;
    };
    class?: string;
    tripType?: string;
    nationality?: string;
    passengerCount?: {
        min: number;
        max: number;
    };
    status?: string[];
    filterName?: string;
    dateRangeLabel?: string;
    hasRating?: boolean;
    searchValue?: string;
} 
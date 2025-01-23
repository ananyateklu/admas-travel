import { Airport } from '../../services/flightService';

interface BaseBookingData {
    bookingId: string;
    userId: string;
    status: string;
    previousStatus?: string;
    createdAt: string | { toDate: () => Date };
    rating?: {
        score: number;
        comment: string;
        createdAt: string | { toDate: () => Date };
        updatedAt?: string | { toDate: () => Date };
    };
}

export interface HotelLocation {
    country: string;
    city: string;
    address: string;
}

export interface FlightBookingData extends BaseBookingData {
    type: 'flight';
    bookingReference: string;
    destination: string;
    departureDate: string;
    departureTime?: string;
    returnDate?: string;
    returnTime?: string;
    totalPassengers: number;
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
}

export interface HotelBookingData extends BaseBookingData {
    type: 'hotel';
    hotelId: string | number;
    hotelName: string;
    location: string | HotelLocation;
    checkInDate: string;
    checkOutDate: string;
    dates: {
        checkIn: string;
        checkOut: string;
        numberOfNights: number;
    };
    guests: Array<{
        type: string;
        fullName: string;
        dateOfBirth?: string;
    }>;
    numberOfGuests: number;
    numberOfRooms: number;
    numberOfNights: number;
    room: {
        description: string;
        amenities: string[];
        name: string;
        price: {
            amount: number;
            currency: string;
        };
        id: string;
    };
    roomType: string;
    totalPrice: {
        amount: number;
        currency: string;
    };
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    specialRequests?: string;
}

export interface CarBookingData extends BaseBookingData {
    type: 'car';
    vehicle_id: string;
    bookingReference: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    search_key: string;
    specialRequests?: string;
    totalPrice: {
        amount: number;
        currency: string;
    };
}

export type BookingData = FlightBookingData | HotelBookingData | CarBookingData;

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
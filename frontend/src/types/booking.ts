import { Airport } from '../services/flightService';

export interface BookingData {
    bookingId: string;
    bookingReference: string;
    contactName: string;
    contactEmail: string;
    from: Airport | null;
    to: Airport | null;
    departureDate: string;
    returnDate?: string;
    passengers: {
        type: string;
        fullName: string;
        dateOfBirth: string;
        passportNumber: string;
        passportExpiry: string;
        nationality: string;
    }[];
    status: string;
    createdAt: {
        toDate: () => Date;
    } | string;
    updatedAt?: {
        toDate: () => Date;
    } | string;
    totalAmount?: number;
    specialRequests?: string;
    class: string;
    tripType: string;
    userId: string;
} 
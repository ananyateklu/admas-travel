export interface BookingData {
    bookingId: string;
    bookingReference: string;
    contactName: string;
    contactEmail: string;
    from: string;
    to: string;
    departureDate: string;
    returnDate?: string;
    passengers: {
        name: string;
        age: number;
        passportNumber?: string;
    }[];
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    createdAt: {
        toDate: () => Date;
    } | string;
    updatedAt: {
        toDate: () => Date;
    } | string;
    totalAmount: number;
} 
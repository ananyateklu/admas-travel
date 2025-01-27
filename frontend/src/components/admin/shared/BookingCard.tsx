import { motion } from 'framer-motion';
import { BookingData, FlightBookingData, HotelBookingData, CarBookingData } from '../types';
import { FlightListBookingCard } from '../flight-booking-list/FlightListBookingCard';
import { HotelListBookingCard } from '../hotel-booking-list/HotelListBookingCard';
import { CarListBookingCard } from '../car-booking-list/CarListBookingCard';

interface BookingCardProps {
    booking: BookingData;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onStatusChange?: (bookingId: string, newStatus: string, userId: string, previousStatus?: string) => Promise<void>;
    updateLoading?: string | null;
    isReadOnly?: boolean;
    onDelete?: (bookingId: string) => Promise<void>;
    isDeleting?: boolean;
    currentUserId?: string;
    onEdit?: (bookingId: string, updates: Partial<BookingData>) => Promise<void>;
    onRatingSubmit?: (bookingId: string, rating: number, comment: string) => Promise<void>;
    isSubmittingRating?: boolean;
}

export function BookingCard(props: BookingCardProps) {
    const { booking } = props;

    // Infer booking type from available fields if not explicitly set
    const inferBookingType = (booking: BookingData): 'flight' | 'hotel' | 'car' | undefined => {
        if ('from' in booking && 'to' in booking) {
            return 'flight';
        }
        if ('hotelId' in booking && 'roomType' in booking) {
            return 'hotel';
        }
        if ('vehicle_id' in booking) {
            return 'car';
        }
        return undefined;
    };

    // Type guard for FlightBookingData
    const isFlightBooking = (booking: BookingData): booking is FlightBookingData => {
        return booking.type === 'flight' || inferBookingType(booking) === 'flight';
    };

    // Type guard for HotelBookingData
    const isHotelBooking = (booking: BookingData): booking is HotelBookingData => {
        return booking.type === 'hotel' || inferBookingType(booking) === 'hotel';
    };

    // Type guard for CarBookingData
    const isCarBooking = (booking: BookingData): booking is CarBookingData => {
        return booking.type === 'car' || inferBookingType(booking) === 'car';
    };

    // Render the appropriate card based on booking type
    if (isFlightBooking(booking)) {
        return <FlightListBookingCard
            {...props}
            booking={{ ...booking, type: 'flight' }}
            onEdit={props.onEdit ? async (bookingId, updates) => {
                const flightUpdates = updates as Partial<FlightBookingData>;
                await props.onEdit?.(bookingId, {
                    ...flightUpdates,
                    type: 'flight' as const
                });
            } : undefined}
        />;
    }

    if (isHotelBooking(booking)) {
        return <HotelListBookingCard
            {...props}
            booking={{ ...booking, type: 'hotel' }}
            onEdit={props.onEdit ? async (bookingId, updates) => {
                await props.onEdit?.(bookingId, { ...updates, type: 'hotel' });
            } : undefined}
        />;
    }

    if (isCarBooking(booking)) {
        return <CarListBookingCard
            {...props}
            booking={{ ...booking, type: 'car' }}
            onEdit={props.onEdit ? async (bookingId, updates) => {
                await props.onEdit?.(bookingId, { ...updates, type: 'car' });
            } : undefined}
        />;
    }

    // Default case - unknown booking type
    console.error('Could not determine booking type from data:', booking);
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/95 rounded-xl shadow-sm border border-gray-200/60 backdrop-blur-sm backdrop-saturate-150 p-4"
        >
            <div className="text-red-500">
                Unknown booking type. Please check the booking data.
            </div>
        </motion.div>
    );
} 
import { motion } from 'framer-motion';
import { BookingHeader } from '../shared/BookingHeader';
import { BookingDateBadge } from '../flight-booking-list/FlightListBookingDateBadge';
import { CarSearchResult } from '../../../types/carSearch';

interface CarBooking {
    id: string;
    vehicleId: string;
    pickupTime: string;
    dropoffTime: string;
    renterName: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    bookedAt: string | { toDate: () => Date };
    totalPrice: {
        amount: number;
        currency: string;
    };
    vehicleInfo: CarSearchResult['vehicle_info'];
}

interface CarListBookingCardProps {
    booking: CarBooking;
    isExpanded: boolean;
    onToggleExpand: () => void;
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { y: -2 }
};

const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
};

export function CarListBookingCard({
    booking,
    isExpanded,
    onToggleExpand,
}: CarListBookingCardProps) {
    const createdAt = typeof booking.bookedAt === 'object' && 'toDate' in booking.bookedAt
        ? booking.bookedAt.toDate()
        : new Date(booking.bookedAt);

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20%" }}
            whileHover="hover"
            className="bg-white/95 rounded-xl shadow-sm border border-gray-200/60 backdrop-blur-sm backdrop-saturate-150 relative will-change-transform"
        >
            <motion.div
                className="px-2.5 py-2 lg:px-3 lg:py-2"
                variants={contentVariants}
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    {/* Left Section: Date and Main Info */}
                    <div className="flex items-start gap-2">
                        <BookingDateBadge date={new Date(booking.pickupTime)} />
                        <div className="space-y-1.5">
                            <BookingHeader
                                type="car"
                                renterName={booking.renterName}
                                vehicleInfo={booking.vehicleInfo}
                                status={booking.status}
                                bookingId={booking.id}
                                createdAt={createdAt}
                            />
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>
                                    {new Date(booking.pickupTime).toLocaleDateString()} {new Date(booking.pickupTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span className="text-gray-400">→</span>
                                <span>
                                    {new Date(booking.dropoffTime).toLocaleDateString()} {new Date(booking.dropoffTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Price and Actions */}
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">
                                {booking.totalPrice.currency} {booking.totalPrice.amount.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">Total Price</div>
                        </div>
                        <div className="flex items-center">
                            <motion.button
                                onClick={onToggleExpand}
                                className="inline-flex items-center px-2.5 py-1 text-xs bg-gradient-to-br from-gray-50 to-gray-100/80 text-gray-600 rounded-lg hover:from-gray-100 hover:to-gray-200/80 border border-gray-200/60 shadow-sm"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isExpanded ? 'Show Less' : 'Show More'}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
} 
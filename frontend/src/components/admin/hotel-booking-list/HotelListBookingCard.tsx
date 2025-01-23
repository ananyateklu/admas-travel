import { motion, AnimatePresence } from 'framer-motion';
import { BookingHeader } from '../shared/BookingHeader';
import { BookingDateBadge } from '../flight-booking-list/FlightListBookingDateBadge';
import { HotelBookingData, BookingStatus, ADMIN_EMAILS } from '../types';
import { BookingStatusProgress } from '../flight-booking-list/FlightListBookingStatusProgress';

interface HotelLocation {
    country: string;
    city: string;
    address: string;
}

interface HotelListBookingCardProps {
    booking: HotelBookingData;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onStatusChange?: (bookingId: string, newStatus: BookingStatus, userId: string, previousStatus?: BookingStatus) => Promise<void>;
    updateLoading?: string | null;
    isReadOnly?: boolean;
    onDelete?: (bookingId: string) => Promise<void>;
    isDeleting?: boolean;
    currentUserId?: string;
    onEdit?: (bookingId: string, updates: Partial<HotelBookingData>) => Promise<void>;
    onRatingSubmit?: (bookingId: string, rating: number, comment: string) => Promise<void>;
    isSubmittingRating?: boolean;
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

export function HotelListBookingCard({
    booking,
    isExpanded,
    onToggleExpand,
    onStatusChange,
    updateLoading,
    isReadOnly = false,
    onDelete,
    isDeleting,
    currentUserId,
    onEdit,
    onRatingSubmit
}: HotelListBookingCardProps) {
    const canEdit = !isReadOnly && (
        ADMIN_EMAILS.includes(currentUserId ?? '') ||
        (booking.status === 'pending' && currentUserId === booking.userId)
    );
    const canDelete = currentUserId === booking.userId;

    const createdAt = typeof booking.createdAt === 'object' && 'toDate' in booking.createdAt
        ? booking.createdAt.toDate()
        : new Date(booking.createdAt);

    const checkInDate = new Date(booking.checkInDate);
    const checkOutDate = new Date(booking.checkOutDate);

    const location = typeof booking.location === 'string'
        ? booking.location
        : `${(booking.location as HotelLocation).city}, ${(booking.location as HotelLocation).country}`;

    const handleStatusChange = async (bookingId: string, newStatus: string, userId: string, previousStatus?: string) => {
        if (onStatusChange) {
            // Always pass the current status as previous status for tracking
            await onStatusChange(
                bookingId,
                newStatus as BookingStatus,
                userId,
                (previousStatus ?? booking.status) as BookingStatus
            );
        }
    };

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
                        <BookingDateBadge date={checkInDate} />
                        <div className="space-y-1.5">
                            <BookingHeader
                                type="hotel"
                                guestName={booking.contactName}
                                hotelName={booking.hotelName}
                                status={booking.status as BookingStatus}
                                bookingId={booking.bookingId}
                                createdAt={createdAt}
                                rating={booking.rating}
                            />
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>{checkInDate.toLocaleDateString()} - {checkOutDate.toLocaleDateString()}</span>
                                <span className="text-gray-400">•</span>
                                <span>{booking.numberOfGuests} Guest{booking.numberOfGuests > 1 ? 's' : ''}</span>
                                <span className="text-gray-400">•</span>
                                <span>{booking.numberOfRooms} Room{booking.numberOfRooms > 1 ? 's' : ''}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Status and Actions */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="px-2 py-1 bg-gray-50 rounded text-sm text-gray-600 border border-gray-200/60">
                                {booking.numberOfNights} Night{booking.numberOfNights > 1 ? 's' : ''}
                            </div>
                            <div className="px-2 py-1 bg-forest-50 rounded text-sm text-forest-600 border border-forest-200/60 font-medium">
                                {booking.totalPrice.currency} {booking.totalPrice.amount}
                            </div>
                        </div>
                        {!isReadOnly && onStatusChange ? (
                            <BookingStatusProgress
                                currentStatus={booking.status as BookingStatus}
                                previousStatus={booking.previousStatus}
                                bookingId={booking.bookingId}
                                userId={booking.userId}
                                onStatusChange={handleStatusChange}
                                isLoading={updateLoading === booking.bookingId}
                                isAdmin={ADMIN_EMAILS.includes(currentUserId ?? '')}
                            />
                        ) : (
                            <BookingStatusProgress
                                currentStatus={booking.status as BookingStatus}
                                previousStatus={booking.previousStatus}
                                bookingId={booking.bookingId}
                                userId={booking.userId}
                                onStatusChange={handleStatusChange}
                                isLoading={false}
                                isAdmin={ADMIN_EMAILS.includes(currentUserId ?? '')}
                            />
                        )}
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

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-gray-200/60"
                    >
                        <div className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Guest Information</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Name:</span>
                                            <span className="font-medium text-gray-900">{booking.contactName}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Email:</span>
                                            <span className="font-medium text-gray-900">{booking.contactEmail}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Phone:</span>
                                            <span className="font-medium text-gray-900">{booking.contactPhone}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Booking Details</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Hotel:</span>
                                            <span className="font-medium text-gray-900">{booking.hotelName}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Location:</span>
                                            <span className="font-medium text-gray-900">{location}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Room:</span>
                                            <span className="font-medium text-gray-900">{booking.room?.name || booking.roomType}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {booking.specialRequests && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Special Requests</h4>
                                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{booking.specialRequests}</p>
                                </div>
                            )}
                            <div className="flex justify-end gap-2">
                                {canDelete && onDelete && (
                                    <motion.button
                                        onClick={() => onDelete(booking.bookingId)}
                                        disabled={isDeleting}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                                    >
                                        {isDeleting ? 'Deleting...' : 'Delete Booking'}
                                    </motion.button>
                                )}
                                {canEdit && onEdit && (
                                    <motion.button
                                        onClick={() => onEdit(booking.bookingId, {})}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-3 py-1.5 text-sm text-primary hover:text-primary-dark"
                                    >
                                        Edit Booking
                                    </motion.button>
                                )}
                            </div>
                            {booking.status === 'completed' && onRatingSubmit && !booking.rating && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Rate Your Stay</h4>
                                    {/* Add rating component here */}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
} 
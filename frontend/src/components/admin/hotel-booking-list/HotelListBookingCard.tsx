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
                className="px-1.5 sm:px-2.5 py-2 lg:px-3 lg:py-2"
                variants={contentVariants}
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    {/* Left Section: Date and Main Info */}
                    <div className="flex items-start gap-2 w-full md:w-auto">
                        <div className="hidden sm:block">
                            <BookingDateBadge date={checkInDate} />
                        </div>
                        <div className="space-y-1.5 w-full md:w-auto">
                            <BookingHeader
                                type="hotel"
                                guestName={booking.contactName}
                                hotelName={booking.hotelName}
                                status={booking.status as BookingStatus}
                                bookingId={booking.bookingId}
                                createdAt={createdAt}
                                rating={booking.rating}
                            />
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm text-gray-600">
                                {/* ToDo: Add check-in and check-out date and time.*/}
                                <div className="w-full bg-white/90 border border-gray-200/70 rounded-lg p-1.5 mb-0.5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[8px] uppercase tracking-wider text-gray-500 font-medium">Check-in</span>
                                            <div className="flex items-center gap-0.5">
                                                <span className="text-xs font-semibold text-forest-700">{new Date(booking.checkInDate).toLocaleDateString(undefined, { day: 'numeric' })}</span>
                                                <span className="text-[8px] text-gray-600">{new Date(booking.checkInDate).toLocaleDateString(undefined, { month: 'short' })}</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 h-0.5 mx-2">
                                            <div className="relative h-0.5">
                                                <div className="absolute w-full h-0.5 bg-gray-200 rounded-full"></div>
                                                <div className="absolute h-0.5 bg-gradient-to-r from-forest-400 to-red-400 rounded-full" style={{ width: '100%' }}></div>
                                                <div className="absolute -top-1 left-0 w-2 h-2 bg-forest-500 rounded-full border-2 border-white"></div>
                                                <div className="absolute -top-1 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
                                            </div>
                                            <div className="mt-0.5 text-center">
                                                <span className="text-[8px] text-gray-500">
                                                    {Math.ceil((new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 60 * 60 * 24))} night{Math.ceil((new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 60 * 60 * 24)) > 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-[8px] uppercase tracking-wider text-gray-500 font-medium">Check-out</span>
                                            <div className="flex items-center gap-0.5">
                                                <span className="text-xs font-semibold text-red-700">{new Date(booking.checkOutDate).toLocaleDateString(undefined, { day: 'numeric' })}</span>
                                                <span className="text-[8px] text-gray-600">{new Date(booking.checkOutDate).toLocaleDateString(undefined, { month: 'short' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-full bg-white/90 border border-gray-200/70 rounded-lg p-1.5 mb-0.5">
                                        <div className="flex items-center justify-center">
                                            <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-forest-50/80 border border-forest-200/50">
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-3.5 h-3.5 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span className="text-xs font-medium text-forest-700">
                                                        {booking.numberOfGuests} Guest{booking.numberOfGuests > 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                                <span className="text-forest-300">•</span>
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-3.5 h-3.5 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                    <span className="text-xs font-medium text-forest-700">
                                                        {booking.numberOfRooms} Room{booking.numberOfRooms > 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Status and Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
                            <div className="px-2 py-1 bg-gray-50 rounded text-sm text-gray-600 border border-gray-200/60 whitespace-nowrap">
                                {booking.numberOfNights} Night{booking.numberOfNights > 1 ? 's' : ''}
                            </div>
                            <div className="px-2 py-1 bg-forest-50 rounded text-sm text-forest-600 border border-forest-200/60 font-medium whitespace-nowrap">
                                {booking.totalPrice.currency} {booking.totalPrice.amount}
                            </div>
                        </div>

                        {!isReadOnly && onStatusChange ? (
                            <div className="w-full sm:w-auto">
                                <BookingStatusProgress
                                    currentStatus={booking.status as BookingStatus}
                                    previousStatus={booking.previousStatus}
                                    bookingId={booking.bookingId}
                                    userId={booking.userId}
                                    onStatusChange={handleStatusChange}
                                    isLoading={updateLoading === booking.bookingId}
                                    isAdmin={ADMIN_EMAILS.includes(currentUserId ?? '')}
                                />
                            </div>
                        ) : (
                            <div className="w-full sm:w-auto">
                                <BookingStatusProgress
                                    currentStatus={booking.status as BookingStatus}
                                    previousStatus={booking.previousStatus}
                                    bookingId={booking.bookingId}
                                    userId={booking.userId}
                                    onStatusChange={handleStatusChange}
                                    isLoading={false}
                                    isAdmin={ADMIN_EMAILS.includes(currentUserId ?? '')}
                                />
                            </div>
                        )}

                        <div className="flex items-center w-full sm:w-auto mt-6 sm:mt-0">
                            <motion.button
                                onClick={onToggleExpand}
                                className="w-full sm:w-auto inline-flex items-center justify-center px-2.5 py-1 text-xs bg-gradient-to-br from-gray-50 to-gray-100/80 text-gray-600 rounded-lg hover:from-gray-100 hover:to-gray-200/80 border border-gray-200/60 shadow-sm"
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-100">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-1.5">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Guest Information
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Name:</span>
                                            <span className="font-medium text-gray-900">{booking.contactName}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Email:</span>
                                            <span className="font-medium text-gray-900 break-all">{booking.contactEmail}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Phone:</span>
                                            <span className="font-medium text-gray-900">{booking.contactPhone}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-100">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-1.5">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        Booking Details
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Hotel:</span>
                                            <span className="font-medium text-gray-900 text-right">{booking.hotelName}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Location:</span>
                                            <span className="font-medium text-gray-900 text-right">{location}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Room:</span>
                                            <span className="font-medium text-gray-900 text-right">{booking.room?.name || booking.roomType}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Check-in Date:</span>
                                            <span className="font-medium text-gray-900 text-right">{checkInDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Check-out Date:</span>
                                            <span className="font-medium text-gray-900 text-right">{checkOutDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Duration:</span>
                                            <span className="font-medium text-gray-900 text-right">{booking.numberOfNights} night{booking.numberOfNights > 1 ? 's' : ''}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Guests:</span>
                                            <span className="font-medium text-gray-900 text-right">{booking.numberOfGuests} guest{booking.numberOfGuests > 1 ? 's' : ''}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Rooms:</span>
                                            <span className="font-medium text-gray-900 text-right">{booking.numberOfRooms} room{booking.numberOfRooms > 1 ? 's' : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {booking.specialRequests && (
                                <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-100">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-1.5">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                        </svg>
                                        Special Requests
                                    </h4>
                                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{booking.specialRequests}</p>
                                </div>
                            )}
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
                                {canDelete && onDelete && (
                                    <motion.button
                                        onClick={() => onDelete(booking.bookingId)}
                                        disabled={isDeleting}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full sm:w-auto px-3 py-1.5 text-sm text-red-600 hover:text-red-700 disabled:opacity-50 border border-red-200 rounded-lg hover:bg-red-50"
                                    >
                                        {isDeleting ? 'Deleting...' : 'Delete Booking'}
                                    </motion.button>
                                )}
                                {canEdit && onEdit && (
                                    <motion.button
                                        onClick={() => onEdit(booking.bookingId, {})}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full sm:w-auto px-3 py-1.5 text-sm text-forest-600 hover:text-forest-700 border border-forest-200 rounded-lg hover:bg-forest-50"
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
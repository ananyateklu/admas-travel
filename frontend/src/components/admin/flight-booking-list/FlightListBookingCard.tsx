import { motion, AnimatePresence } from 'framer-motion';
import { FlightBookingData, BookingStatus, ADMIN_EMAILS } from '../types';
import { BookingStatusProgress } from './FlightListBookingStatusProgress';
import { BookingDateBadge } from './FlightListBookingDateBadge';
import { BookingHeader } from '../shared/BookingHeader';
import { JourneyDetails } from './FlightListJourneyDetails';
import { PassengerAvatars } from './FlightListPassengerAvatars';
import { FlightListBookingExpandedView } from './FlightListBookingExpandedView';

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 10,
        scale: 0.99,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: [0.23, 1, 0.32, 1],
            opacity: { duration: 0.4 },
            scale: { duration: 0.3 },
            y: { duration: 0.3 },
        }
    },
    hover: {
        y: -2,
        transition: {
            duration: 0.2,
            ease: "easeOut"
        }
    }
};

const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.2,
            ease: "easeOut"
        }
    }
};

interface FlightListBookingCardProps {
    booking: FlightBookingData;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onStatusChange?: (bookingId: string, newStatus: string, userId: string, previousStatus?: string) => Promise<void>;
    updateLoading?: string | null;
    isReadOnly?: boolean;
    onDelete?: (bookingId: string) => Promise<void>;
    isDeleting?: boolean;
    currentUserId?: string;
    onEdit?: (bookingId: string, updates: Partial<FlightBookingData>) => Promise<void>;
    onRatingSubmit?: (bookingId: string, rating: number, comment: string) => Promise<void>;
    isSubmittingRating?: boolean;
}

export function FlightListBookingCard({
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
    onRatingSubmit,
    isSubmittingRating
}: FlightListBookingCardProps) {
    const canEdit = !isReadOnly && (
        ADMIN_EMAILS.includes(currentUserId ?? '') ||
        (booking.status === 'pending' && currentUserId === booking.userId)
    );
    const canDelete = currentUserId === booking.userId;

    const createdAt = typeof booking.createdAt === 'object' && 'toDate' in booking.createdAt
        ? booking.createdAt.toDate()
        : new Date(booking.createdAt);

    const handleStatusChange = async (bookingId: string, newStatus: string, userId: string, previousStatus?: string) => {
        if (onStatusChange) {
            // Always pass the current status as previous status for tracking
            await onStatusChange(bookingId, newStatus, userId, previousStatus ?? booking.status);
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
                        {booking.departureDate && (
                            <BookingDateBadge date={new Date(booking.departureDate)} />
                        )}
                        <div className="space-y-1.5">
                            <BookingHeader
                                type="flight"
                                contactName={booking.contactName}
                                status={booking.status}
                                bookingReference={booking.bookingReference}
                                createdAt={createdAt}
                                rating={booking.rating}
                            />
                            <JourneyDetails booking={booking} />
                        </div>
                    </div>

                    {/* Right Section: Status and Actions */}
                    <div className="flex items-center gap-4">
                        <div className="relative z-10">
                            {booking.passengers && booking.passengers.length > 0 && (
                                <PassengerAvatars passengers={booking.passengers as { fullName: string; type: 'adult' | 'child'; nationality: string; passportNumber: string; }[]} />
                            )}
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
                    <FlightListBookingExpandedView
                        booking={booking}
                        onDelete={onDelete}
                        isDeleting={isDeleting}
                        canDelete={canDelete}
                        canEdit={canEdit}
                        onEdit={onEdit}
                        onRatingSubmit={onRatingSubmit}
                        isSubmittingRating={isSubmittingRating}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
} 
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingQuickActions } from './BookingQuickActions';
import { BookingTabs, TabType } from './BookingTabs';
import { BookingDetails } from './BookingDetails';
import { PassengerDetails } from './PassengerDetails';
import { ContactDetails } from './ContactDetails';
import { BookingData } from '../types';

interface BookingExpandedViewProps {
    booking: BookingData;
    onDelete?: (bookingId: string) => Promise<void>;
    isDeleting?: boolean;
    canDelete?: boolean;
    canEdit?: boolean;
    onEdit?: (bookingId: string, updates: Partial<BookingData>) => Promise<void>;
    onRatingSubmit?: (bookingId: string, rating: number, comment: string) => Promise<void>;
    isSubmittingRating?: boolean;
}

export function BookingExpandedView({
    booking,
    onDelete,
    isDeleting,
    canDelete,
    canEdit,
    onEdit,
    onRatingSubmit,
    isSubmittingRating
}: BookingExpandedViewProps) {
    const [activeTab, setActiveTab] = useState<TabType>('details');
    const [isEditing, setIsEditing] = useState(false);

    const handleShare = async () => {
        const shareData = {
            title: `Travel Booking - ${booking.bookingReference}`,
            text: `Check travel booking from ${booking.from && typeof booking.from === 'object' ? booking.from.city : booking.from ?? 'Unknown'} to ${booking.to && typeof booking.to === 'object' ? booking.to.city : booking.to ?? 'Unknown'}`,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                if ((error as Error).name !== 'AbortError') {
                    console.error('Error sharing:', error);
                }
            }
        }
    };

    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="border-t border-gray-100/50"
        >
            <div className="px-4 py-3 lg:px-6 lg:py-4 bg-gradient-to-b from-gray-50/30 to-white">
                <BookingQuickActions
                    bookingReference={booking.bookingReference}
                    contactPhone={booking.contactPhone}
                    contactEmail={booking.contactEmail}
                    status={booking.status}
                    onShare={handleShare}
                />

                <BookingTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    canEdit={canEdit}
                    isEditing={isEditing}
                    onEditToggle={() => setIsEditing(!isEditing)}
                />

                <AnimatePresence mode="wait">
                    {activeTab === 'details' && (
                        <motion.div
                            key="details"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        >
                            <BookingDetails
                                booking={booking}
                                onDelete={onDelete}
                                isDeleting={isDeleting}
                                canDelete={canDelete}
                                onEdit={onEdit}
                                onRatingSubmit={onRatingSubmit}
                                isSubmittingRating={isSubmittingRating}
                                isEditing={isEditing}
                                onEditComplete={() => setIsEditing(false)}
                            />
                        </motion.div>
                    )}

                    {activeTab === 'passengers' && (
                        <motion.div
                            key="passengers"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        >
                            <PassengerDetails
                                booking={booking}
                                isEditing={isEditing}
                                onEdit={onEdit}
                                onEditComplete={() => setIsEditing(false)}
                            />
                        </motion.div>
                    )}

                    {activeTab === 'contact' && (
                        <motion.div
                            key="contact"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        >
                            <ContactDetails
                                booking={booking}
                                isEditing={isEditing}
                                onEdit={onEdit}
                                onEditComplete={() => setIsEditing(false)}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
} 
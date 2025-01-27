import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingQuickActions } from './FlightListBookingQuickActions';
import { BookingTabs, TabType } from './FlightListBookingTabs';
import { BookingDetails } from './FlightListBookingDetails';
import { PassengerDetails } from './FlightListPassengerDetails';
import { ContactDetails } from './FlightListContactDetails';
import { FlightBookingData, BookingData } from '../types';
import { Airport } from '../../../services/flightService';
import { PassengerInfo } from './FlightListPassengerDetails';

function SaveCancelButtons({
    onSave,
    onCancel,
    onDelete,
    isDeleting,
    canDelete
}: {
    onSave: () => void;
    onCancel: () => void;
    onDelete?: () => void;
    isDeleting?: boolean;
    canDelete?: boolean;
}) {
    return (
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            {canDelete && onDelete && (
                <motion.button
                    onClick={onDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isDeleting ? 'Deleting...' : 'Delete Booking'}
                </motion.button>
            )}
            <motion.button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                Cancel
            </motion.button>
            <motion.button
                onClick={onSave}
                className="px-4 py-2 text-sm font-medium text-white bg-forest-600 hover:bg-forest-700 border border-forest-600 rounded-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                Save Changes
            </motion.button>
        </div>
    );
}

interface FlightListBookingExpandedViewProps {
    booking: FlightBookingData;
    onDelete?: (bookingId: string) => Promise<void>;
    isDeleting?: boolean;
    canDelete?: boolean;
    canEdit?: boolean;
    onEdit?: (bookingId: string, updates: Partial<BookingData>) => Promise<void>;
    onRatingSubmit?: (bookingId: string, rating: number, comment: string) => Promise<void>;
    isSubmittingRating?: boolean;
}

export function FlightListBookingExpandedView({
    booking,
    onDelete,
    isDeleting,
    canDelete,
    canEdit,
    onEdit,
    onRatingSubmit,
    isSubmittingRating
}: FlightListBookingExpandedViewProps) {
    const [activeTab, setActiveTab] = useState<TabType>('details');
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<FlightBookingData>>({});

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

    const handleInputChange = (field: keyof FlightBookingData, value: string | Airport | PassengerInfo[] | null) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    const handleEditComplete = async () => {
        if (onEdit && Object.keys(editForm).length > 0) {
            await onEdit(booking.bookingId, editForm);
            setEditForm({});
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditForm({});
    };

    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="border-t border-gray-100/50"
        >
            <div className="px-2 py-2 sm:px-4 lg:px-6 lg:py-4 bg-gradient-to-b from-gray-50/30 to-white">
                <BookingQuickActions
                    bookingReference={booking.bookingReference}
                    contactPhone={booking.contactPhone}
                    contactEmail={booking.contactEmail}
                    status={booking.status}
                    onShare={handleShare}
                />

                <div className="mt-4">
                    <BookingTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        canEdit={canEdit}
                        isEditing={isEditing}
                        onEditToggle={() => {
                            if (isEditing) {
                                handleEditComplete();
                            } else {
                                setIsEditing(true);
                                setEditForm({});
                            }
                        }}
                    />
                </div>

                <div className="mt-4">
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
                                    isEditing={isEditing}
                                    onRatingSubmit={onRatingSubmit}
                                    isSubmittingRating={isSubmittingRating}
                                />
                                {isEditing && (
                                    <SaveCancelButtons
                                        onSave={handleEditComplete}
                                        onCancel={handleCancel}
                                        onDelete={canDelete && onDelete ? () => onDelete(booking.bookingId) : undefined}
                                        isDeleting={isDeleting}
                                        canDelete={canDelete}
                                    />
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'passengers' && (
                            <motion.div
                                key="passengers"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                className="space-y-4"
                            >
                                <PassengerDetails
                                    booking={booking}
                                    isEditing={isEditing}
                                    editForm={editForm}
                                    onInputChange={handleInputChange}
                                />
                                {isEditing && (
                                    <SaveCancelButtons
                                        onSave={handleEditComplete}
                                        onCancel={handleCancel}
                                        onDelete={canDelete && onDelete ? () => onDelete(booking.bookingId) : undefined}
                                        isDeleting={isDeleting}
                                        canDelete={canDelete}
                                    />
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'contact' && (
                            <motion.div
                                key="contact"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                className="space-y-4"
                            >
                                <ContactDetails
                                    booking={booking}
                                    isEditing={isEditing}
                                    editForm={editForm}
                                    onInputChange={handleInputChange}
                                />
                                {isEditing && (
                                    <SaveCancelButtons
                                        onSave={handleEditComplete}
                                        onCancel={handleCancel}
                                        onDelete={canDelete && onDelete ? () => onDelete(booking.bookingId) : undefined}
                                        isDeleting={isDeleting}
                                        canDelete={canDelete}
                                    />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
} 
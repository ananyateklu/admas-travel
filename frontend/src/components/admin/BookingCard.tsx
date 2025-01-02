import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingData, TabType, BookingStatus } from './types';
import { BookingStatusProgress } from './BookingStatusProgress';
import { BookingDetails } from './BookingDetails';
import { PassengerDetails } from './PassengerDetails';
import { ContactDetails } from './ContactDetails';
import { STATUS_OPTIONS } from './constants';

const getStatusStyle = (status: string) => {
    switch (status) {
        case 'upcoming': return 'bg-blue-100 text-blue-800';
        case 'confirmed': return 'bg-emerald-100 text-emerald-800';
        case 'pending': return 'bg-amber-100 text-amber-800';
        case 'completed': return 'bg-purple-100 text-purple-800';
        case 'cancelled': return 'bg-rose-100 text-rose-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 20,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    },
    visible: {
        opacity: 1,
        y: 0,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    },
    hover: {
        y: -2,
        boxShadow: "0 12px 20px -6px rgba(0, 0, 0, 0.1), 0 8px 12px -2px rgba(0, 0, 0, 0.05)",
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10
        }
    }
};

const buttonVariants = {
    hover: {
        scale: 1.05,
        transition: {
            duration: 0.2,
            ease: "easeOut"
        }
    },
    tap: {
        scale: 0.95,
        transition: {
            duration: 0.1,
            ease: "easeIn"
        }
    }
};

interface BookingCardProps {
    booking: BookingData;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onStatusChange?: (bookingId: string, newStatus: string, userId: string) => Promise<void>;
    updateLoading?: string | null;
    isReadOnly?: boolean;
    onDelete?: (bookingId: string) => Promise<void>;
    isDeleting?: boolean;
    currentUserId?: string;
}

export function BookingCard({
    booking,
    isExpanded,
    onToggleExpand,
    onStatusChange,
    updateLoading,
    isReadOnly = false,
    onDelete,
    isDeleting,
    currentUserId
}: BookingCardProps) {
    const [activeTab, setActiveTab] = React.useState<TabType>('details');
    const [copySuccess, setCopySuccess] = React.useState<'reference' | 'contact' | null>(null);

    const handleCopy = async (text: string, type: 'reference' | 'contact') => {
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccess(type);
            setTimeout(() => setCopySuccess(null), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    const canDelete = currentUserId === booking.userId;

    const renderReadOnlyStatus = () => {
        const currentStepIndex = STATUS_OPTIONS.findIndex(opt => opt.value === booking.status);
        const isCanceled = booking.status === 'cancelled';
        // If canceled, use the previous status to determine where it was canceled
        const lastActiveStepIndex = isCanceled && booking.previousStatus ?
            STATUS_OPTIONS.findIndex(opt => opt.value === booking.previousStatus) :
            currentStepIndex;

        return (
            <div className="flex items-center gap-1.5 text-xs relative">
                <div className="absolute top-2.5 left-4 right-4 h-[2px] bg-gray-200 z-[1]" />

                {STATUS_OPTIONS.map((option, index) => {
                    const isActive = isCanceled ?
                        (index === lastActiveStepIndex) : // Show canceled step
                        (booking.status === option.value);
                    const isPassed = isCanceled ?
                        (index < lastActiveStepIndex) : // Show progress until canceled step
                        (currentStepIndex > index);

                    const getStepColor = () => {
                        if (isActive) return option.colors.active;
                        if (isPassed) return option.colors.completed;
                        return 'border-gray-200 bg-white text-gray-400';
                    };

                    const stepColor = isCanceled && index === lastActiveStepIndex ?
                        'border-rose-500 bg-rose-500 text-white' :
                        getStepColor();

                    return (
                        <React.Fragment key={option.value}>
                            <div className="flex flex-col items-center">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${stepColor} relative z-10`}>
                                    <div className="w-3 h-3 flex items-center justify-center">
                                        {isCanceled && index === lastActiveStepIndex ? (
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        ) : (
                                            option.icon
                                        )}
                                    </div>
                                </div>
                                <span className={`text-[10px] mt-1 font-medium ${(() => {
                                    if (isCanceled && index === lastActiveStepIndex) return 'text-rose-600';
                                    if (isActive) return option.colors.label;
                                    return 'text-gray-400';
                                })()}`}>
                                    {isCanceled && index === lastActiveStepIndex ?
                                        'Cancelled' :
                                        option.label}
                                </span>
                            </div>
                            {index < STATUS_OPTIONS.length - 1 && (
                                <div className="flex-1 h-px bg-gray-200 relative top-2.5 z-10">
                                    <div
                                        className={`absolute inset-0 transition-transform duration-300 ${isCanceled && index >= lastActiveStepIndex ?
                                            'bg-rose-500' :
                                            'bg-gradient-to-r from-gold to-emerald-500'
                                            }`}
                                        style={{
                                            transform: `scaleX(${isPassed ? 1 : 0})`,
                                            transformOrigin: 'left'
                                        }}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        );
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="bg-white rounded-xl shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.12)] transition-all duration-300"
        >
            <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    {/* Left Section: Date and Main Info */}
                    <div className="flex items-start gap-4">
                        <motion.div
                            className="flex-shrink-0"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <div className="w-16 h-16 flex flex-col items-center justify-center bg-gradient-to-br from-gold/5 to-gold/10 rounded-lg border border-gold/20">
                                <span className="text-sm font-medium text-gold">
                                    {new Date(booking.departureDate).toLocaleDateString(undefined, {
                                        month: 'short'
                                    })}
                                </span>
                                <span className="text-xl font-bold text-gray-800">
                                    {new Date(booking.departureDate).getDate()}
                                </span>
                            </div>
                        </motion.div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-lg font-medium text-gray-800">{booking.contactName}</h3>
                                <motion.span
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(booking.status)}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </motion.span>
                                <motion.div
                                    className="flex items-center gap-1 ml-2 bg-gold/10 text-gold/90 px-2 py-0.5 rounded-full text-xs font-medium"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>{booking.passengers.length} {booking.passengers.length === 1 ? 'Passenger' : 'Passengers'}</span>
                                </motion.div>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
                                <motion.div
                                    className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{(booking.from && typeof booking.from === 'object' ? booking.from.city : booking.from) ?? 'Unknown'} → {(booking.to && typeof booking.to === 'object' ? booking.to.city : booking.to) ?? 'Unknown'}</span>
                                </motion.div>
                                <span className="text-gray-400">•</span>
                                <motion.div
                                    className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>
                                        {new Date(booking.departureDate).toLocaleTimeString(undefined, {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                        {booking.returnDate && (
                                            <>
                                                {' - '}
                                                {new Date(booking.returnDate).toLocaleTimeString(undefined, {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </>
                                        )}
                                    </span>
                                </motion.div>
                            </div>
                            <div className="flex items-center gap-4 text-sm flex-wrap">
                                <motion.div
                                    className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span className="capitalize">{booking.class}</span>
                                </motion.div>
                                <span className="text-gray-400">•</span>
                                <motion.div
                                    className="flex items-center gap-1 text-gray-500 group cursor-pointer"
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => handleCopy(booking.bookingReference, 'reference')}
                                >
                                    <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <span className="text-gray-600 group-hover:text-gray-900">Ref: {booking.bookingReference}</span>
                                    {copySuccess === 'reference' && (
                                        <motion.span
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="ml-2 text-xs text-emerald-500"
                                        >
                                            Copied!
                                        </motion.span>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Status and Actions */}
                    <div className="flex items-center gap-4">
                        <motion.div
                            className="flex flex-col items-end gap-2"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="flex -space-x-2">
                                {booking.passengers.slice(0, 3).map((passenger) => (
                                    <motion.div
                                        key={passenger.passportNumber}
                                        className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/5 to-gold/10 border-2 border-white flex items-center justify-center"
                                        title={passenger.fullName}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        whileHover={{ scale: 1.1, zIndex: 10 }}
                                    >
                                        <span className="text-xs font-medium text-gray-700">
                                            {passenger.fullName.charAt(0)}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                        {!isReadOnly && onStatusChange ? (
                            <BookingStatusProgress
                                currentStatus={booking.status as BookingStatus}
                                bookingId={booking.bookingId}
                                userId={booking.userId}
                                onStatusChange={onStatusChange}
                                isLoading={updateLoading === booking.bookingId}
                            />
                        ) : (
                            renderReadOnlyStatus()
                        )}
                        <motion.button
                            onClick={onToggleExpand}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 rounded-full"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <motion.svg
                                className={`w-5 h-5 transform transition-transform`}
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </motion.svg>
                        </motion.button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="border-t border-gray-100"
                    >
                        <div className="p-4 bg-gradient-to-b from-gray-50 to-white">
                            {/* Quick Actions Bar */}
                            <motion.div
                                className="flex items-center justify-between mb-4 bg-white rounded-lg p-2 shadow-sm"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <div className="flex items-center gap-4 overflow-x-auto">
                                    <motion.button
                                        onClick={() => handleCopy(booking.bookingReference, 'reference')}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors group"
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <svg className="w-4 h-4 text-gold group-hover:text-gold/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                        <span className="whitespace-nowrap">Copy Reference</span>
                                        {copySuccess === 'reference' && (
                                            <motion.span
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="ml-2 text-xs text-emerald-500"
                                            >
                                                Copied!
                                            </motion.span>
                                        )}
                                    </motion.button>
                                    <div className="h-4 w-px bg-gray-200"></div>
                                    <motion.button
                                        onClick={() => window.print()}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors group"
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <svg className="w-4 h-4 text-gold group-hover:text-gold/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                        </svg>
                                        <span className="whitespace-nowrap">Print Details</span>
                                    </motion.button>
                                    <div className="h-4 w-px bg-gray-200"></div>
                                    <motion.button
                                        onClick={async () => {
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
                                        }}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors group"
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <svg className="w-4 h-4 text-gold group-hover:text-gold/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                        </svg>
                                        <span className="whitespace-nowrap">Share</span>
                                    </motion.button>
                                </div>
                                <motion.div
                                    className="flex items-center gap-2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <motion.span
                                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(booking.status)}`}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </motion.span>
                                </motion.div>
                            </motion.div>

                            {/* Tabs Navigation */}
                            <motion.div
                                className="bg-white rounded-lg shadow-sm mb-4"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="border-b border-gray-200">
                                    <nav className="flex space-x-8 px-4 overflow-x-auto" aria-label="Booking Information">
                                        {['details', 'passengers', 'contact'].map((tab) => (
                                            <motion.button
                                                key={tab}
                                                onClick={() => setActiveTab(tab as TabType)}
                                                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap relative ${activeTab === tab
                                                    ? 'border-gold text-gold'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                    }`}
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                            >
                                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                                {activeTab === tab && (
                                                    <motion.div
                                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                                                        layoutId="activeTab"
                                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                    />
                                                )}
                                            </motion.button>
                                        ))}
                                    </nav>
                                </div>
                            </motion.div>

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
                                        <PassengerDetails booking={booking} />
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
                                        <ContactDetails booking={booking} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
} 
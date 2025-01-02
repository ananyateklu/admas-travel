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
        case 'upcoming': return 'bg-blue-50/80 text-blue-700 border border-blue-200/50 shadow-sm shadow-blue-100/20';
        case 'confirmed': return 'bg-emerald-50/80 text-emerald-700 border border-emerald-200/50 shadow-sm shadow-emerald-100/20';
        case 'pending': return 'bg-amber-50/80 text-amber-700 border border-amber-200/50 shadow-sm shadow-amber-100/20';
        case 'completed': return 'bg-purple-50/80 text-purple-700 border border-purple-200/50 shadow-sm shadow-purple-100/20';
        case 'cancelled': return 'bg-rose-50/80 text-rose-700 border border-rose-200/50 shadow-sm shadow-rose-100/20';
        default: return 'bg-gray-50/80 text-gray-700 border border-gray-200/50 shadow-sm shadow-gray-100/20';
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
    onEdit?: (bookingId: string, updates: Partial<BookingData>) => Promise<void>;
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
    currentUserId,
    onEdit
}: BookingCardProps) {
    const [activeTab, setActiveTab] = React.useState<TabType>('details');
    const [copySuccess, setCopySuccess] = React.useState<'reference' | 'contact' | null>(null);
    const [isEditing, setIsEditing] = React.useState(false);

    const handleCopy = async (text: string, type: 'reference' | 'contact') => {
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccess(type);
            setTimeout(() => setCopySuccess(null), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    const canEdit = !isReadOnly && booking.status === 'pending' && currentUserId === booking.userId;
    const canDelete = currentUserId === booking.userId;

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

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
            className="bg-white/95 rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden backdrop-blur-sm backdrop-saturate-150 ring-1 ring-black/[0.02]"
        >
            <div className="px-6 py-5 lg:px-8 lg:py-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    {/* Left Section: Date and Main Info */}
                    <div className="flex items-start gap-5">
                        <motion.div
                            className="flex-shrink-0"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <div className="w-[4.5rem] h-[4.5rem] flex flex-col items-center justify-center bg-gradient-to-br from-gold/10 via-gold/5 to-transparent rounded-2xl border border-gold/20 shadow-sm ring-1 ring-black/[0.02]">
                                <span className="text-sm font-semibold bg-gradient-to-r from-gold to-gold/80 bg-clip-text text-transparent">
                                    {new Date(booking.departureDate).toLocaleDateString(undefined, {
                                        month: 'short'
                                    })}
                                </span>
                                <span className="text-2xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    {new Date(booking.departureDate).getDate()}
                                </span>
                            </div>
                        </motion.div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    {booking.contactName}
                                </h3>
                                <motion.span
                                    className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide ${getStatusStyle(booking.status)}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </motion.span>
                                <motion.div
                                    className="flex items-center gap-2 bg-gradient-to-r from-gold/10 via-gold/5 to-transparent px-3 py-1 rounded-full text-xs font-medium border border-gold/20 shadow-sm ring-1 ring-black/[0.02]"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <svg className="w-3.5 h-3.5 text-gold/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span className="text-gold/90">{booking.passengers.length} {booking.passengers.length === 1 ? 'Passenger' : 'Passengers'}</span>
                                </motion.div>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-gray-600">
                                <motion.div
                                    className="flex items-center gap-2.5 hover:text-gray-900 transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="p-1.5 bg-gradient-to-br from-gold/10 via-gold/5 to-transparent rounded-lg shadow-sm ring-1 ring-black/[0.02]">
                                        <svg className="w-4 h-4 text-gold/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <span className="font-medium tracking-wide">{(booking.from && typeof booking.from === 'object' ? booking.from.city : booking.from) ?? 'Unknown'} → {(booking.to && typeof booking.to === 'object' ? booking.to.city : booking.to) ?? 'Unknown'}</span>
                                </motion.div>
                                <span className="text-gray-300">•</span>
                                <motion.div
                                    className="flex items-center gap-2.5 hover:text-gray-900 transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="p-1.5 bg-gradient-to-br from-gold/10 via-gold/5 to-transparent rounded-lg shadow-sm ring-1 ring-black/[0.02]">
                                        <svg className="w-4 h-4 text-gold/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span className="font-medium tracking-wide">
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
                            <div className="flex items-center gap-6 text-sm">
                                <motion.div
                                    className="flex items-center gap-2.5 text-gray-600 hover:text-gray-900 transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="p-1.5 bg-gradient-to-br from-gold/10 via-gold/5 to-transparent rounded-lg shadow-sm ring-1 ring-black/[0.02]">
                                        <svg className="w-4 h-4 text-gold/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <span className="font-medium tracking-wide capitalize">{booking.class}</span>
                                </motion.div>
                                <span className="text-gray-300">•</span>
                                <motion.div
                                    className="flex items-center gap-2.5 text-gray-600 group cursor-pointer hover:text-gray-900 transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => handleCopy(booking.bookingReference, 'reference')}
                                >
                                    <div className="p-1.5 bg-gradient-to-br from-gold/10 via-gold/5 to-transparent rounded-lg shadow-sm ring-1 ring-black/[0.02]">
                                        <svg className="w-4 h-4 text-gold/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    <span className="font-medium tracking-wide">Ref: {booking.bookingReference}</span>
                                    {copySuccess === 'reference' && (
                                        <motion.span
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="ml-2 text-xs text-emerald-500 font-medium"
                                        >
                                            Copied!
                                        </motion.span>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Status and Actions */}
                    <div className="flex items-center gap-6">
                        <motion.div
                            className="flex flex-col items-end gap-2"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="flex -space-x-3">
                                {booking.passengers.map((passenger, index) => (
                                    <motion.div
                                        key={passenger.passportNumber}
                                        className={`w-10 h-10 rounded-full bg-gradient-to-br from-gold/10 via-gold/5 to-transparent border-2 border-white shadow-sm ring-1 ring-black/[0.02] flex items-center justify-center relative group`}
                                        title={passenger.fullName}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0, zIndex: booking.passengers.length - index }}
                                        whileHover={{ scale: 1.1, zIndex: 20 }}
                                        style={{
                                            transformOrigin: 'center'
                                        }}
                                    >
                                        <span className="text-sm font-semibold bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                            {passenger.fullName.charAt(0)}
                                        </span>
                                        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <div className="absolute inset-0 bg-white/90 rounded-full backdrop-blur-sm" />
                                            <div className="relative h-full flex items-center justify-center px-1">
                                                <span className="text-[10px] font-medium text-gray-700 truncate">
                                                    {passenger.fullName}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            {booking.passengers.length > 1 && (
                                <span className="text-xs font-medium text-gray-500">
                                    {booking.passengers.length} Passengers
                                </span>
                            )}
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
                        <div className="flex items-center gap-2">
                            <motion.button
                                onClick={onToggleExpand}
                                className="inline-flex items-center px-3 py-1.5 text-xs bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isExpanded ? 'Show Less' : 'Show More'}
                            </motion.button>
                        </div>
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
                        className="border-t border-gray-100/50"
                    >
                        <div className="px-6 py-5 lg:px-8 lg:py-6 bg-gradient-to-b from-gray-50/30 to-white">
                            {/* Quick Actions Bar */}
                            <motion.div
                                className="flex items-center justify-between mb-8 bg-white/95 rounded-2xl p-4 shadow-sm border border-gray-100/50 ring-1 ring-black/[0.02]"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <div className="flex items-center gap-6 overflow-x-auto">
                                    <motion.button
                                        onClick={() => handleCopy(booking.bookingReference, 'reference')}
                                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-xl transition-colors group"
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <svg className="w-4 h-4 text-gold/90 group-hover:text-gold/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                        <span className="whitespace-nowrap font-medium tracking-wide">Copy Reference</span>
                                        {copySuccess === 'reference' && (
                                            <motion.span
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="ml-2 text-xs text-emerald-500 font-medium"
                                            >
                                                Copied!
                                            </motion.span>
                                        )}
                                    </motion.button>
                                    <div className="h-8 w-px bg-gray-200/70"></div>
                                    <motion.button
                                        onClick={() => window.print()}
                                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-xl transition-colors group"
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <svg className="w-4 h-4 text-gold/90 group-hover:text-gold/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                        </svg>
                                        <span className="whitespace-nowrap font-medium tracking-wide">Print Details</span>
                                    </motion.button>
                                    <div className="h-8 w-px bg-gray-200/70"></div>
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
                                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-xl transition-colors group"
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <svg className="w-4 h-4 text-gold/90 group-hover:text-gold/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                        </svg>
                                        <span className="whitespace-nowrap font-medium tracking-wide">Share</span>
                                    </motion.button>
                                    {canEdit && (
                                        <motion.button
                                            onClick={handleEditToggle}
                                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-xl transition-colors group"
                                            variants={buttonVariants}
                                            whileHover="hover"
                                            whileTap="tap"
                                        >
                                            <svg className="w-4 h-4 text-gold/90 group-hover:text-gold/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            <span className="whitespace-nowrap font-medium tracking-wide">
                                                {isEditing ? 'Cancel Edit' : 'Edit Booking'}
                                            </span>
                                        </motion.button>
                                    )}
                                </div>
                                <motion.div
                                    className="flex items-center gap-2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <motion.span
                                        className={`px-4 py-2 rounded-xl text-sm font-medium tracking-wide ${getStatusStyle(booking.status)}`}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </motion.span>
                                </motion.div>
                            </motion.div>

                            {/* Tabs Navigation */}
                            <motion.div
                                className="bg-white/95 rounded-2xl shadow-sm mb-8 border border-gray-100/50 ring-1 ring-black/[0.02]"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="border-b border-gray-100/80">
                                    <nav className="flex space-x-10 px-8" aria-label="Booking Information">
                                        {['details', 'passengers', 'contact'].map((tab) => (
                                            <motion.button
                                                key={tab}
                                                onClick={() => setActiveTab(tab as TabType)}
                                                className={`py-4 px-3 border-b-2 font-medium text-sm tracking-wide whitespace-nowrap relative ${activeTab === tab
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
                                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold via-gold/90 to-gold/80"
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
                                            isEditing={isEditing}
                                            onEdit={onEdit}
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
                )}
            </AnimatePresence>
        </motion.div >
    );
} 
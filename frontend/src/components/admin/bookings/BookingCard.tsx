import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingData, TabType, BookingStatus } from '../types';
import { BookingStatusProgress } from './BookingStatusProgress';
import { BookingDetails } from './BookingDetails';
import { PassengerDetails } from './PassengerDetails';
import { ContactDetails } from './ContactDetails';
import { STATUS_OPTIONS } from '../constants';

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
    onRatingSubmit?: (bookingId: string, rating: number, comment: string) => Promise<void>;
    isSubmittingRating?: boolean;
}

const JourneyDetails = ({ booking }: { booking: BookingData }) => {
    return (
        <motion.div
            className="flex items-center gap-3 bg-gray-50/80 rounded-lg p-2 relative overflow-hidden group/journey min-w-[600px] w-full"
            whileHover={{
                backgroundColor: "rgba(249, 250, 251, 0.9)",
                transition: { duration: 0.2 }
            }}
        >
            {/* Departure */}
            <div className="flex-1 min-w-[160px]">
                <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                    <div className="flex items-baseline">
                        <p className="text-lg font-bold text-gray-900 tracking-tight">
                            {booking.departureTime ?
                                new Date(`2000-01-01T${booking.departureTime}`).toLocaleTimeString(undefined, {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                }).split(' ')[0]
                                : '00:00'}
                        </p>
                        <p className="text-xs font-medium text-gray-500 ml-1">
                            {booking.departureTime ?
                                new Date(`2000-01-01T${booking.departureTime}`).toLocaleTimeString(undefined, {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                }).split(' ')[1]
                                : 'AM'}
                        </p>
                    </div>
                    <p className="text-xs font-medium text-gray-500">
                        {new Date(booking.departureDate).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric'
                        })}
                    </p>
                </div>
                <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium text-gray-800 truncate max-w-[150px]">
                        {(booking.from && typeof booking.from === 'object' ? booking.from.city : booking.from) ?? 'Unknown'}
                        {(booking.from && typeof booking.from === 'object' && 'airportCode' in booking.from) && (
                            <span className="text-forest-400 font-medium"> ({booking.from.airportCode})</span>
                        )}
                    </p>
                    <div className="flex items-center gap-1">
                        <p className="text-xs text-gray-500 truncate max-w-[150px]">
                            {(booking.from && typeof booking.from === 'object' ? booking.from.country : '')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Duration and Path */}
            <div className="flex-none flex flex-col items-center relative px-3 min-w-[140px]">
                <div className="absolute top-[30%] left-0 right-0">
                    <div className="w-full h-[2px] bg-gray-200" />
                </div>
                <div className="bg-white rounded-full px-3 py-1 shadow-sm border border-gray-200 z-10 mb-1">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900 whitespace-nowrap">
                            {booking.class}
                        </span>
                        <span className="h-3 w-px bg-gray-200" />
                        <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
                            {booking.returnDate ? 'Round Trip' : 'One Way'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Arrival */}
            <div className="flex-1 min-w-[160px]">
                <div className="flex items-baseline gap-1.5 justify-end whitespace-nowrap">
                    <div className="flex items-baseline">
                        <p className="text-lg font-bold text-gray-900 tracking-tight">
                            {booking.returnTime ?
                                new Date(`2000-01-01T${booking.returnTime}`).toLocaleTimeString(undefined, {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                }).split(' ')[0]
                                : '00:00'}
                        </p>
                        <p className="text-xs font-medium text-gray-500 ml-1">
                            {booking.returnTime ?
                                new Date(`2000-01-01T${booking.returnTime}`).toLocaleTimeString(undefined, {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                }).split(' ')[1]
                                : 'AM'}
                        </p>
                    </div>
                    <p className="text-xs font-medium text-gray-500">
                        {booking.returnDate ? new Date(booking.returnDate).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric'
                        }) : ''}
                    </p>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                    <p className="text-sm font-medium text-gray-800 truncate max-w-[150px]">
                        {(booking.to && typeof booking.to === 'object' ? booking.to.city : booking.to) ?? 'Unknown'}
                        {(booking.to && typeof booking.to === 'object' && 'airportCode' in booking.to) && (
                            <span className="text-forest-400 font-medium"> ({booking.to.airportCode})</span>
                        )}
                    </p>
                    <div className="flex items-center gap-1">
                        <p className="text-xs text-gray-500 truncate max-w-[150px]">
                            {(booking.to && typeof booking.to === 'object' ? booking.to.country : '')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover/journey:opacity-100 transition-opacity duration-300" />
        </motion.div>
    );
};

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
    onEdit,
    onRatingSubmit,
    isSubmittingRating
}: BookingCardProps) {
    const [activeTab, setActiveTab] = React.useState<TabType>('details');
    const [copySuccess, setCopySuccess] = React.useState<'reference' | 'contact' | 'phone' | 'email' | null>(null);
    const [isEditing, setIsEditing] = React.useState(false);

    const handleCopy = async (text: string, type: 'reference' | 'contact' | 'phone' | 'email') => {
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
            className="bg-white/95 rounded-xl shadow-xl border border-gray-100/50 backdrop-blur-sm backdrop-saturate-150 ring-1 ring-black/[0.02]"
        >
            <div className="px-3 py-2 lg:px-4 lg:py-3 overflow-visible">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 overflow-visible">
                    {/* Left Section: Date and Main Info */}
                    <div className="flex items-start gap-3">
                        <motion.div
                            className="flex-shrink-0"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <div className="w-[3.5rem] h-[3.5rem] flex flex-col items-center justify-center bg-gradient-to-br from-gold/10 via-gold/5 to-transparent rounded-xl border border-gold/20 shadow-sm ring-1 ring-black/[0.02]">
                                <span className="text-[10px] font-medium bg-gradient-to-r from-gold to-gold/80 bg-clip-text text-transparent uppercase tracking-wider">
                                    {new Date(booking.departureDate).toLocaleDateString(undefined, {
                                        month: 'short'
                                    })}
                                </span>
                                <span className="text-lg font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    {new Date(booking.departureDate).getDate()}
                                </span>
                            </div>
                        </motion.div>
                        <div className="space-y-2">
                            {/* Contact Name and Status */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/80 shadow-sm">
                                        <span className="text-sm font-semibold bg-gradient-to-br from-gray-700 to-gray-500 bg-clip-text text-transparent">
                                            {booking.contactName.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 mb-0.5">
                                            {booking.contactName}
                                        </h3>
                                        <div className="flex items-center gap-1.5">
                                            <motion.span
                                                className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide ${getStatusStyle(booking.status)}`}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                            </motion.span>
                                            <span className="flex items-center gap-1 text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                                                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                                </svg>
                                                <span>Ref:</span>
                                                <span className="font-semibold">{booking.bookingReference}</span>
                                            </span>
                                            <span className="flex items-center gap-1 text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                                                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>Created:</span>
                                                <span className="font-medium">
                                                    {(typeof booking.createdAt === 'object' && 'toDate' in booking.createdAt
                                                        ? booking.createdAt.toDate()
                                                        : new Date(booking.createdAt)
                                                    ).toLocaleDateString(undefined, {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </span>
                                            {booking.rating && (
                                                <motion.div
                                                    className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-yellow-50/80 text-yellow-700 border border-yellow-200/50 shadow-sm"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <svg className="w-3 h-3" fill="currentColor" stroke="none" viewBox="0 0 24 24">
                                                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                    </svg>
                                                    <span>{booking.rating.score.toFixed(1)}</span>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Journey Details */}
                            <JourneyDetails booking={booking} />

                            {/* Additional Info */}
                            <div className="flex items-center gap-4 text-xs">
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Status and Actions */}
                    <div className="flex items-center gap-6 overflow-visible">
                        <motion.div
                            className="flex flex-col items-end gap-2 overflow-visible"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="flex -space-x-3 overflow-visible">
                                {booking.passengers.map((passenger, index) => (
                                    <motion.div
                                        key={passenger.passportNumber}
                                        className={`w-10 h-10 rounded-full bg-white
                                            border-2 border-forest-300/40 shadow-md ring-2 ring-forest-200/10
                                            flex items-center justify-center relative group/avatar
                                            hover:z-10 hover:shadow-xl hover:border-forest-400/60 hover:ring-forest-300/30
                                            transition-all duration-300 ease-in-out`}
                                        title={passenger.fullName}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{
                                            opacity: 1,
                                            x: 0,
                                            transition: { delay: index * 0.1 }
                                        }}
                                        whileHover={{
                                            scale: 1.35,
                                            transition: { type: "spring", stiffness: 400, damping: 10 }
                                        }}
                                    >
                                        <span className="text-sm font-semibold bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent
                                            group-hover/avatar:from-forest-600 group-hover/avatar:to-forest-500 transition-all duration-300">
                                            {passenger.fullName.split(' ').map(n => n[0]).join('')}
                                        </span>

                                        {/* Hover Card */}
                                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover/avatar:opacity-100 transition-all duration-200 pointer-events-none z-[60]">
                                            <div className="bg-white rounded-lg shadow-2xl p-2 whitespace-nowrap border border-gray-100/50 text-xs backdrop-blur-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="font-medium text-gray-900">{passenger.fullName}</div>
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium 
                                                        ${passenger.type === 'adult'
                                                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                                            : 'bg-green-50 text-green-700 border border-green-100'
                                                        }`}>
                                                        {passenger.type === 'adult' ? 'Adult' : 'Child'}
                                                    </span>
                                                </div>
                                                <div className="text-gray-500 text-[10px] mt-0.5">{passenger.nationality}</div>
                                                <div className="flex items-center gap-2 mt-1 pt-1 border-t border-gray-100">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[10px] text-gray-500">Passport:</span>
                                                        <span className="text-[10px] font-medium text-gray-900">{passenger.passportNumber}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-b border-r border-gray-100 transform rotate-45"></div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            {booking.passengers.length > 1 && (
                                <motion.span
                                    className="text-xs font-medium text-gray-500"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {booking.passengers.length} Passengers
                                </motion.span>
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
                                className="inline-flex items-center px-3 py-1.5 text-xs bg-gradient-to-br from-gray-50 to-gray-100/80 text-gray-600 rounded-lg hover:from-gray-100 hover:to-gray-200/80 border border-gray-200/60 shadow-sm"
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
                        <div className="px-4 py-3 lg:px-6 lg:py-4 bg-gradient-to-b from-gray-50/30 to-white">
                            {/* Quick Actions Bar */}
                            <motion.div
                                className="flex items-center justify-between mb-4 bg-white/95 rounded-xl p-2 shadow-sm border border-gray-100/50 ring-1 ring-black/[0.02]"
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
                                        onClick={() => handleCopy(booking.contactPhone, 'phone')}
                                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-xl transition-colors group"
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <svg className="w-4 h-4 text-gold/90 group-hover:text-gold/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <span className="whitespace-nowrap font-medium tracking-wide">{booking.contactPhone}</span>
                                        {copySuccess === 'phone' && (
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
                                        onClick={() => handleCopy(booking.contactEmail, 'email')}
                                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-xl transition-colors group"
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <svg className="w-4 h-4 text-gold/90 group-hover:text-gold/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span className="whitespace-nowrap font-medium tracking-wide">{booking.contactEmail}</span>
                                        {copySuccess === 'email' && (
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
                                className="bg-white/95 rounded-xl shadow-sm mb-4 border border-gray-100/50 ring-1 ring-black/[0.02]"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="border-b border-gray-100/80">
                                    <nav className="flex space-x-8 px-6" aria-label="Booking Information">
                                        {['details', 'passengers', 'contact'].map((tab) => (
                                            <motion.button
                                                key={tab}
                                                onClick={() => setActiveTab(tab as TabType)}
                                                className={`py-3 px-2 border-b-2 font-medium text-sm tracking-wide whitespace-nowrap relative ${activeTab === tab
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
                )}
            </AnimatePresence>
        </motion.div >
    );
} 
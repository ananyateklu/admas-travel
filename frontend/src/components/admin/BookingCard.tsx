import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingData, TabType, BookingStatus } from './types';
import { getStatusStyle } from './utils';
import { BookingStatusProgress } from './BookingStatusProgress';
import { BookingDetails } from './BookingDetails';
import { PassengerDetails } from './PassengerDetails';
import { ContactDetails } from './ContactDetails';

interface BookingCardProps {
    booking: BookingData;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onStatusChange: (bookingId: string, newStatus: string, userId: string) => Promise<void>;
    updateLoading: string | null;
}

export function BookingCard({
    booking,
    isExpanded,
    onToggleExpand,
    onStatusChange,
    updateLoading
}: BookingCardProps) {
    const [activeTab, setActiveTab] = React.useState<TabType>('details');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
        >
            <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    {/* Left Section: Date and Main Info */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                                <span className="text-sm font-medium text-gold/90">
                                    {new Date(booking.departureDate).toLocaleDateString(undefined, {
                                        month: 'short'
                                    })}
                                </span>
                                <span className="text-xl font-bold text-gray-800">
                                    {new Date(booking.departureDate).getDate()}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-medium text-gray-800">{booking.contactName}</h3>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(booking.status)}`}>
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                                <div className="flex items-center gap-1 ml-2 bg-gold/10 text-gold/90 px-2 py-0.5 rounded-full text-xs font-medium">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>{booking.passengers.length} {booking.passengers.length === 1 ? 'Passenger' : 'Passengers'}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{(booking.from && typeof booking.from === 'object' ? booking.from.city : booking.from) ?? 'Unknown'} → {(booking.to && typeof booking.to === 'object' ? booking.to.city : booking.to) ?? 'Unknown'}</span>
                                </div>
                                <span className="text-gray-400">•</span>
                                <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1 text-gray-500">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span className="capitalize">{booking.class}</span>
                                </div>
                                <span className="text-gray-400">•</span>
                                <div className="flex items-center gap-1 text-gray-500">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <span className="text-gray-600">Ref: {booking.bookingReference}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Status and Actions */}
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end gap-2">
                            <div className="flex -space-x-2">
                                {booking.passengers.slice(0, 3).map((passenger) => (
                                    <div
                                        key={passenger.passportNumber}
                                        className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center"
                                        title={passenger.fullName}
                                    >
                                        <span className="text-xs font-medium text-gray-700">
                                            {passenger.fullName.charAt(0)}
                                        </span>
                                    </div>
                                ))}
                                {booking.passengers.length > 3 && (
                                    <div className="w-8 h-8 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center">
                                        <span className="text-xs font-medium text-gray-600">
                                            +{booking.passengers.length - 3}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="text-xs text-gray-500">
                                {booking.passengers.length} {booking.passengers.length === 1 ? 'Passenger' : 'Passengers'}
                            </div>
                        </div>
                        <BookingStatusProgress
                            currentStatus={booking.status as BookingStatus}
                            bookingId={booking.bookingId}
                            userId={booking.userId}
                            onStatusChange={onStatusChange}
                            isLoading={updateLoading === booking.bookingId}
                        />
                        <button
                            onClick={onToggleExpand}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg
                                className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-gray-100"
                    >
                        <div className="p-4 bg-gray-50">
                            {/* Quick Actions Bar */}
                            <div className="flex items-center justify-between mb-4 bg-white rounded-lg p-2 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => navigator.clipboard.writeText(booking.bookingReference)}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                                        title="Copy booking reference"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                        Copy Reference
                                    </button>
                                    <div className="h-4 w-px bg-gray-200"></div>
                                    <button
                                        onClick={() => window.print()}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                                        title="Print booking details"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                        </svg>
                                        Print Details
                                    </button>
                                    <div className="h-4 w-px bg-gray-200"></div>
                                    <button
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
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                                        title="Share booking"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                        </svg>
                                        Share
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(booking.status)}`}>
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </span>
                                </div>
                            </div>

                            {/* Tabs Navigation */}
                            <div className="bg-white rounded-lg shadow-sm mb-4">
                                <div className="border-b border-gray-200">
                                    <nav className="flex space-x-8 px-4" aria-label="Booking Information">
                                        <button
                                            onClick={() => setActiveTab('details')}
                                            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'details'
                                                ? 'border-gold text-gold'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            Trip Details
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('passengers')}
                                            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'passengers'
                                                ? 'border-gold text-gold'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            Passengers
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('contact')}
                                            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'contact'
                                                ? 'border-gold text-gold'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            Contact Info
                                        </button>
                                    </nav>
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {activeTab === 'details' && (
                                    <motion.div
                                        key="details"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <BookingDetails booking={booking} />
                                    </motion.div>
                                )}

                                {activeTab === 'passengers' && (
                                    <motion.div
                                        key="passengers"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.2 }}
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
                                        transition={{ duration: 0.2 }}
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
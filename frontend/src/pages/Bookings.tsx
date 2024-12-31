import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../lib/firebase/useAuth';
import { collection, query, orderBy, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import mountainTwo from '../assets/mountain-two.jpg';

interface BookingData {
    bookingId: string;
    bookingReference: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    status: string;
    totalPassengers: number;
    createdAt: string | {
        toDate: () => Date;
    };
    from: string;
    to: string;
    tripType: string;
    class: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    passengers: Array<{
        type: string;
        fullName: string;
        dateOfBirth: string;
        passportNumber: string;
        passportExpiry: string;
        nationality: string;
    }>;
}

type BookingStatus = 'upcoming' | 'pending' | 'recurring' | 'past' | 'cancelled';

export default function Bookings() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<BookingData[]>([]);
    const [activeTab, setActiveTab] = useState<BookingStatus>('upcoming');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setError('Please sign in to view your bookings');
            setIsLoading(false);
            return;
        }

        console.log('Setting up real-time listener for user:', user.uid);

        const bookingsRef = collection(db, `users/${user.uid}/bookings`);
        const q = query(bookingsRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const bookingsData = snapshot.docs.map(doc => {
                    const data = doc.data();
                    console.log('Received booking update:', doc.id, data.status);
                    const createdAtDate = typeof data.createdAt === 'string'
                        ? new Date(data.createdAt)
                        : data.createdAt?.toDate?.() || new Date();

                    return {
                        ...data,
                        bookingId: doc.id,
                        createdAt: createdAtDate,
                        departureDate: data.departureDate || '',
                        returnDate: data.returnDate || '',
                        passengers: data.passengers || [],
                        status: data.status || 'pending'
                    } as BookingData;
                });

                console.log('Updated bookings:', bookingsData);
                setBookings(bookingsData);
                setIsLoading(false);
            },
            (err) => {
                console.error('Error fetching bookings:', err);
                setError('Failed to load bookings. Please try again later.');
                setIsLoading(false);
            }
        );

        // Cleanup subscription on unmount
        return () => {
            console.log('Cleaning up listener');
            unsubscribe();
        };
    }, [user]);

    const handleDelete = async (bookingId: string) => {
        if (!user || !window.confirm('Are you sure you want to delete this booking?')) {
            return;
        }

        try {
            setIsDeleting(bookingId);
            setError(null);

            // Delete from user's bookings subcollection
            await deleteDoc(doc(db, `users/${user.uid}/bookings`, bookingId));

            // Also delete from root bookings collection
            await deleteDoc(doc(db, 'bookings', bookingId));

            // Update local state
            setBookings(prev => prev.filter(b => b.bookingId !== bookingId));
        } catch (err) {
            console.error('Error deleting booking:', err);
            setError('Failed to delete booking. Please try again.');
            // Don't update the local state if deletion failed
            return;
        } finally {
            setIsDeleting(null);
        }
    };

    const filteredBookings = useMemo(() => {
        const now = new Date();
        switch (activeTab) {
            case 'upcoming':
                return bookings.filter(b => new Date(b.departureDate) > now && b.status !== 'cancelled');
            case 'pending':
                return bookings.filter(b => b.status === 'pending');
            case 'recurring':
                return bookings.filter(b => b.tripType === 'recurring');
            case 'past':
                return bookings.filter(b => new Date(b.departureDate) < now && b.status !== 'cancelled');
            case 'cancelled':
                return bookings.filter(b => b.status === 'cancelled');
            default:
                return bookings;
        }
    }, [bookings, activeTab]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-96px)] mt-[112px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[calc(100vh-96px)] mt-[112px]">
                <div className="max-w-[90%] mx-auto px-6">
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-6">
                        {error}
                    </div>
                    <Link to="/" className="text-gold hover:text-gold/80 transition-colors">
                        ← Return to Home
                    </Link>
                </div>
            </div>
        );
    }

    const toggleBookingDetails = (bookingId: string) => {
        setExpandedBookingId(expandedBookingId === bookingId ? null : bookingId);
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section - now extends to the top */}
            <div className="relative h-[45vh] bg-gray-900">
                <div className="absolute inset-0">
                    <img
                        src={mountainTwo}
                        alt="Mountain Landscape"
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="relative h-full flex items-center justify-center text-center pt-[112px]">
                    <div className="max-w-4xl mx-auto px-4">
                        <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Your Travel Journey</h1>
                        <p className="text-xl text-white/90">Track and manage your upcoming adventures</p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50">
                <div className="max-w-[90%] mx-auto px-6 -mt-20 pb-8 relative z-10">
                    {/* Tabs with white background - updated shadow and padding */}
                    <div className="bg-white rounded-xl shadow-md mb-6">
                        <nav className="flex space-x-12 px-8" aria-label="Booking status">
                            {(['upcoming', 'pending', 'recurring', 'past', 'cancelled'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`
                                        py-5 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                                        ${activeTab === tab
                                            ? 'border-gold text-gold'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }
                                    `}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Bookings List */}
                    <div className="space-y-4">
                        {filteredBookings.map((booking) => (
                            <div
                                key={booking.bookingId}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between gap-4">
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
                                                    <h3 className="text-lg font-medium text-gray-800">
                                                        {booking.destination}
                                                    </h3>
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
                                                        <span>{booking.from} → {booking.to}</span>
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

                                        {/* Right Section: Passengers and Actions */}
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
                                            <button
                                                onClick={() => toggleBookingDetails(booking.bookingId)}
                                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {expandedBookingId === booking.bookingId && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="border-t border-gray-100"
                                        >
                                            <div className="p-6 bg-gray-50">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                    <div className="bg-white rounded-lg p-6 shadow-sm">
                                                        <h4 className="font-medium text-gray-900 mb-3">Trip Details</h4>
                                                        <div className="space-y-2 text-sm text-gray-600">
                                                            <p><span className="font-medium">Reference:</span> {booking.bookingReference}</p>
                                                            <p><span className="font-medium">Trip Type:</span> {booking.tripType}</p>
                                                            <p><span className="font-medium">Class:</span> {booking.class}</p>
                                                            <p><span className="font-medium">Status:</span> {booking.status}</p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-white rounded-lg p-6 shadow-sm">
                                                        <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                                                        <div className="space-y-2 text-sm text-gray-600">
                                                            <p><span className="font-medium">Name:</span> {booking.contactName}</p>
                                                            <p><span className="font-medium">Email:</span> {booking.contactEmail}</p>
                                                            <p><span className="font-medium">Phone:</span> {booking.contactPhone}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Passenger List Section */}
                                                <div className="border-t border-gray-200 pt-6">
                                                    <h4 className="font-medium text-gray-900 mb-4">Passengers ({booking.passengers.length})</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {booking.passengers.map((passenger) => (
                                                            <div
                                                                key={passenger.passportNumber}
                                                                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300"
                                                            >
                                                                <div className="flex items-center gap-3 mb-3">
                                                                    <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                                                                        <span className="text-sm font-medium text-gold">
                                                                            {passenger.fullName.split(' ').map(n => n[0]).join('')}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium text-gray-900">{passenger.fullName}</p>
                                                                        <p className="text-sm text-gray-500 capitalize">{passenger.type} Passenger</p>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2 text-sm text-gray-600">
                                                                    <p><span className="font-medium">Nationality:</span> {passenger.nationality}</p>
                                                                    <p><span className="font-medium">Passport:</span> {passenger.passportNumber}</p>
                                                                    <p><span className="font-medium">Passport Expiry:</span> {' '}
                                                                        {new Date(passenger.passportExpiry).toLocaleDateString(undefined, {
                                                                            year: 'numeric',
                                                                            month: 'long',
                                                                            day: 'numeric'
                                                                        })}
                                                                    </p>
                                                                    <p><span className="font-medium">Date of Birth:</span> {' '}
                                                                        {new Date(passenger.dateOfBirth).toLocaleDateString(undefined, {
                                                                            year: 'numeric',
                                                                            month: 'long',
                                                                            day: 'numeric'
                                                                        })}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="mt-6 flex justify-end border-t border-gray-200 pt-6">
                                                    <motion.button
                                                        className="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm transition-all duration-300 shadow-sm"
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => handleDelete(booking.bookingId)}
                                                        disabled={isDeleting === booking.bookingId}
                                                    >
                                                        {isDeleting === booking.bookingId ? (
                                                            'Deleting...'
                                                        ) : (
                                                            <>
                                                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                                Delete Booking
                                                            </>
                                                        )}
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}

                        {filteredBookings.length === 0 && (
                            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                                <p className="text-gray-600">There are no {activeTab} bookings to display.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 
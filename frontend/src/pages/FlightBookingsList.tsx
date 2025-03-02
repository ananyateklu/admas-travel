import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../lib/firebase/useAuth';
import { collection, query, orderBy, deleteDoc, doc, onSnapshot, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase/firebase';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import mountainTwo from '../assets/mountain-two.jpg';
import { BookingCard } from '../components/admin';
import { toast } from 'react-hot-toast';
import { NotificationToggle } from '../components/notifications/NotificationToggle';
import { BookingData, FlightBookingData } from '../components/admin/types';

type BookingStatus = 'upcoming' | 'pending' | 'confirmed' | 'completed' | 'cancelled';

interface StatusOption {
    value: BookingStatus;
    label: string;
    icon: React.ReactNode;
    colors: {
        active: string;
        completed: string;
        connector: string;
    };
}

// Add status mapping helper
const mapStatusFromDb = (dbStatus: string): BookingStatus => {
    // If the booking is cancelled, always show as cancelled
    if (dbStatus === 'cancelled') {
        return 'cancelled';
    }

    // Return the original status without date-based modifications
    return dbStatus as BookingStatus;
};

const STATUS_OPTIONS: StatusOption[] = [
    {
        value: 'upcoming',
        label: 'Upcoming',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        colors: {
            active: 'border-blue-500 bg-blue-500 text-white',
            completed: 'border-blue-500 bg-blue-50 text-blue-600',
            connector: 'blue-500'
        }
    },
    {
        value: 'pending',
        label: 'Pending',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        colors: {
            active: 'border-amber-500 bg-amber-500 text-white',
            completed: 'border-amber-500 bg-amber-50 text-amber-600',
            connector: 'amber-500'
        }
    },
    {
        value: 'confirmed',
        label: 'Confirmed',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        colors: {
            active: 'border-emerald-500 bg-emerald-500 text-white',
            completed: 'border-emerald-500 bg-emerald-50 text-emerald-600',
            connector: 'emerald-500'
        }
    },
    {
        value: 'completed',
        label: 'Completed',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
        colors: {
            active: 'border-purple-500 bg-purple-500 text-white',
            completed: 'border-purple-500 bg-purple-50 text-purple-600',
            connector: 'purple-500'
        }
    },
    {
        value: 'cancelled',
        label: 'Cancelled',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        colors: {
            active: 'border-rose-500 bg-rose-500 text-white',
            completed: 'border-rose-500 bg-rose-50 text-rose-600',
            connector: 'rose-500'
        }
    }
];

// Helper to parse Firestore date fields
const parseFirestoreDate = (date: any): Date | null => {
    if (!date) return null;

    try {
        // If it's already a Date object
        if (date instanceof Date) return date;

        // If it's a Firestore timestamp with toDate method
        if (date.toDate && typeof date.toDate === 'function') {
            return date.toDate();
        }

        // If it's an ISO string or other date string
        const parsedDate = new Date(date);
        return isNaN(parsedDate.getTime()) ? null : parsedDate;
    } catch (error) {
        console.error('Error parsing date:', error);
        return null;
    }
};

export function Bookings() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<BookingData[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<BookingStatus>('upcoming');
    const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isSubmittingRating, setIsSubmittingRating] = useState<string | null>(null);
    const [updateLoading, setUpdateLoading] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        setIsLoading(true);
        setError(null);

        // First, try to get bookings from the root 'bookings' collection
        const bookingsRef = collection(db, 'bookings');
        const q = query(
            bookingsRef,
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                // Consider a booking as a flight booking if it has flight-specific fields
                // even if the type field is not explicitly set to 'flight'
                const bookingsData = snapshot.docs.map(doc => {
                    const data = doc.data();

                    // Consider a booking as a flight booking if it has flight-specific fields
                    const isFlightBooking = data.type === 'flight' ||
                        (data.departureDate && data.from && data.to);

                    if (!isFlightBooking) {
                        return null;
                    }

                    // Skip if belongs to a different user
                    if (data.userId && data.userId !== user.uid) {
                        return null;
                    }

                    // Force status to be one of the allowed values
                    let processedStatus = data.status ? String(data.status).toLowerCase() : 'pending';
                    if (!['upcoming', 'pending', 'confirmed', 'completed', 'cancelled'].includes(processedStatus)) {
                        processedStatus = 'pending';
                    }

                    const mappedStatus = mapStatusFromDb(processedStatus);
                    const createdAtDate = parseFirestoreDate(data.createdAt) || new Date();
                    const departureDateObj = parseFirestoreDate(data.departureDate);

                    return {
                        ...data,
                        bookingId: doc.id,
                        createdAt: createdAtDate.toISOString(),
                        type: 'flight',
                        departureDate: departureDateObj ? departureDateObj.toISOString() : data.departureDate || '',
                        returnDate: data.returnDate || '',
                        passengers: data.passengers || [],
                        from: data.from || null,
                        to: data.to || null,
                        tripType: data.tripType || 'oneway',
                        class: data.class || 'economy',
                        status: mappedStatus,
                        userId: data.userId || user.uid,
                        bookingReference: data.bookingReference || `REF${Math.floor(Math.random() * 100000)}`,
                        destination: data.to?.name || data.destination || 'Unknown Destination',
                        totalPassengers: data.totalPassengers || (data.passengers?.length || 1),
                        contactName: data.contactName || user.displayName || 'Guest',
                        contactEmail: data.contactEmail || user.email || '',
                        contactPhone: data.contactPhone || ''
                    } as FlightBookingData;
                }).filter((booking): booking is FlightBookingData => booking !== null);

                // If we found bookings in the main collection, use those
                if (bookingsData.length > 0) {
                    setBookings(bookingsData);
                    setIsLoading(false);
                    return;
                }

                // If no bookings found in main collection, try the user's subcollection
                const userBookingsRef = collection(db, `users/${user.uid}/bookings`);
                const userBookingsQuery = query(userBookingsRef, orderBy('createdAt', 'desc'));

                // We don't need to unsubscribe this because it's inside the callback of the main subscription
                onSnapshot(userBookingsQuery,
                    (userSnapshot) => {
                        const userBookingsData = userSnapshot.docs.map(doc => {
                            const data = doc.data();

                            // Consider a booking as a flight booking if it has flight-specific fields
                            const isFlightBooking = data.type === 'flight' ||
                                (data.departureDate && data.from && data.to);

                            if (!isFlightBooking) {
                                return null;
                            }

                            // Force status to be one of the allowed values
                            let processedStatus = data.status ? String(data.status).toLowerCase() : 'pending';
                            if (!['upcoming', 'pending', 'confirmed', 'completed', 'cancelled'].includes(processedStatus)) {
                                processedStatus = 'pending';
                            }

                            const mappedStatus = mapStatusFromDb(processedStatus);
                            const createdAtDate = parseFirestoreDate(data.createdAt) || new Date();
                            const departureDateObj = parseFirestoreDate(data.departureDate);

                            return {
                                ...data,
                                bookingId: doc.id,
                                createdAt: createdAtDate.toISOString(),
                                type: 'flight',
                                departureDate: departureDateObj ? departureDateObj.toISOString() : data.departureDate || '',
                                returnDate: data.returnDate || '',
                                passengers: data.passengers || [],
                                from: data.from || null,
                                to: data.to || null,
                                tripType: data.tripType || 'oneway',
                                class: data.class || 'economy',
                                status: mappedStatus,
                                userId: data.userId || user.uid,
                                bookingReference: data.bookingReference || `REF${Math.floor(Math.random() * 100000)}`,
                                destination: data.to?.name || data.destination || 'Unknown Destination',
                                totalPassengers: data.totalPassengers || (data.passengers?.length || 1),
                                contactName: data.contactName || user.displayName || 'Guest',
                                contactEmail: data.contactEmail || user.email || '',
                                contactPhone: data.contactPhone || ''
                            } as FlightBookingData;
                        }).filter((booking): booking is FlightBookingData => booking !== null);

                        setBookings(userBookingsData);
                        setIsLoading(false);
                    },
                    (error) => {
                        console.error('Error fetching user bookings:', error);
                        setIsLoading(false);
                    }
                );
            },
            (error) => {
                console.error('Error fetching bookings:', error);
                setError('Failed to load bookings. Please try refreshing the page.');
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
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

    const handleEdit = async (bookingId: string, updates: Partial<FlightBookingData>) => {
        if (!user) {
            toast.error('Please sign in to edit your booking');
            return;
        }

        try {
            // Ensure type is flight and dates are strings
            const processedUpdates = {
                ...updates,
                type: 'flight' as const
            };

            // Update in both collections
            const bookingRef = doc(db, 'bookings', bookingId);
            const userBookingRef = doc(db, `users/${user.uid}/bookings`, bookingId);

            await Promise.all([
                setDoc(bookingRef, processedUpdates, { merge: true }),
                setDoc(userBookingRef, processedUpdates, { merge: true })
            ]);

            toast.success('Booking updated successfully!');
        } catch (err) {
            console.error('Error updating booking:', err);
            toast.error('Failed to update booking. Please try again.');
        }
    };

    const handleRatingSubmit = async (bookingId: string, rating: number, comment: string) => {
        if (!user) return;

        setIsSubmittingRating(bookingId);
        try {
            const bookingRef = doc(db, 'bookings', bookingId);
            const userBookingRef = doc(db, 'users', user.uid, 'bookings', bookingId);

            const ratingData = {
                rating: {
                    score: rating,
                    comment: comment,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                }
            };

            // Update both the main booking and user's booking copy
            await Promise.all([
                updateDoc(bookingRef, ratingData),
                updateDoc(userBookingRef, ratingData)
            ]);

            toast.success('Rating submitted successfully!');
        } catch (error) {
            console.error('Error submitting rating:', error);
            toast.error('Failed to submit rating. Please try again.');
        } finally {
            setIsSubmittingRating(null);
        }
    };

    const handleStatusChange = async (bookingId: string, newStatus: string, userId: string, previousStatus?: string) => {
        if (!user) return;

        setUpdateLoading(bookingId);
        try {
            const updateData = {
                status: newStatus,
                previousStatus: previousStatus ?? undefined
            };

            // Update both the main booking and user's booking copy
            await Promise.all([
                updateDoc(doc(db, 'bookings', bookingId), updateData),
                updateDoc(doc(db, 'users', userId, 'bookings', bookingId), updateData)
            ]);

            // Update local state
            setBookings(prevBookings =>
                prevBookings.map(booking =>
                    booking.bookingId === bookingId
                        ? { ...booking, ...updateData }
                        : booking
                )
            );

            toast.success(`Booking status updated to ${newStatus}`);
        } catch (err) {
            console.error('Error updating booking status:', err);
            toast.error('Failed to update booking status');
        } finally {
            setUpdateLoading(null);
        }
    };

    // Filter bookings based on selected status
    const filteredBookings = useMemo(() => {
        const now = new Date();

        return bookings.filter((booking) => {
            // First, ensure we're only working with flight bookings
            if (booking.type !== 'flight') {
                return false;
            }

            let bookingDate: Date | null = null;

            // Handle different date formats and missing dates
            if ('departureDate' in booking && booking.departureDate) {
                try {
                    bookingDate = new Date(booking.departureDate);

                    // Check if date is invalid
                    if (isNaN(bookingDate.getTime())) {
                        bookingDate = null;
                    }
                } catch (error) {
                    bookingDate = null;
                }
            }

            // Normalize status to string for comparison
            const dbStatus = String(booking.status).toLowerCase();

            // Match based on status
            switch (selectedStatus) {
                case 'upcoming':
                    // Show bookings with future departure dates that are either confirmed or pending
                    return bookingDate !== null &&
                        bookingDate > now &&
                        (dbStatus === 'confirmed' || dbStatus === 'pending');
                case 'completed':
                    return dbStatus === 'completed';
                case 'confirmed':
                    return dbStatus === 'confirmed';
                case 'pending':
                    return dbStatus === 'pending';
                case 'cancelled':
                    return dbStatus === 'cancelled';
                default:
                    return true;
            }
        });
    }, [bookings, selectedStatus]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
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
            <div className="w-full">
                {/* Hero Section */}
                <motion.div
                    className="bg-white/95 backdrop-blur-sm backdrop-saturate-150 mb-4 sm:mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="relative h-[40vh] bg-gray-900">
                        <div className="absolute inset-0">
                            <img
                                src={mountainTwo}
                                alt="Mountain Landscape"
                                className="w-full h-full object-cover object-center"
                            />
                            <div className="absolute inset-0 bg-black/50" />
                        </div>
                        <div className="relative h-full flex items-center justify-center text-center pt-16">
                            <div className="max-w-4xl mx-auto px-4">
                                <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Your Travel Bookings</h1>
                                <p className="text-xl text-white/90">Track and manage all your travel reservations</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Status Filter */}
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                    <motion.div
                        className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg shadow-black/5 mb-8 overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex justify-between items-center px-4 md:px-6">
                            <div className="w-full overflow-x-auto no-scrollbar py-2">
                                <nav className="flex space-x-4 md:space-x-8 min-w-max" aria-label="Booking status">
                                    {STATUS_OPTIONS.map((status) => (
                                        <motion.button
                                            key={status.value}
                                            onClick={() => setSelectedStatus(status.value)}
                                            className={`
                                                py-3 px-2 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-1.5 md:gap-2
                                                ${selectedStatus === status.value
                                                    ? 'border-gold text-gold'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }
                                            `}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="w-4 h-4 md:w-5 md:h-5">
                                                {status.icon}
                                            </div>
                                            <span className="text-xs md:text-sm">{status.label}</span>
                                        </motion.button>
                                    ))}
                                </nav>
                            </div>
                            <NotificationToggle className="py-2 ml-4 flex-shrink-0" />
                        </div>
                    </motion.div>
                </div>

                {/* Bookings List */}
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                    <motion.div
                        className="grid grid-cols-1 gap-4 sm:gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="grid grid-cols-1 gap-6 md:gap-8"
                                >
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="bg-white rounded-xl shadow-sm p-8 animate-pulse">
                                            <div className="flex items-start justify-between gap-6">
                                                <div className="flex items-start gap-6">
                                                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                                                    <div className="space-y-4">
                                                        <div className="h-6 w-32 bg-gray-200 rounded"></div>
                                                        <div className="h-4 w-48 bg-gray-200 rounded"></div>
                                                        <div className="h-4 w-40 bg-gray-200 rounded"></div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="w-24 h-8 bg-gray-200 rounded-full"></div>
                                                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="content"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="grid grid-cols-1 gap-6 md:gap-8"
                                >
                                    {filteredBookings.map((booking) => {
                                        // Since we filtered for flight bookings only in useEffect
                                        const flightBooking = booking as FlightBookingData;
                                        return (
                                            <BookingCard
                                                key={flightBooking.bookingId}
                                                booking={flightBooking}
                                                isExpanded={expandedBookingId === flightBooking.bookingId}
                                                onToggleExpand={() => toggleBookingDetails(flightBooking.bookingId)}
                                                onStatusChange={handleStatusChange}
                                                updateLoading={updateLoading}
                                                onDelete={handleDelete}
                                                isDeleting={isDeleting === flightBooking.bookingId}
                                                currentUserId={user?.uid}
                                                onEdit={(id, updates) => handleEdit(id, updates as Partial<FlightBookingData>)}
                                                onRatingSubmit={handleRatingSubmit}
                                                isSubmittingRating={isSubmittingRating === flightBooking.bookingId}
                                            />
                                        );
                                    })}

                                    {filteredBookings.length === 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white rounded-xl shadow-sm p-12 text-center"
                                        >
                                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No {selectedStatus} flight bookings found</h3>
                                            <p className="text-gray-600">
                                                {selectedStatus === 'upcoming' && "You don't have any upcoming flight bookings scheduled."}
                                                {selectedStatus === 'pending' && "You don't have any flight bookings waiting for confirmation."}
                                                {selectedStatus === 'confirmed' && "You don't have any confirmed flight bookings at the moment."}
                                                {selectedStatus === 'completed' && "You haven't completed any flight bookings yet."}
                                                {selectedStatus === 'cancelled' && "You don't have any cancelled flight bookings."}
                                            </p>
                                            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                                                <Link
                                                    to="/flight-booking"
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gold hover:bg-gold/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold"
                                                >
                                                    Book a Flight
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
} 
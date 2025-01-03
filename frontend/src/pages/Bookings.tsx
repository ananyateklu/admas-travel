import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../lib/firebase/useAuth';
import { collection, query, orderBy, deleteDoc, doc, onSnapshot, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase/firebase';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import mountainTwo from '../assets/mountain-two.jpg';
import { Airport } from '../services/flightService';
import { BookingCard } from '../components/admin';
import { toast } from 'react-hot-toast';
import { NotificationToggle } from '../components/notifications/NotificationToggle';

interface BookingData {
    bookingId: string;
    userId: string;
    bookingReference: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    status: string;
    previousStatus?: string;
    totalPassengers: number;
    createdAt: string | {
        toDate: () => Date;
    };
    from: Airport | null;
    to: Airport | null;
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

export function Bookings() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<BookingData[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<BookingStatus>('upcoming');
    const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isSubmittingRating, setIsSubmittingRating] = useState<string | null>(null);

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
                        status: mapStatusFromDb(data.status || 'pending')
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

    const handleEdit = async (bookingId: string, updates: Partial<BookingData>) => {
        if (!user) {
            toast.error('Please sign in to edit your booking');
            return;
        }

        try {
            // Update in both collections
            const bookingRef = doc(db, 'bookings', bookingId);
            const userBookingRef = doc(db, `users/${user.uid}/bookings`, bookingId);

            await Promise.all([
                setDoc(bookingRef, updates, { merge: true }),
                setDoc(userBookingRef, updates, { merge: true })
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

    // Filter bookings based on selected status
    const filteredBookings = useMemo(() => {
        const now = new Date();

        return bookings.filter((booking) => {
            const bookingDate = new Date(booking.departureDate);
            const dbStatus = booking.status;

            switch (selectedStatus) {
                case 'upcoming':
                    // Show all future bookings regardless of status
                    return bookingDate > now;
                case 'completed':
                    // Show bookings with status 'completed'
                    return dbStatus === 'completed';
                case 'confirmed':
                    // Show bookings with status 'confirmed'
                    return dbStatus === 'confirmed';
                case 'pending':
                    // Show pending bookings
                    return dbStatus === 'pending';
                case 'cancelled':
                    // Show cancelled bookings
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
            {/* Hero Section */}
            <motion.div
                className="relative h-[40vh] bg-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
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
                        <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Your Travel Journey</h1>
                        <p className="text-xl text-white/90">Track and manage your upcoming adventures</p>
                    </div>
                </div>
            </motion.div>

            <div className="bg-gray-50">
                <div className="max-w-[90%] mx-auto px-6 -mt-20 pb-8 relative z-10">
                    {/* Status Filter */}
                    <motion.div
                        className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg shadow-black/5 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex justify-between items-center px-8">
                            <nav className="flex space-x-12" aria-label="Booking status">
                                {STATUS_OPTIONS.map((status) => (
                                    <motion.button
                                        key={status.value}
                                        onClick={() => setSelectedStatus(status.value)}
                                        className={`
                                            py-5 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2
                                            ${selectedStatus === status.value
                                                ? 'border-gold text-gold'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }
                                        `}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {status.icon}
                                        {status.label}
                                    </motion.button>
                                ))}
                            </nav>
                            <NotificationToggle className="py-2" />
                        </div>
                    </motion.div>

                    {/* Bookings List */}
                    <motion.div
                        className="grid grid-cols-1 gap-6 md:gap-8"
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
                                    {filteredBookings.map((booking) => (
                                        <BookingCard
                                            key={booking.bookingId}
                                            booking={booking}
                                            isExpanded={expandedBookingId === booking.bookingId}
                                            onToggleExpand={() => toggleBookingDetails(booking.bookingId)}
                                            onDelete={handleDelete}
                                            isDeleting={isDeleting === booking.bookingId}
                                            currentUserId={user?.uid}
                                            onEdit={handleEdit}
                                            onRatingSubmit={handleRatingSubmit}
                                            isSubmittingRating={isSubmittingRating === booking.bookingId}
                                        />
                                    ))}

                                    {filteredBookings.length === 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white rounded-xl shadow-sm p-12 text-center"
                                        >
                                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                                            <p className="text-gray-600">There are no {selectedStatus} bookings to display.</p>
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
import { useState, useEffect } from 'react';
import { useAuth } from '../lib/firebase/AuthContext';
import { collection, query, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';

interface BookingData {
    bookingId: string;
    bookingReference: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    status: string;
    totalPassengers: number;
    createdAt: {
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

const getStatusStyle = (status: string) => {
    switch (status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'confirmed':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export default function Bookings() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<BookingData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user) {
                setError('Please sign in to view your bookings');
                setIsLoading(false);
                return;
            }

            try {
                const bookingsRef = collection(db, `users/${user.uid}/bookings`);
                const q = query(bookingsRef, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);

                const bookingsPromises = querySnapshot.docs.map(async doc => {
                    const data = doc.data();
                    return {
                        ...data,
                        bookingId: doc.id,
                        createdAt: data.createdAt?.toDate() || new Date(),
                        departureDate: data.departureDate || '',
                        returnDate: data.returnDate || '',
                        passengers: data.passengers || []
                    } as BookingData;
                });

                const bookingsData = await Promise.all(bookingsPromises);
                setBookings(bookingsData);
            } catch (err) {
                console.error('Error fetching bookings:', err);
                setError('Failed to load bookings. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
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
                <div className="max-w-4xl mx-auto px-4">
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
        <div className="min-h-[calc(100vh-96px)] mt-[112px] bg-gray-50">
            {/* Hero Section */}
            <div className="bg-white border-b">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-serif text-gray-900 mb-4">Your Travel Journey</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Track your adventures and manage your upcoming trips all in one place
                        </p>
                    </div>
                </div>
            </div>

            {/* Bookings Section */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gold/10 rounded-lg">
                                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Bookings</p>
                                <p className="text-2xl font-semibold text-gray-900">{bookings.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-50 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Upcoming Trips</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {bookings.filter(b => new Date(b.departureDate) > new Date()).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Completed Trips</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {bookings.filter(b => new Date(b.departureDate) < new Date()).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {bookings.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-serif text-gray-900 mb-4">Start Your Journey</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Your travel adventures await! Book your first trip and let us help you create unforgettable memories.
                        </p>
                        <Link
                            to="/book"
                            className="inline-flex items-center px-6 py-3 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Book Your First Trip
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <div
                                key={booking.bookingId}
                                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div
                                    className="p-6 cursor-pointer"
                                    onClick={() => toggleBookingDetails(booking.bookingId)}
                                >
                                    <div className="flex flex-wrap justify-between items-start gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-semibold text-gray-900">{booking.destination}</h3>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(booking.status)}`}>
                                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mb-2">
                                                <span className="font-medium">Reference:</span> {booking.bookingReference}
                                            </p>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>
                                                    {new Date(booking.departureDate).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                    {booking.returnDate && (
                                                        <>
                                                            <span className="mx-2">→</span>
                                                            {new Date(booking.returnDate).toLocaleDateString(undefined, {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </>
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600 mb-1">Passengers</p>
                                                <p className="font-semibold text-gray-900">
                                                    {booking.totalPassengers} {booking.totalPassengers === 1 ? 'Person' : 'People'}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    className="inline-flex items-center px-4 py-2 bg-gold/10 text-gold rounded-lg hover:bg-gold/20 transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleBookingDetails(booking.bookingId);
                                                    }}
                                                >
                                                    {expandedBookingId === booking.bookingId ? (
                                                        <>
                                                            Hide Details
                                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </>
                                                    ) : (
                                                        <>
                                                            View Details
                                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    className="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(booking.bookingId);
                                                    }}
                                                    disabled={isDeleting === booking.bookingId}
                                                >
                                                    {isDeleting === booking.bookingId ? (
                                                        'Deleting...'
                                                    ) : (
                                                        <>
                                                            Delete
                                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Details Section */}
                                {expandedBookingId === booking.bookingId && (
                                    <div className="border-t border-gray-100 p-6 bg-gray-50">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Trip Details */}
                                            <div>
                                                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                    <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Trip Details
                                                </h4>
                                                <div className="space-y-3">
                                                    <p><span className="font-medium">Trip Type:</span> {booking.tripType}</p>
                                                    <p><span className="font-medium">From:</span> {booking.from}</p>
                                                    <p><span className="font-medium">To:</span> {booking.to}</p>
                                                    <p><span className="font-medium">Class:</span> {booking.class}</p>
                                                </div>
                                            </div>

                                            {/* Contact Information */}
                                            <div>
                                                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                    <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    Contact Information
                                                </h4>
                                                <div className="space-y-3">
                                                    <p><span className="font-medium">Name:</span> {booking.contactName}</p>
                                                    <p><span className="font-medium">Email:</span> {booking.contactEmail}</p>
                                                    <p><span className="font-medium">Phone:</span> {booking.contactPhone}</p>
                                                </div>
                                            </div>

                                            {/* Passenger Information */}
                                            <div className="md:col-span-2">
                                                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                    <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    Passengers
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {booking.passengers?.map((passenger, index) => (
                                                        <div key={passenger.passportNumber} className="bg-white p-4 rounded-lg">
                                                            <p className="font-medium text-gray-900 mb-2">
                                                                {passenger.type.charAt(0).toUpperCase() + passenger.type.slice(1)} {index + 1}
                                                            </p>
                                                            <div className="space-y-2 text-sm">
                                                                <p><span className="font-medium">Name:</span> {passenger.fullName}</p>
                                                                <p><span className="font-medium">Nationality:</span> {passenger.nationality}</p>
                                                                <p><span className="font-medium">Passport:</span> {passenger.passportNumber}</p>
                                                                <p><span className="font-medium">Passport Expiry:</span> {new Date(passenger.passportExpiry).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 
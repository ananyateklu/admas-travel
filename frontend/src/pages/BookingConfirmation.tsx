import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/firebase/useAuth';

interface BookingData {
    userId: string;
    bookingReference: string;
    status: string;
    tripType: string;
    from: string;
    to: string;
    departureDate: string;
    returnDate?: string;
    totalPassengers: number;
    class: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    createdAt: {
        toDate: () => Date;
    };
}

export default function BookingConfirmation() {
    const { bookingId } = useParams();
    const { user } = useAuth();
    const [booking, setBooking] = useState<BookingData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            if (!bookingId || !user) {
                setError('Invalid booking or user not authenticated');
                setIsLoading(false);
                return;
            }

            try {
                const bookingDoc = await getDoc(doc(db, 'bookings', bookingId));

                if (!bookingDoc.exists()) {
                    setError('Booking not found');
                    setIsLoading(false);
                    return;
                }

                const bookingData = bookingDoc.data() as BookingData;

                // Verify the booking belongs to the current user
                if (bookingData.userId !== user.uid) {
                    setError('Unauthorized access');
                    setIsLoading(false);
                    return;
                }

                setBooking(bookingData);
            } catch (err) {
                console.error('Error fetching booking:', err);
                setError('Failed to load booking details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooking();
    }, [bookingId, user]);

    if (isLoading) {
        return (
            <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-32 pb-16">
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

    if (!booking) {
        return null;
    }

    return (
        <div className="min-h-screen pt-32 pb-16">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {/* Success Message */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-serif mb-2">Booking Confirmed!</h1>
                        <p className="text-gray-600">Your booking has been successfully submitted.</p>
                    </div>

                    {/* Booking Details */}
                    <div className="border-t border-b py-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
                                <p className="font-medium">{booking.bookingReference}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Status</p>
                                <p className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">From</p>
                                <p className="font-medium">{booking.from}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">To</p>
                                <p className="font-medium">{booking.to}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Departure Date</p>
                                <p className="font-medium">{new Date(booking.departureDate).toLocaleDateString()}</p>
                            </div>
                            {booking.returnDate && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Return Date</p>
                                    <p className="font-medium">{new Date(booking.returnDate).toLocaleDateString()}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Passengers</p>
                                <p className="font-medium">{booking.totalPassengers}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Class</p>
                                <p className="font-medium">{booking.class.charAt(0).toUpperCase() + booking.class.slice(1)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Full Name</p>
                                <p className="font-medium">{booking.contactName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Email</p>
                                <p className="font-medium">{booking.contactEmail}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Phone</p>
                                <p className="font-medium">{booking.contactPhone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Booking Date</p>
                                <p className="font-medium">{booking.createdAt.toDate().toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center">
                        <Link to="/" className="text-gold hover:text-gold/80 transition-colors">
                            ← Return to Home
                        </Link>
                        <Link
                            to="/account"
                            className="px-6 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors"
                        >
                            View All Bookings
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
} 
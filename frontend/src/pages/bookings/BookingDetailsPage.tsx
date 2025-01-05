import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase/firebase';
import { useAuth } from '../../lib/firebase/useAuth';
import { formatDate } from '../../utils/dateUtils';

interface BookingDetails {
    type: 'flight' | 'hotel';
    status: string;
    createdAt: string;
    userId: string;
    totalPrice: {
        amount: number;
        currency: string;
    };
    // Flight specific fields
    flightDetails?: {
        departure: {
            airport: string;
            date: string;
            time: string;
        };
        arrival: {
            airport: string;
            date: string;
            time: string;
        };
    };
    // Hotel specific fields
    hotelName?: string;
    room?: {
        id: string;
        name: string;
        description: string;
        amenities: string[];
        price: {
            amount: number;
            currency: string;
            perNight: boolean;
        };
    };
    dates?: {
        checkIn: string;
        checkOut: string;
        numberOfNights: number;
    };
    location?: {
        address: string;
        city: string;
        country: string;
    };
    numberOfRooms?: number;
    numberOfGuests?: number;
}

export default function BookingDetailsPage() {
    const { bookingId } = useParams<{ bookingId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [booking, setBooking] = useState<BookingDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            if (!bookingId || !user) return;

            try {
                const bookingRef = doc(db, 'bookings', bookingId);
                const bookingSnap = await getDoc(bookingRef);

                if (!bookingSnap.exists()) {
                    setError('Booking not found');
                    return;
                }

                const bookingData = bookingSnap.data() as BookingDetails;

                // Verify booking belongs to user
                if (bookingData.userId !== user.uid) {
                    setError('Unauthorized');
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

        fetchBookingDetails();
    }, [bookingId, user]);

    const getStatusStyle = (status: string) => {
        if (status === 'confirmed') return 'bg-green-100 text-green-800';
        if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
        return 'bg-gray-100 text-gray-800';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-32 pb-12 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen pt-32 pb-12 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                        {error ?? 'Booking not found'}
                    </h1>
                    <button
                        onClick={() => navigate('/bookings')}
                        className="text-primary hover:text-primary-dark"
                    >
                        Return to bookings
                    </button>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen pt-32 pb-12"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    {booking.type === 'hotel' ? booking.hotelName : 'Flight Booking'}
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Booking ID: {bookingId}
                                </p>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(booking.status)}`}>
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                                <span className="text-sm text-gray-500 mt-1">
                                    {new Date(booking.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        {/* Content based on booking type */}
                        {booking.type === 'hotel' ? (
                            <div className="space-y-6">
                                {/* Hotel Details */}
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900 mb-2">Hotel Details</h2>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-600">{booking.location?.address}</p>
                                        <p className="text-gray-600">{booking.location?.city}, {booking.location?.country}</p>
                                    </div>
                                </div>

                                {/* Stay Details */}
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900 mb-2">Stay Details</h2>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Check-in</p>
                                                <p className="font-medium">{formatDate(booking.dates?.checkIn ?? '')}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Check-out</p>
                                                <p className="font-medium">{formatDate(booking.dates?.checkOut ?? '')}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <p className="text-gray-600">
                                                {booking.numberOfRooms} room{booking.numberOfRooms !== 1 ? 's' : ''}, {booking.numberOfGuests} guest{booking.numberOfGuests !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Room Details */}
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900 mb-2">Room Details</h2>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-medium text-gray-900">{booking.room?.name}</h3>
                                        <p className="text-gray-600 mt-1">{booking.room?.description}</p>
                                        {booking.room?.amenities && booking.room.amenities.length > 0 && (
                                            <div className="mt-4">
                                                <p className="text-sm font-medium text-gray-900 mb-2">Amenities</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {booking.room.amenities.map((amenity) => (
                                                        <span
                                                            key={`${booking.room?.id}-${amenity}`}
                                                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                                                        >
                                                            {amenity}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Flight Details */}
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900 mb-2">Flight Details</h2>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Departure</p>
                                                <p className="font-medium">{booking.flightDetails?.departure.airport}</p>
                                                <p className="text-sm text-gray-600">
                                                    {formatDate(booking.flightDetails?.departure.date ?? '')} at {booking.flightDetails?.departure.time}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Arrival</p>
                                                <p className="font-medium">{booking.flightDetails?.arrival.airport}</p>
                                                <p className="text-sm text-gray-600">
                                                    {formatDate(booking.flightDetails?.arrival.date ?? '')} at {booking.flightDetails?.arrival.time}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Price Summary */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="space-y-4">
                                {booking.type === 'hotel' && booking.room?.price.perNight && (
                                    <div className="flex justify-between items-center text-gray-600">
                                        <span>Price per night</span>
                                        <span>
                                            {booking.room.price.currency} {booking.room.price.amount.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                {booking.type === 'hotel' && booking.dates?.numberOfNights && (
                                    <div className="flex justify-between items-center text-gray-600">
                                        <span>Duration</span>
                                        <span>
                                            {booking.dates.numberOfNights} night{booking.dates.numberOfNights !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                )}
                                {booking.type === 'hotel' && booking.numberOfRooms && booking.numberOfRooms > 1 && (
                                    <div className="flex justify-between items-center text-gray-600">
                                        <span>Number of rooms</span>
                                        <span>{booking.numberOfRooms}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                    <span className="text-lg font-medium text-gray-900">Total Price</span>
                                    <span className="text-xl font-semibold text-gray-900">
                                        {booking.totalPrice.currency} {booking.totalPrice.amount.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
} 
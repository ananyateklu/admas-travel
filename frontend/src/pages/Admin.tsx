import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/firebase/AuthContext';
import { collection, query, orderBy, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface BookingData {
    bookingId: string;
    userId: string;
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

const ADMIN_EMAILS = ['ananya.meseret@gmail.com'];
const BOOKING_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

export default function Admin() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<BookingData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [updateLoading, setUpdateLoading] = useState<string | null>(null);

    useEffect(() => {
        if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
            navigate('/');
            return;
        }

        console.log('Admin - Setting up real-time listener');
        const bookingsRef = collection(db, 'bookings');
        const q = query(bookingsRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                console.log('Admin - Received snapshot update');
                const bookingsData = snapshot.docs.map(doc => {
                    const data = doc.data();
                    console.log('Admin - Booking data:', {
                        id: doc.id,
                        status: data.status,
                        userId: data.userId,
                        reference: data.bookingReference
                    });
                    return {
                        ...data,
                        bookingId: doc.id,
                        createdAt: data.createdAt
                    };
                }) as BookingData[];

                console.log('Admin - All bookings:', bookingsData);
                setBookings(bookingsData);
                setIsLoading(false);
            },
            (error) => {
                console.error('Admin - Error fetching bookings:', error);
                setError('Failed to load bookings');
                setIsLoading(false);
            }
        );

        return () => {
            console.log('Admin - Cleaning up listener');
            unsubscribe();
        };
    }, [user, navigate]);

    const handleStatusChange = async (bookingId: string, newStatus: string, userId: string) => {
        console.log('Admin - Updating status:', { bookingId, newStatus, userId });
        setUpdateLoading(bookingId);
        try {
            // Update in root bookings collection
            console.log('Admin - Updating root collection');
            await updateDoc(doc(db, 'bookings', bookingId), {
                status: newStatus
            });

            // Update in user's bookings subcollection
            console.log('Admin - Updating user subcollection');
            await updateDoc(doc(db, 'users', userId, 'bookings', bookingId), {
                status: newStatus
            });

            console.log('Admin - Update successful');
            setBookings(prevBookings =>
                prevBookings.map(booking =>
                    booking.bookingId === bookingId
                        ? { ...booking, status: newStatus }
                        : booking
                )
            );
        } catch (err) {
            console.error('Error updating booking status:', err);
            setError('Failed to update booking status');
        } finally {
            setUpdateLoading(null);
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            booking.contactName?.toLowerCase().includes(searchLower) ||
            booking.bookingReference?.toLowerCase().includes(searchLower) ||
            booking.contactEmail?.toLowerCase().includes(searchLower);
        return matchesStatus && matchesSearch;
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-96px)] mt-[112px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-96px)] mt-[112px] bg-gray-50 pb-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="mb-6 flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search by name, reference, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg bg-white"
                    >
                        <option value="all">All Statuses</option>
                        {BOOKING_STATUSES.map(status => (
                            <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-4">
                    {filteredBookings.map(booking => (
                        <div
                            key={booking.bookingId}
                            className="bg-white rounded-lg shadow-md p-6"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h3 className="text-xl font-semibold">{booking.contactName}</h3>
                                    <p className="text-gray-600">Ref: {booking.bookingReference}</p>
                                    <p className="text-gray-600">{booking.contactEmail}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={booking.status}
                                            onChange={(e) => handleStatusChange(booking.bookingId, e.target.value, booking.userId)}
                                            disabled={updateLoading === booking.bookingId}
                                            className={`px-3 py-2 rounded border ${booking.status === 'confirmed' ? 'bg-green-100 border-green-300' :
                                                booking.status === 'cancelled' ? 'bg-red-100 border-red-300' :
                                                    booking.status === 'completed' ? 'bg-blue-100 border-blue-300' :
                                                        'bg-yellow-100 border-yellow-300'
                                                }`}
                                        >
                                            {BOOKING_STATUSES.map(status => (
                                                <option key={status} value={status}>
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                        {updateLoading === booking.bookingId && (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setExpandedBookingId(
                                            expandedBookingId === booking.bookingId ? null : booking.bookingId
                                        )}
                                        className="px-4 py-2 text-blue-600 hover:text-blue-800"
                                    >
                                        {expandedBookingId === booking.bookingId ? 'Show Less' : 'Show More'}
                                    </button>
                                </div>
                            </div>

                            {expandedBookingId === booking.bookingId && (
                                <div className="mt-4 border-t pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-semibold mb-2">Trip Details</h4>
                                            <p>From: {booking.from}</p>
                                            <p>To: {booking.to}</p>
                                            <p>Trip Type: {booking.tripType}</p>
                                            <p>Class: {booking.class}</p>
                                            <p>Departure: {booking.departureDate}</p>
                                            {booking.returnDate && <p>Return: {booking.returnDate}</p>}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-2">Contact Information</h4>
                                            <p>Name: {booking.contactName}</p>
                                            <p>Email: {booking.contactEmail}</p>
                                            <p>Phone: {booking.contactPhone}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <h4 className="font-semibold mb-2">Passengers ({booking.totalPassengers})</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {booking.passengers.map((passenger, index) => (
                                                <div key={index} className="border rounded p-3">
                                                    <p className="font-medium">{passenger.fullName}</p>
                                                    <p className="text-sm text-gray-600">Type: {passenger.type}</p>
                                                    <p className="text-sm text-gray-600">Nationality: {passenger.nationality}</p>
                                                    <p className="text-sm text-gray-600">Passport: {passenger.passportNumber}</p>
                                                    <p className="text-sm text-gray-600">Passport Expiry: {passenger.passportExpiry}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 
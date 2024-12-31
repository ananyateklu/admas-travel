import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/firebase/useAuth';
import { collection, query, orderBy, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import mountainTwo from '../assets/mountain-two.jpg';
import { BookingCard } from '../components/admin/BookingCard';
import { SearchFilters } from '../components/admin/SearchFilters';
import { ADMIN_EMAILS, BookingData } from '../components/admin/types';
import { formatDate, formatDateShort, formatDateNumeric } from '../components/admin/utils';

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

        // If search is empty, just check status
        if (!searchLower) return matchesStatus;

        // Check if search term matches any date format
        const departureDate = new Date(booking.departureDate);
        const returnDate = booking.returnDate ? new Date(booking.returnDate) : null;

        const departureDateFormats = [
            formatDate(departureDate),
            formatDateShort(departureDate),
            formatDateNumeric(departureDate)
        ];

        const returnDateFormats = returnDate ? [
            formatDate(returnDate),
            formatDateShort(returnDate),
            formatDateNumeric(returnDate)
        ] : [];

        // Check if search matches any of our criteria
        const matchesSearch =
            // Existing search criteria
            booking.contactName?.toLowerCase().includes(searchLower) ||
            booking.bookingReference?.toLowerCase().includes(searchLower) ||
            booking.contactEmail?.toLowerCase().includes(searchLower) ||
            // New date search criteria
            departureDateFormats.some(format => format.includes(searchLower)) ||
            returnDateFormats.some(format => format.includes(searchLower)) ||
            // Additional search fields
            booking.from?.toLowerCase().includes(searchLower) ||
            booking.to?.toLowerCase().includes(searchLower) ||
            booking.class?.toLowerCase().includes(searchLower) ||
            // Search in passenger names
            booking.passengers.some(passenger =>
                passenger.fullName.toLowerCase().includes(searchLower) ||
                passenger.nationality.toLowerCase().includes(searchLower)
            );

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
        <div className="min-h-screen">
            {/* Hero Section */}
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
                        <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Admin Dashboard</h1>
                        <p className="text-xl text-white/90">Manage and monitor all travel bookings</p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50">
                <div className="max-w-[90%] mx-auto px-6 -mt-20 pb-8 relative z-10">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6">
                            {error}
                        </div>
                    )}

                    <SearchFilters
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                    />

                    {/* Bookings List */}
                    <div className="space-y-4">
                        {filteredBookings.map(booking => (
                            <BookingCard
                                key={booking.bookingId}
                                booking={booking}
                                isExpanded={expandedBookingId === booking.bookingId}
                                onToggleExpand={() => setExpandedBookingId(
                                    expandedBookingId === booking.bookingId ? null : booking.bookingId
                                )}
                                onStatusChange={handleStatusChange}
                                updateLoading={updateLoading}
                            />
                        ))}

                        {filteredBookings.length === 0 && (
                            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                                <p className="text-gray-600">
                                    {statusFilter === 'all'
                                        ? 'There are no bookings to display.'
                                        : `There are no ${statusFilter} bookings to display.`}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 
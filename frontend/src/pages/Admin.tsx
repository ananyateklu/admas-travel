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
import { AdminAnalytics } from '../components/admin/AdminAnalytics';
import { AdminFlights } from '../components/admin/AdminFlights';

type AdminTab = 'bookings' | 'flights' | 'analytics' | 'settings';

export default function Admin() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<AdminTab>('bookings');
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

        if (activeTab === 'bookings') {
            console.log('Admin - Setting up real-time listener');
            const bookingsRef = collection(db, 'bookings');
            const q = query(bookingsRef, orderBy('createdAt', 'desc'));

            const unsubscribe = onSnapshot(q,
                (snapshot) => {
                    console.log('Admin - Received snapshot update');
                    const bookingsData = snapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            ...data,
                            bookingId: doc.id,
                            createdAt: data.createdAt
                        };
                    }) as BookingData[];

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
        }
    }, [user, navigate, activeTab]);

    const handleStatusChange = async (bookingId: string, newStatus: string, userId: string) => {
        console.log('Admin - Updating status:', { bookingId, newStatus, userId });
        setUpdateLoading(bookingId);
        try {
            await updateDoc(doc(db, 'bookings', bookingId), {
                status: newStatus
            });

            await updateDoc(doc(db, 'users', userId, 'bookings', bookingId), {
                status: newStatus
            });

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

        if (!searchLower) return matchesStatus;

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

        const matchesSearch =
            booking.contactName?.toLowerCase().includes(searchLower) ||
            booking.bookingReference?.toLowerCase().includes(searchLower) ||
            booking.contactEmail?.toLowerCase().includes(searchLower) ||
            departureDateFormats.some(format => format.includes(searchLower)) ||
            returnDateFormats.some(format => format.includes(searchLower)) ||
            booking.from?.toLowerCase().includes(searchLower) ||
            booking.to?.toLowerCase().includes(searchLower) ||
            booking.class?.toLowerCase().includes(searchLower) ||
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
                        <p className="text-xl text-white/90">Manage and monitor all travel operations</p>
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

                    {/* Main Navigation Tabs */}
                    <div className="bg-white rounded-xl shadow-md mb-6">
                        <nav className="flex space-x-1 p-1" aria-label="Admin sections">
                            <button
                                onClick={() => setActiveTab('bookings')}
                                className={`flex-1 px-4 py-4 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-200
                                    ${activeTab === 'bookings'
                                        ? 'bg-gradient-to-r from-gold/90 to-gold text-white shadow-md'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 4h-1V3a1 1 0 00-2 0v1H8V3a1 1 0 00-2 0v1H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
                                </svg>
                                Bookings
                            </button>
                            <button
                                onClick={() => setActiveTab('flights')}
                                className={`flex-1 px-4 py-4 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-200
                                    ${activeTab === 'flights'
                                        ? 'bg-gradient-to-r from-gold/90 to-gold text-white shadow-md'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                Flights
                            </button>
                            <button
                                onClick={() => setActiveTab('analytics')}
                                className={`flex-1 px-4 py-4 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-200
                                    ${activeTab === 'analytics'
                                        ? 'bg-gradient-to-r from-gold/90 to-gold text-white shadow-md'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Analytics
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`flex-1 px-4 py-4 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-200
                                    ${activeTab === 'settings'
                                        ? 'bg-gradient-to-r from-gold/90 to-gold text-white shadow-md'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Settings
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'bookings' && (
                        <>
                            <SearchFilters
                                searchTerm={searchTerm}
                                onSearchChange={setSearchTerm}
                                statusFilter={statusFilter}
                                onStatusFilterChange={setStatusFilter}
                            />

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
                        </>
                    )}

                    {activeTab === 'flights' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-serif text-gray-900">Flight Management</h2>
                                    <p className="text-gray-600">Search, manage, and monitor flight schedules and pricing</p>
                                </div>
                                <button className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add Flight
                                </button>
                            </div>
                            <AdminFlights />
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <AdminAnalytics bookings={bookings} />
                    )}

                    {activeTab === 'settings' && (
                        <div className="bg-white rounded-xl shadow-sm p-8">
                            <div className="max-w-2xl mx-auto">
                                <h3 className="text-xl font-medium text-gray-900 mb-6">Admin Settings</h3>

                                <div className="space-y-6">
                                    {/* Notification Settings */}
                                    <div className="border-b border-gray-200 pb-6">
                                        <h4 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h4>
                                        <div className="space-y-4">
                                            <label className="flex items-center justify-between">
                                                <span className="text-gray-700">Email notifications for new bookings</span>
                                                <input type="checkbox" className="form-checkbox h-5 w-5 text-gold rounded" />
                                            </label>
                                            <label className="flex items-center justify-between">
                                                <span className="text-gray-700">SMS alerts for booking cancellations</span>
                                                <input type="checkbox" className="form-checkbox h-5 w-5 text-gold rounded" />
                                            </label>
                                            <label className="flex items-center justify-between">
                                                <span className="text-gray-700">Daily booking summary</span>
                                                <input type="checkbox" className="form-checkbox h-5 w-5 text-gold rounded" />
                                            </label>
                                        </div>
                                    </div>

                                    {/* API Integration Settings - Placeholder */}
                                    <div className="border-b border-gray-200 pb-6">
                                        <h4 className="text-lg font-medium text-gray-900 mb-4">API Integration</h4>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-600">
                                                API integration settings will be available soon. This will allow you to
                                                configure flight APIs and other third-party services.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Admin Access Control - Placeholder */}
                                    <div>
                                        <h4 className="text-lg font-medium text-gray-900 mb-4">Access Control</h4>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-600">
                                                Admin access control settings will be available soon. This will allow you to
                                                manage admin permissions and roles.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/firebase/useAuth';
import { collection, query, orderBy, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import planeBoarding from '../assets/plane-boarding.jpg';
import {
    BookingCard,
    SearchFilters,
    AdminAnalytics,
    AdminFlights,
    ADMIN_EMAILS,
    BookingData,
    formatDate,
    formatDateShort,
    formatDateNumeric
} from '../components/admin';
import { Airport } from '../services/flightService';
import { AdminSettings } from '../components/admin/settings';
import { motion } from 'framer-motion';

// Add type guard for Airport
const isAirport = (value: unknown): value is Airport => {
    return value !== null && typeof value === 'object' && 'city' in value;
};

// Add helper function to get searchable location text
const getLocationSearchText = (location: Airport | string | null): string => {
    if (!location) return '';
    if (isAirport(location)) return location.city.toLowerCase();
    return location.toLowerCase();
};

type AdminTab = 'bookings' | 'flights' | 'analytics' | 'settings';

interface AdminTabConfig {
    id: AdminTab;
    label: string;
    icon: JSX.Element;
    notifications?: number;
    highlight?: boolean;
}

export default function Admin() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<AdminTab>(() => {
        const savedTab = localStorage.getItem('adminActiveTab');
        return (savedTab as AdminTab) || 'bookings';
    });

    useEffect(() => {
        localStorage.setItem('adminActiveTab', activeTab);
    }, [activeTab]);

    const [bookings, setBookings] = useState<BookingData[]>([]);
    const [isBookingsLoading, setIsBookingsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [updateLoading, setUpdateLoading] = useState<string | null>(null);

    // Check admin access
    useEffect(() => {
        if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
            navigate('/');
        }
    }, [user, navigate]);

    // Handle bookings data fetching - now independent of activeTab
    useEffect(() => {
        setIsBookingsLoading(true);
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
                setIsBookingsLoading(false);
            },
            (error) => {
                console.error('Admin - Error fetching bookings:', error);
                setError('Failed to load bookings');
                setIsBookingsLoading(false);
            }
        );

        return () => {
            console.log('Admin - Cleaning up listener');
            unsubscribe();
        };
    }, []);

    const handleStatusChange = async (bookingId: string, newStatus: string, userId: string) => {
        console.log('Admin - Updating status:', { bookingId, newStatus, userId });
        setUpdateLoading(bookingId);
        try {
            // Get the current booking to store its status as previousStatus
            const currentBooking = bookings.find(b => b.bookingId === bookingId);
            if (!currentBooking) return;

            const updateData = {
                status: newStatus,
                previousStatus: currentBooking.status
            };

            await updateDoc(doc(db, 'bookings', bookingId), updateData);
            await updateDoc(doc(db, 'users', userId, 'bookings', bookingId), updateData);

            setBookings(prevBookings =>
                prevBookings.map(booking =>
                    booking.bookingId === bookingId
                        ? { ...booking, ...updateData }
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
            getLocationSearchText(booking.from).includes(searchLower) ||
            getLocationSearchText(booking.to).includes(searchLower) ||
            booking.class?.toLowerCase().includes(searchLower) ||
            booking.passengers.some(passenger =>
                passenger.fullName.toLowerCase().includes(searchLower) ||
                passenger.nationality.toLowerCase().includes(searchLower)
            );

        return matchesStatus && matchesSearch;
    });

    // Calculate pending bookings count
    const pendingBookingsCount = useMemo(() =>
        bookings.filter(booking => booking.status === 'pending').length,
        [bookings]);

    // Get time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Calculate completion rate
    const getCompletionRate = () => {
        const completedBookings = bookings.filter(b => b.status === 'completed').length;
        const totalBookings = bookings.length;
        return totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0;
    };

    // Format last active time
    const getLastActiveTime = () => {
        if (!user?.metadata.lastSignInTime) return '';
        const lastActive = new Date(user.metadata.lastSignInTime);
        const now = new Date();
        const diffInHours = Math.abs(now.getTime() - lastActive.getTime()) / 36e5;

        if (diffInHours < 1) return 'Active now';
        if (diffInHours < 24) return `Last active ${Math.floor(diffInHours)}h ago`;
        return `Last active ${Math.floor(diffInHours / 24)}d ago`;
    };

    // Main render content based on tab
    const renderTabContent = () => {
        switch (activeTab) {
            case 'bookings':
                if (isBookingsLoading) {
                    return (
                        <div className="flex items-center justify-center min-h-[200px]">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent"></div>
                        </div>
                    );
                }
                return (
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
                );
            case 'flights':
                return <AdminFlights />;
            case 'analytics':
                return <AdminAnalytics bookings={bookings} />;
            case 'settings':
                return <AdminSettings />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-gray-900 to-black overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={planeBoarding}
                        alt="Plane Boarding"
                        className="w-full h-full object-cover object-center transform scale-105 motion-safe:animate-subtle-zoom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70 backdrop-blur-[2px]" />

                    {/* Animated particles */}
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute w-2 h-2 bg-white rounded-full top-1/4 left-1/4 animate-float" style={{ animationDelay: '0s' }} />
                        <div className="absolute w-2 h-2 bg-white rounded-full top-1/3 left-2/3 animate-float" style={{ animationDelay: '0.5s' }} />
                        <div className="absolute w-2 h-2 bg-white rounded-full top-2/3 left-1/3 animate-float" style={{ animationDelay: '1s' }} />
                        <div className="absolute w-2 h-2 bg-white rounded-full top-1/2 left-3/4 animate-float" style={{ animationDelay: '1.5s' }} />
                    </div>
                </div>
                <div className="relative flex flex-col justify-center pt-[200px]">
                    <div className="w-full max-w-[2000px] mx-auto px-8">
                        <div className="w-[80%] max-w-[2000px] mx-auto">
                            <div className="flex flex-col items-center text-center mb-12">
                                <motion.div
                                    className="flex-shrink-0 mb-6 relative group"
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    {user?.photoURL ? (
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
                                            <img
                                                src={user.photoURL}
                                                alt={user.displayName ?? 'Admin'}
                                                className="w-28 h-28 rounded-full object-cover border-4 border-white/20 shadow-xl relative z-10"
                                            />
                                            <motion.div
                                                className="absolute -bottom-2 -right-2 w-7 h-7 bg-green-500 rounded-full border-4 border-white z-20"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.5, type: "spring" }}
                                            />
                                            <motion.div
                                                className="absolute -bottom-2 -left-2 bg-gold text-white text-xs px-2 py-1 rounded-full shadow-lg z-20"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.6 }}
                                            >
                                                Admin
                                            </motion.div>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
                                            <div className="w-28 h-28 rounded-full bg-gold text-white flex items-center justify-center text-4xl font-medium border-4 border-white/20 shadow-xl relative z-10">
                                                {user?.displayName?.charAt(0) ?? user?.email?.charAt(0) ?? 'A'}
                                            </div>
                                            <motion.div
                                                className="absolute -bottom-2 -right-2 w-7 h-7 bg-green-500 rounded-full border-4 border-white z-20"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.5, type: "spring" }}
                                            />
                                            <motion.div
                                                className="absolute -bottom-2 -left-2 bg-gold text-white text-xs px-2 py-1 rounded-full shadow-lg z-20"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.6 }}
                                            >
                                                Admin
                                            </motion.div>
                                        </div>
                                    )}
                                </motion.div>
                                <div>
                                    <motion.div
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                    >
                                        <span className="text-gold text-xl mb-2 block font-medium tracking-wide">{getGreeting()},</span>
                                        <h1 className="text-4xl md:text-6xl font-serif text-white mb-2 tracking-tight">
                                            {user?.displayName ?? 'Admin'}
                                        </h1>
                                    </motion.div>
                                    <motion.div
                                        className="flex items-center justify-center gap-4 flex-wrap"
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.3 }}
                                    >
                                        <div className="flex items-center text-white/60">
                                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                            {getLastActiveTime()}
                                        </div>
                                        <div className="text-white/60">•</div>
                                        <div className="text-white/60 hover:text-white transition-colors">{user?.email}</div>
                                        <div className="text-white/60">•</div>
                                        <div className="text-white/60">Last login: {new Date(user?.metadata.lastSignInTime ?? '').toLocaleDateString()}</div>
                                    </motion.div>
                                </div>
                            </div>

                            <motion.p
                                className="text-xl text-white/80 text-center mx-auto max-w-2xl mb-16"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                Welcome to your command center. Monitor bookings, manage flights, and keep your travel operations running smoothly.
                            </motion.p>

                            {/* Quick stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-8 mb-12">
                                {[
                                    {
                                        value: bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length,
                                        label: 'Active Bookings',
                                        icon: (
                                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        ),
                                        trend: '+12% from last week',
                                        trendUp: true
                                    },
                                    {
                                        value: bookings.filter(b => {
                                            const today = new Date();
                                            const bookingDate = new Date(b.departureDate);
                                            return bookingDate.toDateString() === today.toDateString();
                                        }).length,
                                        label: "Today's Flights",
                                        icon: (
                                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                            </svg>
                                        ),
                                        trend: 'On schedule',
                                        trendUp: true
                                    },
                                    {
                                        value: `${getCompletionRate()}%`,
                                        label: 'Completion Rate',
                                        icon: (
                                            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        ),
                                        trend: '+5% this month',
                                        trendUp: true
                                    },
                                    {
                                        value: bookings.filter(b => {
                                            const today = new Date();
                                            const bookingDate = typeof b.createdAt === 'string'
                                                ? new Date(b.createdAt)
                                                : b.createdAt.toDate();
                                            return bookingDate.toDateString() === today.toDateString();
                                        }).length,
                                        label: 'New Bookings',
                                        icon: (
                                            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        ),
                                        trend: '3 in last hour',
                                        trendUp: true
                                    }
                                ].map((stat, index) => (
                                    <motion.div
                                        key={stat.label}
                                        className="bg-white/90 backdrop-blur-lg rounded-xl px-6 py-4 border border-white/20 hover:bg-white/95 transition-all duration-300 group hover:shadow-lg hover:-translate-y-1"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 + 0.5 }}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="p-2 rounded-lg bg-gray-50 group-hover:scale-110 transition-transform duration-300">
                                                {stat.icon}
                                            </div>
                                            <div className={`text-xs font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'} flex items-center gap-1`}>
                                                {stat.trendUp ? (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                                                    </svg>
                                                )}
                                                {stat.trend}
                                            </div>
                                        </div>
                                        <div className="text-2xl font-bold text-gray-800 mb-1 group-hover:text-gold transition-colors">
                                            {stat.value}
                                        </div>
                                        <div className="text-sm text-gray-600">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Navigation Tabs */}
                            <div className="w-[80%] max-w-[2000px] mx-auto mb-16">
                                <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg shadow-black/5 motion-safe:animate-fade-in-up animation-delay-100">
                                    <nav className="flex flex-col sm:flex-row" aria-label="Admin sections">
                                        <div className="flex overflow-x-auto sm:w-full scrollbar-hide">
                                            <div className="flex-1 flex p-3 gap-3 justify-center">
                                                {([
                                                    {
                                                        id: 'bookings',
                                                        label: 'Bookings',
                                                        icon: (
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 4h-1V3a1 1 0 00-2 0v1H8V3a1 1 0 00-2 0v1H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
                                                            </svg>
                                                        ),
                                                        notifications: pendingBookingsCount
                                                    },
                                                    {
                                                        id: 'flights',
                                                        label: 'Flights',
                                                        icon: (
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                            </svg>
                                                        )
                                                    },
                                                    {
                                                        id: 'analytics',
                                                        label: 'Analytics',
                                                        icon: (
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                            </svg>
                                                        ),
                                                        highlight: true
                                                    },
                                                    {
                                                        id: 'settings',
                                                        label: 'Settings',
                                                        icon: (
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                        )
                                                    }
                                                ] as AdminTabConfig[]).map((tab) => (
                                                    <button
                                                        key={tab.id}
                                                        onClick={() => setActiveTab(tab.id)}
                                                        className={`group relative flex-1 sm:flex-initial min-w-[140px] px-6 py-4 text-sm font-medium rounded-xl flex items-center justify-center gap-3 transition-all duration-500
                                                            ${activeTab === tab.id
                                                                ? 'bg-gradient-to-r from-gold via-gold/90 to-gold text-white shadow-lg shadow-gold/20 scale-[1.02] hover:shadow-xl hover:shadow-gold/25'
                                                                : 'text-gray-500 hover:text-gray-700 hover:bg-black/5'
                                                            }`}
                                                        aria-current={activeTab === tab.id ? 'page' : undefined}
                                                    >
                                                        {/* Background glow effect */}
                                                        {activeTab === tab.id && (
                                                            <div className="absolute inset-0 rounded-xl bg-gold/20 blur-xl transition-opacity duration-500" />
                                                        )}

                                                        {/* Icon with hover animation */}
                                                        <span className={`relative transition-all duration-500 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                                                            {tab.icon}
                                                        </span>

                                                        {/* Label with underline effect */}
                                                        <span className="relative">
                                                            {tab.label}
                                                            <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-current transform origin-left transition-transform duration-300 ${activeTab === tab.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                                                        </span>

                                                        {/* Notification badge with pulse effect */}
                                                        {tab.notifications && tab.notifications > 0 && (
                                                            <span className="absolute -top-1 -right-1">
                                                                <span className="relative flex h-5 w-5">
                                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                                    <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-xs font-bold items-center justify-center">
                                                                        {tab.notifications}
                                                                    </span>
                                                                </span>
                                                            </span>
                                                        )}

                                                        {/* Highlight indicator */}
                                                        {tab.highlight && (
                                                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-gray-50/80 backdrop-blur-xl -mt-8 pt-12 relative">
                <div className="max-w-[95%] mx-auto px-6 pb-12 relative">
                    {error && (
                        <div className="bg-red-50/95 backdrop-blur-xl border border-red-200 text-red-600 rounded-xl p-4 mb-6 shadow-lg animate-fade-in">
                            {error}
                        </div>
                    )}
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
} 
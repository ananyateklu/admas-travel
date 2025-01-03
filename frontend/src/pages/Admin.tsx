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
import { useAnalytics } from '../hooks/useAnalytics';

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

    const { ratings } = useAnalytics(bookings);

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

    // Calculate revenue growth
    const getRevenueStats = () => {
        const today = new Date();
        const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 1);

        const TICKET_PRICE = 40; // Fixed ticket price as used in analytics

        const calculateMonthRevenue = (startDate: Date, endDate: Date) => {
            return bookings
                .filter(b => {
                    const bookingDate = typeof b.createdAt === 'string'
                        ? new Date(b.createdAt)
                        : b.createdAt.toDate();
                    return bookingDate >= startDate && bookingDate < endDate;
                })
                .reduce((total, booking) => {
                    const amount = TICKET_PRICE * (Array.isArray(booking.passengers) ? booking.passengers.length : 0);
                    return total + amount;
                }, 0);
        };

        const currentMonthRevenue = calculateMonthRevenue(currentMonth, today);
        const lastMonthRevenue = calculateMonthRevenue(lastMonth, currentMonth);
        const twoMonthsAgoRevenue = calculateMonthRevenue(twoMonthsAgo, lastMonth);

        // Calculate month-over-month growth
        const monthOverMonthGrowth = lastMonthRevenue > 0
            ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
            : 0;

        // Calculate previous month's growth for comparison
        const previousMonthGrowth = twoMonthsAgoRevenue > 0
            ? ((lastMonthRevenue - twoMonthsAgoRevenue) / twoMonthsAgoRevenue) * 100
            : 0;

        // Determine if the trend is improving
        const trendUp = monthOverMonthGrowth >= previousMonthGrowth;

        // Format trend message
        const getTrendMessage = () => {
            const growthAbs = Math.abs(monthOverMonthGrowth);
            if (growthAbs === 0) return 'No change vs last month';
            return `${monthOverMonthGrowth > 0 ? '+' : '-'}${growthAbs.toFixed(1)}% vs last month`;
        };

        return {
            value: currentMonthRevenue.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
            }),
            trend: getTrendMessage(),
            trendUp,
            details: {
                currentMonth: currentMonthRevenue,
                lastMonth: lastMonthRevenue,
                twoMonthsAgo: twoMonthsAgoRevenue,
                growthRate: monthOverMonthGrowth
            }
        };
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
                                            <motion.img
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                                src={user.photoURL}
                                                alt={user.displayName ?? 'Admin'}
                                                className="w-28 h-28 rounded-full object-cover ring-4 ring-white/20 shadow-xl relative z-10"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName ?? 'Admin')}&background=D4AF37&color=fff&size=112`;
                                                }}
                                            />
                                            <motion.div
                                                className="absolute -bottom-2 -right-2 w-7 h-7 bg-green-500 rounded-full border-4 border-white z-20"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.5, type: "spring" }}
                                            />
                                            <motion.div
                                                className="absolute -bottom-2 -left-2 bg-forest-400 text-white text-xs px-2 py-1 rounded-full shadow-lg z-20"
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
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                                className="w-28 h-28 rounded-full bg-gold text-white flex items-center justify-center text-4xl font-medium ring-4 ring-white/20 shadow-xl relative z-10"
                                            >
                                                <motion.span
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.1 }}
                                                >
                                                    {user?.displayName?.[0] ?? user?.email?.[0] ?? 'A'}
                                                </motion.span>
                                            </motion.div>
                                            <motion.div
                                                className="absolute -bottom-2 -right-2 w-7 h-7 bg-green-500 rounded-full border-4 border-white z-20"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.5, type: "spring" }}
                                            />
                                            <motion.div
                                                className="absolute -bottom-2 -left-2 bg-forest-400 text-white text-xs px-2 py-1 rounded-full shadow-lg z-20"
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
                                        className="bg-white/10 backdrop-blur-md rounded-2xl px-8 py-6 border border-white/20 shadow-xl"
                                    >
                                        <span className="font-serif text-2xl mb-3 block tracking-[0.05em] text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-300 to-gold-400 uppercase font-medium [text-shadow:_0_1px_2px_rgba(212,175,55,0.3)]">{getGreeting()}</span>
                                        <h1 className="text-4xl md:text-6xl font-serif text-white mb-2 tracking-tight relative">
                                            <span className="absolute -inset-2 bg-forest-300/20 blur-2xl rounded-full"></span>
                                            <span className="relative bg-gradient-to-br from-forest-200 to-forest-300 text-transparent bg-clip-text [text-shadow:_0_1px_12px_rgb(127_167_123_/_30%)] font-medium">
                                                {user?.displayName ?? 'Admin'}
                                            </span>
                                        </h1>
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
                                    </motion.div>
                                </div>
                            </div>

                            <motion.p
                                className="text-xl text-white/80 text-center mx-auto max-w-2xl mb-16 font-sans tracking-[-0.01em] leading-relaxed"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <span className="bg-gradient-to-r from-white/90 via-white/80 to-white/90 text-transparent bg-clip-text font-light">
                                    Welcome to your command center. Monitor bookings, manage flights, and keep your travel operations running smoothly.
                                </span>
                            </motion.p>

                            {/* Quick stats */}
                            <div className="w-[80%] max-w-[2000px] mx-auto">
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-10 mb-12">
                                    {[
                                        {
                                            value: bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length,
                                            label: 'Active Bookings',
                                            icon: (
                                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            ),
                                            trend: '+12% from last week',
                                            trendUp: true
                                        },
                                        {
                                            value: getRevenueStats().value,
                                            label: 'Monthly Revenue',
                                            icon: (
                                                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            ),
                                            trend: getRevenueStats().trend,
                                            trendUp: getRevenueStats().trendUp
                                        },
                                        {
                                            value: `${getCompletionRate()}%`,
                                            label: 'Completion Rate',
                                            icon: (
                                                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            ),
                                            trend: '3 in last hour',
                                            trendUp: true
                                        },
                                        {
                                            value: ratings.average.toFixed(1),
                                            label: 'Customer Rating',
                                            icon: (
                                                <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                </svg>
                                            ),
                                            trend: `${ratings.trend >= 0 ? '+' : ''}${ratings.trend.toFixed(1)}% this month`,
                                            trendUp: ratings.trend >= 0
                                        }
                                    ].map((stat, index) => (
                                        <motion.div
                                            key={stat.label}
                                            className="bg-white/95 backdrop-blur-lg rounded-2xl px-4 py-3 border border-white/40 hover:bg-white/90 transition-all duration-300 group relative overflow-hidden"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 + 0.5 }}
                                            whileHover={{
                                                scale: 1.04,
                                                transition: {
                                                    duration: 0.2,
                                                    ease: [0.23, 1, 0.32, 1]
                                                }
                                            }}
                                        >
                                            {/* Animated gradient background */}
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                                                initial={{ x: '-100%' }}
                                                animate={{ x: '200%' }}
                                                transition={{
                                                    repeat: Infinity,
                                                    duration: 2,
                                                    ease: "linear",
                                                    delay: index * 0.1
                                                }}
                                            />

                                            {/* Content container with glass effect */}
                                            <div className="relative z-10">
                                                <div className="flex items-center justify-between mb-2">
                                                    <motion.div
                                                        className="p-2.5 rounded-xl bg-gray-50/80 transition-all duration-300"
                                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        {stat.icon}
                                                    </motion.div>
                                                    <motion.div
                                                        className={`text-xs font-medium ${stat.trendUp ? 'text-forest-400' : 'text-red-500'} flex items-center gap-1.5 bg-gray-50/50 px-3 py-1.5 rounded-full`}
                                                        initial={{ scale: 0.8, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        transition={{ delay: index * 0.1 + 0.3 }}
                                                    >
                                                        <motion.div
                                                            animate={{
                                                                y: [0, -2, 0],
                                                                transition: {
                                                                    repeat: Infinity,
                                                                    duration: 2,
                                                                    ease: "easeInOut"
                                                                }
                                                            }}
                                                        >
                                                            {stat.trendUp ? (
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                                                                </svg>
                                                            )}
                                                        </motion.div>
                                                        {stat.trend}
                                                    </motion.div>
                                                </div>
                                                <motion.div
                                                    className="text-xl font-bold text-gray-800 mb-1 transition-colors relative group-hover:text-gold"
                                                    initial={{ scale: 0.9, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: index * 0.1 + 0.2 }}
                                                >
                                                    {stat.value}
                                                    <div className="absolute -inset-1 bg-gold/10 rounded-lg blur-lg group-hover:blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                                                </motion.div>
                                                <motion.div
                                                    className="text-sm text-gray-600 font-medium"
                                                    initial={{ x: -10, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: index * 0.1 + 0.4 }}
                                                >
                                                    {stat.label}
                                                </motion.div>
                                            </div>

                                            {/* Hover effect overlay */}
                                            <motion.div
                                                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                style={{
                                                    background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.1) 0%, transparent 100%)'
                                                }}
                                                initial={false}
                                                whileHover={{ scale: 1.02 }}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
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
                                                                ? 'bg-gradient-to-r from-forest-400 via-forest-400/90 to-forest-400 text-white shadow-lg shadow-forest-400/20 scale-[1.02] hover:shadow-xl hover:shadow-forest-400/25'
                                                                : 'text-gray-500 hover:text-gray-700 hover:bg-black/5'
                                                            }`}
                                                        aria-current={activeTab === tab.id ? 'page' : undefined}
                                                    >
                                                        {/* Background glow effect */}
                                                        {activeTab === tab.id && (
                                                            <div className="absolute inset-0 rounded-xl bg-forest-400/20 blur-xl transition-opacity duration-500" />
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
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
    formatDateShort,
    formatDateNumeric,
    AdvancedFilters
} from '../components/admin';
import { Airport } from '../services/flightService';
import { AdminSettings } from '../components/admin/settings';
import { motion } from 'framer-motion';
import { useAnalytics } from '../hooks/useAnalytics';
import { BookingData, FlightBookingData, HotelBookingData } from '../components/admin/types';
import { CarBookingData } from '../components/admin/types';

import { useAdminStatus } from '../hooks/useAdminStatus';
import { initializeAdminCollection } from '../lib/firebase/adminUtils';

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
    const { isAdmin, isLoading: isAdminLoading } = useAdminStatus();
    const [hasInitialized, setHasInitialized] = useState(false);

    const [activeTab, setActiveTab] = useState<AdminTab>(() => {
        const savedTab = localStorage.getItem('adminActiveTab');
        return (savedTab as AdminTab) ?? 'bookings';
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
    const [advancedFilters, setAdvancedFilters] = useState<Partial<AdvancedFilters>>({});
    const [isLoading, setIsLoading] = useState(true);

    const { ratings } = useAnalytics(bookings);

    // Initialize admin collection on first load (migration helper)
    useEffect(() => {
        const initializeAdmins = async () => {
            if (!user?.email || hasInitialized) return;

            try {
                // Check if this is one of the original admin emails
                const originalAdmins = [
                    import.meta.env.VITE_ADMIN_EMAIL_1,
                    import.meta.env.VITE_ADMIN_EMAIL_2
                ].filter(Boolean);

                if (originalAdmins.includes(user.email)) {
                    await initializeAdminCollection(user.email);
                    setHasInitialized(true);
                }
            } catch (error) {
                console.error('Error initializing admin collection:', error);
            }
        };

        initializeAdmins();
    }, [user?.email, hasInitialized]);

    // Check admin access
    useEffect(() => {
        if (!isAdminLoading && (!user || !isAdmin)) {
            navigate('/');
        }
    }, [user, isAdmin, isAdminLoading, navigate]);

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

    useEffect(() => {
        // Simulate minimum loading time for smooth transition
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    const handleStatusChange = async (bookingId: string, newStatus: string, userId: string, previousStatus?: string) => {
        console.log('Admin - Updating status:', { bookingId, newStatus, userId, previousStatus });
        setUpdateLoading(bookingId);
        try {
            // Find the current booking to update
            const currentBooking = bookings.find(b => b.bookingId === bookingId);
            if (!currentBooking) return;

            // Store the previous status for audit trail and UI state management
            // This is especially important for cancelled bookings to show which step they were cancelled from
            const updateData = {
                status: newStatus,
                previousStatus: previousStatus || currentBooking.status
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

    const handleStatClick = (statType: string, bookingRef?: string) => {
        setActiveTab('bookings');

        // Reset all filters first
        setStatusFilter('all');
        setSearchTerm('');
        setAdvancedFilters({});

        // If we have a specific booking reference, use that
        if (bookingRef) {
            setSearchTerm(bookingRef);
            setAdvancedFilters({
                filterName: 'Booking Reference',
                searchValue: bookingRef
            });
        } else {
            // Set specific filters based on the stat clicked
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const twentyFourHoursAgo = new Date();
            twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

            const now = new Date();

            switch (statType) {
                case 'Active Bookings':
                    setStatusFilter('pending');
                    setAdvancedFilters({
                        status: ['pending', 'confirmed'],
                        filterName: 'Active Bookings'
                    });
                    break;
                case 'Monthly Revenue':
                    setAdvancedFilters({
                        dateRange: {
                            start: formatDateNumeric(thirtyDaysAgo),
                            end: formatDateNumeric(now)
                        },
                        filterName: 'Monthly Revenue',
                        dateRangeLabel: 'Last 30 Days'
                    });
                    break;
                case 'Customer Rating':
                    setStatusFilter('completed');
                    setAdvancedFilters({
                        status: ['completed'],
                        filterName: 'Customer Rating',
                        hasRating: true
                    });
                    break;
                case 'Recent Bookings':
                    setAdvancedFilters({
                        dateRange: {
                            start: formatDateNumeric(twentyFourHoursAgo),
                            end: formatDateNumeric(now)
                        },
                        filterName: 'Recent Bookings',
                        dateRangeLabel: 'Last 24 Hours'
                    });
                    break;
                case 'Completion Rate':
                    setStatusFilter('completed');
                    setAdvancedFilters({
                        status: ['completed'],
                        filterName: 'Completed Bookings'
                    });
                    break;
            }
        }

        // Scroll to the bookings section
        setTimeout(() => {
            const bookingsSection = document.querySelector('.bg-gray-50\\/80');
            if (bookingsSection) {
                bookingsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    const getBookingDate = (booking: BookingData): Date => {
        if (typeof booking.createdAt === 'object' && booking.createdAt?.toDate) {
            return booking.createdAt.toDate();
        }
        return new Date(booking.createdAt as string);
    };

    // Helper functions for filtering
    const matchesStatusFilter = (booking: BookingData, filter: string) => {
        if (filter === 'all') return true;
        if (filter === 'pending') {
            return booking.status === 'pending' || booking.status === 'confirmed';
        }
        return booking.status === filter;
    };

    const isFlightBooking = (booking: BookingData): booking is FlightBookingData => booking.type === 'flight';
    const isHotelBooking = (booking: BookingData): booking is HotelBookingData => booking.type === 'hotel';
    const isCarBooking = (booking: BookingData): booking is CarBookingData => booking.type === 'car';

    const matchesSearchTerm = (booking: BookingData, term: string) => {
        if (!term) return true;
        const searchLower = term.toLowerCase();

        // Location search
        const locationMatch = (() => {
            if (isFlightBooking(booking)) {
                return booking.from && booking.to ?
                    (getLocationSearchText(booking.from) + getLocationSearchText(booking.to)).includes(searchLower) :
                    false;
            } else if (isHotelBooking(booking)) {
                const hotelLocation = typeof booking.location === 'string'
                    ? booking.location
                    : `${booking.location.city}, ${booking.location.country}`;
                return hotelLocation.toLowerCase().includes(searchLower);
            } else if (isCarBooking(booking)) {
                const searchKey = JSON.parse(atob(booking.search_key));
                return (
                    searchKey.pickUpLocation.toLowerCase().includes(searchLower) ||
                    searchKey.dropOffLocation.toLowerCase().includes(searchLower)
                );
            }
            return false;
        })();

        // Details search
        const detailsMatch = (() => {
            const searchableFields = [];

            // Common fields
            searchableFields.push(booking.bookingId.toLowerCase());
            searchableFields.push(booking.status.toLowerCase());

            // Type-specific fields
            if (isFlightBooking(booking)) {
                searchableFields.push(booking.contactName.toLowerCase());
                searchableFields.push(booking.bookingReference.toLowerCase());
            } else if (isHotelBooking(booking)) {
                searchableFields.push(booking.contactName.toLowerCase());
                searchableFields.push(booking.hotelName.toLowerCase());
            } else if (isCarBooking(booking)) {
                searchableFields.push(`${booking.firstName} ${booking.lastName}`.toLowerCase());
                searchableFields.push(booking.vehicle_id.toLowerCase());
            }

            return searchableFields.some(field => field.includes(searchLower));
        })();

        return locationMatch || detailsMatch;
    };

    const matchesAdvancedFilters = (booking: BookingData, filters: Partial<AdvancedFilters>) => {
        if (Object.keys(filters).length === 0) return true;

        // Date range filter applies to all booking types
        if (filters.dateRange) {
            const bookingDate = getBookingDate(booking);
            const startDate = new Date(filters.dateRange.start);
            const endDate = new Date(filters.dateRange.end);
            if (bookingDate < startDate || bookingDate > endDate) return false;
        }

        // Type-specific filters
        if (isFlightBooking(booking)) {
            if (filters.class && booking.class !== filters.class) return false;
            if (filters.tripType && booking.tripType !== filters.tripType) return false;
            if (filters.passengerCount) {
                const count = booking.totalPassengers;
                if (count < filters.passengerCount.min || count > filters.passengerCount.max) return false;
            }
        } else if (isHotelBooking(booking)) {
            if (filters.class && booking.roomType !== filters.class) return false;
            if (filters.passengerCount) {
                const count = booking.numberOfGuests;
                if (count < filters.passengerCount.min || count > filters.passengerCount.max) return false;
            }
        } else if (isCarBooking(booking)) {
            const searchKey = JSON.parse(atob(booking.search_key));
            if (filters.passengerCount) {
                // For cars, we might want to filter by vehicle capacity instead
                const capacity = searchKey.vehicleCapacity ?? 4; // default to 4 if not specified
                if (capacity < filters.passengerCount.min || capacity > filters.passengerCount.max) return false;
            }
        }

        return true;
    };

    // Update the filteredBookings logic
    const filteredBookings = bookings.filter(booking =>
        matchesStatusFilter(booking, statusFilter) &&
        matchesSearchTerm(booking, searchTerm) &&
        matchesAdvancedFilters(booking, advancedFilters)
    );

    // Calculate booking counts by type and status
    const bookingCounts = useMemo(() => {
        const flightBookings = bookings.filter(isFlightBooking);
        const hotelBookings = bookings.filter(isHotelBooking);
        const carBookings = bookings.filter(isCarBooking);

        return {
            active: {
                total: bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length,
                flights: flightBookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length,
                hotels: hotelBookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length,
                cars: carBookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length
            },
            all: {
                total: bookings.length,
                flights: flightBookings.length,
                hotels: hotelBookings.length,
                cars: carBookings.length
            }
        };
    }, [bookings]);

    // Log booking counts for debugging
    useEffect(() => {
        console.log('Booking counts:', bookingCounts);
    }, [bookingCounts]);

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

        const FLIGHT_TICKET_PRICE = 40; // Fixed ticket price as used in analytics

        const calculateMonthRevenue = (startDate: Date, endDate: Date) => {
            return bookings
                .filter(b => {
                    const bookingDate = typeof b.createdAt === 'string'
                        ? new Date(b.createdAt)
                        : b.createdAt.toDate();
                    return bookingDate >= startDate && bookingDate < endDate;
                })
                .reduce((total, booking) => {
                    // Calculate amount based on booking type
                    let amount = 0;
                    if (isFlightBooking(booking)) {
                        amount = FLIGHT_TICKET_PRICE * (Array.isArray(booking.passengers) ? booking.passengers.length : 0);
                    } else if (isHotelBooking(booking)) {
                        amount = booking.totalPrice?.amount || 0;
                    } else if (isCarBooking(booking)) {
                        amount = booking.totalPrice?.amount || 0;
                    }
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
                            onAdvancedFiltersChange={setAdvancedFilters}
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
                                    currentUserId={user?.email ?? undefined}
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

    const STAT_SKELETONS = ['revenue', 'bookings', 'completion', 'new', 'rating'];
    const BOOKING_SKELETONS = ['recent1', 'recent2', 'recent3'];
    const TAB_SKELETONS = ['bookings', 'flights', 'analytics', 'settings'];

    // Add loading skeleton before the main content
    if (isLoading) {
        return (
            <div className="min-h-screen">
                <div className="relative bg-gradient-to-br from-gray-900 to-black overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/0"></div>
                    <div className="relative">
                        <div className="pt-[160px] px-4">
                            <div className="w-[100%] max-w-[1800px] mx-auto">
                                {/* Header Skeleton */}
                                <motion.div
                                    className="w-full flex flex-col items-center justify-center mb-12"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="h-8 w-64 bg-white/10 rounded-lg animate-pulse mb-4"></div>
                                    <div className="h-4 w-96 bg-white/5 rounded animate-pulse"></div>
                                </motion.div>

                                {/* Stats Skeleton */}
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
                                    {STAT_SKELETONS.map((id, index) => (
                                        <motion.div
                                            key={id}
                                            className="bg-white/20 backdrop-blur-md border border-white/20 rounded-xl p-4 relative overflow-hidden"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.3,
                                                delay: index * 0.05,
                                                ease: [0.25, 0.1, 0.25, 1]
                                            }}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="h-10 w-10 bg-white/30 rounded-lg animate-pulse"></div>
                                                <div className="h-4 w-24 bg-white/30 rounded animate-pulse"></div>
                                            </div>
                                            <div className="h-7 w-20 bg-white/30 rounded mb-2 animate-pulse"></div>
                                            <div className="h-4 w-28 bg-white/30 rounded animate-pulse"></div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Recent Bookings Skeleton */}
                                <motion.div
                                    className="w-[100%] max-w-[1800px] mx-auto mb-8"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                >
                                    <div className="bg-white/20 backdrop-blur-md border border-white/20 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-10 w-10 bg-white/30 rounded-lg animate-pulse"></div>
                                                <div className="h-6 w-32 bg-white/30 rounded animate-pulse"></div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            {BOOKING_SKELETONS.map((id, index) => (
                                                <motion.div
                                                    key={id}
                                                    className="flex items-center justify-between p-3 bg-white/10 rounded-lg"
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{
                                                        duration: 0.3,
                                                        delay: 0.3 + index * 0.05,
                                                        ease: [0.25, 0.1, 0.25, 1]
                                                    }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 bg-white/30 rounded-full animate-pulse"></div>
                                                        <div>
                                                            <div className="h-4 w-24 bg-white/30 rounded mb-2 animate-pulse"></div>
                                                            <div className="h-3 w-20 bg-white/30 rounded animate-pulse"></div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <div className="text-right">
                                                            <div className="h-4 w-32 bg-white/30 rounded mb-2 animate-pulse"></div>
                                                            <div className="h-3 w-24 bg-white/30 rounded animate-pulse"></div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Tabs Skeleton */}
                                <motion.div
                                    className="w-[100%] max-w-[1800px] mx-auto mb-10"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: 0.4 }}
                                >
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2">
                                        <div className="flex justify-center gap-2">
                                            {TAB_SKELETONS.map((id, index) => (
                                                <motion.div
                                                    key={id}
                                                    className="h-10 w-32 bg-white/30 rounded-lg animate-pulse"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{
                                                        duration: 0.3,
                                                        delay: 0.5 + index * 0.05,
                                                        ease: [0.25, 0.1, 0.25, 1]
                                                    }}
                                                ></motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                <div className="relative flex flex-col justify-center pt-[160px]">
                    <div className="w-full max-w-[1800px] mx-auto px-2">
                        <div className="w-full max-w-[1800px] mx-auto">
                            <div className="flex flex-col items-center text-center mb-8">
                                <motion.div
                                    className="flex-shrink-0 mb-4 relative group"
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    {user?.photoURL ? (
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gold/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
                                            <motion.img
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                                src={user.photoURL}
                                                alt={user.displayName ?? 'Admin'}
                                                className="w-16 h-16 rounded-full object-cover ring-2 ring-white/20 shadow-xl relative z-10"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName ?? 'Admin')}&background=D4AF37&color=fff&size=80`;
                                                }}
                                            />
                                            <motion.div
                                                className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white z-20"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.5, type: "spring" }}
                                            />
                                            <motion.div
                                                className="absolute -bottom-1 -left-1 bg-forest-400 text-white text-[8px] px-1 py-0.5 rounded-full shadow-lg z-20"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.6 }}
                                            >
                                                Admin
                                            </motion.div>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gold/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                                className="w-16 h-16 rounded-full bg-gold text-white flex items-center justify-center text-2xl font-medium ring-2 ring-white/20 shadow-xl relative z-10"
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
                                                className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white z-20"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.5, type: "spring" }}
                                            />
                                            <motion.div
                                                className="absolute -bottom-1 -left-1 bg-forest-400 text-white text-[8px] px-1 py-0.5 rounded-full shadow-lg z-20"
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
                                        className="bg-white/10 backdrop-blur-md rounded-lg px-6 py-4 border border-white/20 shadow-xl"
                                    >
                                        <span className="font-serif text-lg mb-2 block tracking-[0.03em] text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-300 to-gold-400 uppercase font-medium [text-shadow:_0_1px_1px_rgba(212,175,55,0.3)]">{getGreeting()}</span>
                                        <h1 className="text-2xl md:text-3xl font-serif text-white mb-1.5 tracking-tight relative">
                                            <span className="absolute -inset-1 bg-forest-300/20 blur-xl rounded-full"></span>
                                            <span className="relative bg-gradient-to-br from-forest-200 to-forest-300 text-transparent bg-clip-text [text-shadow:_0_1px_8px_rgb(127_167_123_/_30%)] font-medium">
                                                {user?.displayName ?? 'Admin'}
                                            </span>
                                        </h1>
                                        <motion.div
                                            className="flex items-center justify-center gap-2 flex-wrap"
                                            initial={{ y: -20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.5, delay: 0.3 }}
                                        >
                                            <div className="flex items-center text-white/60 text-xs">
                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                                                {getLastActiveTime()}
                                            </div>
                                            <div className="text-white/60 text-xs">•</div>
                                            <div className="text-white/60 hover:text-white transition-colors text-xs">{user?.email}</div>
                                            <div className="text-white/60 text-xs">•</div>
                                            <div className="text-white/60 text-xs">Last login: {new Date(user?.metadata.lastSignInTime ?? '').toLocaleDateString()}</div>
                                        </motion.div>
                                    </motion.div>
                                </div>
                            </div>

                            <motion.p
                                className="text-sm text-white/80 text-center mx-auto max-w-xl mb-6 font-sans tracking-[-0.01em] leading-relaxed"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <span className="bg-gradient-to-r from-white/90 via-white/80 to-white/90 text-transparent bg-clip-text font-light">
                                    Welcome to your command center. Monitor bookings, manage flights, and keep your travel operations running smoothly.
                                </span>
                            </motion.p>

                            {/* Quick stats */}
                            <motion.div
                                className="w-[100%] max-w-[1800px] mx-auto"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
                                    {[
                                        {
                                            value: bookingCounts.active.total,
                                            label: 'Active Bookings',
                                            icon: (
                                                <svg className="w-5 h-5 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            ),
                                            trend: `${bookingCounts.active.flights} flights, ${bookingCounts.active.hotels} hotels, ${bookingCounts.active.cars} cars`,
                                            trendUp: true
                                        },
                                        {
                                            value: getRevenueStats().value,
                                            label: 'Monthly Revenue',
                                            icon: (
                                                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                        },
                                        {
                                            value: ratings.average.toFixed(1),
                                            label: 'Customer Rating',
                                            icon: (
                                                <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                </svg>
                                            ),
                                            trend: `${ratings.trend >= 0 ? '+' : ''}${ratings.trend.toFixed(1)}% this month`,
                                            trendUp: ratings.trend >= 0
                                        }
                                    ].map((stat, index) => (
                                        <motion.div
                                            key={stat.label}
                                            className="bg-white/20 backdrop-blur-md border border-white/20 rounded-xl p-4 relative group hover:shadow-lg hover:bg-white/30 transition-all duration-200 cursor-pointer"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.4,
                                                delay: index * 0.05,
                                                ease: [0.25, 0.1, 0.25, 1]
                                            }}
                                            whileHover={{
                                                scale: 1.01,
                                                transition: { duration: 0.2 }
                                            }}
                                            onClick={() => handleStatClick(stat.label)}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <motion.div
                                                    className="h-10 w-10 bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center"
                                                    whileHover={{ scale: 1.05 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        {stat.icon.props.children}
                                                    </svg>
                                                </motion.div>
                                                <motion.div
                                                    className="flex items-center text-xs font-medium"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.3, delay: index * 0.05 + 0.1 }}
                                                >
                                                    <span className={`${stat.trendUp ? 'text-forest-300' : 'text-forest-400'} flex items-center gap-0.5`}>
                                                        <motion.div
                                                            animate={{
                                                                y: [0, -2, 0],
                                                            }}
                                                            transition={{
                                                                repeat: Infinity,
                                                                duration: 2.5,
                                                                ease: "easeInOut",
                                                                delay: index * 0.1
                                                            }}
                                                        >
                                                            {stat.trendUp ? (
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                                                                </svg>
                                                            )}
                                                        </motion.div>
                                                        {stat.trend}
                                                    </span>
                                                </motion.div>
                                            </div>
                                            <motion.div
                                                className="text-lg font-bold text-white mb-2"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 + 0.2 }}
                                            >
                                                {typeof stat.value === 'number' && stat.label.includes('Revenue')
                                                    ? `$${stat.value.toLocaleString()}`
                                                    : stat.value}
                                            </motion.div>
                                            <motion.div
                                                className="text-xs text-white/70"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 + 0.3 }}
                                            >
                                                {stat.label}
                                            </motion.div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Recent Bookings */}
                            <motion.div
                                className="w-[100%] max-w-[1800px] mx-auto mb-8"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                            >
                                <motion.div
                                    className="bg-white/20 backdrop-blur-md border border-white/20 rounded-xl p-4 cursor-pointer"
                                    whileHover={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)", scale: 1.01 }}
                                    transition={{ duration: 0.2 }}
                                    onClick={() => handleStatClick('Recent Bookings')}
                                >
                                    <motion.div
                                        className="flex items-center justify-between mb-2"
                                        initial={{ y: -10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.3, delay: 0.6 }}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <motion.div
                                                className="p-1.5 bg-white/30 backdrop-blur-sm rounded-md"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                            >
                                                <svg className="w-4 h-4 text-forest-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </motion.div>
                                            <h3 className="text-sm font-semibold text-white">Recent Bookings</h3>
                                        </div>
                                        <span className="text-forest-300 text-xs">Last 24 hours</span>
                                    </motion.div>
                                    <div className="space-y-2">
                                        {bookings
                                            .filter(booking => booking.status === 'confirmed')
                                            .slice(0, 3)
                                            .map((booking, index) => (
                                                <motion.div
                                                    key={booking.bookingId}
                                                    className="flex items-center justify-between p-2 bg-white/10 rounded-md hover:bg-white/15 transition-colors"
                                                    initial={{ x: -20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{
                                                        duration: 0.3,
                                                        delay: 0.7 + (index * 0.1),
                                                        type: "spring",
                                                        damping: 15
                                                    }}
                                                    whileHover={{
                                                        scale: 1.02,
                                                        transition: { duration: 0.2 }
                                                    }}
                                                    onClick={() => handleStatClick('Recent Bookings',
                                                        isFlightBooking(booking) ? booking.bookingReference : booking.bookingId
                                                    )}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <motion.div
                                                            className="w-6 h-6 bg-forest-400/20 rounded-full flex items-center justify-center"
                                                            whileHover={{ scale: 1.1 }}
                                                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                                        >
                                                            <span className="text-forest-300 text-sm font-semibold">
                                                                {isCarBooking(booking)
                                                                    ? `${booking.firstName[0]}${booking.lastName[0]}`
                                                                    : booking.contactName?.charAt(0) ?? '?'}
                                                            </span>
                                                        </motion.div>
                                                        <div>
                                                            <div className="text-white text-xs font-medium">
                                                                {isCarBooking(booking)
                                                                    ? `${booking.firstName} ${booking.lastName}`
                                                                    : booking.contactName ?? 'Anonymous'}
                                                            </div>
                                                            <div className="text-white/70 text-[10px]">
                                                                {isHotelBooking(booking)
                                                                    ? booking.contactPhone ?? 'No phone'
                                                                    : 'No phone'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right">
                                                            <div className="text-white text-xs font-medium flex items-center gap-1.5">
                                                                {isFlightBooking(booking) ? (
                                                                    <>
                                                                        <span>{booking.from?.city ?? 'Unknown'}</span>
                                                                        <motion.svg
                                                                            className="w-3 h-3 text-forest-300"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            viewBox="0 0 24 24"
                                                                            animate={{ x: [0, 4, 0] }}
                                                                            transition={{
                                                                                duration: 2,
                                                                                repeat: Infinity,
                                                                                ease: "easeInOut"
                                                                            }}
                                                                        >
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                                        </motion.svg>
                                                                        <span>{booking.to?.city ?? 'Unknown'}</span>
                                                                    </>
                                                                ) : (
                                                                    <span>Location details unavailable</span>
                                                                )}
                                                            </div>
                                                            <div className="text-white/70 text-[10px]">
                                                                {isFlightBooking(booking)
                                                                    ? formatDateShort(new Date(booking.departureDate))
                                                                    : isHotelBooking(booking)
                                                                        ? formatDateShort(new Date(booking.checkInDate))
                                                                        : isCarBooking(booking)
                                                                            ? formatDateShort(new Date(JSON.parse(atob(booking.search_key)).pickUpDate))
                                                                            : 'No date'
                                                                }
                                                            </div>
                                                        </div>
                                                        <motion.div
                                                            className="flex items-center gap-1.5 text-forest-300"
                                                            whileHover={{ scale: 1.05 }}
                                                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                                        >
                                                            <span className="text-[10px] font-medium">
                                                                {isFlightBooking(booking)
                                                                    ? `${booking.passengers?.length ?? 0} passengers`
                                                                    : isHotelBooking(booking)
                                                                        ? `${booking.numberOfGuests} guests`
                                                                        : isCarBooking(booking)
                                                                            ? `${JSON.parse(atob(booking.search_key)).passengers} passengers`
                                                                            : 'No passengers'
                                                                }
                                                            </span>
                                                        </motion.div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Navigation Tabs */}
                            <motion.div
                                className="w-[100%] max-w-[1800px] mx-auto mb-10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                            >
                                <motion.div
                                    className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20"
                                    whileHover={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)" }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <nav className="flex flex-col sm:flex-row" aria-label="Admin sections">
                                        <div className="flex overflow-x-auto sm:w-full scrollbar-hide">
                                            <div className="flex-1 flex p-2 gap-2.5 justify-center">
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
                                                ] as AdminTabConfig[]).map((tab, index) => (
                                                    <motion.button
                                                        key={tab.id}
                                                        onClick={() => setActiveTab(tab.id)}
                                                        className={`
                                                            flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 
                                                            rounded-lg font-medium text-sm transition-all duration-200
                                                            ${activeTab === tab.id
                                                                ? 'bg-white/20 text-white shadow-sm backdrop-blur-sm'
                                                                : 'text-white/70 hover:text-white hover:bg-white/10'
                                                            }
                                                        `}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{
                                                            duration: 0.3,
                                                            delay: 0.4 + (index * 0.05),
                                                            ease: [0.25, 0.1, 0.25, 1]
                                                        }}
                                                        whileHover={{ scale: 1.01 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        {tab.icon}
                                                        {tab.label}
                                                        {tab.notifications && tab.notifications > 0 && (
                                                            <motion.span
                                                                className="bg-forest-400/80 backdrop-blur-sm text-white text-xs font-semibold px-2 py-0.5 rounded-full"
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{
                                                                    type: "spring",
                                                                    stiffness: 300,
                                                                    damping: 15,
                                                                    delay: 0.5 + (index * 0.05)
                                                                }}
                                                            >
                                                                {tab.notifications}
                                                            </motion.span>
                                                        )}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>
                                    </nav>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-gray-50/80 backdrop-blur-xl -mt-6 pt-8 relative">
                <div className="max-w-[95%] mx-auto px-2 sm:px-4 pb-8 relative">
                    {error && (
                        <div className="bg-red-50/95 backdrop-blur-xl border border-red-200 text-red-600 rounded-lg p-3 mb-5 shadow-lg animate-fade-in text-sm">
                            {error}
                        </div>
                    )}
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
} 
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/firebase/useAuth';
import { collection, query, orderBy, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import mountainTwo from '../assets/mountain-two.jpg';

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
const BOOKING_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'] as const;
type BookingStatus = typeof BOOKING_STATUSES[number];

interface StatusOption {
    value: BookingStatus;
    label: string;
    icon: JSX.Element;
    className: string;
    step: number;
    colors: {
        active: string;
        completed: string;
        connector: string;
        inactive: string;
        label: string;
    };
}

const STATUS_OPTIONS: StatusOption[] = [
    {
        value: 'pending',
        label: 'Pending',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        className: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
        step: 1,
        colors: {
            active: 'border-amber-500 bg-amber-500 text-white',
            completed: 'border-amber-500 bg-amber-50 text-amber-600',
            connector: 'bg-amber-500',
            inactive: 'border-gray-200 bg-white text-gray-400 hover:border-amber-500 hover:text-amber-500',
            label: 'text-amber-600'
        }
    },
    {
        value: 'confirmed',
        label: 'Confirmed',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
        className: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100',
        step: 2,
        colors: {
            active: 'border-emerald-500 bg-emerald-500 text-white',
            completed: 'border-emerald-500 bg-emerald-50 text-emerald-600',
            connector: 'bg-emerald-500',
            inactive: 'border-gray-200 bg-white text-gray-400 hover:border-emerald-500 hover:text-emerald-500',
            label: 'text-emerald-600'
        }
    },
    {
        value: 'completed',
        label: 'Completed',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        className: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100',
        step: 3,
        colors: {
            active: 'border-blue-500 bg-blue-500 text-white',
            completed: 'border-blue-500 bg-blue-50 text-blue-600',
            connector: 'bg-blue-500',
            inactive: 'border-gray-200 bg-white text-gray-400 hover:border-blue-500 hover:text-blue-500',
            label: 'text-blue-600'
        }
    },
    {
        value: 'cancelled',
        label: 'Cancelled',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        className: 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100',
        step: 4,
        colors: {
            active: 'border-rose-500 bg-rose-500 text-white',
            completed: 'border-rose-500 bg-rose-50 text-rose-600',
            connector: 'bg-rose-500',
            inactive: 'border-gray-200 bg-white text-gray-400 hover:border-rose-500 hover:text-rose-500',
            label: 'text-rose-600'
        }
    }
];

// Add date format helpers
const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).toLowerCase();
};

const formatDateShort = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).toLowerCase();
};

const formatDateNumeric = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).toLowerCase();
};

const getStatusStyle = (status: string) => {
    switch (status) {
        case 'confirmed': return 'bg-green-100 text-green-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        case 'completed': return 'bg-blue-100 text-blue-800';
        default: return 'bg-yellow-100 text-yellow-800';
    }
};

// Color mapping for gradients
const COLOR_MAP: Record<string, string> = {
    'amber-500': 'rgb(245 158 11)',    // Amber
    'emerald-500': 'rgb(16 185 129)',  // Emerald
    'blue-500': 'rgb(59 130 246)',     // Blue
    'rose-500': 'rgb(244 63 94)'       // Rose
};

// Add gradient connector helper function
const getConnectorGradient = (fromStatus: StatusOption, toStatus: StatusOption, isActive: boolean) => {
    if (!isActive) return { backgroundColor: 'rgb(229 231 235)' }; // gray-200

    const fromColorKey = fromStatus.colors.connector.replace('bg-', '');
    const toColorKey = toStatus.colors.connector.replace('bg-', '');

    const fromColor = COLOR_MAP[fromColorKey] || '#e5e7eb';
    const toColor = COLOR_MAP[toColorKey] || '#e5e7eb';

    return {
        backgroundImage: `linear-gradient(to right, ${fromColor}, ${toColor})`
    };
};

// Add helper function for status button styles
const getStatusButtonStyle = (option: StatusOption, isActive: boolean, isPassed: boolean) => {
    if (isActive) return option.colors.active;
    if (isPassed) return option.colors.completed;
    return option.colors.inactive;
};

// Add at the top with other type definitions
type TabType = 'details' | 'passengers' | 'contact';

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
    const [activeTab, setActiveTab] = useState<TabType>('details');

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

                    {/* Updated Search and Filter Section */}
                    <div className="bg-white rounded-xl shadow-md mb-6">
                        <div className="flex flex-col md:flex-row gap-4 p-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search by name, reference, email, date (e.g., Dec 25, 2023)..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
                                    />
                                    <svg
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
                            >
                                <option value="all">All Statuses</option>
                                {BOOKING_STATUSES.map(status => (
                                    <option key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Bookings List */}
                    <div className="space-y-4">
                        {filteredBookings.map(booking => (
                            <motion.div
                                key={booking.bookingId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        {/* Left Section: Date and Main Info */}
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-16 h-16 flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                                                    <span className="text-sm font-medium text-gold/90">
                                                        {new Date(booking.departureDate).toLocaleDateString(undefined, {
                                                            month: 'short'
                                                        })}
                                                    </span>
                                                    <span className="text-xl font-bold text-gray-800">
                                                        {new Date(booking.departureDate).getDate()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-lg font-medium text-gray-800">{booking.contactName}</h3>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(booking.status)}`}>
                                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                    </span>
                                                    <div className="flex items-center gap-1 ml-2 bg-gold/10 text-gold/90 px-2 py-0.5 rounded-full text-xs font-medium">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                        <span>{booking.passengers.length} {booking.passengers.length === 1 ? 'Passenger' : 'Passengers'}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <span>{booking.from} → {booking.to}</span>
                                                    </div>
                                                    <span className="text-gray-400">•</span>
                                                    <div className="flex items-center gap-1">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span>
                                                            {new Date(booking.departureDate).toLocaleTimeString(undefined, {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                            {booking.returnDate && (
                                                                <>
                                                                    {' - '}
                                                                    {new Date(booking.returnDate).toLocaleTimeString(undefined, {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </>
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <div className="flex items-center gap-1 text-gray-500">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                        </svg>
                                                        <span className="capitalize">{booking.class}</span>
                                                    </div>
                                                    <span className="text-gray-400">•</span>
                                                    <div className="flex items-center gap-1 text-gray-500">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        <span className="text-gray-600">Ref: {booking.bookingReference}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Section: Status and Actions */}
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col items-end gap-2">
                                                <div className="flex -space-x-2">
                                                    {booking.passengers.slice(0, 3).map((passenger) => (
                                                        <div
                                                            key={passenger.passportNumber}
                                                            className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center"
                                                            title={passenger.fullName}
                                                        >
                                                            <span className="text-xs font-medium text-gray-700">
                                                                {passenger.fullName.charAt(0)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    {booking.passengers.length > 3 && (
                                                        <div className="w-8 h-8 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center">
                                                            <span className="text-xs font-medium text-gray-600">
                                                                +{booking.passengers.length - 3}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {booking.passengers.length} {booking.passengers.length === 1 ? 'Passenger' : 'Passengers'}
                                                </div>
                                            </div>
                                            <div className="relative group">
                                                <div className="flex items-center gap-1">
                                                    {STATUS_OPTIONS.map((option, index) => {
                                                        const isActive = booking.status === option.value;
                                                        const isPassed = STATUS_OPTIONS.findIndex(opt => opt.value === booking.status) > index;

                                                        return (
                                                            <button
                                                                key={option.value}
                                                                type="button"
                                                                disabled={updateLoading === booking.bookingId}
                                                                className={`relative flex items-center ${index > 0 ? 'ml-8' : ''}`}
                                                                onClick={() => handleStatusChange(booking.bookingId, option.value, booking.userId)}
                                                            >
                                                                {/* Connector Line with Gradient */}
                                                                {index > 0 && (
                                                                    <div className="absolute right-full w-8 h-0.5 -translate-y-1/2 top-1/2">
                                                                        <div
                                                                            className="w-full h-full rounded-full transition-all duration-300"
                                                                            style={{
                                                                                ...(isActive || isPassed
                                                                                    ? getConnectorGradient(STATUS_OPTIONS[index - 1], option, true)
                                                                                    : { backgroundColor: 'rgb(229 231 235)' }
                                                                                )
                                                                            }}
                                                                        />
                                                                    </div>
                                                                )}

                                                                {/* Status Button */}
                                                                <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 
                                                                    ${getStatusButtonStyle(option, isActive, isPassed)} transition-all duration-300`}
                                                                >
                                                                    {option.icon}

                                                                    {/* Status Label */}
                                                                    <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                                                        <span className={`text-xs font-medium ${isActive
                                                                            ? option.colors.label
                                                                            : 'text-gray-500'
                                                                            }`}>
                                                                            {option.label}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {/* Loading Overlay */}
                                                                {updateLoading === booking.bookingId && isActive && (
                                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                                        <div className={`animate-spin rounded-full h-8 w-8 border-2 border-current border-t-transparent`}></div>
                                                                    </div>
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                {/* Tooltip on hover */}
                                                <div className="absolute top-full left-0 mt-8 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 text-sm p-2">
                                                    <p className="text-gray-600">Click to change status</p>
                                                    <p className="text-gray-400 text-xs">Current: {STATUS_OPTIONS.find(opt => opt.value === booking.status)?.label}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setExpandedBookingId(
                                                    expandedBookingId === booking.bookingId ? null : booking.bookingId
                                                )}
                                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <svg
                                                    className={`w-5 h-5 transform transition-transform ${expandedBookingId === booking.bookingId ? 'rotate-180' : ''
                                                        }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {expandedBookingId === booking.bookingId && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="border-t border-gray-100"
                                        >
                                            <div className="p-4 bg-gray-50">
                                                {/* Quick Actions Bar */}
                                                <div className="flex items-center justify-between mb-4 bg-white rounded-lg p-2 shadow-sm">
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            onClick={() => navigator.clipboard.writeText(booking.bookingReference)}
                                                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                                                            title="Copy booking reference"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                            </svg>
                                                            Copy Reference
                                                        </button>
                                                        <div className="h-4 w-px bg-gray-200"></div>
                                                        <button
                                                            onClick={() => window.print()}
                                                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                                                            title="Print booking details"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                                            </svg>
                                                            Print Details
                                                        </button>
                                                        <div className="h-4 w-px bg-gray-200"></div>
                                                        <button
                                                            onClick={async () => {
                                                                const shareData = {
                                                                    title: `Travel Booking - ${booking.bookingReference}`,
                                                                    text: `Check travel booking from ${booking.from} to ${booking.to}`,
                                                                    url: window.location.href
                                                                };
                                                                if (navigator.share) {
                                                                    try {
                                                                        await navigator.share(shareData);
                                                                    } catch (error) {
                                                                        if ((error as Error).name !== 'AbortError') {
                                                                            console.error('Error sharing:', error);
                                                                        }
                                                                    }
                                                                }
                                                            }}
                                                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                                                            title="Share booking"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                                            </svg>
                                                            Share
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(booking.status)}`}>
                                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Tabs Navigation */}
                                                <div className="bg-white rounded-lg shadow-sm mb-4">
                                                    <div className="border-b border-gray-200">
                                                        <nav className="flex space-x-8 px-4" aria-label="Booking Information">
                                                            <button
                                                                onClick={() => setActiveTab('details')}
                                                                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'details'
                                                                    ? 'border-gold text-gold'
                                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                                    }`}
                                                            >
                                                                Trip Details
                                                            </button>
                                                            <button
                                                                onClick={() => setActiveTab('passengers')}
                                                                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'passengers'
                                                                    ? 'border-gold text-gold'
                                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                                    }`}
                                                            >
                                                                Passengers
                                                            </button>
                                                            <button
                                                                onClick={() => setActiveTab('contact')}
                                                                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'contact'
                                                                    ? 'border-gold text-gold'
                                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                                    }`}
                                                            >
                                                                Contact Info
                                                            </button>
                                                        </nav>
                                                    </div>
                                                </div>

                                                <AnimatePresence mode="wait">
                                                    {activeTab === 'details' && (
                                                        <motion.div
                                                            key="details"
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -20 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            {/* Journey Timeline */}
                                                            <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                                                                <div className="flex items-center gap-2 mb-4">
                                                                    <div className="p-2 bg-gold/10 rounded-lg">
                                                                        <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                        </svg>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-medium text-gray-900">Journey Timeline</h4>
                                                                        <p className="text-xs text-gray-500">Travel schedule</p>
                                                                    </div>
                                                                </div>
                                                                <div className="relative">
                                                                    <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200"></div>
                                                                    <div className="space-y-6">
                                                                        <div className="relative flex items-center gap-4">
                                                                            <div className="w-16 flex-shrink-0 text-xs text-gray-500">
                                                                                {new Date(booking.departureDate).toLocaleTimeString(undefined, {
                                                                                    hour: '2-digit',
                                                                                    minute: '2-digit'
                                                                                })}
                                                                            </div>
                                                                            <div className="w-4 h-4 rounded-full bg-gold flex-shrink-0 relative z-10"></div>
                                                                            <div className="flex-1 bg-gold/5 rounded-lg p-3">
                                                                                <div className="flex items-center justify-between">
                                                                                    <div>
                                                                                        <p className="font-medium text-gray-900">{booking.from}</p>
                                                                                        <p className="text-sm text-gray-500">Departure</p>
                                                                                    </div>
                                                                                    <span className="text-xs px-2 py-0.5 bg-gold/10 text-gold rounded-full">
                                                                                        {new Date(booking.departureDate).toLocaleDateString(undefined, {
                                                                                            weekday: 'short',
                                                                                            month: 'short',
                                                                                            day: 'numeric'
                                                                                        })}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="relative flex items-center gap-4">
                                                                            <div className="w-16 flex-shrink-0 text-xs text-gray-500">
                                                                                {new Date(booking.departureDate).toLocaleTimeString(undefined, {
                                                                                    hour: '2-digit',
                                                                                    minute: '2-digit'
                                                                                })}
                                                                            </div>
                                                                            <div className="w-4 h-4 rounded-full bg-emerald-500 flex-shrink-0 relative z-10"></div>
                                                                            <div className="flex-1 bg-emerald-50 rounded-lg p-3">
                                                                                <div className="flex items-center justify-between">
                                                                                    <div>
                                                                                        <p className="font-medium text-gray-900">{booking.to}</p>
                                                                                        <p className="text-sm text-gray-500">Arrival</p>
                                                                                    </div>
                                                                                    <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full">
                                                                                        {new Date(booking.departureDate).toLocaleDateString(undefined, {
                                                                                            weekday: 'short',
                                                                                            month: 'short',
                                                                                            day: 'numeric'
                                                                                        })}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {booking.returnDate && (
                                                                            <>
                                                                                <div className="relative flex items-center gap-4">
                                                                                    <div className="w-16 flex-shrink-0 text-xs text-gray-500">
                                                                                        {new Date(booking.returnDate).toLocaleTimeString(undefined, {
                                                                                            hour: '2-digit',
                                                                                            minute: '2-digit'
                                                                                        })}
                                                                                    </div>
                                                                                    <div className="w-4 h-4 rounded-full bg-blue-500 flex-shrink-0 relative z-10"></div>
                                                                                    <div className="flex-1 bg-blue-50 rounded-lg p-3">
                                                                                        <div className="flex items-center justify-between">
                                                                                            <div>
                                                                                                <p className="font-medium text-gray-900">{booking.to}</p>
                                                                                                <p className="text-sm text-gray-500">Return Departure</p>
                                                                                            </div>
                                                                                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">
                                                                                                {new Date(booking.returnDate).toLocaleDateString(undefined, {
                                                                                                    weekday: 'short',
                                                                                                    month: 'short',
                                                                                                    day: 'numeric'
                                                                                                })}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="relative flex items-center gap-4">
                                                                                    <div className="w-16 flex-shrink-0 text-xs text-gray-500">
                                                                                        {new Date(booking.returnDate).toLocaleTimeString(undefined, {
                                                                                            hour: '2-digit',
                                                                                            minute: '2-digit'
                                                                                        })}
                                                                                    </div>
                                                                                    <div className="w-4 h-4 rounded-full bg-indigo-500 flex-shrink-0 relative z-10"></div>
                                                                                    <div className="flex-1 bg-indigo-50 rounded-lg p-3">
                                                                                        <div className="flex items-center justify-between">
                                                                                            <div>
                                                                                                <p className="font-medium text-gray-900">{booking.from}</p>
                                                                                                <p className="text-sm text-gray-500">Return Arrival</p>
                                                                                            </div>
                                                                                            <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full">
                                                                                                {new Date(booking.returnDate).toLocaleDateString(undefined, {
                                                                                                    weekday: 'short',
                                                                                                    month: 'short',
                                                                                                    day: 'numeric'
                                                                                                })}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Trip Details Grid */}
                                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                                                {/* Trip Details */}
                                                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                                                    <div className="flex items-center gap-2 mb-3">
                                                                        <div className="p-2 bg-gold/10 rounded-lg">
                                                                            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                                            </svg>
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="font-medium text-gray-900">Trip Details</h4>
                                                                            <p className="text-xs text-gray-500">Booking information and route</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-3 text-sm">
                                                                        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                                                            <span className="text-gray-600">Reference</span>
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="font-medium text-gray-900">{booking.bookingReference}</span>
                                                                                <button
                                                                                    onClick={() => navigator.clipboard.writeText(booking.bookingReference)}
                                                                                    className="text-gray-400 hover:text-gray-600"
                                                                                >
                                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                                                    </svg>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                                                            <span className="text-gray-600">Trip Type</span>
                                                                            <span className="font-medium text-gray-900 capitalize">{booking.tripType}</span>
                                                                        </div>
                                                                        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                                                            <span className="text-gray-600">Class</span>
                                                                            <span className="font-medium text-gray-900 capitalize">{booking.class}</span>
                                                                        </div>
                                                                        <div className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                                                            <div className="flex items-center justify-between mb-2">
                                                                                <span className="text-gray-600">Route</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="flex-1 text-right">
                                                                                    <span className="font-medium text-gray-900">{booking.from}</span>
                                                                                    <p className="text-xs text-gray-500">Departure</p>
                                                                                </div>
                                                                                <div className="flex-shrink-0">
                                                                                    <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H7" />
                                                                                    </svg>
                                                                                </div>
                                                                                <div className="flex-1">
                                                                                    <span className="font-medium text-gray-900">{booking.to}</span>
                                                                                    <p className="text-xs text-gray-500">Arrival</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Travel Dates */}
                                                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                                                    <div className="flex items-center gap-2 mb-3">
                                                                        <div className="p-2 bg-gold/10 rounded-lg">
                                                                            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                            </svg>
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="font-medium text-gray-900">Travel Dates</h4>
                                                                            <p className="text-xs text-gray-500">Departure and return schedule</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-4 text-sm">
                                                                        <div className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                                                            <div className="flex items-center justify-between mb-2">
                                                                                <span className="text-gray-600">Departure</span>
                                                                                <span className="text-xs text-gold font-medium px-2 py-0.5 bg-gold/10 rounded-full">Outbound</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="flex-1">
                                                                                    <div className="font-medium text-gray-900">
                                                                                        {new Date(booking.departureDate).toLocaleDateString(undefined, {
                                                                                            weekday: 'short',
                                                                                            month: 'short',
                                                                                            day: 'numeric'
                                                                                        })}
                                                                                    </div>
                                                                                    <div className="text-sm text-gray-600 flex items-center gap-1">
                                                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                        </svg>
                                                                                        {new Date(booking.departureDate).toLocaleTimeString(undefined, {
                                                                                            hour: '2-digit',
                                                                                            minute: '2-digit'
                                                                                        })}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {booking.returnDate && (
                                                                            <div className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                                                                <div className="flex items-center justify-between mb-2">
                                                                                    <span className="text-gray-600">Return</span>
                                                                                    <span className="text-xs text-emerald-600 font-medium px-2 py-0.5 bg-emerald-50 rounded-full">Inbound</span>
                                                                                </div>
                                                                                <div className="flex items-center gap-3">
                                                                                    <div className="flex-1">
                                                                                        <div className="font-medium text-gray-900">
                                                                                            {new Date(booking.returnDate).toLocaleDateString(undefined, {
                                                                                                weekday: 'short',
                                                                                                month: 'short',
                                                                                                day: 'numeric'
                                                                                            })}
                                                                                        </div>
                                                                                        <div className="text-sm text-gray-600 flex items-center gap-1">
                                                                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                            </svg>
                                                                                            {new Date(booking.returnDate).toLocaleTimeString(undefined, {
                                                                                                hour: '2-digit',
                                                                                                minute: '2-digit'
                                                                                            })}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Additional Details */}
                                                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                                                    <div className="flex items-center gap-2 mb-3">
                                                                        <div className="p-2 bg-gold/10 rounded-lg">
                                                                            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                            </svg>
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="font-medium text-gray-900">Additional Information</h4>
                                                                            <p className="text-xs text-gray-500">Extra booking details</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-3 text-sm">
                                                                        <div className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                                                            <span className="text-gray-600">Booking Status</span>
                                                                            <div className="mt-1 flex items-center gap-2">
                                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(booking.status)}`}>
                                                                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                                                            <span className="text-gray-600">Created On</span>
                                                                            <p className="font-medium text-gray-900">
                                                                                {typeof booking.createdAt === 'object' && 'toDate' in booking.createdAt
                                                                                    ? booking.createdAt.toDate().toLocaleDateString(undefined, {
                                                                                        weekday: 'long',
                                                                                        year: 'numeric',
                                                                                        month: 'long',
                                                                                        day: 'numeric'
                                                                                    })
                                                                                    : new Date(booking.createdAt).toLocaleDateString(undefined, {
                                                                                        weekday: 'long',
                                                                                        year: 'numeric',
                                                                                        month: 'long',
                                                                                        day: 'numeric'
                                                                                    })}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}

                                                    {activeTab === 'passengers' && (
                                                        <motion.div
                                                            key="passengers"
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -20 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            {/* Passenger Information */}
                                                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                                                <div className="flex items-center gap-2 mb-4">
                                                                    <div className="p-2 bg-gold/10 rounded-lg">
                                                                        <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                                        </svg>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-medium text-gray-900">Passengers</h4>
                                                                        <p className="text-xs text-gray-500">{booking.passengers.length} total passengers</p>
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    {booking.passengers.map((passenger) => (
                                                                        <div
                                                                            key={`${passenger.passportNumber}-${passenger.fullName}`}
                                                                            className="bg-gray-50 rounded-lg p-4 hover:shadow-sm transition-shadow"
                                                                        >
                                                                            <div className="flex items-center gap-3 mb-3">
                                                                                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                                                                                    <span className="text-sm font-medium text-gold">
                                                                                        {passenger.fullName.split(' ').map(n => n[0]).join('')}
                                                                                    </span>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="font-medium text-gray-900">{passenger.fullName}</p>
                                                                                    <p className="text-sm text-gray-500 capitalize">{passenger.type} Passenger</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="space-y-2 text-sm text-gray-600">
                                                                                <p><span className="font-medium">Nationality:</span> {passenger.nationality}</p>
                                                                                <p><span className="font-medium">Passport:</span> {passenger.passportNumber}</p>
                                                                                <p><span className="font-medium">Passport Expiry:</span> {passenger.passportExpiry}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}

                                                    {activeTab === 'contact' && (
                                                        <motion.div
                                                            key="contact"
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -20 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            {/* Contact Information */}
                                                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                                                <div className="flex items-center gap-2 mb-4">
                                                                    <div className="p-2 bg-gold/10 rounded-lg">
                                                                        <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                        </svg>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-medium text-gray-900">Contact Information</h4>
                                                                        <p className="text-xs text-gray-500">Primary contact details</p>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-3 text-sm">
                                                                    <div className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                                                                                <span className="text-sm font-medium text-gold">
                                                                                    {booking.contactName.split(' ').map(n => n[0]).join('')}
                                                                                </span>
                                                                            </div>
                                                                            <div>
                                                                                <p className="font-medium text-gray-900">{booking.contactName}</p>
                                                                                <p className="text-xs text-gray-500">Primary Contact</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                                                                        <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                                        </svg>
                                                                        <span className="text-gray-600 group-hover:text-gray-900">{booking.contactEmail}</span>
                                                                        <button
                                                                            onClick={() => navigator.clipboard.writeText(booking.contactEmail)}
                                                                            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        >
                                                                            <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                                                                        <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                        </svg>
                                                                        <span className="text-gray-600 group-hover:text-gray-900">{booking.contactPhone}</span>
                                                                        <button
                                                                            onClick={() => navigator.clipboard.writeText(booking.contactPhone)}
                                                                            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        >
                                                                            <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
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
import { BookingData } from './types';
import { BookingTrendsChart } from './BookingTrendsChart';

interface AdminAnalyticsProps {
    bookings: BookingData[];
}

export function AdminAnalytics({ bookings }: AdminAnalyticsProps) {
    // Calculate revenue metrics
    const calculateRevenue = () => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const TICKET_PRICE = 40; // Price per ticket in USD

        const revenueData = bookings.reduce((acc, booking) => {
            const bookingDate = typeof booking.createdAt === 'string'
                ? new Date(booking.createdAt)
                : booking.createdAt.toDate();
            const isCurrentMonth = bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
            const isLastYear = bookingDate.getFullYear() === currentYear - 1;
            const isCurrentYear = bookingDate.getFullYear() === currentYear;

            // Calculate total amount for this booking based on number of passengers
            const amount = TICKET_PRICE * booking.passengers.length;

            return {
                total: acc.total + amount,
                monthly: isCurrentMonth ? acc.monthly + amount : acc.monthly,
                average: bookings.length > 0 ? (acc.total + amount) / bookings.length : 0,
                lastYear: isLastYear ? acc.lastYear + amount : acc.lastYear,
                currentYear: isCurrentYear ? acc.currentYear + amount : acc.currentYear,
                totalPassengers: acc.totalPassengers + booking.passengers.length,
                averagePassengers: acc.totalPassengers / bookings.length
            };
        }, {
            total: 0,
            monthly: 0,
            average: 0,
            lastYear: 0,
            currentYear: 0,
            totalPassengers: 0,
            averagePassengers: 0
        });

        // Calculate year-over-year growth
        const yoyGrowth = revenueData.lastYear > 0
            ? ((revenueData.currentYear - revenueData.lastYear) / revenueData.lastYear) * 100
            : 0;

        return {
            ...revenueData,
            yoyGrowth
        };
    };

    const revenue = calculateRevenue();

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Format percentage
    const formatPercentage = (value: number) => {
        return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
    };

    // Calculate booking trends
    const getRecentTrends = () => {
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);

        const recentBookings = bookings.filter(booking => {
            const bookingDate = typeof booking.createdAt === 'string'
                ? new Date(booking.createdAt)
                : booking.createdAt.toDate();
            return bookingDate > last30Days;
        });

        return {
            total: recentBookings.length,
            completed: recentBookings.filter(b => b.status === 'completed').length,
            cancelled: recentBookings.filter(b => b.status === 'cancelled').length,
            pending: recentBookings.filter(b => b.status === 'pending').length
        };
    };

    const trends = getRecentTrends();

    // Get popular destinations
    const getPopularDestinations = () => {
        const destinations = bookings.reduce((acc, booking) => {
            const dest = booking.to;
            acc[dest] = (acc[dest] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(destinations)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
    };

    const popularDestinations = getPopularDestinations();

    return (
        <div className="space-y-6">
            {/* Revenue Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Total Revenue</h3>
                        <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                        {formatCurrency(revenue.total)}
                    </div>
                    <p className="text-sm text-gray-600">Lifetime revenue</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Monthly Revenue</h3>
                        <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                        {formatCurrency(revenue.monthly)}
                    </div>
                    <p className="text-sm text-gray-600">Current month</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">YoY Growth</h3>
                        <span className={`p-2 rounded-lg ${revenue.yoyGrowth >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {revenue.yoyGrowth >= 0 ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                                )}
                            </svg>
                        </span>
                    </div>
                    <div className={`text-3xl font-bold mb-2 ${revenue.yoyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPercentage(revenue.yoyGrowth)}
                    </div>
                    <p className="text-sm text-gray-600">Year over year</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Avg. Passengers</h3>
                        <span className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                        {revenue.averagePassengers.toFixed(1)}
                    </div>
                    <p className="text-sm text-gray-600">Per booking</p>
                </div>
            </div>

            {/* Recent Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Booking Trends Chart */}
                <BookingTrendsChart bookings={bookings} />

                {/* Popular Destinations */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">Popular Destinations</h3>
                    <div className="space-y-4">
                        {popularDestinations.map(([destination, count]) => (
                            <div key={destination} className="flex items-center">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-gray-900">{destination}</span>
                                        <span className="text-sm text-gray-600">{count} bookings</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className="bg-gold h-2 rounded-full"
                                            style={{
                                                width: `${(count / popularDestinations[0][1]) * 100}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 30-Day Performance */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Booking Status Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                            <span className="text-gray-600">Completed</span>
                        </div>
                        <span className="text-2xl font-medium text-gray-900">{trends.completed}</span>
                        <div className="text-sm text-gray-500">bookings</div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                            <span className="text-gray-600">Pending</span>
                        </div>
                        <span className="text-2xl font-medium text-gray-900">{trends.pending}</span>
                        <div className="text-sm text-gray-500">bookings</div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-3 h-3 rounded-full bg-red-500"></span>
                            <span className="text-gray-600">Cancelled</span>
                        </div>
                        <span className="text-2xl font-medium text-gray-900">{trends.cancelled}</span>
                        <div className="text-sm text-gray-500">bookings</div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                            <span className="text-gray-600">Total</span>
                        </div>
                        <span className="text-2xl font-medium text-gray-900">{trends.total}</span>
                        <div className="text-sm text-gray-500">bookings</div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
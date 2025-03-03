import React, { Suspense } from 'react';
import { BookingData } from '../types';
import { BookingTrendsChart } from './AdminBookingTrendsChart';
import { StatCard } from './AdminStatCard';
import { PopularDestinations } from './AdminPopularDestinations';
import { BookingStatusOverview } from './AdminBookingStatusOverview';
import { RevenueIcon, TrendUpIcon, TrendDownIcon, CalendarIcon } from '../icons/StatIcons';
import { useAnalytics } from '../../../hooks/useAnalytics';
import { ErrorBoundary } from '../../../components/common/ErrorBoundary';
import { StatCardSkeleton, PopularDestinationsSkeleton, BookingStatusSkeleton } from '../../../components/common/Skeleton';

interface AdminAnalyticsProps {
    bookings: BookingData[];
    isLoading?: boolean;
}

function StatCards({ revenue, formatCurrency, formatPercentage }: {
    revenue: ReturnType<typeof useAnalytics>['revenue'];
    formatCurrency: (amount: number) => string;
    formatPercentage: (value: number) => string;
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <StatCard
                title="Total Revenue"
                value={formatCurrency(revenue.total)}
                subtitle="Lifetime revenue"
                icon={<RevenueIcon />}
                details={[
                    { label: 'Average per booking', value: formatCurrency(revenue.average) },
                    { label: 'This month', value: formatCurrency(revenue.monthly) },
                    { label: 'Total bookings', value: revenue.currentYearBookings + revenue.previousYearBookings }
                ]}
            />
            <StatCard
                title="Monthly Revenue"
                value={formatCurrency(revenue.monthly)}
                subtitle="Current month"
                icon={<TrendUpIcon />}
                details={[
                    { label: 'Bookings this month', value: revenue.currentMonthBookings },
                    { label: 'Average per booking', value: formatCurrency(revenue.monthly / (revenue.currentMonthBookings || 1)) },
                    { label: 'vs. last month', value: formatPercentage(revenue.monthlyGrowth) }
                ]}
            />
            <StatCard
                title="Yearly Growth"
                value={formatPercentage(revenue.yearlyGrowth)}
                subtitle="vs. last year"
                icon={revenue.yearlyGrowth >= 0 ? <TrendUpIcon /> : <TrendDownIcon />}
                trend={{ value: revenue.yearlyGrowth, isPositive: revenue.yearlyGrowth >= 0 }}
                details={[
                    { label: 'This year bookings', value: revenue.currentYearBookings },
                    { label: 'Last year bookings', value: revenue.previousYearBookings },
                    { label: 'Growth rate', value: formatPercentage(revenue.yearlyGrowth) }
                ]}
            />
            <StatCard
                title="Monthly Growth"
                value={formatPercentage(revenue.monthlyGrowth)}
                subtitle="vs. last month"
                icon={revenue.monthlyGrowth >= 0 ? <TrendUpIcon /> : <TrendDownIcon />}
                trend={{ value: revenue.monthlyGrowth, isPositive: revenue.monthlyGrowth >= 0 }}
                details={[
                    { label: 'This month bookings', value: revenue.currentMonthBookings },
                    { label: 'Last month bookings', value: revenue.previousMonthBookings },
                    { label: 'Growth rate', value: formatPercentage(revenue.monthlyGrowth) }
                ]}
            />
            <StatCard
                title="Weekly Growth"
                value={formatPercentage(revenue.weeklyGrowth)}
                subtitle="vs. last week"
                icon={revenue.weeklyGrowth >= 0 ? <TrendUpIcon /> : <TrendDownIcon />}
                trend={{ value: revenue.weeklyGrowth, isPositive: revenue.weeklyGrowth >= 0 }}
                details={[
                    { label: 'This week bookings', value: revenue.currentWeekBookings },
                    { label: 'Last week bookings', value: revenue.previousWeekBookings },
                    { label: 'Growth rate', value: formatPercentage(revenue.weeklyGrowth) }
                ]}
            />
            <StatCard
                title="Bookings Today"
                value={revenue.bookingsToday}
                subtitle="New bookings today"
                icon={<CalendarIcon />}
                details={[
                    { label: 'This week total', value: revenue.currentWeekBookings },
                    { label: 'This month total', value: revenue.currentMonthBookings },
                    { label: 'Daily average', value: (revenue.currentMonthBookings / 30).toFixed(1) }
                ]}
            />
        </div>
    );
}

function LoadingState() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                {[...Array(6)].map((_, i) => (
                    <StatCardSkeleton key={`skeleton-stat-${i + 1}`} />
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PopularDestinationsSkeleton />
                <PopularDestinationsSkeleton />
            </div>
            <BookingStatusSkeleton />
        </div>
    );
}

export function AdminAnalytics({ bookings, isLoading = false }: AdminAnalyticsProps) {
    const { revenue, trends, popularDestinations, bookingTypes } = useAnalytics(bookings);

    // Format currency
    const formatCurrency = React.useMemo(() => (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }, []);

    // Format percentage
    const formatPercentage = React.useMemo(() => (value: number) => {
        return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
    }, []);

    if (isLoading) {
        return <LoadingState />;
    }

    return (
        <div className="space-y-6">
            <ErrorBoundary>
                <StatCards
                    revenue={revenue}
                    formatCurrency={formatCurrency}
                    formatPercentage={formatPercentage}
                />
            </ErrorBoundary>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Type Distribution</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-700 font-medium">Flight Bookings</p>
                            <p className="text-2xl font-bold text-blue-900">{bookingTypes.flights}</p>
                            <p className="text-xs text-blue-600">{bookingTypes.flights > 0 ? `${Math.round((bookingTypes.flights / (bookingTypes.flights + bookingTypes.hotels + bookingTypes.cars)) * 100)}%` : '0%'} of total</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                    <div className="bg-forest-50 rounded-lg p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-forest-700 font-medium">Hotel Bookings</p>
                            <p className="text-2xl font-bold text-forest-900">{bookingTypes.hotels}</p>
                            <p className="text-xs text-forest-600">{bookingTypes.hotels > 0 ? `${Math.round((bookingTypes.hotels / (bookingTypes.flights + bookingTypes.hotels + bookingTypes.cars)) * 100)}%` : '0%'} of total</p>
                        </div>
                        <div className="w-12 h-12 bg-forest-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                    </div>
                    <div className="bg-gold-50 rounded-lg p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gold-700 font-medium">Car Bookings</p>
                            <p className="text-2xl font-bold text-gold-900">{bookingTypes.cars}</p>
                            <p className="text-xs text-gold-600">{bookingTypes.cars > 0 ? `${Math.round((bookingTypes.cars / (bookingTypes.flights + bookingTypes.hotels + bookingTypes.cars)) * 100)}%` : '0%'} of total</p>
                        </div>
                        <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ErrorBoundary>
                    <Suspense fallback={<PopularDestinationsSkeleton />}>
                        <BookingTrendsChart bookings={bookings} />
                    </Suspense>
                </ErrorBoundary>

                <ErrorBoundary>
                    <PopularDestinations destinations={popularDestinations} />
                </ErrorBoundary>
            </div>

            <ErrorBoundary>
                <BookingStatusOverview trends={trends} />
            </ErrorBoundary>
        </div>
    );
} 
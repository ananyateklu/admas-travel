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
    const { revenue, trends, popularDestinations } = useAnalytics(bookings);

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
import { useMemo } from 'react';
import { BookingData } from '../components/admin/types';

interface DateRanges {
    now: Date;
    startOfCurrentWeek: Date;
    startOfPreviousWeek: Date;
    startOfCurrentMonth: Date;
    startOfPreviousMonth: Date;
    startOfCurrentYear: Date;
    startOfPreviousYear: Date;
}

interface AnalyticsData {
    revenue: {
        total: number;
        monthly: number;
        average: number;
        weeklyGrowth: number;
        monthlyGrowth: number;
        yearlyGrowth: number;
        bookingsToday: number;
        currentWeekBookings: number;
        previousWeekBookings: number;
        currentMonthBookings: number;
        previousMonthBookings: number;
        currentYearBookings: number;
        previousYearBookings: number;
    };
    trends: {
        total: number;
        completed: number;
        cancelled: number;
        pending: number;
    };
    popularDestinations: [string, number][];
}

export function useAnalytics(bookings: BookingData[]): AnalyticsData {
    // Safely parse date with error handling
    const parseDate = (dateInput: string | { toDate: () => Date }): Date | null => {
        try {
            if (typeof dateInput === 'string') {
                const date = new Date(dateInput);
                return isNaN(date.getTime()) ? null : date;
            }
            return dateInput.toDate();
        } catch (error) {
            console.error('Error parsing date:', error);
            return null;
        }
    };

    // Get start of day in local timezone
    const getStartOfDay = (date: Date): Date => {
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0);
        return newDate;
    };

    const dateRanges = useMemo((): DateRanges => {
        const now = new Date();
        const startOfToday = getStartOfDay(now);

        // Weekly calculations (using Monday as start of week)
        const startOfCurrentWeek = new Date(startOfToday);
        startOfCurrentWeek.setDate(startOfToday.getDate() - ((startOfToday.getDay() + 6) % 7));

        const startOfPreviousWeek = new Date(startOfCurrentWeek);
        startOfPreviousWeek.setDate(startOfCurrentWeek.getDate() - 7);

        // Monthly calculations
        const startOfCurrentMonth = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1);
        const startOfPreviousMonth = new Date(startOfToday.getFullYear(), startOfToday.getMonth() - 1, 1);

        // Yearly calculations
        const startOfCurrentYear = new Date(startOfToday.getFullYear(), 0, 1);
        const startOfPreviousYear = new Date(startOfToday.getFullYear() - 1, 0, 1);

        return {
            now: startOfToday,
            startOfCurrentWeek,
            startOfPreviousWeek,
            startOfCurrentMonth,
            startOfPreviousMonth,
            startOfCurrentYear,
            startOfPreviousYear
        };
    }, []);

    const revenue = useMemo(() => {
        const TICKET_PRICE = 40;

        const getBookingPeriods = (bookingDate: Date | null, dates: DateRanges) => {
            if (!bookingDate) return {
                isCurrentMonth: false,
                isPreviousMonth: false,
                isCurrentWeek: false,
                isPreviousWeek: false,
                isCurrentYear: false,
                isPreviousYear: false,
                isToday: false
            };

            return {
                isCurrentMonth: bookingDate >= dates.startOfCurrentMonth && bookingDate < dates.now,
                isPreviousMonth: bookingDate >= dates.startOfPreviousMonth && bookingDate < dates.startOfCurrentMonth,
                isCurrentWeek: bookingDate >= dates.startOfCurrentWeek && bookingDate < dates.now,
                isPreviousWeek: bookingDate >= dates.startOfPreviousWeek && bookingDate < dates.startOfCurrentWeek,
                isCurrentYear: bookingDate >= dates.startOfCurrentYear && bookingDate < dates.now,
                isPreviousYear: bookingDate >= dates.startOfPreviousYear && bookingDate < dates.startOfCurrentYear,
                isToday: getStartOfDay(bookingDate).getTime() === dates.now.getTime()
            };
        };

        const revenueData = bookings.reduce((acc, booking) => {
            const bookingDate = parseDate(booking.createdAt);
            if (!bookingDate) return acc;

            const periods = getBookingPeriods(bookingDate, dateRanges);
            const amount = TICKET_PRICE * (Array.isArray(booking.passengers) ? booking.passengers.length : 0);

            return {
                total: acc.total + amount,
                monthly: periods.isCurrentMonth ? acc.monthly + amount : acc.monthly,
                average: bookings.length > 0 ? (acc.total + amount) / bookings.length : 0,
                currentWeekBookings: acc.currentWeekBookings + (periods.isCurrentWeek ? 1 : 0),
                previousWeekBookings: acc.previousWeekBookings + (periods.isPreviousWeek ? 1 : 0),
                currentMonthBookings: acc.currentMonthBookings + (periods.isCurrentMonth ? 1 : 0),
                previousMonthBookings: acc.previousMonthBookings + (periods.isPreviousMonth ? 1 : 0),
                currentYearBookings: acc.currentYearBookings + (periods.isCurrentYear ? 1 : 0),
                previousYearBookings: acc.previousYearBookings + (periods.isPreviousYear ? 1 : 0),
                bookingsToday: acc.bookingsToday + (periods.isToday ? 1 : 0)
            };
        }, {
            total: 0,
            monthly: 0,
            average: 0,
            currentWeekBookings: 0,
            previousWeekBookings: 0,
            currentMonthBookings: 0,
            previousMonthBookings: 0,
            currentYearBookings: 0,
            previousYearBookings: 0,
            bookingsToday: 0
        });

        const calculateGrowth = (current: number, previous: number) => {
            if (previous > 0) {
                return ((current - previous) / previous) * 100;
            }
            return current > 0 ? 100 : 0;
        };

        const weeklyGrowth = calculateGrowth(revenueData.currentWeekBookings, revenueData.previousWeekBookings);
        const monthlyGrowth = calculateGrowth(revenueData.currentMonthBookings, revenueData.previousMonthBookings);
        const yearlyGrowth = calculateGrowth(revenueData.currentYearBookings, revenueData.previousYearBookings);

        return {
            ...revenueData,
            weeklyGrowth,
            monthlyGrowth,
            yearlyGrowth
        };
    }, [bookings, dateRanges]);

    const trends = useMemo(() => {
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);

        const recentBookings = bookings.filter(booking => {
            const bookingDate = parseDate(booking.createdAt);
            return bookingDate ? bookingDate > last30Days : false;
        });

        return {
            total: recentBookings.length,
            completed: recentBookings.filter(b => b.status === 'completed').length,
            cancelled: recentBookings.filter(b => b.status === 'cancelled').length,
            pending: recentBookings.filter(b => b.status === 'pending').length
        };
    }, [bookings]);

    const popularDestinations = useMemo(() => {
        const destinations = bookings.reduce((acc: Record<string, number>, booking) => {
            const dest = typeof booking.to === 'object' && booking.to ? booking.to.city : booking.to;
            if (dest && typeof dest === 'string') {
                acc[dest] = (acc[dest] || 0) + 1;
            }
            return acc;
        }, {});

        return Object.entries(destinations)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
    }, [bookings]);

    return {
        revenue,
        trends,
        popularDestinations
    };
} 
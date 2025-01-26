import { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    TooltipItem,
    Scale,
    CoreScaleOptions
} from 'chart.js';
import { BookingData, FlightBookingData } from '../types';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface BookingTrendsChartProps {
    bookings: BookingData[];
}

type TooltipContext = TooltipItem<"line"> & {
    dataset: { label: string };
    raw: number;
};

type DateRange = '7d' | '30d' | '90d' | '1y' | 'custom';

interface DatePreset {
    label: string;
    value: DateRange;
    days: number;
}

const DATE_PRESETS: DatePreset[] = [
    { label: '7 Days', value: '7d', days: 7 },
    { label: '30 Days', value: '30d', days: 30 },
    { label: '90 Days', value: '90d', days: 90 },
    { label: '1 Year', value: '1y', days: 365 },
];

function isFlightBooking(booking: BookingData): booking is FlightBookingData {
    return 'passengers' in booking;
}

export function BookingTrendsChart({ bookings }: BookingTrendsChartProps) {
    // Initialize with last 30 days
    const defaultEndDate = new Date();
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultEndDate.getDate() - 30);

    const [selectedRange, setSelectedRange] = useState<DateRange>('30d');
    const [customStartDate, setCustomStartDate] = useState<Date | null>(defaultStartDate);
    const [customEndDate, setCustomEndDate] = useState<Date | null>(defaultEndDate);

    // Format date to YYYY-MM-DD for input value
    const formatDateForInput = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const { labels, dailyRevenue, dailyBookings } = useMemo(() => {
        let days = selectedRange === 'custom'
            ? Math.ceil((customEndDate!.getTime() - customStartDate!.getTime()) / (1000 * 60 * 60 * 24))
            : DATE_PRESETS.find(preset => preset.value === selectedRange)?.days ?? 30;

        // Ensure days is positive and within reasonable limits
        days = Math.max(1, Math.min(days, 365));

        const dates = [...Array(days)].map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (days - 1 - i));
            return date;
        });

        const dailyRevenue = new Array(days).fill(0);
        const dailyBookings = new Array(days).fill(0);

        bookings.forEach(booking => {
            const bookingDate = typeof booking.createdAt === 'string'
                ? new Date(booking.createdAt)
                : booking.createdAt.toDate();

            const dayIndex = dates.findIndex(date =>
                date.toDateString() === bookingDate.toDateString()
            );

            if (dayIndex !== -1) {
                const amount = isFlightBooking(booking) ? 40 * (booking.passengers?.length ?? 0) : 40;
                dailyRevenue[dayIndex] += amount;
                dailyBookings[dayIndex] += 1;
            }
        });

        return {
            labels: dates.map(date => date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            })),
            dailyRevenue,
            dailyBookings
        };
    }, [bookings, selectedRange, customStartDate, customEndDate]);

    const handleCustomDateChange = (start: Date | null, end: Date | null) => {
        if (start && end) {
            // Prevent future end dates
            const today = new Date();
            today.setHours(23, 59, 59, 999);

            // Ensure end date is not in the future
            const validEnd = end > today ? today : end;

            // Ensure start date is not after end date
            if (start > validEnd) {
                start = new Date(validEnd);
                start.setDate(validEnd.getDate() - 30); // Default to 30 days if invalid range
            }

            // Limit to maximum of 365 days
            const daysDiff = Math.ceil((validEnd.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            if (daysDiff > 365) {
                start = new Date(validEnd);
                start.setDate(validEnd.getDate() - 365);
            }

            setCustomStartDate(start);
            setCustomEndDate(validEnd);
            setSelectedRange('custom');
        }
    };

    const commonOptions = {
        responsive: true,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'white',
                titleColor: '#111827',
                bodyColor: '#111827',
                borderColor: '#E4EBE2',
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                usePointStyle: true,
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 11,
                        family: "'Inter', sans-serif"
                    },
                    color: '#374533'
                }
            }
        }
    } as const;

    const revenueData = {
        labels,
        datasets: [{
            data: dailyRevenue,
            borderColor: '#7FA77B',
            backgroundColor: 'rgba(127, 167, 123, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };

    const bookingsData = {
        labels,
        datasets: [{
            data: dailyBookings,
            borderColor: '#D4AF37',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };

    const revenueOptions = {
        ...commonOptions,
        plugins: {
            ...commonOptions.plugins,
            tooltip: {
                ...commonOptions.plugins.tooltip,
                callbacks: {
                    label: (context: TooltipContext) => {
                        return new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(context.raw);
                    }
                }
            }
        },
        scales: {
            ...commonOptions.scales,
            y: {
                type: 'linear' as const,
                display: true,
                grid: {
                    color: '#E4EBE2'
                },
                ticks: {
                    callback: function (this: Scale<CoreScaleOptions>, value: number | string): string {
                        return new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(Number(value));
                    },
                    font: {
                        size: 11,
                        family: "'Inter', sans-serif"
                    },
                    color: '#374533'
                }
            }
        }
    } as const;

    const bookingsOptions = {
        ...commonOptions,
        plugins: {
            ...commonOptions.plugins,
            tooltip: {
                ...commonOptions.plugins.tooltip,
                callbacks: {
                    label: (context: TooltipContext) => `${context.raw} bookings`
                }
            }
        },
        scales: {
            ...commonOptions.scales,
            y: {
                type: 'linear' as const,
                display: true,
                grid: {
                    color: '#E4EBE2'
                },
                ticks: {
                    stepSize: 1,
                    font: {
                        size: 11,
                        family: "'Inter', sans-serif"
                    },
                    color: '#374533'
                }
            }
        }
    } as const;

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1),0_12px_25px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.15),0_20px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 p-6">
            <div className="space-y-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Revenue & Booking Trends</h3>
                        <p className="text-sm text-gray-500">Track your business performance</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {DATE_PRESETS.map(preset => (
                            <button
                                key={preset.value}
                                onClick={() => setSelectedRange(preset.value)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors
                                    ${selectedRange === preset.value
                                        ? 'bg-forest-400 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {preset.label}
                            </button>
                        ))}
                        <div className="relative ml-2">
                            <input
                                type="date"
                                defaultValue={formatDateForInput(defaultStartDate)}
                                max={formatDateForInput(new Date())}
                                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-400"
                                onChange={(e) => {
                                    const start = new Date(e.target.value);
                                    const end = new Date();
                                    handleCustomDateChange(start, end);
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Revenue Trend</h3>
                    <p className="text-sm text-gray-500 mb-4">
                        {selectedRange === 'custom'
                            ? `From ${customStartDate?.toLocaleDateString()} to ${customEndDate?.toLocaleDateString()}`
                            : `Last ${DATE_PRESETS.find(preset => preset.value === selectedRange)?.label.toLowerCase()}`
                        }
                    </p>
                    <div className="h-[200px]">
                        <Line options={revenueOptions} data={revenueData} />
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Booking Trend</h3>
                    <p className="text-sm text-gray-500 mb-4">
                        {selectedRange === 'custom'
                            ? `From ${customStartDate?.toLocaleDateString()} to ${customEndDate?.toLocaleDateString()}`
                            : `Last ${DATE_PRESETS.find(preset => preset.value === selectedRange)?.label.toLowerCase()}`
                        }
                    </p>
                    <div className="h-[200px]">
                        <Line options={bookingsOptions} data={bookingsData} />
                    </div>
                </div>
            </div>
        </div>
    );
} 
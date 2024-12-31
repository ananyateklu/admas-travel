import { BookingData } from './types';

interface BookingTrendsChartProps {
    bookings: BookingData[];
    days?: number;
}

export function BookingTrendsChart({ bookings, days = 30 }: BookingTrendsChartProps) {
    const generateTrendData = () => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days + 1);

        // Initialize data array with dates
        const data = Array.from({ length: days }, (_, i) => {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            return {
                date: date.toISOString().split('T')[0],
                count: 0,
                revenue: 0,
                completedCount: 0,
                pendingCount: 0,
                cancelledCount: 0
            };
        });

        // Fill in booking data
        bookings.forEach(booking => {
            const bookingDate = typeof booking.createdAt === 'string'
                ? new Date(booking.createdAt)
                : booking.createdAt.toDate();

            const dateStr = bookingDate.toISOString().split('T')[0];

            const dataPoint = data.find(d => {
                const pointDate = new Date(d.date);
                const bookingDateOnly = new Date(dateStr);
                return pointDate.getFullYear() === bookingDateOnly.getFullYear() &&
                    pointDate.getMonth() === bookingDateOnly.getMonth() &&
                    pointDate.getDate() === bookingDateOnly.getDate();
            });

            if (dataPoint) {
                dataPoint.count += 1;
                dataPoint.revenue += 40 * booking.passengers.length;

                switch (booking.status.toLowerCase()) {
                    case 'completed':
                        dataPoint.completedCount += 1;
                        break;
                    case 'pending':
                        dataPoint.pendingCount += 1;
                        break;
                    case 'cancelled':
                        dataPoint.cancelledCount += 1;
                        break;
                }
            }
        });

        return data;
    };

    const trendData = generateTrendData();
    const maxCount = Math.max(1, ...trendData.map(d => d.count));
    const maxRevenue = Math.max(1, ...trendData.map(d => d.revenue));

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const generatePathD = (points: Array<{ x: number; y: number }>) => {
        if (points.length === 0) return '';
        return points
            .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
            .join(' ');
    };

    // Calculate points for revenue line
    const revenuePoints = trendData.map((point, i) => ({
        x: (i / Math.max(1, days - 1)) * 100,
        y: 100 - ((point.revenue / maxRevenue) * 80)
    }));

    // Calculate points for booking line
    const bookingPoints = trendData.map((point, i) => ({
        x: (i / Math.max(1, days - 1)) * 100,
        y: 100 - ((point.count / maxCount) * 80)
    }));

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Booking Trends</h3>
                <div className="flex gap-4">
                    <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
                        <span className="text-sm text-gray-600">Revenue</span>
                    </div>
                    <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></span>
                        <span className="text-sm text-gray-600">Bookings</span>
                    </div>
                </div>
            </div>

            <div className="relative h-64">
                {/* Grid lines */}
                <div className="absolute inset-0 grid grid-cols-1 grid-rows-4">
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="border-t border-gray-100 relative">
                            <span className="absolute -left-4 -top-3 text-xs text-gray-400">
                                {formatCurrency((maxRevenue / 4) * (4 - i))}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Revenue Area */}
                <svg className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="revenue-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Revenue area */}
                    <path
                        d={`${generatePathD(revenuePoints)} L ${revenuePoints[revenuePoints.length - 1].x} 100 L 0 100 Z`}
                        fill="url(#revenue-gradient)"
                    />

                    {/* Revenue line */}
                    <path
                        d={generatePathD(revenuePoints)}
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2"
                    />

                    {/* Booking Count Line */}
                    <path
                        d={generatePathD(bookingPoints)}
                        fill="none"
                        stroke="#6366F1"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                    />

                    {/* Data points */}
                    {revenuePoints.map((point, i) => (
                        <circle
                            key={`revenue-point-${trendData[i].date}-${i}`}
                            cx={`${point.x}%`}
                            cy={`${point.y}%`}
                            r="3"
                            fill="#10B981"
                            className="hover:r-4 transition-all duration-200"
                        />
                    ))}
                </svg>

                {/* X-axis labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
                    {trendData.filter((_, i) => i % 5 === 0).map((point) => (
                        <span key={point.date}>
                            {new Date(point.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                    ))}
                </div>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t">
                <div>
                    <div className="text-sm text-gray-600">Total Bookings</div>
                    <div className="text-2xl font-semibold text-gray-900">
                        {trendData.reduce((sum, d) => sum + d.count, 0)}
                    </div>
                </div>
                <div>
                    <div className="text-sm text-gray-600">Completed</div>
                    <div className="text-2xl font-semibold text-emerald-600">
                        {trendData.reduce((sum, d) => sum + d.completedCount, 0)}
                    </div>
                </div>
                <div>
                    <div className="text-sm text-gray-600">Pending</div>
                    <div className="text-2xl font-semibold text-amber-600">
                        {trendData.reduce((sum, d) => sum + d.pendingCount, 0)}
                    </div>
                </div>
                <div>
                    <div className="text-sm text-gray-600">Cancelled</div>
                    <div className="text-2xl font-semibold text-red-600">
                        {trendData.reduce((sum, d) => sum + d.cancelledCount, 0)}
                    </div>
                </div>
            </div>
        </div>
    );
} 
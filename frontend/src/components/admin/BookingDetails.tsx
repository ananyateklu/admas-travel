import { BookingData } from './types';
import { getStatusStyle } from './utils';

interface BookingDetailsProps {
    booking: BookingData;
}

export function BookingDetails({ booking }: BookingDetailsProps) {
    return (
        <>
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
        </>
    );
} 
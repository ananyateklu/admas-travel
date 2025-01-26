import { Airport } from '../../services/flightService';

interface PassengerInfo {
    type: 'adult' | 'child';
    fullName: string;
    dateOfBirth: string;
    passportNumber: string;
    passportExpiry: string;
    nationality: string;
}

interface BookingFormData {
    tripType: 'roundtrip' | 'oneway';
    from: Airport | null;
    to: Airport | null;
    departureDate: string;
    departureTime: string;
    returnDate?: string;
    returnTime?: string;
    adults: number;
    children: number;
    class: 'economy' | 'business' | 'first';
    passengers: PassengerInfo[];
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    specialRequests?: string;
}

interface BookingReviewProps {
    formData: BookingFormData;
}

export function BookingReview({ formData }: BookingReviewProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-2">
            {/* Contact Information - Moved to top */}
            <div className="bg-white rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-forest-400/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-[11px] font-medium text-gray-900">Contact Information</h3>
                            <p className="text-[10px] text-gray-500">Booking contact details</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="p-2 bg-gray-50/50 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-forest-400/10 flex items-center justify-center">
                                <svg className="w-3 h-3 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-[9px] text-gray-500">Contact Name</div>
                                <div className="text-[10px] font-medium text-gray-900">{formData.contactName}</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-2 bg-gray-50/50 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-forest-400/10 flex items-center justify-center">
                                <svg className="w-3 h-3 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <div className="text-[9px] text-gray-500">Email Address</div>
                                <div className="text-[10px] font-medium text-gray-900 truncate">{formData.contactEmail}</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-2 bg-gray-50/50 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-forest-400/10 flex items-center justify-center">
                                <svg className="w-3 h-3 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-[9px] text-gray-500">Phone Number</div>
                                <div className="text-[10px] font-medium text-gray-900">{formData.contactPhone}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Journey Timeline */}
            <div className="bg-white rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-forest-400/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-[10px] font-medium text-gray-900">Journey Timeline</h3>
                            <p className="text-[9px] text-gray-500">Your travel schedule</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[9px] px-2 sm:px-0">
                        <div className="flex items-center gap-1">
                            <span className="text-gray-500">Trip:</span>
                            <span className="font-medium text-gray-900 capitalize">{formData.tripType}</span>
                        </div>
                        <div className="h-3 w-px bg-gray-200"></div>
                        <div className="flex items-center gap-1">
                            <span className="text-gray-500">Class:</span>
                            <span className="font-medium text-gray-900 capitalize">{formData.class}</span>
                        </div>
                        <div className="h-3 w-px bg-gray-200"></div>
                        <div className="flex items-center gap-1">
                            <span className="text-gray-500">Passengers:</span>
                            <span className="font-medium text-gray-900">
                                {formData.adults + formData.children} ({formData.adults} Adult{formData.adults > 1 ? 's' : ''}
                                {formData.children > 0 && `, ${formData.children} Child${formData.children > 1 ? 'ren' : ''}`})
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    {/* Outbound Journey */}
                    <div className="flex items-center gap-2">
                        {/* Departure */}
                        <div className="flex-1 relative">
                            <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-forest-400 flex-shrink-0 relative z-10"></div>
                                <div className="flex-1 bg-forest-400/5 rounded-lg py-1 px-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                        <div>
                                            <p className="text-[10px] font-medium text-gray-900">{formData.from?.city}</p>
                                            <div className="flex items-center gap-1">
                                                <p className="text-[9px] text-gray-500">Departure</p>
                                                <span className="text-[9px] text-gray-400">•</span>
                                                <span className="text-[9px] text-gray-500">{formatTime(formData.departureTime)}</span>
                                            </div>
                                        </div>
                                        <span className="text-[9px] px-1.5 py-0.5 bg-forest-400/10 text-forest-400 rounded">
                                            {formatDate(formData.departureDate)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Arrow */}
                        <div className="w-8 flex-shrink-0 flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </div>

                        {/* Arrival */}
                        <div className="flex-1 relative">
                            <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-forest-400 flex-shrink-0 relative z-10"></div>
                                <div className="flex-1 bg-forest-400/5 rounded-lg py-1 px-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                        <div>
                                            <p className="text-[10px] font-medium text-gray-900">{formData.to?.city}</p>
                                            <div className="flex items-center gap-1">
                                                <p className="text-[9px] text-gray-500">Arrival</p>
                                                <span className="text-[9px] text-gray-400">•</span>
                                                <span className="text-[9px] text-gray-500">{formatTime(formData.departureTime)}</span>
                                            </div>
                                        </div>
                                        <span className="text-[9px] px-1.5 py-0.5 bg-forest-400/10 text-forest-400 rounded">
                                            {formatDate(formData.departureDate)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Return Journey */}
                    {formData.tripType === 'roundtrip' && formData.returnDate && formData.returnTime && (
                        <div className="flex items-center gap-2">
                            {/* Return Departure */}
                            <div className="flex-1 relative">
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 relative z-10"></div>
                                    <div className="flex-1 bg-blue-50 rounded-lg py-1 px-2">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                            <div>
                                                <p className="text-[10px] font-medium text-gray-900">{formData.to?.city}</p>
                                                <div className="flex items-center gap-1">
                                                    <p className="text-[9px] text-gray-500">Return Departure</p>
                                                    <span className="text-[9px] text-gray-400">•</span>
                                                    <span className="text-[9px] text-gray-500">{formatTime(formData.returnTime)}</span>
                                                </div>
                                            </div>
                                            <span className="text-[9px] px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded">
                                                {formatDate(formData.returnDate)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Arrow */}
                            <div className="w-8 flex-shrink-0 flex items-center justify-center">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>

                            {/* Return Arrival */}
                            <div className="flex-1 relative">
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 relative z-10"></div>
                                    <div className="flex-1 bg-blue-50 rounded-lg py-1 px-2">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                            <div>
                                                <p className="text-[10px] font-medium text-gray-900">{formData.from?.city}</p>
                                                <div className="flex items-center gap-1">
                                                    <p className="text-[9px] text-gray-500">Return Arrival</p>
                                                    <span className="text-[9px] text-gray-400">•</span>
                                                    <span className="text-[9px] text-gray-500">{formatTime(formData.returnTime)}</span>
                                                </div>
                                            </div>
                                            <span className="text-[9px] px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded">
                                                {formatDate(formData.returnDate)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Passenger Information and Special Requests */}
            <div className="grid grid-cols-12 gap-2">
                {/* Passenger Details */}
                <div className="col-span-12 lg:col-span-8 bg-white rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-forest-400/10 flex items-center justify-center">
                                <svg className="w-4 h-4 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-medium text-gray-900">Passenger Information</h3>
                                <p className="text-[9px] text-gray-500">Travel document details</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {formData.passengers.map((passenger, index) => (
                            <div
                                key={index}
                                className="bg-gray-50/50 rounded-lg border border-gray-100 p-2"
                            >
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <div className="w-5 h-5 rounded-full bg-forest-400/10 flex items-center justify-center">
                                        <svg className="w-2.5 h-2.5 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <div className="truncate">
                                                <span className="text-[10px] font-medium text-gray-900">
                                                    {passenger.fullName}
                                                </span>
                                                <span className="text-[9px] text-gray-500 ml-1">
                                                    ({passenger.type.charAt(0).toUpperCase() + passenger.type.slice(1)})
                                                </span>
                                            </div>
                                            <span className="text-[8px] px-1 py-0.5 bg-forest-400/10 text-forest-400 rounded flex-shrink-0 ml-1">
                                                P{index + 1}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="grid grid-cols-2 gap-1">
                                        <div className="bg-white rounded p-1 border border-gray-100">
                                            <div className="text-[8px] text-gray-500">Birth Date</div>
                                            <div className="text-[9px] font-medium text-gray-900 truncate">{passenger.dateOfBirth}</div>
                                        </div>
                                        <div className="bg-white rounded p-1 border border-gray-100">
                                            <div className="text-[8px] text-gray-500">Nationality</div>
                                            <div className="text-[9px] font-medium text-gray-900 truncate">{passenger.nationality}</div>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded p-1 border border-gray-100">
                                        <div className="text-[8px] text-gray-500">Passport</div>
                                        <div className="flex items-center justify-between">
                                            <div className="text-[9px] font-medium text-gray-900 truncate">{passenger.passportNumber}</div>
                                            <div className="text-[8px] text-gray-500 flex-shrink-0 ml-1">
                                                Exp: {passenger.passportExpiry}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Special Requests */}
                {formData.specialRequests && (
                    <div className="col-span-12 lg:col-span-4 bg-white rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-forest-400/10 flex items-center justify-center">
                                <svg className="w-4 h-4 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-medium text-gray-900">Special Requests</h3>
                                <p className="text-[9px] text-gray-500">Additional requirements</p>
                            </div>
                        </div>
                        <div className="p-1.5 bg-gray-50 rounded-lg text-[10px] text-gray-700 whitespace-pre-wrap">
                            {formData.specialRequests}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 
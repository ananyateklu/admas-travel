import { motion } from 'framer-motion';
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
        <div className="space-y-8">
            {/* Journey Timeline */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-gold/10 rounded-lg">
                        <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900">Journey Timeline</h3>
                        <p className="text-xs text-gray-500">Your travel schedule</p>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200"></div>
                    <div className="space-y-6">
                        <div className="relative flex items-center gap-4">
                            <div className="w-16 flex-shrink-0 text-xs text-gray-500">
                                {formatTime(formData.departureTime)}
                            </div>
                            <div className="w-4 h-4 rounded-full bg-gold flex-shrink-0 relative z-10"></div>
                            <div className="flex-1 bg-gold/5 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">{formData.from?.city}</p>
                                        <p className="text-sm text-gray-500">Departure</p>
                                    </div>
                                    <span className="text-xs px-2 py-0.5 bg-gold/10 text-gold rounded-full">
                                        {formatDate(formData.departureDate)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="relative flex items-center gap-4">
                            <div className="w-16 flex-shrink-0 text-xs text-gray-500">
                                {formatTime(formData.departureTime)}
                            </div>
                            <div className="w-4 h-4 rounded-full bg-emerald-500 flex-shrink-0 relative z-10"></div>
                            <div className="flex-1 bg-emerald-50 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">{formData.to?.city}</p>
                                        <p className="text-sm text-gray-500">Arrival</p>
                                    </div>
                                    <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full">
                                        {formatDate(formData.departureDate)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {formData.tripType === 'roundtrip' && formData.returnDate && formData.returnTime && (
                            <>
                                <div className="relative flex items-center gap-4">
                                    <div className="w-16 flex-shrink-0 text-xs text-gray-500">
                                        {formatTime(formData.returnTime)}
                                    </div>
                                    <div className="w-4 h-4 rounded-full bg-blue-500 flex-shrink-0 relative z-10"></div>
                                    <div className="flex-1 bg-blue-50 rounded-lg p-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">{formData.to?.city}</p>
                                                <p className="text-sm text-gray-500">Return Departure</p>
                                            </div>
                                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">
                                                {formatDate(formData.returnDate)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative flex items-center gap-4">
                                    <div className="w-16 flex-shrink-0 text-xs text-gray-500">
                                        {formatTime(formData.returnTime)}
                                    </div>
                                    <div className="w-4 h-4 rounded-full bg-indigo-500 flex-shrink-0 relative z-10"></div>
                                    <div className="flex-1 bg-indigo-50 rounded-lg p-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">{formData.from?.city}</p>
                                                <p className="text-sm text-gray-500">Return Arrival</p>
                                            </div>
                                            <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full">
                                                {formatDate(formData.returnDate)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Trip Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-gold/10 rounded-lg">
                            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Trip Details</h3>
                            <p className="text-xs text-gray-500">Flight information</p>
                        </div>
                    </div>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <span className="text-gray-600">Trip Type</span>
                            <span className="font-medium text-gray-900 capitalize">{formData.tripType}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <span className="text-gray-600">Class</span>
                            <span className="font-medium text-gray-900 capitalize">{formData.class}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <span className="text-gray-600">Passengers</span>
                            <span className="font-medium text-gray-900">
                                {formData.adults + formData.children} ({formData.adults} Adult{formData.adults !== 1 ? 's' : ''}, {formData.children} Child{formData.children !== 1 ? 'ren' : ''})
                            </span>
                        </div>
                    </div>
                </div>

                {/* Passenger Details */}
                <div className="bg-white rounded-lg p-6 shadow-sm lg:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-gold/10 rounded-lg">
                            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Passenger Details</h3>
                            <p className="text-xs text-gray-500">Traveler information</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.passengers.map((passenger, index) => (
                            <motion.div
                                key={`${passenger.passportNumber}-${passenger.fullName}`}
                                className="bg-gray-50 rounded-lg p-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                                        <span className="text-sm font-medium text-gold">
                                            {passenger.fullName.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{passenger.fullName}</div>
                                        <div className="text-sm text-gray-500 capitalize">{passenger.type}</div>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Nationality</span>
                                        <span className="text-gray-900">{passenger.nationality}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Passport</span>
                                        <span className="text-gray-900">{passenger.passportNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Passport Expiry</span>
                                        <span className="text-gray-900">{formatDate(passenger.passportExpiry)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Date of Birth</span>
                                        <span className="text-gray-900">{formatDate(passenger.dateOfBirth)}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-gold/10 rounded-lg">
                        <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900">Contact Information</h3>
                        <p className="text-xs text-gray-500">Booking contact details</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500">Full Name</div>
                        <div className="font-medium text-gray-900">{formData.contactName}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="font-medium text-gray-900">{formData.contactEmail}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500">Phone</div>
                        <div className="font-medium text-gray-900">{formData.contactPhone}</div>
                    </div>
                </div>
            </div>

            {/* Special Requests */}
            {formData.specialRequests && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-gold/10 rounded-lg">
                            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Special Requests</h3>
                            <p className="text-xs text-gray-500">Additional requirements</p>
                        </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-700 whitespace-pre-wrap">
                        {formData.specialRequests}
                    </div>
                </div>
            )}
        </div>
    );
} 
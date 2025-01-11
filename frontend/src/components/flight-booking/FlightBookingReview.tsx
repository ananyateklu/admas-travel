import React from 'react';
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
        <div className="space-y-2">
            {/* Contact Information - Moved to top */}
            <div className="bg-white rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-forest-400/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[11px] text-gray-500">Contact:</span>
                                <span className="text-[11px] font-medium text-gray-900">{formData.contactName}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[11px] text-gray-500">Email:</span>
                                <span className="text-[11px] font-medium text-gray-900">{formData.contactEmail}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[11px] text-gray-500">Phone:</span>
                                <span className="text-[11px] font-medium text-gray-900">{formData.contactPhone}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Journey Timeline */}
            <div className="bg-white rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                <div className="flex items-center justify-between mb-2">
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
                    <div className="flex items-center gap-3 text-[9px]">
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
                            <div className="flex items-center gap-1">
                                {Object.entries(
                                    formData.passengers.reduce((acc, p) => {
                                        acc[p.type] = (acc[p.type] || 0) + 1;
                                        return acc;
                                    }, {} as Record<string, number>)
                                ).map(([type, count], index, array) => (
                                    <React.Fragment key={type}>
                                        <span className="text-[9px] text-gray-500">
                                            {count} {type.charAt(0).toUpperCase() + type.slice(1)}
                                            {index < array.length - 1 ? ',' : ''}
                                        </span>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    {/* Outbound Journey */}
                    <div className="flex items-center gap-2 mb-2">
                        {/* Departure */}
                        <div className="flex-1 relative">
                            <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-forest-400 flex-shrink-0 relative z-10"></div>
                                <div className="flex-1 bg-forest-400/5 rounded-lg py-1 px-2">
                                    <div className="flex items-center justify-between">
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

                        {/* Connection Line */}
                        <div className="flex-shrink-0 w-8 relative">
                            <div className="absolute left-0 right-0 top-[7px] border-t border-dashed border-gray-200"></div>
                            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-[2px] text-[9px] text-gray-400">
                                <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </div>

                        {/* Arrival */}
                        <div className="flex-1 relative">
                            <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 relative z-10"></div>
                                <div className="flex-1 bg-emerald-50 rounded-lg py-1 px-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-medium text-gray-900">{formData.to?.city}</p>
                                            <div className="flex items-center gap-1">
                                                <p className="text-[9px] text-gray-500">Arrival</p>
                                                <span className="text-[9px] text-gray-400">•</span>
                                                <span className="text-[9px] text-gray-500">{formatTime(formData.departureTime)}</span>
                                            </div>
                                        </div>
                                        <span className="text-[9px] px-1.5 py-0.5 bg-emerald-100 text-emerald-600 rounded">
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
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 relative z-10"></div>
                                    <div className="flex-1 bg-blue-50 rounded-lg py-1 px-2">
                                        <div className="flex items-center justify-between">
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

                            {/* Return Connection Line */}
                            <div className="flex-shrink-0 w-8 relative">
                                <div className="absolute left-0 right-0 top-[7px] border-t border-dashed border-gray-200"></div>
                                <div className="absolute left-1/2 -translate-x-1/2 -translate-y-[2px] text-[9px] text-gray-400">
                                    <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>

                            {/* Return Arrival */}
                            <div className="flex-1 relative">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-forest-400 flex-shrink-0 relative z-10"></div>
                                    <div className="flex-1 bg-forest-400/5 rounded-lg py-1 px-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-medium text-gray-900">{formData.from?.city}</p>
                                                <div className="flex items-center gap-1">
                                                    <p className="text-[9px] text-gray-500">Return Arrival</p>
                                                    <span className="text-[9px] text-gray-400">•</span>
                                                    <span className="text-[9px] text-gray-500">{formatTime(formData.returnTime)}</span>
                                                </div>
                                            </div>
                                            <span className="text-[9px] px-1.5 py-0.5 bg-forest-400/10 text-forest-400 rounded">
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
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-forest-400/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-[11px] font-medium text-gray-900">Passenger Details</h3>
                            <p className="text-[10px] text-gray-500">Traveler information</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {formData.passengers.map((passenger, index) => (
                            <motion.div
                                key={`${passenger.passportNumber}-${passenger.fullName}`}
                                className="bg-gray-50 rounded-lg p-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.1 }}
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-5 h-5 rounded-full bg-forest-400/10 flex items-center justify-center">
                                            <span className="text-[10px] font-medium text-forest-400">
                                                {passenger.fullName.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-medium text-gray-900">{passenger.fullName}</div>
                                            <div className="text-[9px] text-gray-500 flex items-center gap-1">
                                                <span className="capitalize">{passenger.type}</span>
                                                <span className="text-gray-300">•</span>
                                                <span>PP: {passenger.passportNumber}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-1.5 py-0.5 bg-forest-400/10 rounded text-[9px] text-forest-400 font-medium">
                                        P{index + 1}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-1">
                                    <div className="bg-white rounded p-1 border border-gray-100">
                                        <div className="text-[9px] text-gray-500">Nationality</div>
                                        <div className="text-[10px] font-medium text-gray-900">{passenger.nationality}</div>
                                    </div>
                                    <div className="bg-white rounded p-1 border border-gray-100">
                                        <div className="text-[9px] text-gray-500">Birth</div>
                                        <div className="text-[10px] font-medium text-gray-900">{formatDate(passenger.dateOfBirth)}</div>
                                    </div>
                                    <div className="bg-white rounded p-1 border border-gray-100 col-span-2">
                                        <div className="text-[9px] text-gray-500">Passport</div>
                                        <div className="flex items-center justify-between">
                                            <div className="text-[10px] font-medium text-gray-900">{passenger.passportNumber}</div>
                                            <div className="text-[9px] text-gray-500">
                                                Exp: {formatDate(passenger.passportExpiry)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
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
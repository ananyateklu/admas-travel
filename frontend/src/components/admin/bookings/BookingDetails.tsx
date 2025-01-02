import { BookingData } from '../types';
import { getStatusStyle } from '../utils';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface BookingDetailsProps {
    booking: BookingData;
    onDelete?: (bookingId: string) => Promise<void>;
    isDeleting?: boolean;
    canDelete?: boolean;
    isEditing?: boolean;
    onEdit?: (bookingId: string, updates: Partial<BookingData>) => Promise<void>;
    onEditComplete?: () => void;
}

const formatCreatedAt = (createdAt: string | { toDate: () => Date }) => {
    try {
        if (typeof createdAt === 'string') {
            return new Date(createdAt);
        }
        if (createdAt && typeof createdAt === 'object' && 'toDate' in createdAt) {
            return createdAt.toDate();
        }
        return new Date();
    } catch {
        console.warn('Invalid date format:', createdAt);
        return new Date();
    }
};

export function BookingDetails({
    booking,
    onDelete,
    isDeleting,
    canDelete,
    isEditing = false,
    onEdit,
    onEditComplete
}: BookingDetailsProps) {
    const [editForm, setEditForm] = useState<Partial<BookingData>>({
        departureDate: booking.departureDate,
        returnDate: booking.returnDate,
        class: booking.class,
        specialRequests: booking.specialRequests
    });

    const handleInputChange = (field: keyof BookingData, value: string) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        if (onEdit) {
            await onEdit(booking.bookingId, editForm);
            onEditComplete?.();
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Trip Details */}
            <div className="bg-white rounded-lg p-3 shadow-[0_2px_4px_-2px_rgba(0,0,0,0.1),0_4px_6px_-1px_rgba(0,0,0,0.05)] border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-gold/10 rounded-lg">
                        <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-900">Trip Details</h4>
                        <p className="text-[11px] text-gray-500">Booking information and route</p>
                    </div>
                </div>
                <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
                        <span className="text-gray-600">Reference</span>
                        <span className="font-medium text-gray-900">{booking.bookingReference}</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
                        <span className="text-gray-600">Trip Type • Class</span>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 capitalize">{booking.tripType}</span>
                            <span className="text-gray-400">•</span>
                            <span className="font-medium text-gray-900 capitalize">{booking.class}</span>
                        </div>
                    </div>
                    <div className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-gray-600">Route Details</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Departure */}
                            <div className="flex-1">
                                <div className="flex items-center gap-1.5">
                                    <div className="p-1 bg-gold/10 rounded-full">
                                        <svg className="w-3 h-3 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-800">
                                            {booking.from && typeof booking.from === 'object' ? (
                                                <>
                                                    {booking.from.city}
                                                    <span className="text-[11px] font-normal text-gray-500 ml-1">
                                                        ({booking.from.airportCode})
                                                    </span>
                                                </>
                                            ) : booking.from}
                                        </div>
                                        <div className="text-[11px] text-gray-500">
                                            {new Date(booking.departureDate).toLocaleDateString(undefined, {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric'
                                            })} • {new Date(booking.departureDate).toLocaleTimeString(undefined, {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Journey Arrow */}
                            <div className="flex-shrink-0 flex flex-col items-center px-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>

                            {/* Arrival */}
                            <div className="flex-1">
                                <div className="flex items-center gap-1.5">
                                    <div className="p-1 bg-emerald-500/10 rounded-full">
                                        <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-800">
                                            {booking.to && typeof booking.to === 'object' ? (
                                                <>
                                                    {booking.to.city}
                                                    <span className="text-[11px] font-normal text-gray-500 ml-1">
                                                        ({booking.to.airportCode})
                                                    </span>
                                                </>
                                            ) : booking.to}
                                        </div>
                                        <div className="text-[11px] text-gray-500">
                                            {new Date(booking.departureDate).toLocaleDateString(undefined, {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric'
                                            })} • {new Date(booking.departureDate).toLocaleTimeString(undefined, {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Flight Info */}
                        <div className="mt-2 flex items-center justify-center text-[11px] text-gray-500 gap-3">
                            <div className="flex items-center gap-1">
                                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Direct Flight</span>
                            </div>
                            <span className="text-gray-300">|</span>
                            <div className="flex items-center gap-1">
                                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                <span>Non-stop</span>
                            </div>
                        </div>
                    </div>

                    {isEditing ? (
                        <div className="space-y-4">
                            <div className="form-group">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                                <select
                                    value={editForm.class}
                                    onChange={(e) => handleInputChange('class', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                >
                                    <option value="economy">Economy</option>
                                    <option value="business">Business</option>
                                    <option value="first">First Class</option>
                                </select>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
                            <span className="text-gray-600">Class</span>
                            <span className="font-medium text-gray-900 capitalize">{booking.class}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Travel Dates */}
            <div className="bg-white rounded-lg p-3 shadow-[0_2px_4px_-2px_rgba(0,0,0,0.1),0_4px_6px_-1px_rgba(0,0,0,0.05)] border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-gold/10 rounded-lg">
                        <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-900">Travel Dates</h4>
                        <p className="text-[11px] text-gray-500">Departure and return schedule</p>
                    </div>
                </div>
                <div className="space-y-2 text-xs">
                    {isEditing ? (
                        <div className="space-y-4">
                            <div className="form-group">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
                                <input
                                    type="datetime-local"
                                    value={editForm.departureDate}
                                    onChange={(e) => handleInputChange('departureDate', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                    min={new Date().toISOString().slice(0, 16)}
                                />
                            </div>
                            {booking.returnDate && (
                                <div className="form-group">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                                    <input
                                        type="datetime-local"
                                        value={editForm.returnDate}
                                        onChange={(e) => handleInputChange('returnDate', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                        min={editForm.departureDate}
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="p-2 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-600">Departure</span>
                                    <span className="text-xs text-gold font-medium px-2 py-0.5 bg-gold/10 rounded-full">Outbound</span>
                                </div>
                                <div className="font-medium text-gray-900">
                                    {new Date(booking.departureDate).toLocaleDateString()}
                                </div>
                            </div>
                            {booking.returnDate && (
                                <div className="p-2 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-600">Return</span>
                                        <span className="text-xs text-emerald-600 font-medium px-2 py-0.5 bg-emerald-50 rounded-full">Inbound</span>
                                    </div>
                                    <div className="font-medium text-gray-900">
                                        {new Date(booking.returnDate).toLocaleDateString()}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Additional Details */}
            <div className="bg-white rounded-lg p-3 shadow-[0_2px_4px_-2px_rgba(0,0,0,0.1),0_4px_6px_-1px_rgba(0,0,0,0.05)] border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-gold/10 rounded-lg">
                        <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-900">Additional Information</h4>
                        <p className="text-[11px] text-gray-500">Extra booking details</p>
                    </div>
                </div>
                <div className="space-y-2 text-xs">
                    <div className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <span className="text-gray-600">Booking Status</span>
                        <div className="mt-1 flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${getStatusStyle(booking.status)}`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                        </div>
                    </div>
                    <div className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <span className="text-gray-600">Created On</span>
                        <p className="font-medium text-gray-900 text-[11px]">
                            {formatCreatedAt(booking.createdAt).toLocaleDateString(undefined, {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                    {isEditing ? (
                        <div className="space-y-4">
                            <div className="form-group">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                                <textarea
                                    value={editForm.specialRequests ?? ''}
                                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                    rows={4}
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={onEditComplete}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="px-4 py-2 text-sm text-white bg-gold hover:bg-gold/90 rounded-lg"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {booking.specialRequests && (
                                <div className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                    <span className="text-gray-600">Special Requests</span>
                                    <p className="mt-1 text-gray-900 whitespace-pre-wrap">{booking.specialRequests}</p>
                                </div>
                            )}
                            {canDelete && onDelete && (
                                <div className="pt-3 mt-3 border-t border-gray-100">
                                    <motion.button
                                        className="w-full inline-flex items-center justify-center px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-xs transition-all duration-300 disabled:opacity-50"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => onDelete(booking.bookingId)}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? (
                                            'Deleting...'
                                        ) : (
                                            <>
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete Booking
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
} 
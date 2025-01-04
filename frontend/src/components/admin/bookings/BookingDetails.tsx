import { BookingData } from '../types';
import { useState } from 'react';
import { getStatusStyle } from '../utils';
import { motion } from 'framer-motion';
import { RatingComponent } from '../../booking/RatingComponent';

interface BookingDetailsProps {
    booking: BookingData;
    onDelete?: (bookingId: string) => Promise<void>;
    isDeleting?: boolean;
    canDelete?: boolean;
    isEditing?: boolean;
    onEdit?: (bookingId: string, updates: Partial<BookingData>) => Promise<void>;
    onEditComplete?: () => void;
    onRatingSubmit?: (bookingId: string, rating: number, comment: string) => Promise<void>;
    isSubmittingRating?: boolean;
}

interface AirportType {
    city: string;
    country?: string;
    airportCode?: string;
}

interface RouteDetailsProps {
    booking: BookingData;
    editForm: Partial<BookingData>;
    isEditing: boolean;
    onInputChange: (field: keyof BookingData, value: string | AirportType | null) => void;
}

function RouteDetails({ booking, editForm, isEditing, onInputChange }: RouteDetailsProps) {
    return (
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
                        {isEditing ? (
                            <div>
                                <input
                                    type="text"
                                    value={editForm.from?.city ?? ''}
                                    onChange={(e) => onInputChange('from', { ...editForm.from, city: e.target.value })}
                                    className="w-full px-2 py-1 text-xs border rounded focus:ring-2 focus:ring-gold focus:border-transparent"
                                    placeholder="Departure City"
                                />
                                <div className="flex gap-2 mt-1">
                                    <input
                                        type="date"
                                        value={editForm.departureDate}
                                        onChange={(e) => onInputChange('departureDate', e.target.value)}
                                        className="flex-1 px-2 py-1 text-xs border rounded focus:ring-2 focus:ring-gold focus:border-transparent"
                                    />
                                    <input
                                        type="time"
                                        value={editForm.departureTime}
                                        onChange={(e) => onInputChange('departureTime', e.target.value)}
                                        className="w-24 px-2 py-1 text-xs border rounded focus:ring-2 focus:ring-gold focus:border-transparent"
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
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
                                    })} • {booking.departureTime ? new Date(`2000-01-01T${booking.departureTime}`).toLocaleTimeString(undefined, {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : '00:00'}
                                </div>
                            </>
                        )}
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
                    <div className="p-1 bg-emerald-100 rounded-full">
                        <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </div>
                    <div>
                        {isEditing ? (
                            <div>
                                <input
                                    type="text"
                                    value={editForm.to?.city ?? ''}
                                    onChange={(e) => onInputChange('to', { ...editForm.to, city: e.target.value })}
                                    className="w-full px-2 py-1 text-xs border rounded focus:ring-2 focus:ring-gold focus:border-transparent"
                                    placeholder="Arrival City"
                                />
                                {editForm.tripType === 'roundtrip' && (
                                    <div className="flex gap-2 mt-1">
                                        <input
                                            type="date"
                                            value={editForm.returnDate}
                                            onChange={(e) => onInputChange('returnDate', e.target.value)}
                                            className="flex-1 px-2 py-1 text-xs border rounded focus:ring-2 focus:ring-gold focus:border-transparent"
                                        />
                                        <input
                                            type="time"
                                            value={editForm.returnTime}
                                            onChange={(e) => onInputChange('returnTime', e.target.value)}
                                            className="w-24 px-2 py-1 text-xs border rounded focus:ring-2 focus:ring-gold focus:border-transparent"
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
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
                                    {new Date(booking.returnDate ?? booking.departureDate).toLocaleDateString(undefined, {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric'
                                    })} • {(booking.returnTime ?? booking.departureTime) ? new Date(`2000-01-01T${booking.returnTime ?? booking.departureTime}`).toLocaleTimeString(undefined, {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : '00:00'}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
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
    onEditComplete,
    onRatingSubmit,
    isSubmittingRating = false
}: BookingDetailsProps) {
    const [editForm, setEditForm] = useState<Partial<BookingData>>({
        departureDate: booking.departureDate,
        departureTime: booking.departureTime,
        returnDate: booking.returnDate,
        returnTime: booking.returnTime,
        class: booking.class,
        tripType: booking.tripType,
        from: booking.from,
        to: booking.to,
        specialRequests: booking.specialRequests
    });

    const handleInputChange = (field: keyof BookingData, value: string | AirportType | null) => {
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
            {/* Trip Details */}
            <div className="lg:col-span-7 bg-white rounded-lg p-2 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1 bg-gold/10 rounded-lg">
                        <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-xs font-medium text-gray-900">Trip Details</h4>
                        <p className="text-[10px] text-gray-500">Booking information and route</p>
                    </div>
                </div>
                <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between p-1 hover:bg-gray-50 rounded-lg transition-colors">
                        <span className="text-gray-600">Reference</span>
                        <span className="font-medium text-gray-900">{booking.bookingReference}</span>
                    </div>
                    {booking.rating && (
                        <div className="flex items-center justify-between p-1 hover:bg-gray-50 rounded-lg transition-colors">
                            <span className="text-gray-600">Rating</span>
                            <div className="flex items-center gap-1.5">
                                <div className="flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" stroke="none" viewBox="0 0 24 24">
                                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                    <span className="font-medium text-gray-900">{booking.rating.score.toFixed(1)}</span>
                                </div>
                                {booking.rating.comment && (
                                    <span className="text-gray-500 truncate max-w-[120px]" title={booking.rating.comment}>
                                        "{booking.rating.comment}"
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="flex items-center justify-between p-1 hover:bg-gray-50 rounded-lg transition-colors">
                        <span className="text-gray-600">Trip Type • Class</span>
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <select
                                    value={editForm.tripType}
                                    onChange={(e) => handleInputChange('tripType', e.target.value)}
                                    className="px-1.5 py-0.5 text-xs border rounded focus:ring-1 focus:ring-gold focus:border-transparent"
                                >
                                    <option value="roundtrip">Round Trip</option>
                                    <option value="oneway">One Way</option>
                                </select>
                                <select
                                    value={editForm.class}
                                    onChange={(e) => handleInputChange('class', e.target.value)}
                                    className="px-1.5 py-0.5 text-xs border rounded focus:ring-1 focus:ring-gold focus:border-transparent"
                                >
                                    <option value="economy">Economy</option>
                                    <option value="business">Business</option>
                                    <option value="first">First</option>
                                </select>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900 capitalize">{booking.tripType}</span>
                                <span className="text-gray-400">•</span>
                                <span className="font-medium text-gray-900 capitalize">{booking.class}</span>
                            </div>
                        )}
                    </div>
                    <div className="p-1 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-gray-600">Route Details</span>
                        </div>
                        <RouteDetails
                            booking={booking}
                            editForm={editForm}
                            isEditing={isEditing}
                            onInputChange={handleInputChange}
                        />
                    </div>
                </div>

                {isEditing && (
                    <div className="flex justify-end gap-2 mt-3">
                        <button
                            type="button"
                            onClick={onEditComplete}
                            className="px-3 py-1 text-xs text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="px-3 py-1 text-xs text-white bg-gold hover:bg-gold/90 rounded-lg"
                        >
                            Save Changes
                        </button>
                    </div>
                )}
            </div>

            {/* Travel Dates */}
            <div className="lg:col-span-2 bg-white rounded-lg p-2 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1 bg-gold/10 rounded-lg">
                        <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-xs font-medium text-gray-900">Travel Dates</h4>
                        <p className="text-[10px] text-gray-500">Schedule</p>
                    </div>
                </div>
                <div className="space-y-2 text-xs">
                    {isEditing ? (
                        <div className="space-y-3">
                            <div className="form-group">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Departure</label>
                                <input
                                    type="datetime-local"
                                    value={editForm.departureDate}
                                    onChange={(e) => handleInputChange('departureDate', e.target.value)}
                                    className="w-full px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-gold focus:border-transparent"
                                    min={new Date().toISOString().slice(0, 16)}
                                />
                            </div>
                            {booking.returnDate && (
                                <div className="form-group">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Return</label>
                                    <input
                                        type="datetime-local"
                                        value={editForm.returnDate}
                                        onChange={(e) => handleInputChange('returnDate', e.target.value)}
                                        className="w-full px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-gold focus:border-transparent"
                                        min={editForm.departureDate}
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="p-1.5 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-gray-600">Departure</span>
                                    <span className="text-[10px] text-gold font-medium px-1.5 py-0.5 bg-gold/10 rounded-full">Out</span>
                                </div>
                                <div className="font-medium text-gray-900">
                                    {new Date(booking.departureDate).toLocaleDateString()}
                                </div>
                            </div>
                            {booking.returnDate && (
                                <div className="p-1.5 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-gray-600">Return</span>
                                        <span className="text-[10px] text-emerald-600 font-medium px-1.5 py-0.5 bg-emerald-50 rounded-full">In</span>
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

            {/* Additional Info */}
            <div className="lg:col-span-3 bg-white rounded-lg p-2 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1 bg-gold/10 rounded-lg">
                        <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-xs font-medium text-gray-900">Additional Info</h4>
                        <p className="text-[10px] text-gray-500">Extra details</p>
                    </div>
                </div>
                <div className="space-y-1.5 text-xs">
                    <div className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
                        <span className="text-gray-600">Status</span>
                        <div className="mt-1 flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusStyle(booking.status)}`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                        </div>
                    </div>
                    <div className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
                        <span className="text-gray-600">Created On</span>
                        <p className="font-medium text-gray-900 text-[10px]">
                            {formatCreatedAt(booking.createdAt).toLocaleDateString(undefined, {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                    {isEditing ? (
                        <div className="space-y-3">
                            <div className="form-group">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Special Requests</label>
                                <textarea
                                    value={editForm.specialRequests ?? ''}
                                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                                    className="w-full px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-gold focus:border-transparent"
                                    rows={3}
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={onEditComplete}
                                    className="px-3 py-1 text-xs text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="px-3 py-1 text-xs text-white bg-gold hover:bg-gold/90 rounded-lg"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {booking.specialRequests && (
                                <div className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
                                    <span className="text-gray-600">Special Requests</span>
                                    <p className="mt-1 text-gray-900 whitespace-pre-wrap">{booking.specialRequests}</p>
                                </div>
                            )}
                            {canDelete && onDelete && (
                                <div className="pt-2 mt-2 border-t border-gray-100">
                                    <motion.button
                                        className="w-full inline-flex items-center justify-center px-2 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-[10px] transition-all duration-300 disabled:opacity-50"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => onDelete(booking.bookingId)}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? (
                                            'Deleting...'
                                        ) : (
                                            <>
                                                <svg className="w-2.5 h-2.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            {/* Add Rating Section */}
            {booking.status === 'completed' && (
                <div className="lg:col-span-3">
                    <RatingComponent
                        currentRating={booking.rating?.score}
                        currentComment={booking.rating?.comment}
                        onSubmitRating={async (rating, comment) => {
                            if (onRatingSubmit) {
                                await onRatingSubmit(booking.bookingId, rating, comment);
                            }
                        }}
                        isSubmitting={isSubmittingRating}
                        readonly={!onRatingSubmit}
                    />
                </div>
            )}
        </div>
    );
} 
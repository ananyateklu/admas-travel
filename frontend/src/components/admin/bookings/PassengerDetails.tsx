import { BookingData } from '../types';
import { useState } from 'react';

interface PassengerDetailsProps {
    booking: BookingData;
    isEditing?: boolean;
    onEdit?: (bookingId: string, updates: Partial<BookingData>) => Promise<void>;
    onEditComplete?: () => void;
}

export function PassengerDetails({
    booking,
    isEditing = false,
    onEdit,
    onEditComplete
}: PassengerDetailsProps) {
    const [editForm, setEditForm] = useState({
        passengers: booking.passengers.map(p => ({ ...p }))
    });

    const handlePassengerChange = (index: number, field: keyof typeof booking.passengers[0], value: string) => {
        const newPassengers = [...editForm.passengers];
        newPassengers[index] = {
            ...newPassengers[index],
            [field]: value
        };
        setEditForm({ passengers: newPassengers });
    };

    const handleSave = async () => {
        if (onEdit) {
            await onEdit(booking.bookingId, { passengers: editForm.passengers });
            onEditComplete?.();
        }
    };

    const formatDate = (date: string) => {
        const d = new Date(date);
        return d.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getPassportStatus = (expiryDate: string) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const monthsLeft = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30));

        if (monthsLeft < 0) return { status: 'expired', color: 'red' };
        if (monthsLeft < 6) return { status: 'expiring', color: 'yellow' };
        return { status: 'valid', color: 'emerald' };
    };

    return (
        <div className="bg-white rounded-lg p-3 shadow-sm">
            {/* Compact Header */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-gold/10 rounded-lg">
                        <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">Passengers</h4>
                            <div className="flex gap-1.5">
                                {booking.passengers.some(p => p.type === 'adult') && (
                                    <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium">
                                        {booking.passengers.filter(p => p.type === 'adult').length}A
                                    </span>
                                )}
                                {booking.passengers.some(p => p.type === 'child') && (
                                    <span className="text-[10px] px-1.5 py-0.5 bg-green-50 text-green-700 rounded-full font-medium">
                                        {booking.passengers.filter(p => p.type === 'child').length}C
                                    </span>
                                )}
                            </div>
                        </div>
                        <p className="text-[11px] text-gray-500">{booking.class} Class</p>
                    </div>
                </div>
            </div>

            {/* Compact Passenger Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {(isEditing ? editForm.passengers : booking.passengers).map((passenger, index) => {
                    return (
                        <div
                            key={`${passenger.passportNumber}-${passenger.fullName}`}
                            className="group bg-gray-50 rounded-lg p-3 hover:shadow-sm transition-all duration-200"
                        >
                            {/* Passenger Header - More Compact */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                                            <span className="text-xs font-medium text-gold">
                                                {passenger.fullName.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5">
                                            <span className={`text-[9px] px-1 py-0.5 rounded-full font-medium ${passenger.type === 'adult'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-green-100 text-green-700'
                                                }`}>
                                                {index + 1}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="min-w-0">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={passenger.fullName}
                                                onChange={(e) => handlePassengerChange(index, 'fullName', e.target.value)}
                                                className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-gold focus:border-transparent"
                                                placeholder="Full Name"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-1">
                                                <p className="font-medium text-gray-900 text-sm truncate">{passenger.fullName}</p>
                                                <span className="text-[10px] text-gray-500">({passenger.type})</span>
                                            </div>
                                        )}
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={passenger.nationality}
                                                onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value)}
                                                className="w-full px-2 py-1 mt-1 text-[11px] border rounded focus:ring-2 focus:ring-gold focus:border-transparent"
                                                placeholder="Nationality"
                                            />
                                        ) : (
                                            <p className="text-[11px] text-gray-500 truncate">{passenger.nationality}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Passenger Details - Compact Grid */}
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="col-span-2 bg-white rounded p-1.5">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] text-gray-500">Passport</p>
                                        {!isEditing && (
                                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full bg-${getPassportStatus(passenger.passportExpiry).color}-50 text-${getPassportStatus(passenger.passportExpiry).color}-700`}>
                                                {getPassportStatus(passenger.passportExpiry).status}
                                            </span>
                                        )}
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={passenger.passportNumber}
                                            onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)}
                                            className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-gold focus:border-transparent"
                                            placeholder="Passport Number"
                                        />
                                    ) : (
                                        <p className="font-medium text-gray-900 tracking-wide truncate">{passenger.passportNumber}</p>
                                    )}
                                </div>
                                <div className="bg-white rounded p-1.5 relative group/date">
                                    <p className="text-[10px] text-gray-500">Date of Birth</p>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            value={passenger.dateOfBirth}
                                            onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                                            className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-gold focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="font-medium text-gray-900">{formatDate(passenger.dateOfBirth)}</p>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-emerald-50/0 opacity-0 group-hover/date:opacity-100 transition-opacity rounded pointer-events-none" />
                                </div>
                                <div className="bg-white rounded p-1.5 relative group/date">
                                    <p className="text-[10px] text-gray-500">Passport Expiry</p>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            value={passenger.passportExpiry}
                                            onChange={(e) => handlePassengerChange(index, 'passportExpiry', e.target.value)}
                                            className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-gold focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="font-medium text-gray-900">{formatDate(passenger.passportExpiry)}</p>
                                    )}
                                    {!isEditing && (
                                        <div className={`absolute inset-0 bg-gradient-to-r from-${getPassportStatus(passenger.passportExpiry).color}-50 to-${getPassportStatus(passenger.passportExpiry).color}-50/0 opacity-0 group-hover/date:opacity-100 transition-opacity rounded pointer-events-none`} />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {isEditing && (
                <div className="flex justify-end gap-2 mt-4">
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
            )}
        </div>
    );
} 
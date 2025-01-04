import { BookingData } from '../types';
import { useState } from 'react';

interface ContactDetailsProps {
    booking: BookingData;
    isEditing?: boolean;
    onEdit?: (bookingId: string, updates: Partial<BookingData>) => Promise<void>;
    onEditComplete?: () => void;
}

export function ContactDetails({
    booking,
    isEditing = false,
    onEdit,
    onEditComplete
}: ContactDetailsProps) {
    const [editForm, setEditForm] = useState({
        contactName: booking.contactName,
        contactEmail: booking.contactEmail,
        contactPhone: booking.contactPhone
    });

    const handleInputChange = (field: keyof typeof editForm, value: string) => {
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
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-forest-100/50">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-forest-100/50">
                <div className="relative">
                    <div className="absolute inset-0 bg-forest-400/10 rounded-lg blur-[2px]" />
                    <div className="relative p-1.5 bg-gradient-to-br from-forest-400/20 to-forest-400/5 rounded-lg border border-forest-400/20">
                        <svg className="w-4 h-4 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                </div>
                <div>
                    <h4 className="font-medium text-gray-900">Contact Information</h4>
                    <p className="text-[11px] text-gray-500">Primary contact details</p>
                </div>
            </div>

            <div className="space-y-2">
                <div className="bg-forest-50/50 backdrop-blur-sm p-2 rounded-lg border border-forest-100/50 transition-all duration-200 hover:shadow-sm group">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <div className="absolute inset-0 bg-forest-400/10 rounded-full blur-[2px]" />
                            <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-forest-400/20 to-forest-400/5 border border-forest-400/20 flex items-center justify-center">
                                <span className="text-xs font-medium text-forest-700">
                                    {(isEditing ? editForm.contactName : booking.contactName).split(' ').map(n => n[0]).join('')}
                                </span>
                            </div>
                        </div>
                        <div className="min-w-0">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editForm.contactName}
                                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-forest-400 focus:border-transparent bg-white"
                                    placeholder="Full Name"
                                />
                            ) : (
                                <p className="font-medium text-gray-900 text-sm">{booking.contactName}</p>
                            )}
                            <p className="text-[11px] text-gray-500">Primary Contact</p>
                        </div>
                    </div>
                </div>

                <div className="bg-forest-50/50 backdrop-blur-sm p-2 rounded-lg border border-forest-100/50 transition-all duration-200 hover:shadow-sm group">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <div className="absolute inset-0 bg-forest-400/10 rounded-full blur-[2px]" />
                            <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-forest-400/20 to-forest-400/5 border border-forest-400/20 flex items-center justify-center">
                                <svg className="w-3.5 h-3.5 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <div className="min-w-0">
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={editForm.contactEmail}
                                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-forest-400 focus:border-transparent bg-white"
                                    placeholder="Email Address"
                                />
                            ) : (
                                <p className="font-medium text-gray-900 text-sm truncate">{booking.contactEmail}</p>
                            )}
                            <p className="text-[11px] text-gray-500">Email Address</p>
                        </div>
                    </div>
                </div>

                <div className="bg-forest-50/50 backdrop-blur-sm p-2 rounded-lg border border-forest-100/50 transition-all duration-200 hover:shadow-sm group">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <div className="absolute inset-0 bg-forest-400/10 rounded-full blur-[2px]" />
                            <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-forest-400/20 to-forest-400/5 border border-forest-400/20 flex items-center justify-center">
                                <svg className="w-3.5 h-3.5 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                        </div>
                        <div className="min-w-0">
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={editForm.contactPhone}
                                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-forest-400 focus:border-transparent bg-white"
                                    placeholder="Phone Number"
                                />
                            ) : (
                                <p className="font-medium text-gray-900 text-sm truncate">{booking.contactPhone}</p>
                            )}
                            <p className="text-[11px] text-gray-500">Phone Number</p>
                        </div>
                    </div>
                </div>
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
                        className="px-4 py-2 text-sm text-white bg-forest-500 hover:bg-forest-600 rounded-lg shadow-sm"
                    >
                        Save Changes
                    </button>
                </div>
            )}
        </div>
    );
} 
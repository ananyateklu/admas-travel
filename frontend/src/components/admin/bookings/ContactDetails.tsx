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
        <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gold/10 rounded-lg">
                    <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <div>
                    <h4 className="font-medium text-gray-900">Contact Information</h4>
                    <p className="text-xs text-gray-500">Primary contact details</p>
                </div>
            </div>
            <div className="space-y-3 text-sm">
                <div className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-gold">
                                {(isEditing ? editForm.contactName : booking.contactName).split(' ').map(n => n[0]).join('')}
                            </span>
                        </div>
                        <div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editForm.contactName}
                                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-gold focus:border-transparent"
                                    placeholder="Full Name"
                                />
                            ) : (
                                <p className="font-medium text-gray-900">{booking.contactName}</p>
                            )}
                            <p className="text-xs text-gray-500">Primary Contact</p>
                        </div>
                    </div>
                </div>

                <div className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={editForm.contactEmail}
                                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-gold focus:border-transparent"
                                    placeholder="Email Address"
                                />
                            ) : (
                                <p className="font-medium text-gray-900">{booking.contactEmail}</p>
                            )}
                            <p className="text-xs text-gray-500">Email Address</p>
                        </div>
                    </div>
                </div>

                <div className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <div>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={editForm.contactPhone}
                                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-gold focus:border-transparent"
                                    placeholder="Phone Number"
                                />
                            ) : (
                                <p className="font-medium text-gray-900">{booking.contactPhone}</p>
                            )}
                            <p className="text-xs text-gray-500">Phone Number</p>
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
                        className="px-4 py-2 text-sm text-white bg-gold hover:bg-gold/90 rounded-lg"
                    >
                        Save Changes
                    </button>
                </div>
            )}
        </div>
    );
} 
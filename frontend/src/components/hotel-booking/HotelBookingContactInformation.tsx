import { HotelBookingFormData } from './HotelBookingForm';
import { useEffect, useRef } from 'react';

interface HotelContactInformationProps {
    formData: HotelBookingFormData;
    onChange: (updates: Partial<HotelBookingFormData>) => void;
    onAutoFill?: (field: 'name' | 'email' | 'phone') => string;
    showAutoFill?: boolean;
    errors?: Record<string, string>;
}

export function HotelContactInformation({
    formData,
    onChange,
    onAutoFill,
    showAutoFill
}: HotelContactInformationProps) {
    const initialized = useRef(false);

    useEffect(() => {
        const autoFillData = () => {
            if (!initialized.current && showAutoFill && onAutoFill) {
                const name = onAutoFill('name');
                const email = onAutoFill('email');
                const phone = onAutoFill('phone');

                if (name || email || phone) {
                    onChange({
                        ...formData,
                        contactName: name || formData.contactName,
                        contactEmail: email || formData.contactEmail,
                        contactPhone: phone || formData.contactPhone
                    });
                    initialized.current = true;
                }
            }
        };

        autoFillData();
    }, [showAutoFill, onAutoFill, formData, onChange]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
                <div className="space-y-3">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-900">Contact Information</h3>
                        {showAutoFill && onAutoFill && (
                            <button
                                type="button"
                                onClick={() => {
                                    const name = onAutoFill('name');
                                    const email = onAutoFill('email');
                                    const phone = onAutoFill('phone');
                                    onChange({
                                        ...formData,
                                        contactName: name,
                                        contactEmail: email,
                                        contactPhone: phone
                                    });
                                }}
                                className="text-[10px] sm:text-[11px] text-primary hover:text-primary-dark"
                            >
                                Auto-fill my information
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] sm:text-xs font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={formData.contactName}
                                onChange={(e) => onChange({ ...formData, contactName: e.target.value })}
                                className="w-full px-3 py-1.5 text-[11px] sm:text-xs border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] sm:text-xs font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={formData.contactEmail}
                                onChange={(e) => onChange({ ...formData, contactEmail: e.target.value })}
                                className="w-full px-3 py-1.5 text-[11px] sm:text-xs border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] sm:text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            value={formData.contactPhone}
                            onChange={(e) => onChange({ ...formData, contactPhone: e.target.value })}
                            className="w-full px-3 py-1.5 text-[11px] sm:text-xs border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            placeholder="Enter your phone number"
                        />
                    </div>
                </div>
            </div>

            {/* Special Requests */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
                <div className="space-y-2">
                    <label className="block text-[11px] sm:text-xs font-medium text-gray-700">Special Requests (Optional)</label>
                    <textarea
                        value={formData.specialRequests}
                        onChange={(e) => onChange({ ...formData, specialRequests: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-1.5 text-[11px] sm:text-xs border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                        placeholder="Any special requirements or preferences?"
                    />
                </div>
            </div>
        </div>
    );
} 
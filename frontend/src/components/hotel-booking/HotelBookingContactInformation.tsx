import { HotelBookingFormData } from './HotelBookingForm';

interface HotelContactInformationProps {
    formData: HotelBookingFormData;
    onChange: (updates: Partial<HotelBookingFormData>) => void;
    onAutoFill?: (field: 'name' | 'email' | 'phone') => string;
    showAutoFill?: boolean;
}

export function HotelContactInformation({
    formData,
    onChange,
    onAutoFill,
    showAutoFill
}: HotelContactInformationProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Contact Information */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900">Contact Information</h3>
                    {showAutoFill && onAutoFill && (
                        <button
                            type="button"
                            onClick={() => {
                                onChange({
                                    contactName: onAutoFill('name'),
                                    contactEmail: onAutoFill('email'),
                                    contactPhone: onAutoFill('phone')
                                });
                            }}
                            className="text-[11px] text-primary hover:text-primary-dark"
                        >
                            Auto-fill my information
                        </button>
                    )}
                </div>
                <div className="border border-gray-200 rounded-lg p-2.5 space-y-2">
                    <h4 className="text-[11px] font-medium text-gray-700">Primary Contact</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-[11px] font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                value={formData.contactName}
                                onChange={(e) => onChange({ contactName: e.target.value })}
                                className="mt-1 block w-full px-2 py-1.5 text-[11px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={formData.contactEmail}
                                onChange={(e) => onChange({ contactEmail: e.target.value })}
                                className="mt-1 block w-full px-2 py-1.5 text-[11px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                required
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-[11px] font-medium text-gray-700">Phone Number</label>
                            <input
                                type="tel"
                                value={formData.contactPhone}
                                onChange={(e) => onChange({ contactPhone: e.target.value })}
                                className="mt-1 block w-full px-2 py-1.5 text-[11px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Special Requests */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Special Requests</h3>
                <div className="border border-gray-200 rounded-lg p-2.5 space-y-2">
                    <h4 className="text-[11px] font-medium text-gray-700">Additional Information</h4>
                    <div>
                        <textarea
                            value={formData.specialRequests}
                            onChange={(e) => onChange({ specialRequests: e.target.value })}
                            className="mt-1 block w-full px-2 py-1.5 text-[11px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                            rows={4}
                            placeholder="Any special requirements or preferences? Let us know here..."
                        />
                        <p className="mt-1.5 text-[10px] text-gray-500">
                            Examples: Dietary restrictions, mobility assistance, room preferences
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 
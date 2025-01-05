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
        <div className="space-y-4">
            <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
                    Full Name
                </label>
                <div className="mt-1 relative">
                    <input
                        type="text"
                        id="contactName"
                        value={formData.contactName}
                        onChange={(e) => onChange({ contactName: e.target.value })}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        required
                    />
                    {showAutoFill && onAutoFill && (
                        <button
                            type="button"
                            onClick={() => onChange({ contactName: onAutoFill('name') })}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-primary hover:text-primary-dark"
                        >
                            Auto-fill
                        </button>
                    )}
                </div>
            </div>

            <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <div className="mt-1 relative">
                    <input
                        type="email"
                        id="contactEmail"
                        value={formData.contactEmail}
                        onChange={(e) => onChange({ contactEmail: e.target.value })}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        required
                    />
                    {showAutoFill && onAutoFill && (
                        <button
                            type="button"
                            onClick={() => onChange({ contactEmail: onAutoFill('email') })}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-primary hover:text-primary-dark"
                        >
                            Auto-fill
                        </button>
                    )}
                </div>
            </div>

            <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                </label>
                <div className="mt-1 relative">
                    <input
                        type="tel"
                        id="contactPhone"
                        value={formData.contactPhone}
                        onChange={(e) => onChange({ contactPhone: e.target.value })}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        required
                    />
                    {showAutoFill && onAutoFill && (
                        <button
                            type="button"
                            onClick={() => onChange({ contactPhone: onAutoFill('phone') })}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-primary hover:text-primary-dark"
                        >
                            Auto-fill
                        </button>
                    )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                    We'll only use this to contact you about your booking
                </p>
            </div>
        </div>
    );
} 
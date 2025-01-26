import { HotelDetails } from '../../types/hotelDetails';
import { HotelBookingFormData, GuestInfo } from './HotelBookingForm';
import { motion } from 'framer-motion';

interface GuestInformationProps {
    hotel: HotelDetails;
    formData: HotelBookingFormData;
    onChange: (updates: Partial<HotelBookingFormData>) => void;
    onAutoFill?: () => GuestInfo | null;
    showAutoFill?: boolean;
    errors?: Record<string, string>;
}

export function GuestInformation({
    formData,
    onChange,
    onAutoFill,
    showAutoFill
}: GuestInformationProps) {
    return (
        <div className="space-y-4">
            {/* Guest Information */}
            <div className="space-y-4">
                {formData.guests.map((guest, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-3"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-gray-900">
                                    Guest {index + 1} Information
                                </h3>
                                {showAutoFill && onAutoFill && index === 0 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const autoFilledGuest = onAutoFill();
                                            if (autoFilledGuest) {
                                                const updatedGuests = [...formData.guests];
                                                updatedGuests[index] = autoFilledGuest;
                                                onChange({ ...formData, guests: updatedGuests });
                                            }
                                        }}
                                        className="text-[11px] text-primary hover:text-primary-dark"
                                    >
                                        Auto-fill my information
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="block text-[11px] sm:text-xs font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={guest.fullName}
                                        onChange={(e) => {
                                            const newGuests = [...formData.guests];
                                            newGuests[index] = { ...guest, fullName: e.target.value };
                                            onChange({ ...formData, guests: newGuests });
                                        }}
                                        required
                                        className="w-full px-3 py-1.5 text-[11px] sm:text-xs border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="Enter full name"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-[11px] sm:text-xs font-medium text-gray-700">
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        value={guest.dateOfBirth}
                                        onChange={(e) => {
                                            const newGuests = [...formData.guests];
                                            newGuests[index] = { ...guest, dateOfBirth: e.target.value };
                                            onChange({ ...formData, guests: newGuests });
                                        }}
                                        required
                                        max={new Date().toISOString().split('T')[0]}
                                        className="w-full px-3 py-1.5 text-[11px] sm:text-xs border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-[11px] sm:text-xs font-medium text-gray-700">
                                        Nationality
                                    </label>
                                    <input
                                        type="text"
                                        value={guest.nationality}
                                        onChange={(e) => {
                                            const newGuests = [...formData.guests];
                                            newGuests[index] = { ...guest, nationality: e.target.value };
                                            onChange({ ...formData, guests: newGuests });
                                        }}
                                        required
                                        className="w-full px-3 py-1.5 text-[11px] sm:text-xs border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="Enter nationality"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Guest Button */}
            {formData.guests.length < formData.numberOfGuests && (
                <motion.button
                    type="button"
                    onClick={() => {
                        onChange({
                            ...formData,
                            guests: [
                                ...formData.guests,
                                {
                                    fullName: '',
                                    dateOfBirth: '',
                                    nationality: '',
                                    idNumber: '',
                                    idExpiry: ''
                                }
                            ]
                        });
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-2 text-[11px] sm:text-xs border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400"
                >
                    Add Guest
                </motion.button>
            )}
        </div>
    );
} 
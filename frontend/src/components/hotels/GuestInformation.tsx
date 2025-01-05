import { HotelDetails } from '../../types/hotelTypes';
import { HotelBookingFormData, GuestInfo } from './HotelBookingForm';
import { RoomSelection } from './RoomSelection';

interface GuestInformationProps {
    hotel: HotelDetails;
    formData: HotelBookingFormData;
    onChange: (updates: Partial<HotelBookingFormData>) => void;
    onAutoFill?: () => GuestInfo | null;
    showAutoFill?: boolean;
}

export function GuestInformation({
    hotel,
    formData,
    onChange,
    onAutoFill,
    showAutoFill
}: GuestInformationProps) {
    const handleGuestChange = (index: number, field: keyof typeof formData.guests[0], value: string) => {
        const newGuests = [...formData.guests];
        newGuests[index] = { ...newGuests[index], [field]: value };
        onChange({ guests: newGuests });
    };

    const handleNumberOfGuestsChange = (value: number) => {
        const newGuests = [...formData.guests];
        if (value > newGuests.length) {
            // Add new guests
            for (let i = newGuests.length; i < value; i++) {
                newGuests.push({
                    fullName: '',
                    dateOfBirth: '',
                    nationality: '',
                    idNumber: '',
                    idExpiry: ''
                });
            }
        } else {
            // Remove guests
            newGuests.splice(value);
        }
        onChange({
            numberOfGuests: value,
            guests: newGuests
        });
    };

    return (
        <div className="space-y-8">
            {/* Room Selection */}
            <RoomSelection
                hotel={hotel}
                selectedRoomId={formData.roomType}
                onSelect={(roomId) => onChange({ roomType: roomId })}
            />

            {/* Number of Rooms and Guests */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="numberOfRooms" className="block text-sm font-medium text-gray-700">
                        Number of Rooms
                    </label>
                    <select
                        id="numberOfRooms"
                        value={formData.numberOfRooms}
                        onChange={(e) => onChange({ numberOfRooms: parseInt(e.target.value) })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                        {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                                {num} Room{num > 1 ? 's' : ''}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="numberOfGuests" className="block text-sm font-medium text-gray-700">
                        Number of Guests
                    </label>
                    <select
                        id="numberOfGuests"
                        value={formData.numberOfGuests}
                        onChange={(e) => handleNumberOfGuestsChange(parseInt(e.target.value))}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                        {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                                {num} Guest{num > 1 ? 's' : ''}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="numberOfNights" className="block text-sm font-medium text-gray-700">
                        Number of Nights
                    </label>
                    <select
                        id="numberOfNights"
                        value={formData.numberOfNights || 1}
                        onChange={(e) => {
                            const nights = parseInt(e.target.value);
                            const checkIn = new Date(formData.checkInDate);
                            const checkOut = new Date(checkIn);
                            checkOut.setDate(checkOut.getDate() + nights);
                            onChange({
                                numberOfNights: nights,
                                checkOutDate: checkOut.toISOString().split('T')[0]
                            });
                        }}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                                {num} Night{num > 1 ? 's' : ''}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Guest Details */}
            <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Guest Details</h3>
                {formData.guests.map((guest, index) => (
                    <div
                        key={`guest-${guest.idNumber || guest.fullName || index}`}
                        className="border border-gray-200 rounded-lg p-4 space-y-4"
                    >
                        <div className="flex justify-between items-center">
                            <h4 className="font-medium text-gray-700">Guest {index + 1}</h4>
                            {index === 0 && showAutoFill && onAutoFill && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const autoFilledGuest = onAutoFill();
                                        if (autoFilledGuest) {
                                            const newGuests = [...formData.guests];
                                            newGuests[index] = autoFilledGuest;
                                            onChange({ guests: newGuests });
                                        }
                                    }}
                                    className="text-xs text-primary hover:text-primary-dark"
                                >
                                    Auto-fill my information
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    value={guest.fullName}
                                    onChange={(e) => handleGuestChange(index, 'fullName', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                <input
                                    type="date"
                                    value={guest.dateOfBirth}
                                    onChange={(e) => handleGuestChange(index, 'dateOfBirth', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nationality</label>
                                <input
                                    type="text"
                                    value={guest.nationality}
                                    onChange={(e) => handleGuestChange(index, 'nationality', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">ID Number</label>
                                <input
                                    type="text"
                                    value={guest.idNumber}
                                    onChange={(e) => handleGuestChange(index, 'idNumber', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">ID Expiry Date</label>
                                <input
                                    type="date"
                                    value={guest.idExpiry}
                                    onChange={(e) => handleGuestChange(index, 'idExpiry', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 
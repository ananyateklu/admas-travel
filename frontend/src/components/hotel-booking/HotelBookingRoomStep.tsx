import { HotelDetails } from '../../types/hotelDetails';
import { HotelBookingFormData } from './HotelBookingForm';
import { RoomSelection } from './HotelBookingRoomSelection';

interface RoomStepProps {
    hotel: HotelDetails;
    formData: HotelBookingFormData;
    onChange: (data: Partial<HotelBookingFormData>) => void;
    errors?: Record<string, string>;
}

export function HotelBookingRoomStep({ hotel, formData, onChange, errors }: RoomStepProps) {
    return (
        <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-300 hover:border-gray-400 transition-colors">
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-300">
                    <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-xs font-medium text-gray-700">Room Selection</h4>
                            <p className="text-[10px] text-gray-500">Choose your preferred room type</p>
                        </div>
                    </div>
                </div>
                <div className="p-3">
                    <RoomSelection
                        hotel={hotel}
                        selectedRoomId={formData.roomType}
                        onSelect={(roomId) => onChange({ ...formData, roomType: roomId })}
                    />
                    {errors?.roomType && (
                        <p className="mt-1 text-xs text-red-500">{errors.roomType}</p>
                    )}

                    {/* Room and Guest Selection - One line on mobile */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                        <div className="space-y-1">
                            <label className="block text-[11px] sm:text-xs font-medium text-gray-700">
                                Number of Rooms
                            </label>
                            <select
                                value={formData.numberOfRooms}
                                onChange={(e) => onChange({ ...formData, numberOfRooms: parseInt(e.target.value) })}
                                className={`w-full px-3 py-1.5 text-[11px] sm:text-xs border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors?.numberOfRooms ? 'border-red-500' : ''}`}
                            >
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <option key={num} value={num}>
                                        {num} Room{num !== 1 ? 's' : ''}
                                    </option>
                                ))}
                            </select>
                            {errors?.numberOfRooms && (
                                <p className="mt-1 text-xs text-red-500">{errors.numberOfRooms}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="block text-[11px] sm:text-xs font-medium text-gray-700">
                                Number of Guests
                            </label>
                            <select
                                value={formData.numberOfGuests}
                                onChange={(e) => onChange({ ...formData, numberOfGuests: parseInt(e.target.value) })}
                                className={`w-full px-3 py-1.5 text-[11px] sm:text-xs border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors?.numberOfGuests ? 'border-red-500' : ''}`}
                            >
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <option key={num} value={num}>
                                        {num} Guest{num !== 1 ? 's' : ''}
                                    </option>
                                ))}
                            </select>
                            {errors?.numberOfGuests && (
                                <p className="mt-1 text-xs text-red-500">{errors.numberOfGuests}</p>
                            )}
                        </div>

                        {/* Check-in and Nights - One line on mobile */}
                        <div className="space-y-1">
                            <label className="block text-[11px] sm:text-xs font-medium text-gray-700">
                                Check-in Date
                            </label>
                            <input
                                type="date"
                                value={formData.checkInDate}
                                onChange={(e) => onChange({ ...formData, checkInDate: e.target.value })}
                                min={new Date().toISOString().split('T')[0]}
                                className={`w-full px-3 py-1.5 text-[11px] sm:text-xs border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors?.checkInDate ? 'border-red-500' : ''}`}
                            />
                            {errors?.checkInDate && (
                                <p className="mt-1 text-xs text-red-500">{errors.checkInDate}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="block text-[11px] sm:text-xs font-medium text-gray-700">
                                Number of Nights
                            </label>
                            <select
                                value={formData.numberOfNights}
                                onChange={(e) => {
                                    const nights = parseInt(e.target.value);
                                    const checkIn = new Date(formData.checkInDate);
                                    const checkOut = new Date(checkIn);
                                    checkOut.setDate(checkOut.getDate() + nights);
                                    onChange({
                                        ...formData,
                                        numberOfNights: nights,
                                        checkOutDate: checkOut.toISOString().split('T')[0]
                                    });
                                }}
                                className="w-full px-3 py-1.5 text-[11px] sm:text-xs border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                    <option key={num} value={num}>
                                        {num} Night{num !== 1 ? 's' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
import { HotelDetails } from '../../types/hotelDetails';
import { HotelBookingFormData } from './HotelBookingForm';
import { formatDate } from '../../utils/dateUtils';

interface HotelBookingReviewProps {
    hotel: HotelDetails;
    formData: HotelBookingFormData;
}

export function HotelBookingReview({ hotel, formData }: HotelBookingReviewProps) {
    const selectedRoom = hotel.rooms[formData.roomType || ''];
    if (!selectedRoom) return null;

    // Calculate number of nights
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const numberOfNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate total price
    const pricePerNight = selectedRoom.price.amount;
    const totalPrice = pricePerNight * numberOfNights * formData.numberOfRooms;

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900">Booking Summary</h3>
                <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
                    {/* Dates Section */}
                    <div className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Check-in</p>
                                <p className="mt-1 text-sm text-gray-600">{formatDate(formData.checkInDate)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Check-out</p>
                                <p className="mt-1 text-sm text-gray-600">{formatDate(formData.checkOutDate)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Room Details Section */}
                    <div className="p-4">
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Room Type</p>
                                <p className="mt-1 text-sm text-gray-600">{selectedRoom.room_name}</p>
                            </div>
                            {selectedRoom.facilities && selectedRoom.facilities.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Room Amenities</p>
                                    <p className="mt-1 text-sm text-gray-600">
                                        {selectedRoom.facilities.map(f => f.name).join(' • ')}
                                    </p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-medium text-gray-900">Guests</p>
                                <p className="mt-1 text-sm text-gray-600">
                                    {formData.numberOfGuests} guest{formData.numberOfGuests !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Price Details Section */}
                    <div className="p-4">
                        <p className="text-sm font-medium text-gray-900 mb-3">Price Details</p>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>{selectedRoom.price.amount} {selectedRoom.price.currency} × {numberOfNights} night{numberOfNights !== 1 ? 's' : ''}</span>
                                <span>{(selectedRoom.price.amount * numberOfNights).toFixed(2)} {selectedRoom.price.currency}</span>
                            </div>
                            {formData.numberOfRooms > 1 && (
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>{formData.numberOfRooms} rooms</span>
                                    <span>×{formData.numberOfRooms}</span>
                                </div>
                            )}
                            <div className="pt-2 mt-2 border-t border-gray-200">
                                <div className="flex justify-between">
                                    <span className="text-base font-semibold text-gray-900">Total Price</span>
                                    <span className="text-base font-semibold text-primary">
                                        {totalPrice.toFixed(2)} {selectedRoom.price.currency}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Includes taxes and fees</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Guest Information Section */}
            <div>
                <h3 className="text-lg font-medium text-gray-900">Guest Information</h3>
                <div className="mt-4 space-y-4">
                    {formData.guests.map((guest, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <p className="font-medium text-gray-900 mb-3">Guest {index + 1}</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Full Name</p>
                                    <p className="mt-1 text-sm text-gray-600">{guest.fullName}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Nationality</p>
                                    <p className="mt-1 text-sm text-gray-600">{guest.nationality}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Information Section */}
            <div>
                <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-900">Name</p>
                            <p className="mt-1 text-sm text-gray-600">{formData.contactName}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">Email</p>
                            <p className="mt-1 text-sm text-gray-600">{formData.contactEmail}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">Phone</p>
                            <p className="mt-1 text-sm text-gray-600">{formData.contactPhone}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Special Requests Section */}
            {formData.specialRequests && (
                <div>
                    <h3 className="text-lg font-medium text-gray-900">Special Requests</h3>
                    <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">{formData.specialRequests}</p>
                    </div>
                </div>
            )}
        </div>
    );
} 
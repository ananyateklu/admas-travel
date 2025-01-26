import { HotelDetails } from '../../types/hotelDetails';
import { HotelBookingFormData } from './HotelBookingForm';
import { formatDate } from '../../utils/dateUtils';

interface HotelBookingReviewProps {
    hotel: HotelDetails;
    formData: HotelBookingFormData;
    errors?: Record<string, string>;
}

export function HotelBookingReview({ hotel, formData }: HotelBookingReviewProps) {
    const selectedRoom = hotel.rooms[formData.roomType ?? ''];
    if (!selectedRoom) return null;

    // Calculate number of nights
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const numberOfNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate total price
    const pricePerNight = selectedRoom.price.amount;
    const totalPrice = pricePerNight * numberOfNights * formData.numberOfRooms;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Left Column - Booking Summary and Price */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Booking Summary</h3>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
                    {/* Dates Section */}
                    <div className="p-2.5">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-[11px] font-medium text-gray-900">Check-in</p>
                                <p className="mt-0.5 text-[11px] text-gray-600">{formatDate(formData.checkInDate)}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-medium text-gray-900">Check-out</p>
                                <p className="mt-0.5 text-[11px] text-gray-600">{formatDate(formData.checkOutDate)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Room Details Section */}
                    <div className="p-2.5">
                        <div className="space-y-2">
                            <div>
                                <p className="text-[11px] font-medium text-gray-900">Room Type</p>
                                <p className="mt-0.5 text-[11px] text-gray-600">{selectedRoom.room_name}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <p className="text-[11px] font-medium text-gray-900">Duration & Rooms</p>
                                    <p className="mt-0.5 text-[11px] text-gray-600">
                                        {numberOfNights} night{numberOfNights !== 1 ? 's' : ''} • {formData.numberOfRooms} room{formData.numberOfRooms !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-medium text-gray-900">Guests</p>
                                    <p className="mt-0.5 text-[11px] text-gray-600">
                                        {formData.numberOfGuests} guest{formData.numberOfGuests !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                            {selectedRoom.facilities && selectedRoom.facilities.length > 0 && (
                                <div>
                                    <p className="text-[11px] font-medium text-gray-900">Room Amenities</p>
                                    <p className="mt-0.5 text-[11px] text-gray-600">
                                        {selectedRoom.facilities.map(f => f.name).join(' • ')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Price Section */}
                    <div className="p-2.5">
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <p className="text-[11px] text-gray-600">Price per night</p>
                                <p className="text-[11px] font-medium text-gray-900">
                                    {selectedRoom.price.currency} {pricePerNight.toFixed(2)}
                                </p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-[11px] text-gray-600">Duration & Rooms</p>
                                <p className="text-[11px] font-medium text-gray-900">
                                    {numberOfNights} nights × {formData.numberOfRooms} rooms
                                </p>
                            </div>
                            <div className="pt-2 mt-2 border-t border-gray-100 flex justify-between items-center">
                                <p className="text-[11px] font-medium text-gray-900">Total Price</p>
                                <p className="text-sm font-bold text-primary">
                                    {selectedRoom.price.currency} {totalPrice.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column - Guest and Contact Information */}
            <div className="space-y-3">
                {/* Guest Information */}
                <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Guest Information</h3>
                    <div className="space-y-2">
                        {formData.guests.map((guest) => (
                            <div
                                key={`${guest.fullName}-${guest.idNumber}`}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-2.5"
                            >
                                <p className="text-[11px] font-medium text-gray-900 mb-2">Guest Information</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="text-[11px] font-medium text-gray-900">Full Name</p>
                                        <p className="mt-0.5 text-[11px] text-gray-600">{guest.fullName}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-medium text-gray-900">Nationality</p>
                                        <p className="mt-0.5 text-[11px] text-gray-600">{guest.nationality}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Information */}
                <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Contact Information</h3>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2.5">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-[11px] font-medium text-gray-900">Name</p>
                                <p className="mt-0.5 text-[11px] text-gray-600">{formData.contactName}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-medium text-gray-900">Email</p>
                                <p className="mt-0.5 text-[11px] text-gray-600">{formData.contactEmail}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-medium text-gray-900">Phone</p>
                                <p className="mt-0.5 text-[11px] text-gray-600">{formData.contactPhone}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Special Requests */}
                {formData.specialRequests && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Special Requests</h3>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2.5">
                            <p className="text-[11px] text-gray-600">{formData.specialRequests}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 
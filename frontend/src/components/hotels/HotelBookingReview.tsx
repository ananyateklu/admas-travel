import { HotelDetails } from '../../types/hotelTypes';
import { HotelBookingFormData } from './HotelBookingForm';
import { formatDate } from '../../utils/dateUtils';

interface HotelBookingReviewProps {
    hotel: HotelDetails;
    formData: HotelBookingFormData;
}

export function HotelBookingReview({ hotel, formData }: HotelBookingReviewProps) {
    const selectedRoom = hotel.rooms.find(room => room.id === formData.roomType);

    // Calculate number of nights
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const numberOfNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate total price
    const pricePerNight = selectedRoom?.price.amount ?? 0;
    const totalPrice = pricePerNight * numberOfNights * formData.numberOfRooms;

    return (
        <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Summary</h3>

                {/* Hotel Information */}
                <div className="mb-6">
                    <h4 className="font-medium text-gray-700">Hotel Details</h4>
                    <p className="text-gray-600">{hotel.property.name}</p>
                    {hotel.property.location?.address && (
                        <p className="text-gray-600">{hotel.property.location.address}</p>
                    )}
                </div>

                {/* Room Information */}
                <div className="mb-6">
                    <h4 className="font-medium text-gray-700">Room Details</h4>
                    <p className="text-gray-600">{selectedRoom?.name}</p>
                    <p className="text-gray-600">
                        {numberOfNights} Night{numberOfNights !== 1 ? 's' : ''}, {formData.numberOfRooms} room{formData.numberOfRooms !== 1 ? 's' : ''}
                    </p>
                    <p className="text-gray-600">Check-in: {formatDate(formData.checkInDate)}</p>
                    <p className="text-gray-600">Check-out: {formatDate(formData.checkOutDate)}</p>
                </div>

                {/* Guest Information */}
                <div className="mb-6">
                    <h4 className="font-medium text-gray-700">Guest Information</h4>
                    {formData.guests.map((guest) => (
                        <div key={`guest-${guest.idNumber || guest.fullName}`} className="mt-2">
                            <p className="text-gray-600">Guest {guest.fullName}</p>
                        </div>
                    ))}
                </div>

                {/* Contact Information */}
                <div className="mb-6">
                    <h4 className="font-medium text-gray-700">Contact Information</h4>
                    <p className="text-gray-600">{formData.contactName}</p>
                    <p className="text-gray-600">{formData.contactEmail}</p>
                    <p className="text-gray-600">{formData.contactPhone}</p>
                </div>

                {/* Special Requests */}
                {formData.specialRequests && (
                    <div className="mb-6">
                        <h4 className="font-medium text-gray-700">Special Requests</h4>
                        <p className="text-gray-600">{formData.specialRequests}</p>
                    </div>
                )}

                {/* Price Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-700">Price Summary</h4>
                    <div className="mt-2 space-y-2">
                        <div className="flex justify-between text-gray-600">
                            <span>Room Rate ({numberOfNights} night{numberOfNights !== 1 ? 's' : ''} × {formData.numberOfRooms} room{formData.numberOfRooms !== 1 ? 's' : ''})</span>
                            <span>{selectedRoom?.price.currency} {pricePerNight.toFixed(2)} per night</span>
                        </div>
                        <div className="flex justify-between font-medium text-gray-900 pt-2 border-t">
                            <span>Total Price</span>
                            <span>{selectedRoom?.price.currency} {totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
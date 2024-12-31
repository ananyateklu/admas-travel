import { BookingData } from './types';

interface PassengerDetailsProps {
    booking: BookingData;
}

export function PassengerDetails({ booking }: PassengerDetailsProps) {
    return (
        <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gold/10 rounded-lg">
                    <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <div>
                    <h4 className="font-medium text-gray-900">Passengers</h4>
                    <p className="text-xs text-gray-500">{booking.passengers.length} total passengers</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {booking.passengers.map((passenger) => (
                    <div
                        key={`${passenger.passportNumber}-${passenger.fullName}`}
                        className="bg-gray-50 rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                                <span className="text-sm font-medium text-gold">
                                    {passenger.fullName.split(' ').map(n => n[0]).join('')}
                                </span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{passenger.fullName}</p>
                                <p className="text-sm text-gray-500 capitalize">{passenger.type} Passenger</p>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p><span className="font-medium">Nationality:</span> {passenger.nationality}</p>
                            <p><span className="font-medium">Passport:</span> {passenger.passportNumber}</p>
                            <p><span className="font-medium">Passport Expiry:</span> {passenger.passportExpiry}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 
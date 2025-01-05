import { HotelDetails } from '../../types/hotelTypes';

interface RoomSelectionProps {
    hotel: HotelDetails;
    selectedRoomId?: string;
    onSelect: (roomId: string) => void;
}

export function RoomSelection({ hotel, selectedRoomId, onSelect }: RoomSelectionProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Select Room Type</h3>
            <div className="grid gap-4">
                {hotel.rooms.map((room) => (
                    <div
                        key={room.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedRoomId === room.id
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                            : 'border-gray-200 hover:border-primary/40'
                            }`}
                        onClick={() => onSelect(room.id)}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-medium text-gray-900">{room.name}</h4>
                                <p className="text-sm text-gray-500 mt-1">{room.description}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {room.amenities.map((amenity) => (
                                        <span
                                            key={`${room.id}-${amenity}`}
                                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                        >
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-semibold text-gray-900">
                                    {room.price.currency} {room.price.amount.toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-500">per night</div>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-600">
                            <div>Max Occupancy: {room.capacity.adults} adults, {room.capacity.children} children</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 
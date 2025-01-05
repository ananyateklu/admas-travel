import { HotelDetails } from '../../types/hotelDetails';

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
                {Object.entries(hotel.rooms).map(([roomId, room]) => (
                    <div
                        key={roomId}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedRoomId === roomId
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                            : 'border-gray-200 hover:border-primary/40'
                            }`}
                        onClick={() => onSelect(roomId)}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-medium text-gray-900">{room.room_name}</h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    {room.facilities?.map(f => f.name).join(', ') || 'No amenities listed'}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {room.facilities?.map((facility) => (
                                        <span
                                            key={`${roomId}-${facility.id}`}
                                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                        >
                                            {facility.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 
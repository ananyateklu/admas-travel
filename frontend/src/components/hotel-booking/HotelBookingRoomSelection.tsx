import { HotelDetails } from '../../types/hotelDetails';

interface RoomSelectionProps {
    hotel: HotelDetails;
    selectedRoomId?: string;
    onSelect: (roomId: string) => void;
}

export function RoomSelection({ hotel, selectedRoomId, onSelect }: RoomSelectionProps) {
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Select Room Type</h3>
            <div className="grid gap-3">
                {Object.entries(hotel.rooms).map(([roomId, room]) => (
                    <div
                        key={roomId}
                        className={`p-2.5 sm:p-3 border rounded-lg cursor-pointer transition-all ${selectedRoomId === roomId
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                            : 'border-gray-200 hover:border-primary/40'
                            }`}
                        onClick={() => onSelect(roomId)}
                    >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-3">
                            <div className="space-y-1.5 sm:space-y-2 flex-grow">
                                <h4 className="text-xs sm:text-sm font-medium text-gray-900">{room.room_name}</h4>
                                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                                    {room.facilities?.map((facility) => (
                                        <span
                                            key={`${roomId}-${facility.id}`}
                                            className="inline-flex items-center px-1 sm:px-1.5 py-0.5 rounded-full text-[9px] sm:text-[11px] font-medium bg-gray-100 text-gray-800"
                                        >
                                            {facility.name}
                                        </span>
                                    ))}
                                </div>
                                <div className="text-[9px] sm:text-[11px] text-gray-500">
                                    {room.facilities?.length ? `${room.facilities.length} amenities available` : 'No amenities available'}
                                </div>
                            </div>
                            <div className="flex sm:flex-col items-center sm:items-end gap-1.5 sm:gap-0.5">
                                <div className="text-sm sm:text-base font-semibold text-primary">
                                    {room.price.currency} {room.price.amount.toFixed(2)}
                                </div>
                                <div className="text-[9px] sm:text-[10px] text-gray-500">per night</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 
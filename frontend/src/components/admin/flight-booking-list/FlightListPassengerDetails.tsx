import { FlightBookingData } from '../types';

export type PassengerInfo = {
    type: string;
    fullName: string;
    dateOfBirth: string;
    passportNumber: string;
    passportExpiry: string;
    nationality: string;
};

interface PassengerDetailsProps {
    booking: FlightBookingData;
    isEditing: boolean;
    editForm?: Partial<FlightBookingData>;
    onInputChange: (field: keyof FlightBookingData, value: string | PassengerInfo[] | null) => void;
}

export function PassengerDetails({
    booking,
    isEditing,
    editForm,
    onInputChange
}: PassengerDetailsProps) {
    const formatDate = (date: string) => {
        const d = new Date(date);
        return d.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getPassportStatus = (expiryDate: string) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const monthsLeft = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30));

        if (monthsLeft < 0) return { status: 'expired', color: 'red' };
        if (monthsLeft < 6) return { status: 'expiring', color: 'yellow' };
        return { status: 'valid', color: 'emerald' };
    };

    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-forest-100/50">
            {/* Compact Header */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-forest-100/50">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <div className="absolute inset-0 bg-forest-400/10 rounded-lg blur-[2px]" />
                        <div className="relative p-1.5 bg-gradient-to-br from-forest-400/20 to-forest-400/5 rounded-lg border border-forest-400/20">
                            <svg className="w-4 h-4 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">Passengers</h4>
                            <div className="flex gap-1.5">
                                {booking.passengers.some(p => p.type === 'adult') && (
                                    <span className="text-[10px] px-1.5 py-0.5 bg-forest-50 text-forest-700 rounded-full font-medium">
                                        {booking.passengers.filter(p => p.type === 'adult').length}A
                                    </span>
                                )}
                                {booking.passengers.some(p => p.type === 'child') && (
                                    <span className="text-[10px] px-1.5 py-0.5 bg-forest-50/50 text-forest-600 rounded-full font-medium">
                                        {booking.passengers.filter(p => p.type === 'child').length}C
                                    </span>
                                )}
                            </div>
                        </div>
                        <p className="text-[11px] text-gray-500">{booking.class} Class</p>
                    </div>
                </div>
            </div>

            {/* Compact Passenger Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {(isEditing ? editForm?.passengers ?? booking.passengers : booking.passengers).map((passenger, index) => {
                    const passportStatus = getPassportStatus(passenger.passportExpiry);
                    return (
                        <div
                            key={`${passenger.passportNumber}-${passenger.fullName}`}
                            className="group bg-forest-50/50 backdrop-blur-sm rounded-lg p-3 hover:shadow-md transition-all duration-200 border border-forest-100/50"
                        >
                            {/* Passenger Header - More Compact */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-forest-400/10 rounded-full blur-[2px]" />
                                        <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-forest-400/20 to-forest-400/5 border border-forest-400/20 flex items-center justify-center">
                                            <span className="text-xs font-medium text-forest-700">
                                                {passenger.fullName.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5">
                                            <span className={`text-[9px] px-1 py-0.5 rounded-full font-medium ${passenger.type === 'adult'
                                                ? 'bg-forest-100 text-forest-700'
                                                : 'bg-forest-50 text-forest-600'
                                                }`}>
                                                {index + 1}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="min-w-0">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={passenger.fullName}
                                                onChange={(e) => onInputChange('passengers', [
                                                    ...(editForm?.passengers ?? booking.passengers).slice(0, index),
                                                    { ...passenger, fullName: e.target.value },
                                                    ...(editForm?.passengers ?? booking.passengers).slice(index + 1)
                                                ])}
                                                className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-forest-400 focus:border-transparent bg-white"
                                                placeholder="Full Name"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-1">
                                                <p className="font-medium text-gray-900 text-sm truncate">{passenger.fullName}</p>
                                                <span className="text-[10px] text-gray-500">({passenger.type})</span>
                                            </div>
                                        )}
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={passenger.nationality}
                                                onChange={(e) => onInputChange('passengers', [
                                                    ...(editForm?.passengers ?? booking.passengers).slice(0, index),
                                                    { ...passenger, nationality: e.target.value },
                                                    ...(editForm?.passengers ?? booking.passengers).slice(index + 1)
                                                ])}
                                                className="w-full px-2 py-1 mt-1 text-[11px] border rounded focus:ring-2 focus:ring-forest-400 focus:border-transparent bg-white"
                                                placeholder="Nationality"
                                            />
                                        ) : (
                                            <p className="text-[11px] text-gray-500 truncate">{passenger.nationality}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Passenger Details - Compact Grid */}
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="col-span-2 bg-white/80 backdrop-blur-sm rounded-lg p-1.5 border border-forest-100/50">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] text-gray-500">Passport</p>
                                        {!isEditing && (
                                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full bg-${passportStatus.color}-50 text-${passportStatus.color}-700`}>
                                                {passportStatus.status}
                                            </span>
                                        )}
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={passenger.passportNumber}
                                            onChange={(e) => onInputChange('passengers', [
                                                ...(editForm?.passengers ?? booking.passengers).slice(0, index),
                                                { ...passenger, passportNumber: e.target.value },
                                                ...(editForm?.passengers ?? booking.passengers).slice(index + 1)
                                            ])}
                                            className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-forest-400 focus:border-transparent bg-white"
                                            placeholder="Passport Number"
                                        />
                                    ) : (
                                        <p className="font-medium text-gray-900 tracking-wide truncate">{passenger.passportNumber}</p>
                                    )}
                                </div>
                                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-1.5 border border-forest-100/50 relative group/date">
                                    <p className="text-[10px] text-gray-500">Date of Birth</p>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            value={passenger.dateOfBirth}
                                            onChange={(e) => onInputChange('passengers', [
                                                ...(editForm?.passengers ?? booking.passengers).slice(0, index),
                                                { ...passenger, dateOfBirth: e.target.value },
                                                ...(editForm?.passengers ?? booking.passengers).slice(index + 1)
                                            ])}
                                            className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-forest-400 focus:border-transparent bg-white"
                                        />
                                    ) : (
                                        <p className="font-medium text-gray-900">{formatDate(passenger.dateOfBirth)}</p>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-r from-forest-50 to-forest-50/0 opacity-0 group-hover/date:opacity-100 transition-opacity rounded-lg pointer-events-none" />
                                </div>
                                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-1.5 border border-forest-100/50 relative group/date">
                                    <p className="text-[10px] text-gray-500">Passport Expiry</p>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            value={passenger.passportExpiry}
                                            onChange={(e) => onInputChange('passengers', [
                                                ...(editForm?.passengers ?? booking.passengers).slice(0, index),
                                                { ...passenger, passportExpiry: e.target.value },
                                                ...(editForm?.passengers ?? booking.passengers).slice(index + 1)
                                            ])}
                                            className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-forest-400 focus:border-transparent bg-white"
                                        />
                                    ) : (
                                        <p className="font-medium text-gray-900">{formatDate(passenger.passportExpiry)}</p>
                                    )}
                                    {!isEditing && (
                                        <div className={`absolute inset-0 bg-gradient-to-r from-${passportStatus.color}-50 to-${passportStatus.color}-50/0 opacity-0 group-hover/date:opacity-100 transition-opacity rounded-lg pointer-events-none`} />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
} 
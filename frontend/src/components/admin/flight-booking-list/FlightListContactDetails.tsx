import { FlightBookingData } from '../types';

interface ContactDetailsProps {
    booking: FlightBookingData;
    isEditing: boolean;
    editForm?: Partial<FlightBookingData>;
    onInputChange: (field: keyof FlightBookingData, value: string) => void;
}

export function ContactDetails({
    booking,
    isEditing,
    editForm = {},
    onInputChange
}: ContactDetailsProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-forest-100/50">
                <div className="relative">
                    <div className="absolute inset-0 bg-forest-400/10 rounded-lg blur-[2px]" />
                    <div className="relative p-1.5 bg-gradient-to-br from-forest-400/20 to-forest-400/5 rounded-lg border border-forest-400/20">
                        <svg className="w-4 h-4 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                </div>
                <div>
                    <h4 className="font-medium text-gray-900">Contact Details</h4>
                    <p className="text-[11px] text-gray-500">Passenger contact information</p>
                </div>
            </div>

            <div className="space-y-2 text-sm">
                {/* Contact Name */}
                <div className="flex items-center justify-between p-2 bg-forest-50/50 backdrop-blur-sm rounded-lg border border-forest-100/50 transition-all duration-200 hover:shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <div className="absolute inset-0 bg-forest-400/10 rounded-lg blur-[2px]" />
                            <div className="relative p-1.5 bg-gradient-to-br from-forest-400/20 to-forest-400/5 rounded-lg border border-forest-400/20">
                                <div className="w-6 h-6 rounded-lg bg-forest-100 flex items-center justify-center text-[10px] font-medium text-forest-600">
                                    {(isEditing && editForm.contactName ? editForm.contactName : booking.contactName)?.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                            </div>
                        </div>
                        <div>
                            <span className="text-gray-600">Contact Name</span>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editForm?.contactName ?? booking.contactName ?? ''}
                                    onChange={(e) => onInputChange('contactName', e.target.value)}
                                    className="block w-full mt-1 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-forest-400 focus:border-transparent bg-white"
                                />
                            ) : (
                                <p className="font-medium text-gray-900 text-sm">{booking.contactName}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contact Email */}
                <div className="flex items-center justify-between p-2 bg-forest-50/50 backdrop-blur-sm rounded-lg border border-forest-100/50 transition-all duration-200 hover:shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <div className="absolute inset-0 bg-forest-400/10 rounded-lg blur-[2px]" />
                            <div className="relative p-1.5 bg-gradient-to-br from-forest-400/20 to-forest-400/5 rounded-lg border border-forest-400/20">
                                <svg className="w-4 h-4 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="text-gray-600">Contact Email</span>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={editForm?.contactEmail ?? booking.contactEmail ?? ''}
                                    onChange={(e) => onInputChange('contactEmail', e.target.value)}
                                    className="block w-full mt-1 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-forest-400 focus:border-transparent bg-white"
                                />
                            ) : (
                                <p className="font-medium text-gray-900 text-sm truncate">{booking.contactEmail}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contact Phone */}
                <div className="flex items-center justify-between p-2 bg-forest-50/50 backdrop-blur-sm rounded-lg border border-forest-100/50 transition-all duration-200 hover:shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <div className="absolute inset-0 bg-forest-400/10 rounded-lg blur-[2px]" />
                            <div className="relative p-1.5 bg-gradient-to-br from-forest-400/20 to-forest-400/5 rounded-lg border border-forest-400/20">
                                <svg className="w-4 h-4 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="text-gray-600">Contact Phone</span>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={editForm?.contactPhone ?? booking.contactPhone ?? ''}
                                    onChange={(e) => onInputChange('contactPhone', e.target.value)}
                                    className="block w-full mt-1 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-forest-400 focus:border-transparent bg-white"
                                />
                            ) : (
                                <p className="font-medium text-gray-900 text-sm truncate">{booking.contactPhone}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
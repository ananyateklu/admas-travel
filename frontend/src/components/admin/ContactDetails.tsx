import { BookingData } from './types';

interface ContactDetailsProps {
    booking: BookingData;
}

export function ContactDetails({ booking }: ContactDetailsProps) {
    return (
        <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gold/10 rounded-lg">
                    <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <div>
                    <h4 className="font-medium text-gray-900">Contact Information</h4>
                    <p className="text-xs text-gray-500">Primary contact details</p>
                </div>
            </div>
            <div className="space-y-3 text-sm">
                <div className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-gold">
                                {booking.contactName.split(' ').map(n => n[0]).join('')}
                            </span>
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">{booking.contactName}</p>
                            <p className="text-xs text-gray-500">Primary Contact</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600 group-hover:text-gray-900">{booking.contactEmail}</span>
                    <button
                        onClick={() => navigator.clipboard.writeText(booking.contactEmail)}
                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                    </button>
                </div>
                <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-600 group-hover:text-gray-900">{booking.contactPhone}</span>
                    <button
                        onClick={() => navigator.clipboard.writeText(booking.contactPhone)}
                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
} 
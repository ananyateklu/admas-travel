import { BOOKING_STATUSES } from './types';

interface SearchFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    statusFilter: string;
    onStatusFilterChange: (value: string) => void;
}

export function SearchFilters({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusFilterChange
}: SearchFiltersProps) {
    return (
        <div className="bg-white rounded-xl shadow-md mb-6">
            <div className="p-4 border-b border-gray-100">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by name, reference, email, date (e.g., Dec 25, 2023)..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
                    />
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>

            <div className="px-4 py-2">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => onStatusFilterChange('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                            ${statusFilter === 'all'
                                ? 'bg-gradient-to-r from-gold/90 to-gold text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        All Bookings
                    </button>
                    {BOOKING_STATUSES.map(status => (
                        <button
                            key={status}
                            onClick={() => onStatusFilterChange(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
                                ${statusFilter === status
                                    ? 'bg-gradient-to-r from-gold/90 to-gold text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {status === 'pending' && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                            {status === 'confirmed' && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                            {status === 'completed' && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                            {status === 'cancelled' && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
} 
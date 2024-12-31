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
            <div className="flex flex-col md:flex-row gap-4 p-4">
                <div className="flex-1">
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
                <select
                    value={statusFilter}
                    onChange={(e) => onStatusFilterChange(e.target.value)}
                    className="px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
                >
                    <option value="all">All Statuses</option>
                    {BOOKING_STATUSES.map(status => (
                        <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
} 
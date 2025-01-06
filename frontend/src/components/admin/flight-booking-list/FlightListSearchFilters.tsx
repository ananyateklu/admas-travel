import { useState, useEffect } from 'react';
import { BOOKING_STATUSES, AdvancedFilters } from "../types";

interface DateRange {
    start: string;
    end: string;
}

interface PassengerCount {
    min: number;
    max: number;
}

interface SearchFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    statusFilter: string;
    onStatusFilterChange: (value: string) => void;
    onAdvancedFiltersChange?: (filters: Partial<AdvancedFilters>) => void;
    bookingTypeFilter?: string;
    onBookingTypeFilterChange?: (value: string) => void;
}

export function SearchFilters({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    onAdvancedFiltersChange,
    bookingTypeFilter = 'all',
    onBookingTypeFilterChange
}: SearchFiltersProps) {
    const [filters, setFilters] = useState<Partial<AdvancedFilters>>({});

    // Apply filters whenever they change
    useEffect(() => {
        if (onAdvancedFiltersChange) {
            const cleanFilters: Partial<AdvancedFilters> = {};

            // Only include non-empty values
            if (filters.dateRange?.start ?? filters.dateRange?.end) {
                cleanFilters.dateRange = {
                    start: filters.dateRange.start ?? '',
                    end: filters.dateRange.end ?? ''
                };
            }

            if (filters.class) {
                cleanFilters.class = filters.class;
            }

            if (filters.tripType) {
                cleanFilters.tripType = filters.tripType;
            }

            if (filters.nationality) {
                cleanFilters.nationality = filters.nationality;
            }

            // Only include passenger count if either min or max is greater than 0
            if ((filters.passengerCount?.min ?? 0) > 0 || (filters.passengerCount?.max ?? 0) > 0) {
                cleanFilters.passengerCount = {
                    min: filters.passengerCount?.min ?? 0,
                    max: filters.passengerCount?.max ?? 0
                };
            }

            onAdvancedFiltersChange(cleanFilters);
        }
    }, [filters, onAdvancedFiltersChange]);

    const updateDateRange = (field: keyof DateRange, value: string) => {
        setFilters(prev => {
            const newDateRange = {
                ...(prev.dateRange ?? { start: '', end: '' }),
                [field]: value
            };

            // Only update if at least one date is set
            if (value ?? (field === 'start' ? newDateRange.end : newDateRange.start)) {
                return {
                    ...prev,
                    dateRange: newDateRange
                };
            }

            // If both dates are empty, remove the dateRange filter
            const newFilters = { ...prev };
            delete newFilters.dateRange;
            return newFilters;
        });
    };

    const updatePassengerCount = (field: keyof PassengerCount, value: number) => {
        setFilters(prev => {
            const newPassengerCount = {
                ...(prev.passengerCount ?? { min: 0, max: 0 }),
                [field]: value
            };

            // Ensure max is not less than min
            if (field === 'min' && newPassengerCount.max && newPassengerCount.max < value) {
                newPassengerCount.max = value;
            }
            if (field === 'max' && newPassengerCount.min && value < newPassengerCount.min) {
                newPassengerCount.min = value;
            }

            // Only update if either min or max is greater than 0
            if (newPassengerCount.min > 0 || newPassengerCount.max > 0) {
                return {
                    ...prev,
                    passengerCount: newPassengerCount
                };
            }

            // If both values are 0, remove the passengerCount filter
            const newFilters = { ...prev };
            delete newFilters.passengerCount;
            return newFilters;
        });
    };

    const handleReset = () => {
        setFilters({});
        onSearchChange('');
        onStatusFilterChange('all');
        if (onBookingTypeFilterChange) {
            onBookingTypeFilterChange('all');
        }
    };

    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-forest-50/50 mb-6">
            {/* Search Bar */}
            <div className="p-3 border-b border-forest-50/50">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search bookings..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full px-4 py-2 pl-10 bg-forest-50/30 border border-forest-50/50 rounded-lg text-sm
                                placeholder:text-gray-400 
                                focus:ring-2 focus:ring-forest-200/30 focus:border-forest-200/50 
                                transition-all duration-200"
                        />
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-300"
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
                    <button
                        onClick={handleReset}
                        className="px-3 py-2 text-xs font-medium text-forest-500 hover:text-forest-600 flex items-center gap-1.5"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Reset Filters
                    </button>
                </div>
            </div>

            {/* Booking Type Filters */}
            <div className="px-3 py-2 border-b border-forest-50/50">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => onBookingTypeFilterChange?.('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                            ${bookingTypeFilter === 'all'
                                ? 'bg-gradient-to-br from-forest-300 to-forest-400 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-forest-50/30 hover:text-forest-500'
                            }`}
                    >
                        All Types
                    </button>
                    {['flight', 'hotel', 'car'].map(type => (
                        <button
                            key={type}
                            onClick={() => onBookingTypeFilterChange?.(type)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5
                                ${bookingTypeFilter === type
                                    ? 'bg-gradient-to-br from-forest-300 to-forest-400 text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-forest-50/30 hover:text-forest-500'
                                }`}
                        >
                            {type === 'flight' && (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            )}
                            {type === 'hotel' && (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            )}
                            {type === 'car' && (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                </svg>
                            )}
                            {type.charAt(0).toUpperCase() + type.slice(1)}s
                        </button>
                    ))}
                </div>
            </div>

            {/* Status Filters */}
            <div className="px-3 py-2 border-b border-forest-50/50">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => onStatusFilterChange('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                            ${statusFilter === 'all'
                                ? 'bg-gradient-to-br from-forest-300 to-forest-400 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-forest-50/30 hover:text-forest-500'
                            }`}
                    >
                        All Bookings
                    </button>
                    {BOOKING_STATUSES.map(status => (
                        <button
                            key={status}
                            onClick={() => onStatusFilterChange(status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5
                                ${statusFilter === status
                                    ? 'bg-gradient-to-br from-forest-300 to-forest-400 text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-forest-50/30 hover:text-forest-500'
                                }`}
                        >
                            {status === 'pending' && (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                            {status === 'confirmed' && (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                            {status === 'completed' && (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                            {status === 'cancelled' && (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Advanced Filters */}
            <div className="p-3">
                <div className="grid grid-cols-12 gap-4">
                    {/* Date Range */}
                    <div className="col-span-4">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Date Range</label>
                        <div className="flex gap-2">
                            <input
                                type="date"
                                value={filters.dateRange?.start ?? ''}
                                onChange={(e) => updateDateRange('start', e.target.value)}
                                className="w-full px-2 py-1.5 text-xs bg-forest-50/30 border border-forest-50/50 rounded-lg
                                    focus:ring-2 focus:ring-forest-200/30 focus:border-forest-200/50"
                                placeholder="From"
                            />
                            <input
                                type="date"
                                value={filters.dateRange?.end ?? ''}
                                onChange={(e) => updateDateRange('end', e.target.value)}
                                className="w-full px-2 py-1.5 text-xs bg-forest-50/30 border border-forest-50/50 rounded-lg
                                    focus:ring-2 focus:ring-forest-200/30 focus:border-forest-200/50"
                                placeholder="To"
                            />
                        </div>
                    </div>

                    {/* Class & Trip Type */}
                    <div className="col-span-4">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Class</label>
                                <select
                                    value={filters.class ?? ''}
                                    onChange={(e) => setFilters(prev => ({ ...prev, class: e.target.value }))}
                                    className="w-full px-2 py-1.5 text-xs bg-forest-50/30 border border-forest-50/50 rounded-lg
                                        focus:ring-2 focus:ring-forest-200/30 focus:border-forest-200/50"
                                >
                                    <option value="">All Classes</option>
                                    <option value="economy">Economy</option>
                                    <option value="business">Business</option>
                                    <option value="first">First</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Trip Type</label>
                                <select
                                    value={filters.tripType ?? ''}
                                    onChange={(e) => setFilters(prev => ({ ...prev, tripType: e.target.value }))}
                                    className="w-full px-2 py-1.5 text-xs bg-forest-50/30 border border-forest-50/50 rounded-lg
                                        focus:ring-2 focus:ring-forest-200/30 focus:border-forest-200/50"
                                >
                                    <option value="">All Types</option>
                                    <option value="roundtrip">Round Trip</option>
                                    <option value="oneway">One Way</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Passenger Count */}
                    <div className="col-span-4">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Passenger Count</label>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <input
                                    type="number"
                                    min="0"
                                    value={filters.passengerCount?.min ?? 0}
                                    onChange={(e) => updatePassengerCount('min', parseInt(e.target.value))}
                                    className="w-full px-2 py-1.5 text-xs bg-forest-50/30 border border-forest-50/50 rounded-lg
                                        focus:ring-2 focus:ring-forest-200/30 focus:border-forest-200/50"
                                    placeholder="Min"
                                />
                            </div>
                            <div>
                                <input
                                    type="number"
                                    min="0"
                                    value={filters.passengerCount?.max ?? 0}
                                    onChange={(e) => updatePassengerCount('max', parseInt(e.target.value))}
                                    className="w-full px-2 py-1.5 text-xs bg-forest-50/30 border border-forest-50/50 rounded-lg
                                        focus:ring-2 focus:ring-forest-200/30 focus:border-forest-200/50"
                                    placeholder="Max"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Nationality */}
                    <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Nationality</label>
                        <input
                            type="text"
                            placeholder="Search nationality"
                            value={filters.nationality}
                            onChange={(e) => setFilters(prev => ({ ...prev, nationality: e.target.value }))}
                            className="w-full px-2 py-1.5 text-xs bg-forest-50/30 border border-forest-50/50 rounded-lg
                                focus:ring-2 focus:ring-forest-200/30 focus:border-forest-200/50"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
} 
import { useState, useEffect } from 'react';
import { AirportSearchInput } from '../AirportSearchInput';
import { Airport } from '../../services/flightService';

interface FlightSearchFormProps {
    onSearch: (params: {
        fromId: string;
        toId: string;
        departDate: string;
        page: number;
        pageSize: number;
        cabinClass?: string;
        directFlightsOnly?: boolean;
        passengers?: {
            adults: number;
            children: number;
            infants: number;
        };
    }) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

export function FlightSearchForm({ onSearch, isLoading, error }: FlightSearchFormProps) {
    // State for form fields
    const [fromAirport, setFromAirport] = useState<Airport | null>(() => {
        const cached = localStorage.getItem('adminFlightFromAirport');
        return cached ? JSON.parse(cached) : null;
    });
    const [toAirport, setToAirport] = useState<Airport | null>(() => {
        const cached = localStorage.getItem('adminFlightToAirport');
        return cached ? JSON.parse(cached) : null;
    });
    const [departureDate, setDepartureDate] = useState(() => {
        return localStorage.getItem('adminFlightDepartureDate') ?? '';
    });

    // Advanced search options
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
    const [cabinClass, setCabinClass] = useState('ECONOMY');
    const [passengers, setPassengers] = useState({
        adults: 1,
        children: 0,
        infants: 0
    });
    const [directFlightsOnly, setDirectFlightsOnly] = useState(false);

    // Save search parameters to localStorage
    useEffect(() => {
        if (fromAirport) {
            localStorage.setItem('adminFlightFromAirport', JSON.stringify(fromAirport));
        } else {
            localStorage.removeItem('adminFlightFromAirport');
        }
    }, [fromAirport]);

    useEffect(() => {
        if (toAirport) {
            localStorage.setItem('adminFlightToAirport', JSON.stringify(toAirport));
        } else {
            localStorage.removeItem('adminFlightToAirport');
        }
    }, [toAirport]);

    useEffect(() => {
        if (departureDate) {
            localStorage.setItem('adminFlightDepartureDate', departureDate);
        } else {
            localStorage.removeItem('adminFlightDepartureDate');
        }
    }, [departureDate]);

    // Get minimum date (today)
    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fromAirport || !toAirport || !departureDate) return;

        await onSearch({
            fromId: fromAirport.id,
            toId: toAirport.id,
            departDate: new Date(departureDate).toISOString().split('T')[0],
            page: 1,
            pageSize: 25,
            cabinClass,
            directFlightsOnly,
            passengers
        });
    };

    const handlePassengerChange = (type: keyof typeof passengers, value: number) => {
        setPassengers(prev => ({
            ...prev,
            [type]: Math.max(0, value)
        }));
    };

    return (
        <div className="bg-white rounded-xl shadow-sm">
            {/* Main Search Form */}
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Search Flights</h3>
                    <button
                        type="button"
                        onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                        className="text-sm text-gold hover:text-gold/90 flex items-center gap-1"
                    >
                        {showAdvancedOptions ? (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                                Hide Advanced Options
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                Show Advanced Options
                            </>
                        )}
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <AirportSearchInput
                            label="From"
                            id="from"
                            value={fromAirport?.name ?? ''}
                            onChange={setFromAirport}
                            required
                        />
                        <AirportSearchInput
                            label="To"
                            id="to"
                            value={toAirport?.name ?? ''}
                            onChange={setToAirport}
                            required
                        />
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                Departure Date
                            </label>
                            <input
                                type="date"
                                id="date"
                                value={departureDate}
                                onChange={(e) => setDepartureDate(e.target.value)}
                                min={getMinDate()}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                required
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full px-6 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? 'Searching...' : 'Search Flights'}
                            </button>
                        </div>
                    </div>

                    {/* Advanced Options */}
                    {showAdvancedOptions && (
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Cabin Class */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Cabin Class
                                    </label>
                                    <select
                                        value={cabinClass}
                                        onChange={(e) => setCabinClass(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                    >
                                        <option value="ECONOMY">Economy</option>
                                        <option value="PREMIUM_ECONOMY">Premium Economy</option>
                                        <option value="BUSINESS">Business</option>
                                        <option value="FIRST">First</option>
                                    </select>
                                </div>

                                {/* Passengers */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Passengers
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Adults</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={passengers.adults}
                                                onChange={(e) => handlePassengerChange('adults', parseInt(e.target.value))}
                                                className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Children</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={passengers.children}
                                                onChange={(e) => handlePassengerChange('children', parseInt(e.target.value))}
                                                className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Infants</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={passengers.infants}
                                                onChange={(e) => handlePassengerChange('infants', parseInt(e.target.value))}
                                                className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Options */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Additional Options
                                    </label>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={directFlightsOnly}
                                                onChange={(e) => setDirectFlightsOnly(e.target.checked)}
                                                className="rounded border-gray-300 text-gold focus:ring-gold"
                                            />
                                            <span className="text-sm text-gray-600">Direct flights only</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                            {error}
                        </div>
                    )}
                </form>
            </div>

            {/* Quick Links */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 rounded-b-xl">
                <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">Quick Links:</span>
                    <button
                        type="button"
                        onClick={() => {
                            const today = new Date();
                            setDepartureDate(today.toISOString().split('T')[0]);
                        }}
                        className="text-gold hover:text-gold/90"
                    >
                        Today
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            const tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            setDepartureDate(tomorrow.toISOString().split('T')[0]);
                        }}
                        className="text-gold hover:text-gold/90"
                    >
                        Tomorrow
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            const nextWeek = new Date();
                            nextWeek.setDate(nextWeek.getDate() + 7);
                            setDepartureDate(nextWeek.toISOString().split('T')[0]);
                        }}
                        className="text-gold hover:text-gold/90"
                    >
                        Next Week
                    </button>
                </div>
            </div>
        </div>
    );
} 
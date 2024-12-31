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
                    {/* Main search row */}
                    <div className="grid grid-cols-12 gap-4 mb-6">
                        <div className="col-span-5">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                From
                            </label>
                            <label className="block text-xs text-gray-400 mb-0.5">Departure Airport</label>
                            <AirportSearchInput
                                label=""
                                id="from"
                                value={fromAirport?.name ?? ''}
                                onChange={setFromAirport}
                                required
                                type="departure"
                            />
                        </div>
                        <div className="col-span-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                To
                            </label>
                            <label className="block text-xs text-gray-400 mb-0.5">Arrival Airport</label>
                            <AirportSearchInput
                                label=""
                                id="to"
                                value={toAirport?.name ?? ''}
                                onChange={setToAirport}
                                required
                                type="arrival"
                            />
                        </div>
                        <div className="col-span-2">
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                Departure
                            </label>
                            <label className="block text-xs text-gray-400 mb-0.5">Travel Date</label>
                            <input
                                type="date"
                                id="date"
                                value={departureDate}
                                onChange={(e) => setDepartureDate(e.target.value)}
                                min={getMinDate()}
                                className="w-full px-2 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-200"
                                required
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                &nbsp;
                            </label>
                            <label className="block text-xs text-gray-400 mb-0.5">&nbsp;</label>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full px-2 py-2.5 rounded-xl text-white font-medium text-sm border
                                    transition-all duration-200 overflow-hidden
                                    ${isLoading
                                        ? 'bg-gray-400 cursor-not-allowed border-gray-400'
                                        : 'bg-gradient-to-r from-gold/90 to-gold hover:shadow-lg hover:shadow-gold/20 hover:-translate-y-0.5 active:translate-y-0 border-gold'
                                    }`}
                            >
                                <div className="relative flex items-center justify-center gap-2">
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    fill="none"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            <span>Searching...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                                />
                                            </svg>
                                            <span>Search</span>
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Secondary row for cabin class and passengers */}
                    <div className="grid grid-cols-12 gap-4">
                        {/* Cabin Class */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cabin Class
                            </label>
                            <label className="block text-xs text-gray-400 mb-0.5">Travel Class</label>
                            <select
                                value={cabinClass}
                                onChange={(e) => setCabinClass(e.target.value)}
                                className="w-full px-2 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-200"
                            >
                                <option value="ECONOMY">Economy</option>
                                <option value="PREMIUM_ECONOMY">Premium Economy</option>
                                <option value="BUSINESS">Business</option>
                                <option value="FIRST">First</option>
                            </select>
                            <div className="mt-0.5 text-xs text-gray-400">
                                <span>Select your preferred cabin class</span>
                            </div>
                        </div>

                        {/* Passengers */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Passengers
                            </label>
                            <div className="grid grid-cols-3 gap-0.5">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-0.5">Adults</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={passengers.adults}
                                        onChange={(e) => handlePassengerChange('adults', parseInt(e.target.value))}
                                        className="w-full px-2 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-0.5">Children</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={passengers.children}
                                        onChange={(e) => handlePassengerChange('children', parseInt(e.target.value))}
                                        className="w-full px-2 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-0.5">Infants</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={passengers.infants}
                                        onChange={(e) => handlePassengerChange('infants', parseInt(e.target.value))}
                                        className="w-full px-2 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-200"
                                    />
                                </div>
                            </div>
                            <div className="mt-0.5 text-xs text-gray-400">
                                <span>Children (2-11 years)</span>
                                <span className="mx-2">•</span>
                                <span>Infants (0-2 years)</span>
                            </div>
                        </div>

                        {/* Additional Options */}
                        <div className="col-span-5">
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
                            if (fromAirport && toAirport) {
                                onSearch({
                                    fromId: fromAirport.id,
                                    toId: toAirport.id,
                                    departDate: today.toISOString().split('T')[0],
                                    page: 1,
                                    pageSize: 25,
                                    cabinClass,
                                    directFlightsOnly,
                                    passengers
                                });
                            }
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
                            const tomorrowStr = tomorrow.toISOString().split('T')[0];
                            setDepartureDate(tomorrowStr);
                            if (fromAirport && toAirport) {
                                onSearch({
                                    fromId: fromAirport.id,
                                    toId: toAirport.id,
                                    departDate: tomorrowStr,
                                    page: 1,
                                    pageSize: 25,
                                    cabinClass,
                                    directFlightsOnly,
                                    passengers
                                });
                            }
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
                            const nextWeekStr = nextWeek.toISOString().split('T')[0];
                            setDepartureDate(nextWeekStr);
                            if (fromAirport && toAirport) {
                                onSearch({
                                    fromId: fromAirport.id,
                                    toId: toAirport.id,
                                    departDate: nextWeekStr,
                                    page: 1,
                                    pageSize: 25,
                                    cabinClass,
                                    directFlightsOnly,
                                    passengers
                                });
                            }
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
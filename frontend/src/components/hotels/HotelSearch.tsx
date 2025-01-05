import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { hotelService } from '../../lib/api/hotelService';
import { HotelSearchParams, HotelSearchResponse } from '../../types/hotelTypes';

interface HotelSearchProps {
    onSearch: (results: HotelSearchResponse) => void;
    isLoading?: boolean;
}

interface DestinationResult {
    dest_id: string;
    search_type: string;
    label: string;
}

interface DestinationResponseData {
    dest_id: string;
    search_type: string;
    label: string;
    name: string;
    city_name?: string;
    country?: string;
    region?: string;
    hotels?: number;
    type?: string;
    dest_type?: string;
    image_url?: string;
}

interface DestinationResponse {
    status: boolean;
    message: string;
    data: DestinationResponseData[];
}

const getDefaultDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return {
        arrival_date: formatDate(today),
        departure_date: formatDate(tomorrow)
    };
};

// Format date in YYYY-MM-DD format using local timezone
const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const CACHE_KEY = 'hotelSearchParams';

export function HotelSearch({ onSearch, isLoading }: HotelSearchProps) {
    const [destination, setDestination] = useState('');
    const [destinationResults, setDestinationResults] = useState<DestinationResult[]>([]);
    const [showDestinationResults, setShowDestinationResults] = useState(false);

    // Initialize dates with defaults
    const [dates, setDates] = useState(getDefaultDates());

    // Initialize search params from cache or defaults
    const [searchParams, setSearchParams] = useState<HotelSearchParams>(() => {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const parsed = JSON.parse(cached);
            // Update destination if we have cached params
            if (parsed.dest_id) {
                setDestination(parsed.destination || '');
            }
            return parsed;
        }
        return {
            dest_id: '',
            search_type: 'CITY',
            adults: '2',
            room_qty: '1',
            page_number: '1',
            units: 'metric',
            temperature_unit: 'c',
            languagecode: 'en-us',
            currency_code: 'USD',
            arrival_date: dates.arrival_date,
            departure_date: dates.departure_date
        };
    });

    // Cache search params whenever they change
    useEffect(() => {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            ...searchParams,
            destination // Also cache the destination text
        }));
    }, [searchParams, destination]);

    const handleDestinationSearch = async (query: string) => {
        if (query.length < 2) {
            setDestinationResults([]);
            setShowDestinationResults(false);
            return;
        }

        try {
            const results = await hotelService.searchDestination(query) as DestinationResponse;
            if (results.data) {
                setDestinationResults(results.data.map(item => ({
                    dest_id: item.dest_id,
                    search_type: item.search_type,
                    label: item.label
                })));
                setShowDestinationResults(true);
            }
        } catch (error) {
            console.error('Error searching destination:', error);
        }
    };

    const handleDestinationSelect = (result: DestinationResult) => {
        setDestination(result.label); // Save the selected destination label
        setSearchParams(prev => ({
            ...prev,
            dest_id: result.dest_id,
            search_type: result.search_type.toUpperCase()
        }));
        setShowDestinationResults(false);
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchParams.dest_id) {
            alert('Please select a destination from the dropdown');
            return;
        }

        try {
            const results = await hotelService.searchHotels({
                ...searchParams,
                arrival_date: dates.arrival_date,
                departure_date: dates.departure_date
            });
            onSearch(results);
        } catch (error) {
            console.error('Error searching hotels:', error);
        }
    };

    // Get today's date in local timezone
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minArrivalDate = formatDate(today);

    // Get tomorrow's date in local timezone
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const minDepartureDate = formatDate(tomorrow);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
        >
            <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2 relative">
                    <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                        Destination
                    </label>
                    <input
                        type="text"
                        id="destination"
                        value={destination}
                        onChange={(e) => {
                            setDestination(e.target.value);
                            handleDestinationSearch(e.target.value);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Where are you going?"
                        required
                    />
                    {showDestinationResults && destinationResults.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                            {destinationResults.map((result) => (
                                <button
                                    key={`${result.dest_id}-${result.search_type}`}
                                    type="button"
                                    onClick={() => handleDestinationSelect(result)}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                                >
                                    {result.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="arrival_date" className="block text-sm font-medium text-gray-700">
                            Check-in Date
                        </label>
                        <input
                            type="date"
                            id="arrival_date"
                            min={minArrivalDate}
                            value={dates.arrival_date}
                            onChange={(e) => {
                                setDates(prev => ({ ...prev, arrival_date: e.target.value }));
                                if (e.target.value > dates.departure_date) {
                                    setDates(prev => ({ ...prev, departure_date: '' }));
                                }
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="departure_date" className="block text-sm font-medium text-gray-700">
                            Check-out Date
                        </label>
                        <input
                            type="date"
                            id="departure_date"
                            min={dates.arrival_date || minDepartureDate}
                            value={dates.departure_date}
                            onChange={(e) => setDates(prev => ({ ...prev, departure_date: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="adults" className="block text-sm font-medium text-gray-700">
                            Adults
                        </label>
                        <select
                            id="adults"
                            value={searchParams.adults}
                            onChange={(e) => setSearchParams(prev => ({ ...prev, adults: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                            {[1, 2, 3, 4, 5, 6].map(num => (
                                <option key={num} value={num}>{num} Adult{num !== 1 ? 's' : ''}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="rooms" className="block text-sm font-medium text-gray-700">
                            Rooms
                        </label>
                        <select
                            id="rooms"
                            value={searchParams.room_qty}
                            onChange={(e) => setSearchParams(prev => ({ ...prev, room_qty: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                            {[1, 2, 3, 4, 5].map(num => (
                                <option key={num} value={num}>{num} Room{num !== 1 ? 's' : ''}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                            Currency
                        </label>
                        <select
                            id="currency"
                            value={searchParams.currency_code}
                            onChange={(e) => setSearchParams(prev => ({ ...prev, currency_code: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                        </select>
                    </div>
                </div>

                <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors"
                >
                    {isLoading ? 'Searching...' : 'Search Hotels'}
                </motion.button>
            </form>
        </motion.div>
    );
} 
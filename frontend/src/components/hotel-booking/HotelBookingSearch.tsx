import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { hotelService } from '../../lib/api/hotelService';
import { HotelSearchParams, HotelSearchResponse } from '../../types/hotelSearch';
import { HotelSearchInput } from './HotelSearchInput';

interface HotelSearchProps {
    onSearch: (results: HotelSearchResponse) => void;
    isLoading?: boolean;
    onLoadingChange?: (isLoading: boolean) => void;
    currentPage?: number;
}

interface Destination {
    dest_id: string;
    search_type: string;
    label: string;
    city_name?: string;
    country?: string;
    region?: string;
    hotels?: number;
    type?: string;
    dest_type?: string;
    image_url?: string;
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

export function HotelSearch({ onSearch, isLoading, onLoadingChange, currentPage = 1 }: HotelSearchProps) {
    const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

    // Initialize dates with defaults
    const [dates, setDates] = useState(getDefaultDates());

    // Initialize search params from cache or defaults
    const [searchParams, setSearchParams] = useState<HotelSearchParams>(() => {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const parsed = JSON.parse(cached);
            // Update destination if we have cached params
            if (parsed.dest_id) {
                setSelectedDestination({
                    dest_id: parsed.dest_id,
                    search_type: parsed.search_type,
                    label: parsed.destination || ''
                });
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
            destination: selectedDestination?.label // Also cache the destination text
        }));
    }, [searchParams, selectedDestination]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchParams.dest_id) {
            alert('Please select a destination from the dropdown');
            return;
        }

        try {
            onLoadingChange?.(true);
            const results = await hotelService.searchHotels({
                ...searchParams,
                arrival_date: dates.arrival_date,
                departure_date: dates.departure_date,
                page_number: String(currentPage)
            });
            onSearch(results);
        } catch (error) {
            console.error('Error searching hotels:', error);
            onSearch({ status: false, data: { hotels: [] } });
        } finally {
            onLoadingChange?.(false);
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
            className="bg-white rounded-xl shadow-lg p-4 max-w-[90%] mx-auto"
        >
            <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-12 gap-3">
                    {/* Destination Search */}
                    <div className="col-span-12 md:col-span-6">
                        <label className="block text-xs font-medium text-gray-700">
                            Destination
                        </label>
                        <label className="block text-[10px] text-gray-400 -mt-0.5 mb-0.5">City or Hotel Name</label>
                        <HotelSearchInput
                            id="destination"
                            label=""
                            value={selectedDestination?.label ?? ''}
                            onChange={(destination) => {
                                setSelectedDestination(destination);
                                setSearchParams(prev => ({
                                    ...prev,
                                    dest_id: destination.dest_id,
                                    search_type: destination.search_type.toUpperCase()
                                }));
                            }}
                            required
                        />
                    </div>

                    {/* Check-in Date */}
                    <div className="col-span-6 md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700">
                            Check-in
                        </label>
                        <label className="block text-[10px] text-gray-400 -mt-0.5 mb-0.5">Arrival Date</label>
                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
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
                                className="w-full px-2 py-1 text-[11px] border border-gray-300 rounded-lg 
                                    focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                                required
                            />
                        </motion.div>
                    </div>

                    {/* Check-out Date */}
                    <div className="col-span-6 md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700">
                            Check-out
                        </label>
                        <label className="block text-[10px] text-gray-400 -mt-0.5 mb-0.5">Departure Date</label>
                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                            <input
                                type="date"
                                id="departure_date"
                                min={dates.arrival_date || minDepartureDate}
                                value={dates.departure_date}
                                onChange={(e) => setDates(prev => ({ ...prev, departure_date: e.target.value }))}
                                className="w-full px-2 py-1 text-[11px] border border-gray-300 rounded-lg 
                                    focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                                required
                            />
                        </motion.div>
                    </div>

                    {/* Search Button */}
                    <div className="col-span-12 md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700">
                            &nbsp;
                        </label>
                        <label className="block text-[10px] text-gray-400 -mt-0.5 mb-0.5">&nbsp;</label>
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full h-[30px] rounded-lg text-white font-medium text-[11px]
                                transition-all duration-200 overflow-hidden
                                ${isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-primary hover:bg-primary-dark'
                                }`}
                        >
                            <div className="relative flex items-center justify-center gap-1.5">
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
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
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <span>Search</span>
                                    </>
                                )}
                            </div>
                        </motion.button>
                    </div>
                </div>

                {/* Room and Guest Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                    <div className="space-y-2">
                        <label htmlFor="adults" className="block text-sm font-medium text-gray-700">
                            Guests
                        </label>
                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                            <select
                                id="adults"
                                value={searchParams.adults}
                                onChange={(e) => setSearchParams(prev => ({ ...prev, adults: e.target.value }))}
                                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg 
                                    focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                            >
                                {[1, 2, 3, 4, 5, 6].map(num => (
                                    <option key={num} value={num}>{num} Adult{num !== 1 ? 's' : ''}</option>
                                ))}
                            </select>
                        </motion.div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="rooms" className="block text-sm font-medium text-gray-700">
                            Rooms
                        </label>
                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                            <select
                                id="rooms"
                                value={searchParams.room_qty}
                                onChange={(e) => setSearchParams(prev => ({ ...prev, room_qty: e.target.value }))}
                                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg 
                                    focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                            >
                                {[1, 2, 3, 4, 5].map(num => (
                                    <option key={num} value={num}>{num} Room{num !== 1 ? 's' : ''}</option>
                                ))}
                            </select>
                        </motion.div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                            Currency
                        </label>
                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                            <select
                                id="currency"
                                value={searchParams.currency_code}
                                onChange={(e) => setSearchParams(prev => ({ ...prev, currency_code: e.target.value }))}
                                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg 
                                    focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                            </select>
                        </motion.div>
                    </div>
                </div>
            </form>

            {/* Quick Links */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">Quick Links:</span>
                    {[
                        {
                            label: 'Tonight',
                            onClick: () => {
                                const today = new Date();
                                const todayStr = formatDate(today);
                                const tomorrow = new Date(today);
                                tomorrow.setDate(today.getDate() + 1);
                                const tomorrowStr = formatDate(tomorrow);
                                setDates({
                                    arrival_date: todayStr,
                                    departure_date: tomorrowStr
                                });
                            }
                        },
                        {
                            label: 'Tomorrow',
                            onClick: () => {
                                const tomorrow = new Date();
                                tomorrow.setDate(tomorrow.getDate() + 1);
                                const tomorrowStr = formatDate(tomorrow);
                                const dayAfter = new Date(tomorrow);
                                dayAfter.setDate(tomorrow.getDate() + 1);
                                const dayAfterStr = formatDate(dayAfter);
                                setDates({
                                    arrival_date: tomorrowStr,
                                    departure_date: dayAfterStr
                                });
                            }
                        },
                        {
                            label: 'Next Week',
                            onClick: () => {
                                const nextWeek = new Date();
                                nextWeek.setDate(nextWeek.getDate() + 7);
                                const nextWeekStr = formatDate(nextWeek);
                                const dayAfterNextWeek = new Date(nextWeek);
                                dayAfterNextWeek.setDate(nextWeek.getDate() + 1);
                                const dayAfterNextWeekStr = formatDate(dayAfterNextWeek);
                                setDates({
                                    arrival_date: nextWeekStr,
                                    departure_date: dayAfterNextWeekStr
                                });
                            }
                        }
                    ].map((link) => (
                        <motion.button
                            key={link.label}
                            type="button"
                            onClick={link.onClick}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-primary hover:text-primary-dark text-xs font-medium"
                        >
                            {link.label}
                        </motion.button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
} 
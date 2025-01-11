import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hotelService } from '../../lib/api/hotelService';

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

interface HotelSearchInputProps {
    label: string;
    id: string;
    value: string;
    onChange: (destination: Destination) => void;
    placeholder?: string;
    required?: boolean;
    className?: string;
}

export function HotelSearchInput({
    label,
    id,
    value,
    onChange,
    placeholder = 'Enter city or hotel name',
    required = false,
    className = ''
}: HotelSearchInputProps) {
    const [query, setQuery] = useState('');
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initialize selectedDestination from value prop
    useEffect(() => {
        if (value && !selectedDestination) {
            setSelectedDestination({
                dest_id: '',
                search_type: '',
                label: value
            });
        }
    }, [value, selectedDestination]);

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setQuery('');
                setIsFocused(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDestinationSearch = async (searchQuery: string) => {
        if (searchQuery.length < 2) {
            setDestinations([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await hotelService.searchDestination(searchQuery);
            if (response.status && response.data) {
                setDestinations(response.data);
            } else {
                setError('Failed to fetch destinations');
                setDestinations([]);
            }
        } catch (err) {
            console.error('Error searching destination:', err);
            setError('An error occurred while searching');
            setDestinations([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGetCurrentLocation = useCallback(async () => {
        setIsLocating(true);
        setLocationError(null);

        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                });
            });

            const { latitude, longitude } = position.coords;

            // Search for destinations near the coordinates
            const response = await hotelService.searchNearbyDestinations(latitude, longitude);

            if (response.status && response.data && response.data.length > 0) {
                const nearestDestination = response.data[0];
                setSelectedDestination(nearestDestination);
                onChange(nearestDestination);
                setLocationError(null);
                return;
            }

            throw new Error('No destinations found nearby');
        } catch (error) {
            console.error('Error getting location:', error);
            setLocationError(
                error instanceof GeolocationPositionError
                    ? 'Unable to get your location. Please check your browser permissions.'
                    : 'Unable to find nearby destinations. Please enter manually.'
            );
        } finally {
            setIsLocating(false);
        }
    }, [onChange]);

    const handleSelect = (destination: Destination) => {
        setSelectedDestination(destination);
        onChange(destination);
        setQuery('');
        setIsFocused(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setQuery(newValue);
        setSelectedDestination(null);
        handleDestinationSearch(newValue);
        if (!newValue) {
            onChange({
                dest_id: '',
                search_type: '',
                label: ''
            });
        }
    };

    const handleClear = () => {
        setSelectedDestination(null);
        setQuery('');
        onChange({
            dest_id: '',
            search_type: '',
            label: ''
        });
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const displayValue = selectedDestination ? selectedDestination.label : query;

    const renderDropdownContent = () => {
        if (isLoading || isLocating) {
            return (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 text-center"
                >
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                    <p className="text-sm text-gray-500 mt-2">
                        {isLocating ? 'Getting your location...' : 'Searching destinations...'}
                    </p>
                </motion.div>
            );
        }

        if (error || locationError) {
            return (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 text-center text-red-500"
                >
                    {error ?? locationError}
                </motion.div>
            );
        }

        if (destinations.length > 0) {
            return (
                <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-h-48 overflow-auto"
                >
                    {destinations.map((destination, index) => (
                        <motion.li
                            key={`${destination.dest_id}-${index}`}
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <button
                                type="button"
                                onClick={() => handleSelect(destination)}
                                className="w-full px-3 py-1.5 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-medium text-gray-900 truncate">
                                            {destination.label}
                                        </p>
                                        <p className="text-[10px] text-gray-500 truncate">
                                            {[destination.city_name, destination.country]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </p>
                                    </div>
                                    {destination.hotels && (
                                        <span className="flex-shrink-0 text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                            {destination.hotels} hotels
                                        </span>
                                    )}
                                </div>
                            </button>
                        </motion.li>
                    ))}
                </motion.ul>
            );
        }

        if (query.length >= 2) {
            return (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 text-center"
                >
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-sm text-gray-500">No destinations found</p>
                </motion.div>
            );
        }

        return null;
    };

    return (
        <div className="relative">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div ref={dropdownRef} className="relative">
                <div className="relative">
                    {/* Search Icon */}
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <svg
                            className={`w-5 h-5 ${isFocused ? 'text-primary' : 'text-gray-400'} transition-colors`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>

                    {/* Input */}
                    <input
                        ref={inputRef}
                        type="text"
                        id={id}
                        value={displayValue}
                        onChange={handleInputChange}
                        onFocus={() => setIsFocused(true)}
                        className={`w-full pl-10 pr-10 py-1.5 text-xs border rounded-lg
                            ${isFocused ? 'border-primary ring-1 ring-primary/20' : 'border-gray-300'}
                            ${selectedDestination ? 'bg-gray-50' : 'bg-white'}
                            focus:outline-none transition-all duration-200 ${className}`}
                        placeholder={placeholder}
                        required={required}
                        autoComplete="off"
                    />

                    {/* Clear Button */}
                    {(displayValue || selectedDestination) && (
                        <motion.button
                            type="button"
                            onClick={handleClear}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </motion.button>
                    )}
                </div>

                {/* Location Button */}
                <motion.button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    disabled={isLocating}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-1 text-xs text-primary hover:text-primary-dark focus:outline-none mt-2"
                >
                    {isLocating ? (
                        <>
                            <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            <span>Locating your position...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>Use my current location</span>
                        </>
                    )}
                </motion.button>

                {/* Dropdown */}
                <AnimatePresence>
                    {(query.length >= 2 || isLocating || locationError) && !selectedDestination && (
                        <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.2 }}
                            className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
                        >
                            {renderDropdownContent()}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {locationError && (
                <p className="text-xs text-red-500 mt-1">{locationError}</p>
            )}
        </div>
    );
} 
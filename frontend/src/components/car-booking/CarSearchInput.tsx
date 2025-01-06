import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { carService } from '../../lib/api/carService';
import { LocationSearchResult } from '../../types/carSearch';

interface CarSearchInputProps {
    label: string;
    id: string;
    value: string;
    onChange: (location: LocationSearchResult) => void;
    placeholder?: string;
    required?: boolean;
    className?: string;
    type: 'pickup' | 'dropoff';
}

export function CarSearchInput({
    label,
    id,
    value,
    onChange,
    placeholder = 'Enter city or location',
    required = false,
    className = '',
    type
}: CarSearchInputProps) {
    const [query, setQuery] = useState('');
    const [locations, setLocations] = useState<LocationSearchResult[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<LocationSearchResult | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initialize selectedLocation from value prop
    useEffect(() => {
        if (value) {
            setSelectedLocation({
                dest_id: '',
                name: value,
                type: '',
                latitude: '',
                longitude: '',
                city: '',
                country: '',
                address: ''
            });
        }
    }, [value]);

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

    const handleLocationSearch = async (searchQuery: string) => {
        if (searchQuery.length < 2) {
            setLocations([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await carService.searchDestination(searchQuery);
            if (response.status && response.data) {
                setLocations(response.data);
            } else {
                setError('Failed to fetch locations');
                setLocations([]);
            }
        } catch (err) {
            console.error('Error searching location:', err);
            setError('An error occurred while searching');
            setLocations([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelect = (location: LocationSearchResult) => {
        // Only set the location if it has valid coordinates
        if (!location.latitude || !location.longitude ||
            location.latitude === '0' || location.longitude === '0') {
            setError('Invalid location coordinates. Please select another location.');
            return;
        }

        setSelectedLocation(location);
        onChange(location);
        setQuery('');
        setIsFocused(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setQuery(newValue);
        setSelectedLocation(null);
        handleLocationSearch(newValue);
        if (!newValue) {
            onChange({
                dest_id: '',
                name: '',
                type: '',
                latitude: '',
                longitude: '',
                city: '',
                country: '',
                address: ''
            });
        }
    };

    const handleClear = () => {
        setSelectedLocation(null);
        setQuery('');
        onChange({
            dest_id: '',
            name: '',
            type: '',
            latitude: '',
            longitude: '',
            city: '',
            country: '',
            address: ''
        });
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const displayValue = selectedLocation ? selectedLocation.name : query;

    const renderDropdownContent = () => {
        if (isLoading) {
            return (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 text-center"
                >
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                    <p className="text-sm text-gray-500 mt-2">Searching locations...</p>
                </motion.div>
            );
        }

        if (error) {
            return (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 text-center text-red-500"
                >
                    {error}
                </motion.div>
            );
        }

        if (locations.length > 0) {
            return (
                <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-h-48 overflow-auto"
                >
                    {locations.map((location, index) => (
                        <motion.li
                            key={`${location.dest_id}-${index}`}
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <button
                                type="button"
                                onClick={() => handleSelect(location)}
                                className="w-full px-3 py-1.5 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-xs font-medium text-gray-900">
                                            {location.name}
                                        </p>
                                        <p className="text-[10px] text-gray-500">
                                            {[location.city, location.country].filter(Boolean).join(', ')}
                                        </p>
                                    </div>
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
                    <p className="text-sm text-gray-500">No locations found</p>
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
                    {/* Icon */}
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <svg
                            className={`w-5 h-5 ${isFocused ? 'text-primary' : 'text-gray-400'} transition-colors`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {type === 'pickup' ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.53-.114-.986-.316-1.39L11 7.684c.403.202.86.316 1.39.316 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .53.114.986.316 1.39L7 9.316c-.403-.202-.86-.316-1.39-.316-1.66 0-3 1.34-3 3s1.34 3 3 3c.53 0 .986-.114 1.39-.316l2.684 2.684z"
                                />
                            )}
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
                        className={`w-full pl-10 pr-8 py-1.5 text-xs text-gray-900 border rounded-lg
                            ${isFocused ? 'border-primary ring-1 ring-primary/20' : 'border-gray-300'}
                            ${selectedLocation ? 'bg-gray-50' : 'bg-white'}
                            focus:outline-none transition-all duration-200 ${className}`}
                        placeholder={placeholder}
                        required={required}
                        autoComplete="off"
                    />

                    {/* Clear button */}
                    {(displayValue || selectedLocation) && (
                        <motion.button
                            type="button"
                            onClick={handleClear}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </motion.button>
                    )}
                </div>

                {/* Dropdown */}
                <AnimatePresence>
                    {query.length >= 2 && !selectedLocation && (
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
        </div>
    );
} 
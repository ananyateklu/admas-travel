import { useRef, useEffect, useState } from 'react';
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
        if (isLoading) {
            return (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 text-center"
                >
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                    <p className="text-sm text-gray-500 mt-2">Searching destinations...</p>
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

        if (destinations.length > 0) {
            return (
                <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-h-48 overflow-auto"
                >
                    {destinations.map((destination, index) => (
                        <motion.li
                            key={`${destination.dest_id}-${destination.search_type}`}
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
                    {/* Icon */}
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
                        className={`w-full pl-10 pr-8 py-1.5 text-xs border rounded-lg
                            ${isFocused ? 'border-primary ring-1 ring-primary/20' : 'border-gray-300'}
                            ${selectedDestination ? 'bg-gray-50' : 'bg-white'}
                            focus:outline-none transition-all duration-200 ${className}`}
                        placeholder={placeholder}
                        required={required}
                        autoComplete="off"
                    />

                    {/* Clear button */}
                    {(displayValue || selectedDestination) && (
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
                    {query.length >= 2 && !selectedDestination && (
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
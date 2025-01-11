import { useRef, useEffect, useState } from 'react';
import { useAirportSearch } from '../hooks/useAirportSearch';
import { Airport } from '../services/flightService';

interface AirportSearchInputProps {
    label: string;
    id: string;
    value: Airport | string | null;
    onChange: (airport: Airport) => void;
    placeholder?: string;
    required?: boolean;
    type?: 'departure' | 'arrival';
    className?: string;
}

export function AirportSearchInput({
    label,
    id,
    value,
    onChange,
    placeholder = 'Enter city or airport',
    required = false,
    type = 'departure',
    className = ''
}: AirportSearchInputProps) {
    const { query, setQuery, airports, isLoading, error } = useAirportSearch();
    const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initialize selectedAirport from value prop
    useEffect(() => {
        // Always update selectedAirport when value changes
        if (value) {
            const isAirportObject = typeof value === 'object' && value !== null && 'airportCode' in value;
            if (isAirportObject) {
                console.log('Setting selected airport from object:', value);
                const airport = value;
                // Ensure we have all required fields
                setSelectedAirport({
                    id: airport.id || '',
                    name: airport.name || '',
                    city: airport.city || '',
                    country: airport.country || '',
                    airportCode: airport.airportCode || '',
                    coordinates: airport.coordinates
                });
            } else {
                console.log('Setting selected airport from string:', value);
                setSelectedAirport({
                    id: '',
                    name: value,
                    city: '',
                    country: '',
                    airportCode: ''
                });
            }
        } else {
            setSelectedAirport(null);
        }
    }, [value]); // Only depend on value changes

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
    }, [setQuery]);

    const handleSelect = (airport: Airport) => {
        console.log('Selected airport:', airport);
        setSelectedAirport(airport);
        onChange(airport);
        setQuery('');
        setIsFocused(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setQuery(newValue);
        setSelectedAirport(null);
        if (!newValue) {
            onChange({ id: '', name: '', city: '', country: '', airportCode: '' });
        }
    };

    const handleClear = () => {
        setSelectedAirport(null);
        setQuery('');
        onChange({ id: '', name: '', city: '', country: '', airportCode: '' });
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    // Use the airport name for display, but show the code if available
    const displayValue = selectedAirport ? selectedAirport.name : query;

    const renderDropdownContent = () => {
        if (isLoading) {
            return (
                <div className="p-4 text-center">
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-forest-400 border-t-transparent"></div>
                    <p className="text-sm text-gray-500 mt-2">Searching airports...</p>
                </div>
            );
        }
        if (error) {
            return <div className="p-4 text-center text-red-500">{error}</div>;
        }
        if (airports.length > 0) {
            return (
                <ul className="max-h-48 overflow-auto">
                    {airports.map((airport) => (
                        <li key={airport.id}>
                            <button
                                type="button"
                                onClick={() => handleSelect(airport)}
                                className="w-full px-3 py-1.5 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-medium text-gray-900 truncate">
                                            {airport.name}
                                        </p>
                                        <p className="text-[10px] text-gray-500 truncate">
                                            {airport.city}, {airport.country}
                                        </p>
                                    </div>
                                    <span className="flex-shrink-0 text-[10px] font-medium text-forest-400 bg-forest-400/10 px-1.5 py-0.5 rounded">
                                        {airport.airportCode}
                                    </span>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            );
        }
        if (query.length >= 2) {
            return (
                <div className="p-4 text-center">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <p className="text-sm text-gray-500">No airports found</p>
                </div>
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
                            className={`w-5 h-5 ${isFocused ? 'text-forest-400' : 'text-gray-400'} transition-colors`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {type === 'departure' ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 19l6-6M5 19l-2-2 8-8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 5l-6 6M19 5l2 2-8 8M19 5H5a2 2 0 00-2 2v10a2 2 0 002 2h14" />
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
                        className={`w-full pl-10 pr-16 py-1.5 text-xs border rounded-lg
                            ${isFocused ? 'border-forest-400 ring-1 ring-forest-400/20' : 'border-gray-300'}
                            ${selectedAirport ? 'bg-gray-50' : 'bg-white'}
                            focus:outline-none transition-all duration-200 ${className}`}
                        placeholder={placeholder}
                        required={required}
                        autoComplete="off"
                    />

                    {/* Selected airport pill - Show if we have an airport code */}
                    {selectedAirport?.airportCode && (
                        <div className="absolute right-7 top-1/2 -translate-y-1/2 flex items-center">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-forest-400/10 text-forest-400">
                                {selectedAirport.airportCode}
                            </span>
                        </div>
                    )}

                    {/* Clear button */}
                    {(displayValue || selectedAirport) && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Dropdown */}
                {query.length >= 2 && !selectedAirport && (
                    <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all duration-200 animate-fadeIn">
                        {renderDropdownContent()}
                    </div>
                )}
            </div>
        </div>
    );
} 
import { useRef, useEffect, useState } from 'react';
import { useAirportSearch } from '../hooks/useAirportSearch';
import { Airport } from '../services/flightService';

interface AirportSearchInputProps {
    label: string;
    id: string;
    value: string;
    onChange: (airport: Airport) => void;
    placeholder?: string;
    required?: boolean;
    type?: 'departure' | 'arrival';
}

export function AirportSearchInput({
    label,
    id,
    value,
    onChange,
    placeholder = 'Enter city or airport',
    required = false,
    type = 'departure'
}: AirportSearchInputProps) {
    const { query, setQuery, airports, isLoading, error } = useAirportSearch();
    const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initialize selectedAirport from value prop
    useEffect(() => {
        if (value && !selectedAirport) {
            setSelectedAirport({ id: '', name: value, city: '', country: '', airportCode: '' });
        }
    }, [value, selectedAirport]);

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

    const displayValue = selectedAirport ? selectedAirport.name : query;

    const renderDropdownContent = () => {
        if (isLoading) {
            return (
                <div className="p-4 text-center">
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-gold border-t-transparent"></div>
                    <p className="text-sm text-gray-500 mt-2">Searching airports...</p>
                </div>
            );
        }
        if (error) {
            return <div className="p-4 text-center text-red-500">{error}</div>;
        }
        if (airports.length > 0) {
            return (
                <ul className="max-h-60 overflow-auto">
                    {airports.map((airport) => (
                        <li key={airport.id}>
                            <button
                                type="button"
                                onClick={() => handleSelect(airport)}
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                            >
                                <div className="flex items-center">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">
                                            {airport.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {airport.city}, {airport.country}
                                        </p>
                                    </div>
                                    <span className="text-xs font-medium text-gold bg-gold/10 px-2 py-1 rounded-full">
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
                            className={`w-5 h-5 ${isFocused ? 'text-gold' : 'text-gray-400'} transition-colors`}
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
                        className={`w-full pl-10 pr-24 py-2 border rounded-xl
                            ${isFocused ? 'border-gold ring-2 ring-gold/20' : 'border-gray-300'}
                            ${selectedAirport ? 'bg-gray-50' : 'bg-white'}
                            focus:outline-none transition-all duration-200`}
                        placeholder={placeholder}
                        required={required}
                        autoComplete="off"
                    />

                    {/* Selected airport pill */}
                    {selectedAirport?.airportCode && (
                        <div className="absolute right-10 top-1/2 -translate-y-1/2">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-500 text-white">
                                {selectedAirport.airportCode}
                            </span>
                        </div>
                    )}

                    {/* Clear button */}
                    {(displayValue || selectedAirport) && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Dropdown */}
                {query.length >= 2 && !selectedAirport && (
                    <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-200 animate-fadeIn">
                        {renderDropdownContent()}
                    </div>
                )}
            </div>
        </div>
    );
} 
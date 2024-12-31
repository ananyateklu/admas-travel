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
}

export function AirportSearchInput({
    label,
    id,
    value,
    onChange,
    placeholder = 'Enter city or airport',
    required = false
}: AirportSearchInputProps) {
    const { query, setQuery, airports, isLoading, error } = useAirportSearch();
    const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setQuery]);

    const handleSelect = (airport: Airport) => {
        setSelectedAirport(airport);
        onChange(airport);
        setQuery('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setQuery(newValue);
        setSelectedAirport(null);
        if (!newValue) {
            onChange({ id: '', name: '', city: '', country: '', airportCode: '' });
        }
    };

    const displayValue = selectedAirport ? selectedAirport.name : query;

    const renderDropdownContent = () => {
        if (isLoading) {
            return <div className="p-4 text-center text-gray-500">Loading...</div>;
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
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
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
                                    <span className="text-xs text-gray-400">{airport.airportCode}</span>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            );
        }
        return <div className="p-4 text-center text-gray-500">No airports found</div>;
    };

    return (
        <div className="relative">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <div ref={dropdownRef}>
                <input
                    type="text"
                    id={id}
                    value={displayValue}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder={placeholder}
                    required={required}
                    autoComplete="off"
                />

                {/* Dropdown */}
                {query.length >= 2 && !selectedAirport && (
                    <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
                        {renderDropdownContent()}
                    </div>
                )}
            </div>
        </div>
    );
} 
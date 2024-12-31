import { useState } from 'react';
import { Airport } from '../services/flightService';
import { AIRPORTS } from '../data/airports';

export function useAirportSearch(initialQuery: string = '') {
    const [query, setQuery] = useState(initialQuery);

    // Filter airports based on query
    const filteredAirports = query.length >= 2
        ? AIRPORTS.filter((airport: Airport) => {
            const searchTerm = query.toLowerCase();
            const searchableFields = [
                airport.name.toLowerCase(),
                airport.city.toLowerCase(),
                airport.country.toLowerCase(),
                airport.airportCode.toLowerCase(),
                `${airport.city} ${airport.country}`.toLowerCase(),
                `${airport.airportCode} ${airport.city}`.toLowerCase()
            ];

            return searchableFields.some(field => field.includes(searchTerm));
        })
            .sort((a: Airport, b: Airport) => {
                const searchTerm = query.toLowerCase();
                const aStartsWith = a.airportCode.toLowerCase().startsWith(searchTerm) ||
                    a.city.toLowerCase().startsWith(searchTerm);
                const bStartsWith = b.airportCode.toLowerCase().startsWith(searchTerm) ||
                    b.city.toLowerCase().startsWith(searchTerm);

                if (aStartsWith && !bStartsWith) return -1;
                if (!aStartsWith && bStartsWith) return 1;
                return 0;
            })
            .slice(0, 10)
        : [];

    return {
        query,
        setQuery,
        airports: filteredAirports,
        isLoading: false,
        error: null
    };
} 
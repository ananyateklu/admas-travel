import { useState, useEffect } from 'react';
import { Airport, flightService } from '../services/flightService';

export function useAirportSearch(initialQuery: string = '') {
    const [query, setQuery] = useState(initialQuery);
    const [airports, setAirports] = useState<Airport[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const searchAirports = async () => {
            if (query.length < 2) {
                setAirports([]);
                setError(null);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const results = await flightService.searchAirports(query);
                if (isMounted) {
                    setAirports(results);
                }
            } catch (error: unknown) {
                if (isMounted) {
                    setError('Failed to search airports. Please try again.');
                    setAirports([]);
                    console.error('Airport search error:', error);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        // Debounce the search to prevent too many API calls
        const timeoutId = setTimeout(searchAirports, 300);

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, [query]);

    return {
        query,
        setQuery,
        airports,
        isLoading,
        error
    };
} 